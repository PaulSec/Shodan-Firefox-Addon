function insertAfter(target, el) {
    if( !target.nextSibling )
        target.parentNode.appendChild( el );
    else
        target.parentNode.insertBefore( el, target.nextSibling );
};

window.onload = function () {
    var bg = chrome.extension.getBackgroundPage();
    var host = bg.getHost();

    if (host) {
        console.log(host);
        var el = document.getElementById('ip');
        if (el) {
            el.textContent = host.ip_str;
        }

        // Hostnames
        el = document.getElementById('hostnames');
        if (host.hostnames) {
            for (var i = 0; i < host.hostnames.length; i++) {
                new_link = document.createElement('a');
                new_link.setAttribute('href', 'https://' + host.hostnames[i]);
                new_link.textContent = host.hostnames[i];
                insertAfter(el, new_link);
            }
        }

        // Miscellaneous items (location, operating system etc.)
        el = document.getElementById('items');
        var items = '';
        if (host.city) {
            new_row = document.createElement('tr');
            new_row.insertCell(0).textContent = 'City';
            new_row.insertCell(1).textContent = host.city;
            insertAfter(el, new_row);
        }
        if (host.country_name) {
            new_row = document.createElement('tr');
            new_row.insertCell(0).textContent = 'Country';
            new_row.insertCell(1).textContent = host.country_name;
            insertAfter(el, new_row);
        }
        if (host.os) {
            new_row = document.createElement('tr');
            new_row.insertCell(0).textContent = 'Operating System';
            new_row.insertCell(1).textContent = host.os;
            insertAfter(el, new_row);
        }
        if (host.org) {
            new_row = document.createElement('tr');
            new_row.insertCell(0).textContent = 'Organization';
            new_row.insertCell(1).textContent = host.org;
            insertAfter(el, new_row);
        }
        el = document.getElementById('items');

        // Ports
        if (host.ports) {
            var ports = '';

            // Convert the array to integers
            for (var i = 0; i < host.ports.length; i++) {
                host.ports[i] = parseInt(host.ports[i]);
            }

            el = document.getElementById('ports');
            host.ports.sort(function(a, b){return a-b});
            for (var i = 0; i < host.ports.length; i++) {
                if (host.ports[i] === 80 || host.ports[i] === 8080 || host.ports[i] === 81) {
                    ports += '<li><a href="http://' + host.ip_str + ':' + host.ports[i] + '" target="_blank"><span>' + host.ports[i] + '</span></a></li>';
                    // // new span
                    // new_span = document.createElement('span');
                    // new_span.textContent = host.ports[i]

                    // // new link
                    // new_link = document.createElement('a');
                    // new_link.setAttribute('href', 'http://' + host.ip_str + ':' + host.ports[i]);
                    // new_link.appendChild(new_span);

                    // // new li
                    // new_li = document.createElement('li');
                    // new_li.appendChild(new_link)
                    // insertAfter(el, new_li);
                }
                else if (host.ports[i] === 443 || host.ports[i] === 8443) {
                    ports += '<li><a href="https://' + host.ip_str + ':' + host.ports[i] + '" target="_blank"><span>' + host.ports[i] + '</span></a></li>';
                    // // new span
                    // new_span = document.createElement('span');
                    // new_span.textContent = host.ports[i]

                    // // new link
                    // new_link = document.createElement('a');
                    // new_link.setAttribute('href', 'https://' + host.ip_str + ':' + host.ports[i]);
                    // new_link.appendChild(new_span);

                    // // new li
                    // new_li = document.createElement('li');
                    // new_li.appendChild(new_link)
                    // insertAfter(el, new_li);
                }
                else {
                    ports += '<li><span>' + host.ports[i] + '</span></li>';                    
                    // // new span
                    // new_span = document.createElement('span');
                    // new_span.textContent = host.ports[i]

                    // // new li
                    // new_li = document.createElement('li');
                    // new_li.appendChild(new_span)
                    // insertAfter(el, new_li);
                }
            }
            el.innerHTML = ports;
        }

        // Vulnerability information if available
        // var vulns = '';
        // if (host.vulns) {
        //     vulns = "<br/>\
        //     <h2><i class='icon-fire'></i>Security Issues</h2>\
        //     <ul>";

        //     var has_vulns = false;
        //     for (var i = 0; i < host.vulns.length; i++) {
        //         if (host.vulns[i] === 'CVE-2014-0160') {
        //             vulns += "<li><a href='http://heartbleed.org' target='_blank'><img src='/img/vulns/heartbleed.png' /> Heartbleed (CVE-2014-0160)</a></li>";
        //             has_vulns = true;
        //         }
        //     }

        //     vulns += '</ul>';

        //     if (!has_vulns) {
        //         vulns = '';
        //     }
        // }
        // el = document.getElementById('vulns');
        // el.textContent = vulns;

        // Update the link to the host details page
        el = document.getElementById('host-link');
        el.href = 'https://www.shodan.io/host/' + host.ip_str;
    }
}