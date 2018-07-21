# Electron

## Electron samples

## Tips

### Disable short-cut
ソース非公開プロダクトの場合は公開アプリでショートカットが利用出来ると困るので、NODE_ENV環境変数にてdevelopment環境を定義出来るようにしてます。ウィンドウにフォーカスを当てた際のアクティブウィンドウに対してDOMインスペクタがChromeと同じショートカットを次のように登録します：

~~~js
if (process.env.NODE_ENV==='development') {
  app.on('browser-window-focus', (event, focusedWindow) => {
    globalShortcut.register(
　　　　　　　　　　　　process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
　　　　　　　　　　　　() => focusedWindow.webContents.toggleDevTools()
　　　　　　　　)
  })
  app.on('browser-window-blur', (event, focusedWindow) => {
    globalShortcut.unregister(
　　　　　　　　　　　　process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'
　　　　　　　　)
  })
}
~~~
### ライセンスコメント
~~~js
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dest'),
  },
  optimization: {
    minimizer:
      argv.mode === 'production'
        ? [
            new UglifyJSPlugin({
              uglifyOptions: {
                output: {comments: /^\**!|@preserve|@license|@cc_on/},
              },
            }),
          ]
        : [],
  },
});
~~~
or
Using license-info-webpack-plugin