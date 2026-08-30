<template>
  <div id="top" class="subconverter-page">
    <section class="converter-hero">
      <h1>一个清晰的订阅转换工具</h1>
      <p>支持 Clash、sing-box、Surge、Quantumult X 等客户端格式，快速生成可用订阅链接。</p>
    </section>
    <el-row id="converter" class="converter-shell">
      <el-col>
        <el-card class="converter-card" shadow="never">
          <el-container>
            <el-form class="converter-form" :model="form" label-position="top">
              <el-form-item class="mode-switch" label="模式">
                <el-radio v-model="advanced" label="1">基础模式</el-radio>
                <el-radio v-model="advanced" label="2">进阶模式</el-radio>
              </el-form-item>
              <el-form-item label="订阅链接">
                <el-input v-model="form.sourceSubUrl" type="textarea" rows="4" maxlength="5000" show-word-limit
                  placeholder="支持订阅或ss/ssr/vmess链接，多个链接每行一个或用 | 分隔" @blur="saveSubUrl" />
              </el-form-item>
              <div class="converter-basic-grid">
                <el-form-item label="目标客户端">
                  <el-select v-model="form.clientType" style="width: 100%">
                    <el-option v-for="(v, k) in options.clientTypes" :key="k" :label="k" :value="v"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="远程配置（可选）">
                  <el-select v-model="form.remoteConfig" clearable filterable placeholder="默认配置" style="width: 100%">
                    <el-option-group v-for="group in options.remoteConfig" :key="group.label" :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-option-group>
                  </el-select>
                </el-form-item>
                <el-form-item label="文件名（可选）">
                  <el-input v-model="form.filename" placeholder="例如：我的订阅" />
                </el-form-item>
              </div>

              <div v-if="advanced === '2'" class="converter-advanced">
                <el-form-item label="后端地址:">
                  <el-autocomplete style="width: 100%" v-model="form.customBackend" :fetch-suggestions="backendSearch"
                    placeholder="动动小手，（建议）自行搭建后端服务。例：http://127.0.0.1:25500/sub?">
                    <el-button slot="append" @click="gotoGayhub" icon="el-icon-link">前往项目仓库</el-button>
                  </el-autocomplete>
                </el-form-item>
                <el-form-item label="Include:">
                  <el-input v-model="form.includeRemarks" placeholder="节点名包含的关键字，支持正则" />
                </el-form-item>
                <el-form-item label="Exclude:">
                  <el-input v-model="form.excludeRemarks" placeholder="节点名不包含的关键字，支持正则" />
                </el-form-item>

                <el-form-item v-for="(param, i) in customParams" :key="i">
                  <el-input slot="label" v-model="param.name" placeholder="自定义参数名">
                    <div slot="suffix" style="width: 10px;">:</div>
                  </el-input>
                  <el-input v-model="param.value" placeholder="自定义参数内容">
                      <el-button slot="suffix" type="text" icon="el-icon-delete" style="margin-right: 5px" @click="customParams.splice(i, 1)"/>
                  </el-input>
                </el-form-item>

                <el-form-item label-width="0px">
                  <el-row type="flex">
                    <el-col>
                      <el-checkbox v-model="form.nodeList" label="输出为 Node List" border></el-checkbox>
                    </el-col>
                    <el-popover placement="bottom" v-model="form.extraset">
                      <el-row>
                        <el-checkbox v-model="form.emoji" label="Emoji"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.scv" label="跳过证书验证"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.udp" @change="needUdp = true" label="启用 UDP"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.appendType" label="节点类型"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.sort" label="排序节点"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.fdn" label="过滤非法节点"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.expand" label="规则展开"></el-checkbox>
                      </el-row>
                      <el-button slot="reference">更多选项</el-button>
                    </el-popover>
                    <el-popover placement="bottom" style="margin-left: 10px">
                      <el-row>
                        <el-checkbox v-model="form.tpl.surge.doh" label="Surge.DoH"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.insert" label="网易云"></el-checkbox>
                      </el-row>
                      <el-button slot="reference">定制功能</el-button>
                    </el-popover>
                    <el-popover placement="top-end" title="添加自定义转换参数" trigger="hover">
                      <el-link type="primary" :href="subDocAdvanced" target="_blank" icon="el-icon-info">参考文档</el-link>
                      <el-button slot="reference" @click="addCustomParam" style="margin-left: 10px">
                        <i class="el-icon-plus"></i>
                      </el-button>
                    </el-popover>
                  </el-row>
                </el-form-item>
              </div>

              <el-button class="generate-button" type="primary" icon="el-icon-magic-stick" @click="makeUrl"
                :disabled="form.sourceSubUrl.length === 0">生成订阅</el-button>

              <el-divider class="converter-divider" />

              <el-form-item label="订阅链接">
                <el-input class="copy-content" disabled v-model="customSubUrl">
                  <el-button slot="append" v-clipboard:copy="customSubUrl" v-clipboard:success="onCopy" ref="copy-btn"
                    icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="短链接">
                <el-input class="copy-content" disabled v-model="curtomShortSubUrl">
                  <el-button slot="append" v-clipboard:copy="curtomShortSubUrl" v-clipboard:success="onCopy"
                    ref="copy-btn" icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>

              <el-form-item class="converter-actions" label-width="0px">
                <el-button plain @click="makeShortUrl" :loading="loading"
                  :disabled="customSubUrl.length === 0">生成短链接</el-button>
              </el-form-item>
              <p class="privacy-note"><i class="el-icon-info" /> 订阅链接可能包含个人配置或节点信息，请勿公开分享给不信任的人。</p>
            </el-form>
          </el-container>
        </el-card>
      </el-col>
    </el-row>

    <section id="clients" class="content-section converter-shell">
      <div class="section-heading"><h2>支持的客户端</h2><p>请从官方渠道获取客户端，并根据系统与架构选择版本。</p></div>
      <div class="client-list">
        <div v-for="client in clients" :key="client.name" class="client-row">
          <div><strong>{{ client.name }}</strong><small>{{ client.note }}</small></div>
          <span class="client-platform">{{ client.platform }}</span>
          <a :href="client.url" target="_blank" rel="noopener noreferrer">官方来源 <i class="el-icon-top-right" /></a>
        </div>
      </div>
    </section>

    <section class="content-section converter-shell checklist-section">
      <div class="section-heading"><h2>转换前先确认</h2></div>
      <ul>
        <li>原订阅链接可以在对应客户端中正常使用。</li>
        <li>目标客户端与所选输出格式一致。</li>
        <li>需要筛选节点或调整规则时，再启用进阶模式。</li>
        <li>转换后请在客户端中检查节点与规则是否符合预期。</li>
      </ul>
    </section>

    <section id="help" class="content-section converter-shell faq-section">
      <div class="section-heading"><h2>常见问题</h2></div>
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in faqs" :key="item.question" :name="index">
          <template slot="title">{{ item.question }}</template>
          <p>{{ item.answer }}</p>
        </el-collapse-item>
      </el-collapse>
    </section>

    <el-dialog :visible.sync="dialogUploadConfigVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false" width="700px">
      <div slot="title">
        Remote config upload
        <el-popover trigger="hover" placement="right" style="margin-left: 10px">
          <el-link type="primary" :href="sampleConfig" target="_blank" icon="el-icon-info">参考配置</el-link>
          <i class="el-icon-question" slot="reference"></i>
        </el-popover>
      </div>
      <el-form label-position="left">
        <el-form-item prop="uploadConfig">
          <el-input v-model="uploadConfig" type="textarea" :autosize="{ minRows: 15, maxRows: 30 }" maxlength="10000"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadConfig = ''; dialogUploadConfigVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUploadConfig" :disabled="uploadConfig.length === 0">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogLoadConfigVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false" width="700px">
      <div slot="title">
        解析 Subconverter 链接
      </div>
      <el-form label-position="left" :inline="true" >
        <el-form-item prop="uploadConfig" label="订阅链接：" label-width="85px">
          <el-input v-model="loadConfig" style="width: 565px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loadConfig = ''; dialogLoadConfigVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmLoadConfig" :disabled="loadConfig.length === 0">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const project = process.env.VUE_APP_PROJECT
const remoteConfigSample = process.env.VUE_APP_SUBCONVERTER_REMOTE_CONFIG
const subDocAdvanced = process.env.VUE_APP_SUBCONVERTER_DOC_ADVANCED
const gayhubRelease = process.env.VUE_APP_BACKEND_RELEASE
const defaultBackend = process.env.VUE_APP_SUBCONVERTER_DEFAULT_BACKEND + '/sub?'
const shortUrlBackend = process.env.VUE_APP_MYURLS_API
const configUploadBackend = process.env.VUE_APP_CONFIG_UPLOAD_API
const tgBotLink = process.env.VUE_APP_BOT_LINK

export default {
  data() {
    return {
      backendVersion: "",
      advanced: "1",

      // 是否为 PC 端
      isPC: true,

      options: {
        clientTypes: {
          Clash: "clash",
          Surge: "surge&ver=4",
          Quantumult: "quan",
          QuantumultX: "quanx",
          Mellow: "mellow",
          Surfboard: "surfboard",
          Loon: "loon",
          singbox: "singbox",
          ss: "ss",
          ssd: "ssd",
          sssub: "sssub",
          ssr: "ssr",
          ClashR: "clashr",          
          V2Ray: "v2ray",
          Trojan: "trojan",
          Surge3: "surge&ver=3",
        },
        backendOptions: [{ value: "http://127.0.0.1:25500/sub?" }],
        remoteConfig: [
          {
            label: "universal",
            options: [
              {
                label: "No-Urltest",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/no-urltest.ini"
              },
              {
                label: "Urltest",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/urltest.ini"
              }
            ]
          },
          {
            label: "customized",
            options: [
              {
                label: "Maying",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/maying.ini"
              },
              {
                label: "Ytoo",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ytoo.ini"
              },
              {
                label: "FlowerCloud",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/flowercloud.ini"
              },
              {
                label: "Nexitally",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/nexitally.ini"
              },
              {
                label: "SoCloud",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/socloud.ini"
              },
              {
                label: "ARK",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ark.ini"
              },
              {
                label: "ssrCloud",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ssrcloud.ini"
              }
            ]
          },
          {
            label: "Special",
            options: [
              {
                label: "NeteaseUnblock(仅规则，No-Urltest)",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/netease.ini"
              },
              {
                label: "Basic(仅GEOIP CN + Final)",
                value:
                  "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/basic.ini"
              }
            ]
          }
        ]
      },
      form: {
        sourceSubUrl: "",
        clientType: "",
        customBackend: "",
        remoteConfig: "",
        excludeRemarks: "",
        includeRemarks: "",
        filename: "",
        emoji: true,
        nodeList: false,
        extraset: false,
        sort: false,
        udp: false,
        tfo: false,
        scv: true,
        fdn: false,
        expand: true,
        appendType: false,
        insert: false, // 是否插入默认订阅的节点，对应配置项 insert_url
        new_name: true, // 是否使用 Clash 新字段

        // tpl 定制功能
        tpl: {
          surge: {
            doh: false // dns 查询是否使用 DoH
          },
          clash: {
            doh: false
          }
        }
      },

      customParams: [],

      loading: false,
      customSubUrl: "",
      curtomShortSubUrl: "",

      dialogUploadConfigVisible: false,
      loadConfig: "",
      dialogLoadConfigVisible: false,
      uploadConfig: "",
      uploadPassword: "",
      myBot: tgBotLink,
      sampleConfig: remoteConfigSample,
      subDocAdvanced: subDocAdvanced,

      needUdp: false, // 是否需要添加 udp 参数
      clients: [
        { name: "Clash Verge Rev", note: "开源桌面客户端", platform: "Windows · macOS · Linux", url: "https://github.com/clash-verge-rev/clash-verge-rev" },
        { name: "FlClash", note: "跨平台开源客户端", platform: "Windows · macOS · Android", url: "https://github.com/chen08209/FlClash" },
        { name: "sing-box", note: "通用代理平台", platform: "Windows · macOS · Linux · Android", url: "https://github.com/SagerNet/sing-box" },
        { name: "Shadowrocket", note: "iOS 客户端", platform: "iOS", url: "https://apps.apple.com/app/shadowrocket/id932747118" }
      ],
      faqs: [
        { question: "转换后的订阅链接可以长期使用吗？", answer: "链接是否持续可用取决于原订阅、转换后端和远程配置的可用状态。" },
        { question: "为什么有些节点转换后无法使用？", answer: "常见原因包括客户端不支持该协议、原节点失效，或所选规则与节点不兼容。" },
        { question: "如何选择目标客户端？", answer: "选择与你实际使用的软件对应的格式；不确定时请先查看客户端的官方说明。" },
        { question: "可以一次转换多个订阅吗？", answer: "可以。多个订阅链接可按行填写，或使用竖线分隔。" }
      ],
    };
  },
  created() {
    document.title = "Subscription Converter";
    this.isPC = this.$getOS().isPc;

    // 获取 url cache
    if (process.env.VUE_APP_USE_STORAGE === 'true') {
      this.form.sourceSubUrl = this.getLocalStorageItem('sourceSubUrl')
    }
  },
  mounted() {
    this.form.clientType = "clash";
    this.getBackendVersion();
  },
  methods: {
    onCopy() {
      this.$message.success("Copied!");
    },
    goToProject() {
      window.open(project);
    },
    gotoGayhub() {
      window.open(gayhubRelease);
    },
    gotoRemoteConfig() {
      window.open(remoteConfigSample);
    },
    clashInstall() {
      if (this.customSubUrl === "") {
        this.$message.error("请先填写必填项，生成订阅链接");
        return false;
      }

      const url = "clash://install-config?url=";
      window.open(
        url +
        encodeURIComponent(
          this.curtomShortSubUrl !== ""
            ? this.curtomShortSubUrl
            : this.customSubUrl
        )
      );
    },
    surgeInstall() {
      if (this.customSubUrl === "") {
        this.$message.error("请先填写必填项，生成订阅链接");
        return false;
      }

      const url = "surge://install-config?url=";
      window.open(url + this.customSubUrl);
    },
    addCustomParam(){
      this.customParams.push({
        name: "",
        value: "",
      })
    },
    makeUrl() {
      if (this.form.sourceSubUrl === "" || this.form.clientType === "") {
        this.$message.error("订阅链接与客户端为必填项");
        return false;
      }

      let backend =
        this.form.customBackend === ""
          ? defaultBackend
          : this.form.customBackend;

      let sourceSub = this.form.sourceSubUrl;
      sourceSub = sourceSub.replace(/(\n|\r|\n\r)/g, "|");

      this.customSubUrl =
        backend +
        "target=" +
        this.form.clientType +
        "&url=" +
        encodeURIComponent(sourceSub) +
        "&insert=" +
        this.form.insert;

      if (this.advanced === "2") {
        if (this.form.remoteConfig) {
          this.customSubUrl +=
            "&config=" + encodeURIComponent(this.form.remoteConfig);
        }
        if (this.form.excludeRemarks) {
          this.customSubUrl +=
            "&exclude=" + encodeURIComponent(this.form.excludeRemarks);
        }
        if (this.form.includeRemarks) {
          this.customSubUrl +=
            "&include=" + encodeURIComponent(this.form.includeRemarks);
        }
        if (this.form.filename) {
          this.customSubUrl +=
            "&filename=" + encodeURIComponent(this.form.filename);
        }
        if (this.form.appendType) {
          this.customSubUrl +=
            "&append_type=" + this.form.appendType.toString();
        }

      this.customSubUrl +=
  "&emoji=" +
  this.form.emoji.toString() +
  // ✅ 仅在目标为 Clash 且后端支持时启用 list 参数
  (this.form.clientType === "clash" ? "&list=" + this.form.nodeList.toString() : "") +
  "&tfo=" +
  this.form.tfo.toString() +
  "&scv=" +
  this.form.scv.toString() +
  "&fdn=" +
  this.form.fdn.toString() +
  "&expand=" +
  this.form.expand.toString() +
  "&sort=" +
  this.form.sort.toString();

        if (this.needUdp) {
          this.customSubUrl += "&udp=" + this.form.udp.toString()
        }

        if (this.form.tpl.surge.doh === true) {
          this.customSubUrl += "&surge.doh=true";
        }

        if (this.form.clientType === "clash") {
          if (this.form.tpl.clash.doh === true) {
            this.customSubUrl += "&clash.doh=true";
          }

          this.customSubUrl += "&new_name=" + this.form.new_name.toString();
        }

        this.customParams.filter(param => param.name && param.value).forEach(param => {
          this.customSubUrl += `&${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`
        })
      }

      this.$copyText(this.customSubUrl);
      this.$message.success("定制订阅已复制到剪贴板");
    },
    makeShortUrl() {
      if (this.customSubUrl === "") {
        this.$message.warning("请先生成订阅链接，再获取对应短链接");
        return false;
      }

      this.loading = true;

      let data = new FormData();
      data.append("longUrl", btoa(this.customSubUrl));

      this.$axios
        .post(shortUrlBackend, data, {
          header: {
            "Content-Type": "application/form-data; charset=utf-8"
          }
        })
        .then(res => {
          if (res.data.Code === 1 && res.data.ShortUrl !== "") {
            this.curtomShortSubUrl = res.data.ShortUrl;
            this.$copyText(res.data.ShortUrl);
            this.$message.success("短链接已复制到剪贴板");
          } else {
            this.$message.error("短链接获取失败：" + res.data.Message);
          }
        })
        .catch(() => {
          this.$message.error("短链接获取失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    notify() {
      const h = this.$createElement;

      this.$notify({
        title: "隐私提示",
        type: "warning",
        message: h(
          "i",
          { style: "color: teal" },
          "各种订阅链接（短链接服务除外）生成纯前端实现，无隐私问题。默认提供后端转换服务，隐私担忧者请自行搭建后端服务。"
        )
      });
    },
    confirmUploadConfig() {
      if (this.uploadConfig === "") {
        this.$message.warning("远程配置不能为空");
        return false;
      }

      this.loading = true;

      let body = {
        content: this.uploadConfig,
      }
      this.$axios.post(configUploadBackend, body).then(res => {
        if (res.data.code === 0 && res.data.data.url !== "") {
          this.$message.success(
            "远程配置上传成功，配置链接已复制到剪贴板，有效期三个月望知悉"
          );

          // 自动填充至『表单-远程配置』
          this.form.remoteConfig = res.data.data.url;
          this.$copyText(this.form.remoteConfig);

          this.dialogUploadConfigVisible = false;
        } else {
          this.$message.error("远程配置上传失败: " + res.data.msg);
        }
      })
        .catch(() => {
          this.$message.error("远程配置上传失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
 * Asynchronously analyzes the URL.
 *
 * @return {Promise<string>} The result of the analysis.
 */
    async analyzeUrl() {
      // Check if `loadConfig` includes "target"
      if (this.loadConfig.includes("target")) {
        // If it does, return `loadConfig`
        return this.loadConfig;
      } else {
        // Otherwise, set `loading` to true
        this.loading = true;
        try {
          // Fetch the data from `loadConfig` using GET method and follow redirects
          let response = await fetch(this.loadConfig, {
            method: "GET",
            redirect: "follow",
          });
          // Return the URL from the response
          return response.url;
        } catch (e) {
          // If an error occurs, display an error message with the error details
          this.$message.error(
            "解析短链接失败，请检查短链接服务端是否配置跨域：" + e
          );
        } finally {
          // Set `loading` to false
          this.loading = false;
        }
      }
    },
    /**
     * Confirm and load the configuration.
     *
     * @return {boolean} Returns false if the 'loadConfig' is empty, otherwise returns true.
     */
    confirmLoadConfig() {
      // Check if 'loadConfig' is empty
      if (this.loadConfig.trim() === "") {
        // Display error message if 'loadConfig' is empty
        this.$message.error("订阅链接不能为空");
        return false;
      }

      // Async function to handle the configuration loading
      (async () => {
        try {
          // Analyze the URL and extract its components
          const url = new URL(await this.analyzeUrl());

          // Set the custom backend URL
          this.form.customBackend = url.origin + url.pathname + "?";

          // Parse the URL parameters
          const params = new URLSearchParams(url.search);

          // Record parameters have been read
          const getParam = params.get.bind(params)
          const excludeParams = new Set()
          params.get = key => {
            excludeParams.add(key)
            return getParam(key)
          }

          // Get the 'target' parameter
          const target = params.get("target");

          // Set the client type based on the 'target' parameter
          if (target === "surge") {
            const ver = params.get("ver") || "4";
            this.form.clientType = target + "&ver=" + ver;
          } else {
            this.form.clientType = target;
          }

          // Set other form properties based on the URL parameters
          this.form.sourceSubUrl = params.get("url").replace(/\|/g, "\n");
          this.form.insert = params.get("insert") === "true";
          this.form.remoteConfig = params.get("config");
          this.form.excludeRemarks = params.get("exclude");
          this.form.includeRemarks = params.get("include");
          this.form.filename = params.get("filename");
          this.form.appendType = params.get("append_type") === "true";
          this.form.emoji = params.get("emoji") === "true";
          this.form.nodeList = params.get("list") === "true";
          this.form.tfo = params.get("tfo") === "true";
          this.form.scv = params.get("scv") === "true";
          this.form.fdn = params.get("fdn") === "true";
          this.form.sort = params.get("sort") === "true";
          this.form.udp = params.get("udp") === "true";
          this.form.expand = params.get("expand") === "true";
          this.form.tpl.surge.doh = params.get("surge.doh") === "true";
          this.form.tpl.clash.doh = params.get("clash.doh") === "true";
          this.form.new_name = params.get("new_name") === "true";

          // Filter custom parameters
          this.customParams = Array.from(params
            .entries()
            .filter(e => !excludeParams.has(e[0]))
            .map(e => ({ name: e[0], value: e[1] }))
          )

          // Hide the configuration dialog
          this.dialogLoadConfigVisible = false;

          // Display success message
          this.$message.success("长/短链接已成功解析为订阅信息");
        } catch (error) {
          // Display error message if URL is not valid
          this.$message.error("请输入正确的订阅地址!");
        }
      })();
    },
    backendSearch(queryString, cb) {
      let backends = this.options.backendOptions;

      let results = queryString
        ? backends.filter(this.createFilter(queryString))
        : backends;

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return candidate => {
        return (
          candidate.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    getBackendVersion() {
      this.$axios
        .get(
          defaultBackend.substring(0, defaultBackend.length - 5) + "/version"
        )
        .then(res => {
          this.backendVersion = res.data.replace(/backend\n$/gm, "");
          this.backendVersion = this.backendVersion.replace("subconverter", "");
        })
        .catch(() => {
          this.backendVersion = "";
        });
    },
    saveSubUrl() {
      if (this.form.sourceSubUrl !== '') {
        this.setLocalStorageItem('sourceSubUrl', this.form.sourceSubUrl)
      }
    },
    getLocalStorageItem(itemKey) {
      const now = +new Date()
      let ls = localStorage.getItem(itemKey)

      let itemValue = ''
      if (ls !== null) {
        let data = JSON.parse(ls)
        if (data.expire > now) {
          itemValue = data.value
        } else {
          localStorage.removeItem(itemKey)
        }
      }

      return itemValue
    },
    setLocalStorageItem(itemKey, itemValue) {
      const ttl = process.env.VUE_APP_CACHE_TTL
      const now = +new Date()

      let data = {
        setTime: now,
        ttl: parseInt(ttl),
        expire: now + ttl * 1000,
        value: itemValue
      }
      localStorage.setItem(itemKey, JSON.stringify(data))
    }
  },
};
</script>

<style>
.subconverter-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 52px 20px 72px;
  color: #1f2937;
  background:
    radial-gradient(circle at 12% 0%, rgba(59, 130, 246, 0.13), transparent 30%),
    radial-gradient(circle at 88% 8%, rgba(14, 165, 233, 0.1), transparent 28%),
    #f7f9fc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.subconverter-page .converter-hero {
  width: min(920px, 100%);
  margin: 0 auto 34px;
  text-align: center;
}

.subconverter-page .converter-hero__eyebrow {
  margin-bottom: 13px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.subconverter-page .converter-hero h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.subconverter-page .converter-hero p {
  margin: 16px auto 20px;
  color: #64748b;
  font-size: 16px;
  line-height: 1.75;
}

.subconverter-page .converter-formats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.subconverter-page .converter-formats span {
  padding: 6px 11px;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #dce3ee;
  border-radius: 999px;
}

.subconverter-page *,
.subconverter-page *::before,
.subconverter-page *::after {
  box-sizing: border-box;
}

.subconverter-page .converter-shell {
  width: min(1160px, 100%);
  margin: 0 auto;
}

.subconverter-page .converter-card {
  overflow: hidden;
  border: 1px solid #e3e6eb;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(36, 55, 85, 0.1);
}

.subconverter-page .converter-card > .el-card__header {
  padding: 20px 24px;
  border-bottom: 1px solid #e8eaee;
}

.subconverter-page .converter-card > .el-card__body {
  padding: 0;
}

.subconverter-page .converter-header,
.subconverter-page .converter-heading {
  display: flex;
  align-items: center;
}

.subconverter-page .converter-header {
  justify-content: space-between;
  gap: 16px;
}

.subconverter-page .converter-heading {
  gap: 12px;
  min-width: 0;
}

.subconverter-page .converter-title {
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.subconverter-page .converter-project-link {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: #596273;
  cursor: pointer;
  transition: color 160ms ease;
}

.subconverter-page .converter-project-link:hover {
  color: #2563eb;
}

.subconverter-page .converter-version {
  flex: 0 0 auto;
  padding: 4px 9px;
  color: #667085;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  background: #f5f6f8;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
}

.subconverter-page .converter-form {
  width: 100%;
  padding: 34px 40px 42px;
}

.subconverter-page .converter-section-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 26px;
  padding-bottom: 18px;
  border-bottom: 1px solid #edf0f4;
}

.subconverter-page .converter-section-heading--subtle,
.subconverter-page .converter-section-heading--result { margin-top: 34px; }

.subconverter-page .converter-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
}

.subconverter-page .converter-section-heading div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subconverter-page .converter-section-heading strong { color: #172033; font-size: 16px; }
.subconverter-page .converter-section-heading small { color: #8992a3; font-size: 13px; }

.subconverter-page .el-form-item {
  margin-bottom: 18px;
}

.subconverter-page .el-form-item__label {
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
}

.subconverter-page .el-input__inner,
.subconverter-page .el-textarea__inner {
  color: #1f2937;
  background: #fff;
  border-color: #d9dee7;
  border-radius: 8px;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.subconverter-page .el-input__inner {
  height: 42px;
  line-height: 42px;
}

.subconverter-page .el-textarea__inner {
  min-height: 96px !important;
  padding: 11px 14px;
  line-height: 1.65;
}

.subconverter-page .el-input__inner:hover,
.subconverter-page .el-textarea__inner:hover {
  border-color: #aeb7c5;
}

.subconverter-page .el-input__inner:focus,
.subconverter-page .el-textarea__inner:focus {
  border-color: #4f7cff;
  box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.12);
}

.subconverter-page .el-input-group__append {
  color: #596273;
  background: #f8f9fb;
  border-color: #d9dee7;
  border-radius: 0 8px 8px 0;
}

.subconverter-page .el-radio__label,
.subconverter-page .el-checkbox__label {
  color: #4b5563;
  font-weight: 500;
}

.subconverter-page .el-radio__input.is-checked + .el-radio__label {
  color: #2563eb;
}

.subconverter-page .el-radio__input.is-checked .el-radio__inner {
  background: #2563eb;
  border-color: #2563eb;
}

.subconverter-page .converter-advanced {
  padding-top: 2px;
}

.subconverter-page .converter-divider {
  margin: 28px 0 30px;
}

.subconverter-page .converter-divider .el-divider__text {
  color: #7b8494;
  background: #fff;
}

.subconverter-page .el-button {
  min-height: 38px;
  font-weight: 600;
  border-radius: 8px;
}

.subconverter-page .el-button--primary {
  background: #2563eb;
  border-color: #2563eb;
}

.subconverter-page .el-button--danger {
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  border-color: #2563eb;
}

.subconverter-page .converter-actions {
  margin-bottom: 12px;
  text-align: center;
}

.subconverter-page .converter-actions-primary {
  margin-top: 32px;
}

.subconverter-page .copy-content.is-disabled .el-input__inner {
  color: #667085;
  background: #f7f8fa;
}

.subconverter-page .el-notification {
  border-radius: 10px;
}

@media (max-width: 700px) {
  .subconverter-page {
    padding: 30px 10px 40px;
  }

  .subconverter-page .converter-hero { margin-bottom: 24px; padding: 0 10px; }
  .subconverter-page .converter-hero h1 { font-size: 30px; }
  .subconverter-page .converter-hero p { margin: 12px auto 16px; font-size: 14px; }

  .subconverter-page .converter-card {
    border-radius: 10px;
    box-shadow: none;
  }

  .subconverter-page .converter-card > .el-card__header {
    padding: 16px;
  }

  .subconverter-page .converter-title {
    font-size: 16px;
  }

  .subconverter-page .converter-form {
    padding: 20px 16px 24px;
  }

  .subconverter-page .converter-section-heading { align-items: flex-start; margin-bottom: 20px; }

  .subconverter-page .el-form-item {
    margin-bottom: 16px;
  }

  .subconverter-page .el-form-item__label {
    float: none;
    width: 100% !important;
    padding: 0;
    margin-bottom: 7px;
    line-height: 1.5;
    text-align: left;
  }

  .subconverter-page .el-form-item__content {
    margin-left: 0 !important;
  }

  .subconverter-page .converter-advanced .el-row--flex {
    flex-wrap: wrap;
    gap: 8px;
  }

  .subconverter-page .converter-advanced .el-row--flex > .el-col {
    flex: 1 0 100%;
  }

  .subconverter-page .converter-advanced .el-row--flex > .el-popover__reference-wrapper,
  .subconverter-page .converter-advanced .el-row--flex > .el-popover {
    margin-left: 0 !important;
  }

  .subconverter-page .converter-divider {
    margin: 24px 0;
  }

  .subconverter-page .converter-actions .el-form-item__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .subconverter-page .converter-actions .el-button {
    width: 100% !important;
    margin: 0 !important;
  }

  .subconverter-page .converter-actions-wide .el-form-item__content {
    grid-template-columns: 1fr;
  }

  .subconverter-page .el-dialog {
    width: calc(100% - 24px) !important;
  }
}

/* Warm editorial layout inspired by the approved reference page. */
.subconverter-page {
  padding: 42px 20px 68px;
  color: #20211d;
  background:
    radial-gradient(circle at 8% 0%, rgba(214, 90, 49, 0.08), transparent 28%),
    radial-gradient(circle at 92% 6%, rgba(15, 118, 110, 0.09), transparent 30%),
    #f6f2e8;
}

.subconverter-page .converter-hero {
  margin-bottom: 38px;
}

.subconverter-page .converter-hero h1 {
  color: #20211d;
  font-family: Georgia, "Noto Serif SC", "Songti SC", serif;
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.subconverter-page .converter-hero p {
  max-width: 820px;
  margin: 18px auto 0;
  color: #6c6b61;
  font-size: 15px;
}

.subconverter-page .converter-intro {
  margin-bottom: 4px;
}

.subconverter-page .converter-intro h2 {
  margin: 20px 0 14px;
  color: #20211d;
  font-family: Georgia, "Noto Serif SC", "Songti SC", serif;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.18;
}

.subconverter-page .converter-intro h2::after {
  display: block;
  width: 52px;
  height: 3px;
  margin-top: 10px;
  content: "";
  background: linear-gradient(90deg, #d65a31, #0f766e);
  border-radius: 999px;
}

.subconverter-page .converter-intro p {
  margin: 0 0 6px;
  color: #6c6b61;
  font-size: 16px;
  line-height: 1.85;
}

.subconverter-page .converter-card {
  margin: 4px 0 10px;
  border: 1px solid rgba(32, 33, 29, 0.1);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(255, 250, 240, 0.78)), rgba(255, 255, 255, 0.56);
  box-shadow: 0 14px 34px rgba(38, 34, 23, 0.08);
}

.subconverter-page .converter-card > .el-card__header {
  padding: 18px 28px;
  border-bottom-color: rgba(32, 33, 29, 0.1);
}

.subconverter-page .converter-title {
  color: #20211d;
  font-family: Georgia, "Noto Serif SC", "Songti SC", serif;
}

.subconverter-page .converter-version {
  color: #0b514c;
  background: rgba(15, 118, 110, 0.08);
  border-color: rgba(15, 118, 110, 0.2);
}

.subconverter-page .converter-form {
  padding: 28px;
}

.subconverter-page .el-form-item__label {
  color: #20211d;
}

.subconverter-page .el-input__inner,
.subconverter-page .el-textarea__inner {
  border-color: rgba(32, 33, 29, 0.18);
  border-radius: 9px;
}

.subconverter-page .el-input__inner:focus,
.subconverter-page .el-textarea__inner:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.subconverter-page .el-radio__input.is-checked + .el-radio__label { color: #0f766e; }
.subconverter-page .el-radio__input.is-checked .el-radio__inner,
.subconverter-page .el-button--primary {
  background: #0f766e;
  border-color: #0f766e;
}

.subconverter-page .el-checkbox.is-bordered {
  background: rgba(255, 255, 255, 0.55);
  border-radius: 999px;
}

.subconverter-page .converter-divider {
  margin: 34px 0 30px;
}

.subconverter-page .converter-result-title {
  color: #0b514c;
  font-size: 14px;
  font-weight: 700;
}

.subconverter-page .el-button--danger {
  background: #d65a31;
  border-color: #d65a31;
}

.subconverter-page .el-button {
  border-radius: 9px;
}

@media (max-width: 700px) {
  .subconverter-page { padding: 30px 10px 40px; }
  .subconverter-page .converter-hero { margin-bottom: 26px; }
  .subconverter-page .converter-hero h1 { font-size: 32px; }
  .subconverter-page .converter-intro { padding: 0 4px; }
  .subconverter-page .converter-intro p { font-size: 15px; line-height: 1.75; }
  .subconverter-page .converter-card { border-radius: 16px; }
  .subconverter-page .converter-form { padding: 20px 12px 26px; }
}

/* Selected Product Design direction: clear blue tool + editorial guidance. */
.subconverter-page {
  padding: 64px 20px 88px;
  color: #12213f;
  background: #f7fbff;
}
.subconverter-page .converter-hero { margin-bottom: 42px; }
.subconverter-page .converter-hero h1 {
  color: #102044;
  font-family: inherit;
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.subconverter-page .converter-hero p {
  max-width: 760px;
  color: #65728a;
  font-size: 16px;
  line-height: 1.8;
}
.subconverter-page .converter-card {
  margin: 0;
  border: 1px solid #dfe7f1;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 55px rgba(28, 67, 120, .09);
}
.subconverter-page .converter-form { padding: 34px; }
.subconverter-page .mode-switch { margin-bottom: 24px; }
.subconverter-page .mode-switch .el-form-item__label { display: none; }
.subconverter-page .converter-basic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 18px;
}
.subconverter-page .el-form-item__label { color: #20304d; font-weight: 700; }
.subconverter-page .el-input__inner,
.subconverter-page .el-textarea__inner { border-color: #d9e2ee; border-radius: 8px; }
.subconverter-page .el-input__inner:focus,
.subconverter-page .el-textarea__inner:focus { border-color: #2684ff; box-shadow: 0 0 0 3px rgba(38,132,255,.1); }
.subconverter-page .el-radio__input.is-checked + .el-radio__label { color: #2684ff; }
.subconverter-page .el-radio__input.is-checked .el-radio__inner,
.subconverter-page .el-button--primary { background: #2684ff; border-color: #2684ff; }
.subconverter-page .generate-button {
  display: block;
  width: 38%;
  min-width: 260px;
  height: 48px;
  margin: 10px auto 8px;
  font-size: 15px;
  box-shadow: 0 10px 24px rgba(38,132,255,.2);
}
.subconverter-page .converter-divider { margin: 30px 0 26px; }
.subconverter-page .converter-actions { margin: -2px 0 0; text-align: right; }
.subconverter-page .privacy-note {
  margin: 18px 0 0;
  padding: 13px 15px;
  color: #52627a;
  font-size: 13px;
  line-height: 1.6;
  background: #f1f7ff;
  border: 1px solid #d8e9ff;
  border-radius: 8px;
}
.subconverter-page .privacy-note i { margin-right: 6px; color: #2684ff; }
.subconverter-page .content-section { margin-top: 28px; padding: 30px 32px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; }
.subconverter-page .section-heading { margin-bottom: 20px; }
.subconverter-page .section-heading h2 { margin: 0; color: #132442; font-size: 22px; }
.subconverter-page .section-heading p { margin: 8px 0 0; color: #748097; font-size: 14px; }
.subconverter-page .client-list { border-top: 1px solid #edf1f6; }
.subconverter-page .client-row { display: grid; grid-template-columns: 1fr auto 96px; align-items: center; gap: 14px; padding: 18px 0; border-bottom: 1px solid #edf1f6; }
.subconverter-page .client-row div { display: flex; flex-direction: column; gap: 4px; }
.subconverter-page .client-row strong { color: #172844; font-size: 15px; }
.subconverter-page .client-row small, .subconverter-page .client-platform { color: #7a879b; font-size: 13px; }
.subconverter-page .client-row a { color: #2684ff; font-size: 13px; font-weight: 700; text-decoration: none; }
.subconverter-page .checklist-section ul { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
.subconverter-page .checklist-section li { position: relative; padding: 14px 0 14px 30px; color: #536178; font-size: 14px; border-top: 1px solid #edf1f6; }
.subconverter-page .checklist-section li::before { position: absolute; left: 2px; color: #2684ff; font-weight: 800; content: "✓"; }
.subconverter-page .faq-section .el-collapse { border-color: #e7edf4; }
.subconverter-page .faq-section .el-collapse-item__header { height: 54px; color: #26364f; font-weight: 600; }
.subconverter-page .faq-section .el-collapse-item__content { color: #65728a; line-height: 1.75; }
.subconverter-page .faq-section p { margin: 0; }
@media (max-width: 700px) {
  .subconverter-page { padding: 38px 10px 56px; }
  .subconverter-page .converter-hero { margin-bottom: 28px; }
  .subconverter-page .converter-hero h1 { font-size: 32px; }
  .subconverter-page .converter-form { padding: 22px 16px 26px; }
  .subconverter-page .converter-basic-grid { grid-template-columns: 1fr; gap: 0; }
  .subconverter-page .generate-button { width: 100%; min-width: 0; }
  .subconverter-page .content-section { margin-top: 16px; padding: 24px 18px; }
  .subconverter-page .client-row { grid-template-columns: 1fr; }
}
</style>
