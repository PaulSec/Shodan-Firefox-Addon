
var hostnameCache = {};
var hostCache = {};

// Globals shared across pages
var HOST;

function getHostname(url) {
	var elem = document.createElement('a');
	elem.href = url;
	return elem.hostname;
}

function dnsLookup(hostname, callback) {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.shodan.io/dns/resolve?key=MM72AkzHXdHpC8iP65VVEEVrJjp7zkgd&hostnames=' + hostname, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        	try {
	            var data = JSON.parse(xhr.responseText);

	            if (data[hostname]) {
	            	callback(data[hostname]);
	            }
            }
	        catch(e) {
	        	// pass
	        }
        }
    }
    xhr.send();
}

function hostLookup(ip, callback) {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.shodan.io/shodan/host/' + ip + '?key=MM72AkzHXdHpC8iP65VVEEVrJjp7zkgd&minify=true', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        	try {
	            var host = JSON.parse(xhr.responseText);
	            if (!host.error) {
	            	callback(host);
	            }
            }
	        catch(e) {
	        	// pass
	        }
        }
    }
    xhr.send();
}

function updateHost(host, tabId) {
	chrome.browserAction.enable(tabId);

	chrome.browserAction.setBadgeText({
		'text': String(host.ports.length)
	});

	// Update the globals so the popup can access the info collected in the background
	HOST = host;
}

function getHost() {
	return HOST;
}

function updateBrowserAction(tabId, url) {
	var host = null;
	var hostname;

	// If the URL doesn't start with http or https then we won't go any further
	if (url.indexOf('http') === -1 && url.indexOf('https') === -1) {
		return;
	}

	hostname = getHostname(url);

	// Disable the browser action button until we know that the current
	// hostname has some data.
	chrome.browserAction.disable(tabId);
	chrome.browserAction.setBadgeText({
		text: ''
	});

	// If we're switching tabs or the URL is already in the cache, try to look up the host information
	// from the cache.
	if (hostnameCache[tabId] && hostnameCache[tabId] === hostname) {
		// We've previously looked up the Shodan host information for this hostname, so use it
		if (hostCache[tabId]) {
			updateHost(hostCache[tabId], tabId);
		}
	}
	else {
		// Resolve the hostname to its IP address, which then gets passed to the actual Shodan host lookup
		dnsLookup(hostname, function(ip) {
			hostLookup(ip, function(host) {
				// Make sure we got a response back for the right ip
				if (host.ip_str === ip) {
					// Update the hostname cache so we know when the browseraction needs to get updated
					hostnameCache[tabId] = hostname;
					hostCache[tabId] = host;

					updateHost(host, tabId);
				}
			})
		});
	}
};

function contextMenuHandler(info, tab) {
	var shodanUrl = 'https://www.shodan.io';
	var checkUrl = null;

	// The user has selected some text
	if (info.selectionText) {
		shodanUrl += '/search?query=' + encodeURI(info.selectionText);
	}
	else if (info.linkUrl) {
		checkUrl = info.linkUrl;
	}
	else if (info.pageUrl) {
		checkUrl = info.pageUrl;
	}
	else if (info.frameUrl) {
		checkUrl = info.frameUrl;
	}

	if (checkUrl !== null) {
		var hostname = getHostname(checkUrl);

		// Strip any prepending 'www.' if present
		if (hostname.indexOf('www.') === 0) {
			hostname = hostname.substr(4);
		}

		shodanUrl += '/search?query=hostname:' + encodeURI(hostname);
	}

	// If the user's selection changed the base URL then open a new tab
	if (shodanUrl != 'https://www.shodan.io') {
		chrome.tabs.create({
			'url': shodanUrl
		});
	}
}

/*
 * Listen for changes in the URL in any of the tabs.
 */
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
	if (tab.status === 'loading') {
		updateBrowserAction(id, tab.url);
	}
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	if (activeInfo.tabId) {
		chrome.tabs.get(activeInfo.tabId, function (tab) {
			updateBrowserAction(tab.id, tab.url);
		});
	}
});

// Cleanup the variables when a tab is closed
chrome.tabs.onRemoved.addListener(function (id) {
	delete hostnameCache[id];
	delete hostCache[id];
});

// Set the button to disabled until we get some actual data
chrome.browserAction.disable();

chrome.browserAction.setBadgeBackgroundColor({
	color: '#000'
});

// Add the ability to search Shodan using the right-click/ context menu
chrome.contextMenus.create({
	'title': 'Search Shodan for link',
	'contexts': ['link'],
	'onclick': contextMenuHandler
});
chrome.contextMenus.create({
	'title': 'Search Shodan for current website',
	'contexts': ['page'],
	'onclick': contextMenuHandler
});
chrome.contextMenus.create({
	'title': 'Search Shodan for "%s"',
	'contexts': ['selection'],
	'onclick': contextMenuHandler
});
