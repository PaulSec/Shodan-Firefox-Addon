self.port.on("ActiveUrl", function(response) {
    document.getElementById("ip").innerHTML = 'IP: ' + response['ip_str'];
    document.getElementById("country-name").innerHTML = 'Country: ' + response['country_name'];
    document.getElementById("city").innerHTML = 'City: ' + response['city'];
    document.getElementById("ports").innerHTML = 'Ports: ' + response['ports'].toString();
    // document.getElementById("direct-link").setAttribute('href', 'https://www.shodan.io/host/' + response['ip_str']);
    // this does not work yet
});
