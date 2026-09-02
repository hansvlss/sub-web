<template>
  <div id="top" class="clients-page">
    <section class="clients-hero">
      <span>客户端推荐</span>
      <h1>选择适合你的代理客户端</h1>
      <p>按设备和使用习惯整理常用客户端。下载入口统一指向项目官方发布页或应用商店。</p>
    </section>

    <section class="choice-guide clients-shell">
      <strong>选择时主要看四点</strong>
      <div><span>设备系统</span><span>订阅格式</span><span>使用难度</span><span>规则需求</span></div>
    </section>

    <section v-for="group in groups" :key="group.title" class="client-section clients-shell">
      <header><div><span>{{ group.label }}</span><h2>{{ group.title }}</h2></div><p>{{ group.description }}</p></header>
      <div class="client-grid">
        <article v-for="client in group.clients" :key="client.name" class="client-card">
          <div class="client-card__top"><span>{{ client.platform }}</span><b>{{ client.type }}</b></div>
          <h3>{{ client.name }}</h3>
          <p>{{ client.summary }}</p>
          <ul><li v-for="feature in client.features" :key="feature">{{ feature }}</li></ul>
          <a :href="client.url" target="_blank" rel="noopener noreferrer">前往官方发布页 <i class="el-icon-top-right" /></a>
        </article>
      </div>
    </section>

    <section class="download-note clients-shell">
      <strong>下载提示</strong>
      <p>请按操作系统和 CPU 架构选择安装包。项目版本、支持平台与维护状态可能变化，请以链接中的官方说明为准。</p>
      <router-link to="/">返回转换工具</router-link>
    </section>
  </div>
</template>

<script>
export default {
  created() {
    document.title = "客户端推荐 - SubWeb";
  },
  data() {
    return {
      groups: [
        {
          label: "DESKTOP",
          title: "桌面客户端",
          description: "适合 Windows、macOS 或 Linux 日常使用。",
          clients: [
            { name: "Clash Verge Rev", platform: "Windows · macOS · Linux", type: "Mihomo", summary: "界面清晰的 Mihomo 桌面客户端，适合订阅管理、策略切换和规则分流。", features: ["图形化管理", "支持系统代理与 TUN", "适合 Clash / Mihomo 配置"], url: "https://github.com/clash-verge-rev/clash-verge-rev/releases" },
            { name: "v2rayN", platform: "Windows · Linux · macOS", type: "Xray / sing-box", summary: "成熟的桌面图形客户端，适合需要管理多种协议和多个订阅的用户。", features: ["支持多种核心", "订阅与路由管理", "功能选项较丰富"], url: "https://github.com/2dust/v2rayN/releases" },
            { name: "FlClash", platform: "Windows · macOS · Linux", type: "Mihomo", summary: "基于 Flutter 的跨平台客户端，界面和操作方式在不同系统间较统一。", features: ["跨平台界面", "订阅导入", "规则与节点选择"], url: "https://github.com/chen08209/FlClash/releases" }
          ]
        },
        {
          label: "MOBILE & CROSS-PLATFORM",
          title: "移动端与跨平台客户端",
          description: "适合 Android、iPhone、iPad 或多设备切换。",
          clients: [
            { name: "Karing", platform: "Android · iOS · macOS · Windows", type: "Clash / sing-box", summary: "覆盖多个桌面与移动平台，适合希望使用同一套操作方式管理订阅的用户。", features: ["多平台支持", "路由规则管理", "支持常见订阅格式"], url: "https://github.com/KaringX/karing/releases" },
            { name: "v2rayNG", platform: "Android", type: "Xray / v2fly", summary: "Android 上常用的 V2Ray 图形客户端，适合导入 VMess、VLESS、Trojan 等配置。", features: ["Android 原生客户端", "订阅批量管理", "支持常见 V2Ray 协议"], url: "https://github.com/2dust/v2rayNG/releases" },
            { name: "Hiddify", platform: "Windows · macOS · Linux · Android · iOS", type: "sing-box", summary: "面向多平台的图形客户端，提供订阅导入、节点选择和基础路由能力。", features: ["多平台安装包", "支持多种协议", "适合快速开始"], url: "https://github.com/hiddify/hiddify-app/releases" },
            { name: "sing-box", platform: "Windows · macOS · Linux · Android · iOS", type: "通用平台", summary: "通用代理平台，适合熟悉配置文件、路由规则或希望直接使用 sing-box 生态的用户。", features: ["覆盖多个系统", "路由能力灵活", "更适合有配置经验的用户"], url: "https://github.com/SagerNet/sing-box/releases" },
            { name: "Shadowrocket", platform: "iPhone · iPad", type: "App Store", summary: "iOS 与 iPadOS 上的规则代理工具，购买和可用情况取决于 App Store 所在地区。", features: ["移动端使用", "订阅导入", "规则和脚本功能"], url: "https://apps.apple.com/app/shadowrocket/id932747118" }
          ]
        }
      ]
    };
  }
};
</script>

<style scoped>
.clients-page { min-height: 100vh; padding: 40px 20px 72px; color: #172b4d; background: #f5f9ff; }
.clients-page * { box-sizing: border-box; }
.clients-shell, .clients-hero { width: min(1160px, 100%); margin-right: auto; margin-left: auto; }
.clients-hero { padding: 46px 28px; color: #fff; text-align: center; background: #2776ed; border-radius: 16px; }
.clients-hero > span { font-size: 13px; font-weight: 800; letter-spacing: .12em; }
.clients-hero h1 { margin: 10px 0 12px; font-size: clamp(30px, 4vw, 42px); letter-spacing: -.035em; }
.clients-hero p { max-width: 720px; margin: auto; color: #eaf3ff; font-size: 15px; line-height: 1.75; }
.choice-guide { display: flex; align-items: center; gap: 20px; margin-top: 18px; padding: 18px 22px; color: #31527f; background: #eaf4ff; border: 1px solid #d3e8ff; border-radius: 12px; }
.choice-guide strong { flex: 0 0 auto; font-size: 14px; }
.choice-guide div { display: flex; flex-wrap: wrap; gap: 8px; }
.choice-guide span { padding: 6px 11px; font-size: 12px; background: #fff; border: 1px solid #d8e7f8; border-radius: 999px; }
.client-section { margin-top: 36px; }
.client-section > header { display: flex; align-items: end; justify-content: space-between; gap: 28px; margin-bottom: 18px; }
.client-section header span { color: #2776ed; font-size: 11px; font-weight: 800; letter-spacing: .12em; }
.client-section h2 { margin: 5px 0 0; font-size: 26px; letter-spacing: -.025em; }
.client-section header p { margin: 0; color: #748198; font-size: 13px; }
.client-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.client-card { display: flex; flex-direction: column; padding: 24px; background: #fff; border: 1px solid #e1e8f0; border-radius: 14px; box-shadow: 0 12px 32px rgba(36, 79, 135, .055); }
.client-card__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #748198; font-size: 11px; }
.client-card__top b { padding: 5px 8px; color: #2776ed; font-weight: 700; background: #eef6ff; border-radius: 999px; }
.client-card h3 { margin: 18px 0 9px; color: #172b4d; font-size: 20px; }
.client-card > p { min-height: 68px; margin: 0; color: #65758b; font-size: 13px; line-height: 1.75; }
.client-card ul { margin: 18px 0 22px; padding: 15px 16px 15px 34px; color: #53657d; font-size: 12px; line-height: 1.9; background: #f7faff; border-radius: 9px; }
.client-card a { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding: 12px 14px; color: #fff; font-size: 13px; font-weight: 700; text-decoration: none; background: #2776ed; border-radius: 9px; }
.client-card a:hover { background: #1767d8; }
.download-note { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 20px; margin-top: 36px; padding: 22px 24px; background: #fff; border: 1px solid #e1e8f0; border-radius: 12px; }
.download-note p { margin: 0; color: #65758b; font-size: 13px; line-height: 1.7; }
.download-note a { color: #2776ed; font-size: 13px; font-weight: 700; text-decoration: none; }
@media (max-width: 900px) { .client-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) {
  .clients-page { padding: 20px 10px 46px; }
  .clients-hero { padding: 32px 18px; border-radius: 12px; }
  .clients-hero h1 { font-size: 29px; }
  .choice-guide, .client-section > header, .download-note { align-items: flex-start; flex-direction: column; }
  .choice-guide { gap: 10px; padding: 15px; }
  .client-grid { grid-template-columns: 1fr; }
  .client-section > header { display: flex; gap: 8px; }
  .download-note { display: flex; gap: 10px; }
  .client-card > p { min-height: 0; }
}
</style>
