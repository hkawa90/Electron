var ping = require('ssh2'); // https://www.npmjs.com/package/ssh2
var scp = require('scp2'); // https://www.npmjs.com/package/scp2
var defaultOptions = {
};
console.log("Started scanner");

process.on('message', (options) => {
    console.log(options);
    process.send(target);
});

