window.onload = function() {
    document.getElementById("host").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("error").style.display = "none";
    document.getElementById("direct-link").addEventListener("click", viewDetails);
}

function viewDetails() {
    console.log('click');
    ip = document.getElementById("ip").innerHTML;
    self.port.emit("viewDetails", {
        'ip': ip
    });
}

self.port.on("ShodanResponse", function(shodanResponsePayload) {
    var hostInfo = JSON.parse(shodanResponsePayload);

    document.getElementById("ip").innerHTML = hostInfo["ip_str"];
    document.getElementById("hostname").innerHTML = hostInfo["hostnames"][0];

    var infoToDisplay = {
        "city": "City",
        "country_name": "Country",
        "org": "Organization"
    };
    var tableInfo = "";
    for (var key in infoToDisplay) {
        if (hostInfo[key] !== null) {
            tableInfo += "<tr><th>" + infoToDisplay[key] + "</th>";
            tableInfo += "<td>" + hostInfo[key] + "</td></tr>";
        }
    }

    document.getElementById("general-info").innerHTML = tableInfo;

    var portsInfo = "";
    var portsSorted = hostInfo["ports"].sort();
    var portsLength = portsSorted.length;
    for (var i = 0; i <  portsLength; i++) {
        portsInfo += "<li><a href=\"#" + portsSorted[i] + "\">" + portsSorted[i] + "</a></li>";
    }

    document.getElementById("ports").innerHTML = portsInfo;
    displayStyle(0);
});

self.port.on("Error", function(errorMessagePayload) {
    document.getElementById("error-content").innerHTML = "<p>Error: " + errorMessagePayload + "</p>";
    displayStyle(1);
});

self.port.on("Info", function(infoMessagePayload) {
    document.getElementById("info-content").innerHTML = "<p>" + infoMessagePayload + "</p>";
    displayStyle(2);
});

function displayStyle(content) {
    switch (content) {
        case 0:
            document.getElementById("host").style.display = "block";
            document.getElementById("info").style.display = "none";
            document.getElementById("error").style.display = "none";
            break;
        case 1:
            document.getElementById("host").style.display = "none";
            document.getElementById("info").style.display = "none";
            document.getElementById("error").style.display = "block";
            break;
        case 2:
            document.getElementById("host").style.display = "none";
            document.getElementById("info").style.display = "block";
            document.getElementById("error").style.display = "none";
            break;
	}
    self.port.emit("resize", {
        width: document.body.scrollWidth,
        height: document.body.scrollHeight
    });
}