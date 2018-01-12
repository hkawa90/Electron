var ping = require('ping'); // https://www.npmjs.com/package/ping
var ip = require('ip'); // https://www.npmjs.com/package/ip
var count = 0;
var defaultOptions = {
    target: '192.168.11.0/24'
};
console.log("Started scanner");

process.on('message', (options) => {
    console.log(options);
    count = 0;
    if ((options === null) || (options.target === undefined) || (options.target === '')) {
        options = defaultOptions;
    }
    console.log(options);
    var firstAddress = ip.toLong(ip.cidrSubnet(options.target).firstAddress);
    var len = ip.cidrSubnet(options.target).numHosts;
    var hostList = [];
    for (var ipNumber = firstAddress; ipNumber < firstAddress + len; ipNumber++) {
        hostList.push(ip.fromLong(ipNumber));
    }
    count = hostList.length;
    hostList.forEach(function (host) {
        // Running with default config
        ping.sys.probe(host, function (isAlive) {
            var target = {};
            count --;
            if (count == 0) {
                target.processStatus = 'exit';
            } else {
                target.processStatus = 'running';
            }
            if (isAlive) {
                target.live = true;
            } else {
                target.live = false;
            }
            target.ip = host;
            process.send(target);
        });
    });
});

