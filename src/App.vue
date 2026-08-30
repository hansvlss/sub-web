<template>
  <div id="app">
    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-brand" href="#top">
          <span class="site-brand__mark">H</span>
          <span>在线订阅转换工具</span>
        </a>
        <nav class="site-nav" aria-label="主导航">
          <a class="is-active" href="#converter">转换工具</a>
          <a href="#clients">客户端推荐</a>
          <a href="#help">帮助</a>
        </nav>
      </div>
    </header>
    <main><router-view/></main>
    <footer class="site-footer">
      <div><strong>在线订阅转换工具</strong><span>专注订阅链接转换，简洁、清晰。</span></div>
      <p>订阅链接可能包含个人配置信息，请勿公开分享。</p>
    </footer>
  </div>
</template>

<style>
html, body { margin: 0; background: #f5f6f8; }
body { color: #1f2329; font-family: Poppins, "Noto Sans SC", "PingFang SC", sans-serif; }
.site-header { position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,.92); border-bottom: 1px solid #e8e9ec; backdrop-filter: blur(14px); }
.site-header__inner { display: flex; align-items: center; justify-content: space-between; width: min(1180px, calc(100% - 32px)); min-height: 64px; margin: auto; }
.site-brand { display: inline-flex; align-items: center; gap: 10px; color: #17191d; font-size: 17px; font-weight: 800; text-decoration: none; }
.site-brand__mark { display: grid; width: 34px; height: 34px; place-items: center; color: #fff; background: #2684ff; border-radius: 10px; }
.site-nav { display: flex; align-items: center; gap: 6px; }
.site-nav a { padding: 9px 13px; color: #555c67; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 9px; }
.site-nav a:hover, .site-nav a.is-active { color: #2684ff; background: #eef6ff; }
.site-footer { display: flex; justify-content: space-between; gap: 30px; width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 34px 0 42px; color: #7a818d; font-size: 13px; border-top: 1px solid #e2e4e8; }
.site-footer div { display: flex; flex-direction: column; gap: 6px; }
.site-footer strong { color: #252932; font-size: 15px; }
.site-footer p { max-width: 480px; margin: 0; line-height: 1.7; text-align: right; }
@media (max-width: 700px) {
  .site-header__inner { width: calc(100% - 20px); min-height: 58px; }
  .site-brand span:last-child { display: none; }
  .site-nav { gap: 0; }
  .site-nav a { padding: 8px; font-size: 13px; }
  .site-footer { flex-direction: column; width: calc(100% - 28px); }
  .site-footer p { text-align: left; }
}
</style>
