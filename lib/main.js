var buttons = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var Request = require("sdk/request").Request;

var button = buttons.ToggleButton({
    id: "shodan-button",
    label: "Display information from Shodan on current website",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "48": "./icon-48.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    contentURL: self.data.url("panel.htm"),
    contentScriptFile: self.data.url("panel.js"),
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {
        host = tabs.activeTab.url.split('/')[2];
        // DNS Resolve using Shodan
        Request({
            url: "https://api.shodan.io/dns/resolve?hostnames="+host+"&key=MM72AkzHXdHpC8iP65VVEEVrJjp7zkgd",
            onComplete: function (response) {
                ip = JSON.parse(response.text)[host];
                // Retrieving results from Shodan API
                Request({
                    url: "https://api.shodan.io/shodan/host/"+ip+"?key=MM72AkzHXdHpC8iP65VVEEVrJjp7zkgd&minify=true",
                    onComplete: function (response) {
                        panel.port.emit("ActiveUrl", JSON.parse(response.text));
                        panel.show({
                            position: button
                        });
                    }
                }).get();
            }
        }).get();
    }
}

function handleHide() {
    button.state('window', {checked: false});
}