window.onload = function() {
    document.getElementById("host").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("error").style.display = "none";
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
    var portsNumber = hostInfo["ports"].length;
    for (var i = 0; i <  portsNumber; i++) {
        portsInfo += "<li><a href=\"#" + hostInfo["ports"][i] + "\">" + hostInfo["ports"][i] + "</a></li>";
    }

    document.getElementById("ports").innerHTML = portsInfo;

    document.getElementById("host").style.display = "block";
    document.getElementById("info").style.display = "none";
    document.getElementById("error").style.display = "none";
});

self.port.on("Error", function(errorMessagePayload) {
    document.getElementById("error-content").innerHTML = "<p>Error: " + errorMessagePayload + "</p>";
    document.getElementById("host").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("error").style.display = "block";
});

self.port.on("Info", function(infoMessagePayload) {
    document.getElementById("info-content").innerHTML = "<p>" + infoMessagePayload + "</p>";
    document.getElementById("host").style.display = "none";
    document.getElementById("info").style.display = "block";
    document.getElementById("error").style.display = "none";
});

self.port.on("resize", function({width, height}) {
    console.log('test');
    console.log(width);
    console.log(height);
    self.resize(width, height);
});
