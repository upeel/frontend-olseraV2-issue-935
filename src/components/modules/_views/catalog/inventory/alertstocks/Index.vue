<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="18">
        <el-card class="box-card" v-loading="loading" shadow="never">
          <div slot="header" class="table-handler-flex">
            <div>
              <h4>{{ $lang[langId].stock_alert }}</h4>
              <p>{{ $lang[langId].info_alert_stock }}</p>
            </div>
          </div>

          <div class="card-body">
            <h3>{{ $lang[langId].email_recipient }}</h3>
            <template v-if="data.stock_alert_to_emails && data.stock_alert_to_emails.length">
              <el-tag
                v-for="tag in data.stock_alert_to_emails"
                :key="tag"
                :disable-transitions="false"
                :closable="checkCustomPermission('inventory/emailstockalert', 'destroy')"
                size="default"
                type="success"
                class="tag-samping-sampingan"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
            </template>

            <el-input
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              class="input-new-tag"
              @keyup.enter.native="handleInputConfirm">
            </el-input>

            <button-action-authenticated
              :permission="['inventory/emailstockalert', 'store']"
              v-if="!inputVisible"
              class="button-new-tag"
              size="small"
              @click="showInput">
              + {{ lang.add }}
            </button-action-authenticated>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndpoint = 'emailstockalert'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'StockAlert',
  mixins: [checkCustomPermission],
  data() {
    return {
      loading: false,
      inputVisible: false,
      inputValue: '',
      data: {}
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getData()
    }
  },
  methods: {
    getData() {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
          params: this.params,
          headers: headers
        }).then(response => {
          this.data = response.data.data
          if (!this.data.stock_alert_to_emails) {
            this.data.stock_alert_to_emails = ''
          } else if (this.data.stock_alert_to_emails === null) {
            this.data.stock_alert_to_emails = ''
          }
          if (this.data.stock_alert_to_emails.length > 0) {
            this.data.stock_alert_to_emails = this.data.stock_alert_to_emails.split(',')
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    save() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {}
      data.stock_alert_to_emails = [...this.data.stock_alert_to_emails]
      data.stock_alert_to_emails = data.stock_alert_to_emails.join(',')
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers,
        data
      }).then(response => {
        if (response.data.data.stock_alert_to_emails.length !== 0) {
          this.data = response.data.data
        }
        if (!this.data.stock_alert_to_emails) {
          this.data.stock_alert_to_emails = ''
        }
        this.data.stock_alert_to_emails = this.data.stock_alert_to_emails.split(',')
        this.$message({
          type: 'success',
          message: 'Saved'
        })
        this.loading = false
      }).catch(error => {
        this.getData()
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error.stock_alert_to_emails[0]
        })
        this.loading = false
      })
    },
    handleClose(tag) {
      this.data.stock_alert_to_emails.splice(this.data.stock_alert_to_emails.indexOf(tag), 1)
      this.save()
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        if (typeof this.data.stock_alert_to_emails !== 'undefined') {
          if (typeof this.data.stock_alert_to_emails !== 'string') {
            this.data.stock_alert_to_emails.push(inputValue)
          } else {
            this.data.stock_alert_to_emails = [inputValue]
          }
        } else {
          this.data.stock_alert_to_emails = [inputValue]
        }
      }
      console.log('data1', this.data.stock_alert_to_emails)
      this.inputVisible = false
      this.inputValue = ''
      this.save()
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
