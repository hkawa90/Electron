var evilscan = require('evilscan');

var defaultOptions = {
    target:'192.168.11.0/24',
    port:'80',
    status:'ROU', // Timeout, Refused, Open, Unreachable
    banner:true
};
console.log("Started scanner");
process.on('message', (options) => {
    console.log(options);
    if (options === null) {
        options = defaultOptions;
    }
    var scanner = new evilscan(options);

    scanner.on('result',function(data) {
        // fired when item is matching options
        data.processStatus = 'running';
        process.send(data);
    });
    
    scanner.on('error',function(err) {
        data.processStatus = 'error: ' + data.toString();
        process.send(data);
    });
    
    scanner.on('done',function() {
        // finished !
        var data = {};
        data.processStatus = 'exit';
        process.send(data);
        //process.exit();
    });
    
    scanner.run();
});
  
