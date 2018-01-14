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
const forked = fork('ssh2_runner.js');

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

ipc.on('run_script', function (event, arg) {
    forked.send(arg);
});

forked.on('message', (msg) => {
    console.log(msg);
    if ((msg.status === 'abort') || (msg.status === 'close')) {
        mainWindow.webContents.send('script-done', '');
    } else {
        mainWindow.webContents.send('script-result', msg);
        console.log(msg);
    }
});

