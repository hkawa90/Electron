'use strict';
// electron
const electron = require("electron");
// アプリケーションをコントロールするモジュール
const app = electron.app;
// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
// ipc communication
const ipc = electron.ipcMain;
// crate child process for evilscan scanner
const { fork } = require('child_process');
const forked = fork('scanner.js');

var defaultOptions = {
    target: '192.168.11.0/24',
    port: '80',
    status: 'ROU', // Timeout, Refused, Open, Unreachable
    banner: true
};

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
let scanner_result;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Electronの初期化完了後に実行
app.on('ready', function () {
    // メイン画面の表示。ウィンドウの幅、高さを指定できる
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

ipc.on('scanner-run', function (event, arg) {
    scanner_result = [];
    if (arg === null) {
        console.log('select default option.');
        forked.send(defaultOptions);
    } else {
        console.log('select arg');
        forked.send(arg);
    }
    
});

forked.on('message', (msg) => {
    if (msg.processStatus == 'exit') {
        mainWindow.webContents.send('scanner-done', scanner_result);
    } else {
        scanner_result.push(msg);
        console.log(msg);
        console.log(scanner_result);
    }
});

