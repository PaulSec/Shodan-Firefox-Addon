window.onload = function () {
    var bg = chrome.extension.getBackgroundPage();
    var host = bg.getHost();

    if (host) {
        console.log(host);
        var el = document.getElementById('ip');
        if (el) {
            el.innerHTML = host.ip_str;
        }

        // Hostnames
        var hostnames = '';
        if (host.hostnames) {
            for (var i = 0; i < host.hostnames.length; i++) {
                hostnames += '<a href="http://' + host.hostnames[i] + '" target="_blank">' + host.hostnames[i] + '</a>';
            }
        }
        el = document.getElementById('hostnames');
        el.innerHTML = hostnames;

        // Miscellaneous items (location, operating system etc.)
        var items = '';
        if (host.city) {
            items += '\
              <tr>\
                <td>City</td>\
                <th>' + host.city + '</th>\
              </tr>';
        }
        if (host.country_name) {
            items += '\
              <tr>\
                <td>Country</td>\
                <th>' + host.country_name + '</th>\
              </tr>';
        }
        if (host.os) {
            items += '\
              <tr>\
                <td>Operating System</td>\
                <th>' + host.os + '</th>\
              </tr>';
        }
        if (host.org) {
            items += '\
              <tr>\
                <td>Organization</td>\
                <th style="line-height: 18px">' + host.org + '</th>\
              </tr>';
        }
        el = document.getElementById('items');
        el.innerHTML = items;

        // Ports
        if (host.ports) {
            var ports = '';

            // Convert the array to integers
            for (var i = 0; i < host.ports.length; i++) {
                host.ports[i] = parseInt(host.ports[i]);
            }

            host.ports.sort(function(a, b){return a-b});
            for (var i = 0; i < host.ports.length; i++) {
                if (host.ports[i] === 80 || host.ports[i] === 8080 || host.ports[i] === 81) {
                    ports += '<li><a href="http://' + host.ip_str + ':' + host.ports[i] + '" target="_blank"><span>' + host.ports[i] + '</span></a></li>';
                }
                else if (host.ports[i] === 443 || host.ports[i] === 8443) {
                    ports += '<li><a href="https://' + host.ip_str + ':' + host.ports[i] + '" target="_blank"><span>' + host.ports[i] + '</span></a></li>';
                }
                else {
                    ports += '<li><span>' + host.ports[i] + '</span></li>';
                }
            }

            el = document.getElementById('ports');
            el.innerHTML = ports;
        }

        // Vulnerability information if available
        var vulns = '';
        if (host.vulns) {
            vulns = "<br/>\
            <h2><i class='icon-fire'></i>Security Issues</h2>\
            <ul>";

            var has_vulns = false;
            for (var i = 0; i < host.vulns.length; i++) {
                if (host.vulns[i] === 'CVE-2014-0160') {
                    vulns += "<li><a href='http://heartbleed.org' target='_blank'><img src='/img/vulns/heartbleed.png' /> Heartbleed (CVE-2014-0160)</a></li>";
                    has_vulns = true;
                }
            }

            vulns += '</ul>';

            if (!has_vulns) {
                vulns = '';
            }
        }
        el = document.getElementById('vulns');
        el.innerHTML = vulns;

        // Update the link to the host details page
        el = document.getElementById('host-link');
        el.href = 'https://www.shodan.io/host/' + host.ip_str;
    }
}