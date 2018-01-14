var Client = require('ssh2').Client;
var killing = false;
var defaultServer = {
    host: '192.168.170.3',
    port: 22,
    username: 'kawa90',
    password: 'xxxxxx'
};
console.log("Started ssh child process.");

process.on('message', (args) => {
    console.log(args.options);
    if (args.cmd == 'run') {
        killing = false;
        var conn = new Client();
        conn.on('ready', function () {
            console.log('Client :: ready');

            conn.exec("TERM=xterm;" + args.execCmd, { pty: true }, function (err, stream) {
                //var reader = require('readline').createInterface({ input: stream });
                if (err) {
                    var result = {};
                    result.status = 'abort';
                    result.strings = '';
                    result.destination = '';
                    process.send(result);
                    stream.close();
                    conn.end();
                    clearInterval(healthCheck);
                } else {
                    var healthCheck = setInterval(() => {
                        if (killing) {
                            var result = {};
                            result.status = 'abort';
                            result.strings = '';
                            result.destination = '';
                            process.send(result);
                            console.log('closing the stream!');
                            stream.write('\x03'); // send Ctrl-C
                            stream.signal('KILL');
                            clearInterval(healthCheck);
                        }
                        console.log('interval timer fired. killing='+killing);
                        
                    }, 1 * 1000);                
                    //reader.on('line', function (data) { console.log('READLINE:' + data) });
                    //reader.on('close', function (data) { console.log('READLINE:close') });
                    stream.on('close', function (code, signal) {
                        var result = {};
                        result.status = 'close';
                        result.strings = '';
                        result.destination = '';
                        process.send(result);
                        stream.close();
                        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        conn.end();
                        clearInterval(healthCheck);
                    }).on('data', function (data) {
                        var result = {};
                        result.status = 'running';
                        result.strings = data.toString();
                        result.destination = 'STDOUT:';
                        process.send(result);
                        console.log('STDOUT: ' + data.toString());
                    }).stderr.on('data', function (data) {
                        var result = {};
                        result.status = 'running';
                        result.strings = data.toString();
                        result.destination = 'STDERR:';
                        process.send(result);
                        console.log('STDERR: ' + data.toString());
                    });
                }
            });
        }).connect(args.server);
    } else if (args.cmd === 'stop') {
        killing = true;
        console.log('killing...');
    }
});

