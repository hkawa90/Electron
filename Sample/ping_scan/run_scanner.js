const { fork } = require('child_process');
const forked = fork('scanner.js');

var defaultOptions = {
    target:'192.168.11.0/24',
    port:'80',
    status:'ROU', // Timeout, Refused, Open, Unreachable
    banner:true
};


forked.on('message', (msg) => {
  console.log('Message from child', msg);
});

forked.send(defaultOptions);