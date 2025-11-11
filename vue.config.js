const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end();
  },

  // ✅ 强制覆盖默认 Service Worker 注入逻辑
pwa: {
  workboxPluginMode: 'GenerateSW',
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    exclude: [/\.map$/, /_redirects/]
  }
}
};
