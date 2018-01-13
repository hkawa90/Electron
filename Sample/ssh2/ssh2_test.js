var Client = require('ssh2').Client;
var readline = require("readline");

var ttyTestCmd = 'while true ;do date ; sleep 10; done';
var ttyCmd = 'tty';
/*
/dev/pts/1
*/
var ttyPsCmd = 'ps --tty ';
/*
  PID TTY          TIME CMD
 3629 pts/1    00:00:00 bash
 3692 pts/1    00:00:00 ps
*/
var promptChgCmd = 'export PS1=';

var conn = new Client();
conn.on('ready', function () {
    console.log('Client :: ready');
    conn.exec('uptime', function (err, stream) {
        var reader = require('readline').createInterface({ input: stream });
        if (err) throw err;
        reader.on('line', function (data) { console.log('READLINE:' + data) });
        reader.on('close', function (data) { console.log('READLINE:close') });
        stream.on('close', function (code, signal) {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', function (data) {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', function (data) {
            console.log('STDERR: ' + data);
        });
    });
}).connect({
    host: '192.168.170.3',
    port: 22,
    username: 'kawa90',
    password: 'k9025247'
});
