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

    console.log('=== ENV CHECK ===');
    console.log(process.env);
    console.log('=================');
  },

  // ✅ 这里改成空对象，禁用 PWA 插件逻辑但保持合法格式
  pwa: {}
};
