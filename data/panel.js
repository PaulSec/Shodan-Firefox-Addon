function displayErrorMessage(errorMessage) {
    var errorContainer = document.getElementById("error");

    if (errorMessage !== "") {
        errorContainer.innerHTML = "<p>Error: " + errorMessage + "</p>";
    } else {
        errorContainer.innerHTML = "";
    }
}

self.port.on("ShodanResponse", function(shodanResponsePayload) {
    var shodanResponseContainer = document.getElementById("shodan-response");
    shodanResponseContainer.innerHTML = shodanResponsePayload;

    // Clear any error message
    displayErrorMessage("");
});

self.port.on("Error", displayErrorMessage);
