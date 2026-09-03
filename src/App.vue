<template>
  <div id="app" :class="{ 'is-embedded': embedded }">
    <header v-if="!embedded" class="site-header">
      <div class="site-header__inner">
        <router-link class="site-brand" to="/">
          <img class="site-brand__mark" src="/img/subweb-mark-192.png" alt="" aria-hidden="true">
          <span>SubWeb</span>
        </router-link>
        <nav class="site-nav" aria-label="主导航">
          <router-link exact to="/">转换工具</router-link>
          <router-link to="/clients">客户端推荐</router-link>
          <router-link to="/help">帮助</router-link>
        </nav>
      </div>
    </header>
    <main><router-view/></main>
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div><strong>SubWeb</strong><span>简单实用的代理网络工具站</span></div>
        <nav aria-label="页尾导航"><router-link to="/">转换工具</router-link><router-link to="/clients">支持客户端</router-link><router-link to="/help">使用说明</router-link></nav>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
    embedded() { return this.$route.query.embed === "1"; }
  },
  mounted() {
    if (!this.embedded) return;
    document.documentElement.classList.add("subweb-embedded");
    document.body.classList.add("subweb-embedded");
    this.embedObserver = new ResizeObserver(() => {
      window.parent.postMessage({ type: "subweb:height", height: document.documentElement.scrollHeight }, "*");
    });
    this.embedObserver.observe(document.body);
  },
  beforeDestroy() {
    if (this.embedObserver) this.embedObserver.disconnect();
    document.documentElement.classList.remove("subweb-embedded");
    document.body.classList.remove("subweb-embedded");
  }
};
</script>

<style>
html, body { margin: 0; background: #f5f9ff; }
html.subweb-embedded, body.subweb-embedded { background: #fff; }
body { color: #1f2329; font-family: Poppins, "Noto Sans SC", "PingFang SC", sans-serif; }
#app { min-height: 100vh; background: #f5f9ff; }
#app.is-embedded { min-height: 0; }
.is-embedded, .is-embedded .subconverter-page { background: #fff; }
.site-header { position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,.92); border-bottom: 1px solid #e8e9ec; backdrop-filter: blur(14px); }
.site-header__inner { display: flex; align-items: center; justify-content: space-between; width: min(1180px, calc(100% - 32px)); min-height: 64px; margin: auto; }
.site-brand { display: inline-flex; align-items: center; gap: 10px; color: #17191d; font-size: 17px; font-weight: 800; text-decoration: none; }
.site-brand__mark { display: block; width: 34px; height: 34px; object-fit: cover; border-radius: 10px; }
.site-nav { display: flex; align-items: center; gap: 6px; }
.site-nav a { padding: 9px 13px; color: #555c67; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 9px; }
.site-nav a:hover, .site-nav a.router-link-exact-active { color: #2684ff; background: #eef6ff; }
.site-footer { background: #f5f9ff; border-top: 1px solid #dfe8f3; }
.site-footer__inner { display: flex; align-items: center; justify-content: space-between; gap: 30px; width: min(1160px, calc(100% - 40px)); margin: 0 auto; padding: 30px 0 36px; color: #748198; font-size: 13px; }
.site-footer__inner > div { display: flex; flex-direction: column; gap: 6px; }
.site-footer strong { color: #213654; font-size: 15px; }
.site-footer nav { display: flex; gap: 22px; }
.site-footer a { color: #62718a; text-decoration: none; }
.site-footer a:hover { color: #2684ff; }
@media (max-width: 700px) {
  .site-header__inner { width: calc(100% - 20px); min-height: 58px; }
  .site-brand span:last-child { display: none; }
  .site-nav { gap: 0; }
  .site-nav a { padding: 8px; font-size: 13px; }
  .site-footer__inner { align-items: flex-start; flex-direction: column; width: calc(100% - 28px); padding: 26px 0 30px; }
  .site-footer nav { flex-wrap: wrap; gap: 12px 20px; }
}
</style>
