import styles from 'xterm/lib/xterm.css';
const electron = require('electron');
const ipc = electron.ipcRenderer;
const path = require('path');
var Terminal = require('xterm').Terminal;
var fit = require('xterm/dist/addons/fit/fit');
var terminalContainer;
var term = new Terminal({ cursorBlink: true });
window.addEventListener('load', function () {
  terminalContainer = document.getElementById('terminal-container');
  Terminal.applyAddon(fit);
  term.open(terminalContainer);
  term.fit();

  var submitButton = document.getElementById('submit');
  var cancelButton = document.getElementById('cancel');
  var accountDialog = document.getElementById('account');

  accountDialog.showModal();

  // Form cancel button closes the dialog box
  cancelButton.addEventListener('click', function () {
    accountDialog.close();
  });
  submitButton.addEventListener('click', function () {
    accountDialog.close();
    ipc.send('connection', {
      username: document.forms.SSH_Connection_Form.username.value,
      password: document.forms.SSH_Connection_Form.password.value,
      host: document.forms.SSH_Connection_Form.host.value
    });
  });
  document.forms.SSH_Connection_Form.username.value = "";
  document.forms.SSH_Connection_Form.password.value = "";
  document.forms.SSH_Connection_Form.host.value = "";

}, false);
// Browser -> Backend
term.on('data', function (data) {
  console.log('terminal:' + data);
  ipc.send('data', data);
});

// Backend -> Browser
ipc.on('data', function (event, data) {
  console.log('Data:', data);
  term.write(data);
});
