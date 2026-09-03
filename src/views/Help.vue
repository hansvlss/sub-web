<template>
  <div class="help-page">
    <section class="help-hero help-shell">
      <span>使用帮助</span>
      <h1>订阅转换使用说明</h1>
      <p>从粘贴订阅到导入客户端，快速了解转换方法和常见问题。</p>
    </section>

    <section class="help-steps help-shell">
      <article v-for="(step, index) in steps" :key="step.title">
        <b>{{ index + 1 }}</b><div><h2>{{ step.title }}</h2><p>{{ step.text }}</p></div>
      </article>
    </section>

    <section class="help-faq help-shell">
      <header><span>常见问题</span><h2>转换前后需要注意什么</h2></header>
      <el-collapse accordion>
        <el-collapse-item v-for="item in faqs" :key="item.question" :title="item.question">
          <p>{{ item.answer }}</p>
        </el-collapse-item>
      </el-collapse>
    </section>

    <section class="help-note help-shell">
      <div><strong>保护订阅信息</strong><p>订阅链接可能包含个人配置，请勿公开分享，也不要提交给不可信的网站或人员。</p></div>
      <router-link to="/">开始转换</router-link>
    </section>
  </div>
</template>

<script>
export default {
  created() { document.title = "使用帮助 - SubWeb"; },
  data() {
    return {
      steps: [
        { title: "添加订阅", text: "粘贴一个或多个有效订阅链接；多个链接可换行填写或使用竖线分隔。" },
        { title: "选择格式", text: "根据实际使用的客户端选择目标格式；不确定时先查看客户端的官方说明。" },
        { title: "生成并导入", text: "生成转换链接后复制到客户端，更新订阅并检查节点与规则是否符合预期。" }
      ],
      faqs: [
        { question: "为什么生成后无法使用？", answer: "请检查原订阅是否有效、转换后端是否可用，以及目标格式是否与客户端匹配。" },
        { question: "可以合并多个订阅吗？", answer: "可以。多个订阅可按行填写，或使用竖线分隔后一起转换。" },
        { question: "转换会修改原订阅吗？", answer: "不会。工具生成新的转换链接，原订阅地址本身不会被修改。" },
        { question: "应该选择哪个转换模板？", answer: "没有特殊分流需求时使用默认配置；其他模板应按客户端与实际规则需求选择。" }
      ]
    };
  }
};
</script>

<style scoped>
.help-page { min-height: 100vh; padding: 40px 20px 72px; color: #172b4d; background: #f5f9ff; }
.help-page * { box-sizing: border-box; }
.help-shell { width: min(1160px, 100%); margin-right: auto; margin-left: auto; }
.help-hero { padding: 42px 28px; color: #fff; text-align: center; background: #2776ed; border-radius: 16px; }
.help-hero span, .help-faq header span { font-size: 12px; font-weight: 800; letter-spacing: .12em; }
.help-hero h1 { margin: 9px 0 10px; font-size: clamp(28px, 3.5vw, 38px); }
.help-hero p { margin: 0; color: #eaf3ff; font-size: 14px; }
.help-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 18px; }
.help-steps article { display: flex; gap: 14px; padding: 24px; background: #fff; border: 1px solid #e1e8f0; border-radius: 12px; }
.help-steps b { display: grid; flex: 0 0 32px; width: 32px; height: 32px; place-items: center; color: #fff; background: #2776ed; border-radius: 9px; }
.help-steps h2 { margin: 2px 0 7px; font-size: 17px; }
.help-steps p, .help-faq p, .help-note p { margin: 0; color: #65758b; font-size: 13px; line-height: 1.75; }
.help-faq { margin-top: 36px; }
.help-faq header { margin-bottom: 16px; }
.help-faq header span { color: #2776ed; }
.help-faq h2 { margin: 5px 0 0; font-size: 26px; }
.help-faq .el-collapse { padding: 0 22px; background: #fff; border: 1px solid #e1e8f0; border-radius: 12px; }
.help-faq .el-collapse-item:last-child ::v-deep .el-collapse-item__wrap { border-bottom: 0; }
.help-note { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 24px; padding: 22px 24px; background: #eaf4ff; border: 1px solid #d3e8ff; border-radius: 12px; }
.help-note strong { display: block; margin-bottom: 5px; }
.help-note a { flex: 0 0 auto; padding: 11px 18px; color: #fff; font-size: 13px; font-weight: 700; text-decoration: none; background: #2776ed; border-radius: 9px; }
@media (max-width: 700px) {
  .help-page { padding: 20px 10px 46px; }
  .help-hero { padding: 32px 18px; border-radius: 12px; }
  .help-steps { grid-template-columns: 1fr; }
  .help-note { align-items: flex-start; flex-direction: column; }
}
</style>
