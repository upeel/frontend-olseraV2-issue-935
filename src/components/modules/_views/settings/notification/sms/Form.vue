<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8">
        <el-card class="box-card">
          <div slot="header">
            <h4>{{ $lang[langId].how_to }}</h4>
          </div>
          <div class="card-body">
            <div>
              <h5><b><span v-pre>{{ order_no }}{{ customer_name }} {{ customer_email }}</span></b></h5>
              <p>{{ lang.info_variable_tags }}</p>
            </div>
            <hr />
            <div>
              <h5>{{ lang.load_template }}</h5>
              <p>{{ lang.info_sample_content_email }} :</p>
              <br>
              <el-button
                class="pull-right" plain
                @click="setExampleBody"
                style="margin-bottom: 5px; color: #0085CD;">
                {{ lang.load_template }} {{ lang.email_body }}
              </el-button>
              <el-input type="textarea" v-model="exampleEmail" :rows="5" readonly></el-input>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="16">
        <el-card>
          <div slot="header" class="table-handler-flex">
            <div class="mr-8">
              <el-tag type="success" style="padding: 2px 6px;"
                v-if="data.sms_notify_type_id === 1 || data.sms_notify_type_id === 2 ||
                data.sms_notify_type_id === 3|| data.sms_notify_type_id === 4">
                <svg-icon icon-class="message-square" style="margin-right: 0; stroke: #67c23a;"></svg-icon>
              </el-tag>
              <el-tag type="warning" style="padding: 2px 6px;"
                v-if="data.sms_notify_type_id === 7 || data.sms_notify_type_id === 8">
                <svg-icon icon-class="message-square" style="margin-right: 0; stroke: #f56c6c;"></svg-icon>
              </el-tag>
              <el-tag type="danger" style="padding: 2px 6px;"
                v-if="data.sms_notify_type_id === 5 || data.sms_notify_type_id === 6">
                <svg-icon icon-class="message-square" style="margin-right: 0; stroke: #e6a23c;"></svg-icon>
              </el-tag>
            </div>

            <div style="flex-grow: 1;">
              <h4>{{ data.sms_notify_type_name }}</h4>
              <p class="input-desc size-12 oldgrey">{{ data.sms_notify_type_description }}</p>
            </div>

            <div>
              <el-button size="small" type="info" @click="cancel">
                {{ lang.cancel }}
              </el-button>
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                :disabled="disabledSave"
                @click="save">
                  {{ lang.save }}
              </el-button>
            </div>
          </div>
          <div class="card-body">
            <h5>{{ $lang[langId].sms_body }}</h5>
            <el-input type="textarea" v-model="data.body" :rows="5"></el-input>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['saved', 'loading', 'formData'],

  data() {
    return {
      disableSave: true,
      exampleEmail: null,
      data: {}
    }
  },
  created() {
    this.exampleEmail = this.data.template
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    }
  },
  watch: {
    data: {
      handler(data) {
        if (data.body && data.body !== '') {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setExampleBody() {
      this.data.body = this.exampleEmail
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      this.disableSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    }
  }
}
</script>

