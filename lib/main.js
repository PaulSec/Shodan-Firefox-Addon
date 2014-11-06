var buttons = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

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
        panel.port.emit("ActiveUrl", tabs.activeTab.url);
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}
