var ping = require('ping'); // https://www.npmjs.com/package/ping
var ip = require('ip'); // https://www.npmjs.com/package/ip

var defaultOptions = {
    target: '192.168.11.0/24'
};
console.log("Started scanner");


var firstAddress = ip.toLong(ip.cidrSubnet(defaultOptions.target).firstAddress);
var len = ip.cidrSubnet(defaultOptions.target).numHosts;
console.log(ip.cidrSubnet(defaultOptions.target).lastAddress);
var hostList = [];
for (var ipNumber = firstAddress; ipNumber < firstAddress + len; ipNumber++) {
    hostList.push(ip.fromLong(ipNumber));
}
hostList.forEach(function (host) {
    // Running with default config
    ping.sys.probe(host, function (isAlive) {
        if (isAlive) {
            //process.send(host);
            console.log(host);
            console.log('------');
        }
    });
});
