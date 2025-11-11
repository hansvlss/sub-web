<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <div slot="header">
            在线订阅转换
            <svg-icon icon-class="github" style="margin-left: 20px" @click="goToProject" />
            <svg-icon icon-class="telegram" style="margin-left: 15px" @click="goToTelegram" />
            <svg-icon icon-class="youtube" style="margin-left: 15px" @click="goToYoutube" />

            <div style="display: inline-block; position:absolute; right: 20px">{{ backendVersion }}</div>
          </div>

          <el-container>
            <el-form :model="form" label-width="140px" label-position="left" style="width: 100%">
              <el-form-item label="模式设置:">
                <el-radio v-model="advanced" label="1">基础模式</el-radio>
                <el-radio v-model="advanced" label="2">进阶模式</el-radio>
              </el-form-item>

              <el-form-item label="订阅链接:">
                <el-input v-model="form.sourceSubUrl" type="textarea" rows="3"
                  placeholder="支持订阅或ss/ssr/vmess链接，多个链接每行一个或用 | 分隔" @blur="saveSubUrl" />
              </el-form-item>

              <el-form-item label="客户端:">
                <el-select v-model="form.clientType" style="width: 100%">
                  <el-option v-for="(v, k) in options.clientTypes" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>

              <div v-if="advanced === '2'">
                <el-form-item label="后端地址:">
                  <el-autocomplete style="width: 100%" v-model="form.customBackend" :fetch-suggestions="backendSearch"
                    placeholder="动动小手，（建议）自行搭建后端服务。例：http://127.0.0.1:25500/sub?">
                    <el-button slot="append" @click="gotoGayhub" icon="el-icon-link">前往项目仓库</el-button>
                  </el-autocomplete>
                </el-form-item>

                <el-form-item label="远程配置:">
                  <el-select v-model="form.remoteConfig" allow-create filterable placeholder="请选择" style="width: 100%">
                    <el-option-group v-for="group in options.remoteConfig" :key="group.label" :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                    </el-option-group>
                    <el-button slot="append" @click="gotoRemoteConfig" icon="el-icon-link">配置示例</el-button>
                  </el-select>
                </el-form-item>

                <el-form-item label="Include:">
                  <el-input v-model="form.includeRemarks" placeholder="节点名包含的关键字，支持正则" />
                </el-form-item>

                <el-form-item label="Exclude:">
                  <el-input v-model="form.excludeRemarks" placeholder="节点名不包含的关键字，支持正则" />
                </el-form-item>

                <el-form-item label="FileName:">
                  <el-input v-model="form.filename" placeholder="返回的订阅文件名" />
                </el-form-item>

                <el-form-item v-for="(param, i) in customParams" :key="i">
                  <el-input slot="label" v-model="param.name" placeholder="自定义参数名">
                    <div slot="suffix" style="width: 10px;">:</div>
                  </el-input>
                  <el-input v-model="param.value" placeholder="自定义参数内容">
                    <el-button slot="suffix" type="text" icon="el-icon-delete" style="margin-right: 5px"
                      @click="customParams.splice(i, 1)" />
                  </el-input>
                </el-form-item>

                <el-form-item label-width="0px">
                  <el-row type="flex">
                    <el-col>
                      <el-checkbox v-model="form.nodeList" label="输出为 Node List" border></el-checkbox>
                    </el-col>

                    <el-popover placement="bottom" v-model="form.extraset">
                      <el-row><el-checkbox v-model="form.emoji" label="Emoji"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.scv" label="跳过证书验证"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.udp" @change="needUdp = true" label="启用 UDP"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.appendType" label="节点类型"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.sort" label="排序节点"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.fdn" label="过滤非法节点"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.expand" label="规则展开"></el-checkbox></el-row>
                      <el-button slot="reference">更多选项</el-button>
                    </el-popover>

                    <el-popover placement="bottom" style="margin-left: 10px">
                      <el-row><el-checkbox v-model="form.tpl.surge.doh" label="Surge.DoH"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH"></el-checkbox></el-row>
                      <el-row><el-checkbox v-model="form.insert" label="网易云"></el-checkbox></el-row>
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

              <el-divider content-position="center">
                <i class="el-icon-magic-stick"></i>
              </el-divider>

              <el-form-item label="定制订阅:">
                <el-input class="copy-content" disabled v-model="customSubUrl">
                  <el-button slot="append" v-clipboard:copy="customSubUrl" v-clipboard:success="onCopy" ref="copy-btn"
                    icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>

              <el-form-item label="订阅短链:">
                <el-input class="copy-content" disabled v-model="curtomShortSubUrl">
                  <el-button slot="append" v-clipboard:copy="curtomShortSubUrl" v-clipboard:success="onCopy"
                    ref="copy-btn" icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>

              <el-form-item label-width="0px" style="margin-top: 40px; text-align: center">
                <el-button style="width: 140px" type="danger" @click="makeUrl"
                  :disabled="form.sourceSubUrl.length === 0">生成订阅链接</el-button>
                <el-button style="width: 140px" type="danger" @click="makeShortUrl" :loading="loading"
                  :disabled="customSubUrl.length === 0">生成短链接</el-button>
              </el-form-item>

              <el-form-item label-width="0px" style="text-align: center">
                <el-button style="width: 140px" type="primary" @click="dialogUploadConfigVisible = true"
                  icon="el-icon-upload" :loading="loading">上传配置</el-button>
                <el-button style="width: 140px" type="primary" @click="clashInstall" icon="el-icon-connection"
                  :disabled="customSubUrl.length === 0">一键导入 Clash</el-button>
              </el-form-item>

              <el-form-item label-width="0px" style="text-align: center">
                <el-button style="width: 290px" type="primary" @click="dialogLoadConfigVisible = true"
                  icon="el-icon-copy-document" :loading="loading">从 URL 解析</el-button>
              </el-form-item>
            </el-form>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const project = process.env.VUE_APP_PROJECT

export default {
  data() {
    return {
      backendVersion: "",
      advanced: "2",
      form: {
        sourceSubUrl: "",
        clientType: "",
        customBackend: "",
      },
      customParams: [],
      loading: false,
      customSubUrl: "",
      curtomShortSubUrl: "",
    };
  },
  created() {
    document.title = "在线订阅转换";
  },
  methods: {
    onCopy() {
      this.$message.success("已复制到剪贴板");
    },
    goToProject() {
      window.open(project);
    },
    goToTelegram() {
      window.open('https://t.me/hansvlss', '_blank');
    },
    goToYoutube() {
      window.open('https://www.youtube.com/@HansTech', '_blank');
    },
  },
};
</script>
