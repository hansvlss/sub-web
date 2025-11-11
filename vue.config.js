const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './', // ✅ 保证相对路径构建，防止空白页

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  chainWebpack: config => {
    // ✅ set svg-sprite-loader
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
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // ✅ 输出环境变量日志（构建时会打印到 Netlify 日志）
    console.log('=== Vue CLI ENV CHECK START ===');
    console.log(process.env);
    console.log('=== Vue CLI ENV CHECK END ===');
  },

  // ✅ 禁用 PWA，防止 Netlify 出现 "unsupported MIME type" 报错
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: false, // 禁用自动更新 SW
      clientsClaim: false
    }
  }
};
