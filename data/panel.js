self.port.on("ActiveUrl", function(activeUrlPayload) {
    var activeTabUrl = document.getElementById("active-tab-url");
    activeTabUrl.innerHTML = activeUrlPayload;
});
