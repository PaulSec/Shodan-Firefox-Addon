var buttons = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var requests = require("sdk/request");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var API_KEY = "MM72AkzHXdHpC8iP65VVEEVrJjp7zkgd";

var button = buttons.ToggleButton({
    id: "shodan-button",
    label: "Display information from Shodan on current website",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "48": "./icon-48.png",
    },
    onChange: handleChange
});

var panel = panels.Panel({
    contentURL: self.data.url("panel.htm"),
    contentScriptFile: self.data.url("panel.js"),
    onHide: handleHide,
    position: button
});

function queryDnsInformation(url) {
    var hostMatches = url.match(/https?:\/\/(?:www\.)?(.[^/]+).*/);
    if (hostMatches == null) {
        panel.port.emit("Info", "No host information for: \"" + url + "\"");
        return;
    }

    panel.port.emit("Info", "Retrieving information for \"" +
                            hostMatches[1] + "\"...");
    var request = requests.Request({
        url: "https://api.shodan.io/dns/resolve?hostnames=" + hostMatches[1] + "&key=" + API_KEY,
        overrideMimeType: "application/json; charset=UTF-8",
        onComplete: function(response) {
            if (response.status !== 200) {
                panel.port.emit("Error", "Failed to retrieve IP for current host");
                return;
            }

            queryHostInformation(response.text);
        }
    });

    request.get();
}

function queryHostInformation(dnsResponse) {
    // dns object format:
    // {"DOMAIN_NAME": "IP_ADDRESS"}
    var dns = JSON.parse(dnsResponse);

    var request = requests.Request({
        url: "https://api.shodan.io/shodan/host/" + dns[Object.keys(dns)[0]] + "?key=" + API_KEY + "&minify=true",
        overrideMimeType: "application/json; charset=UTF-8",
        onComplete: function(response) {
            if (response.status !== 200) {
                panel.port.emit("Error", "Failed to retrieve host information");
                return;
            }

            console.log(response.text);

            panel.port.emit("ShodanResponse", response.text);
            panel.show();
        }
    });

    request.get();
}

function handleChange(state) {
    if (state.checked) {
        queryDnsInformation(tabs.activeTab.url);
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

panel.port.on("resize", function({width, height}) {
    panel.resize(width, height);
});
