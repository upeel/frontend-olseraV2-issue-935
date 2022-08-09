<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="18">
        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.check_stock_mode }}</h4>
          </div>
          <div class="card-body">
            <!-- <el-form> -->
              <el-collapse v-model="collapse">
                <el-collapse-item name="1">
                  <template slot="title">
                    <label>{{ lang.sell_item_no_stock }}</label>
                  </template>
                  <el-alert
                    :title="lang.info_disallow_sell_item_if_no_stock"
                    show-icon :closable="false"
                    style="background-color:#DDF2FA;">
                  </el-alert>
                  <div style="margin-bottom: 20px;"></div>
                  <el-row :gutter="20">
                    <el-col :sm="12">
                      <p style="margin: -5px 0 0 0; text-align: right;">
                        {{ lang.disallow_sell_item_if_no_stock }}
                      </p>
                    </el-col>
                    <el-col :sm="12">
                      <el-switch v-model="data.pos_disallow_sell_no_stock" :disabled="!checkCustomPermission('settings/posstockmode', 'edit')"
                        :active-value="1"
                        :inactive-value="0"
                        @change="update('pos_disallow_sell_no_stock', data.pos_disallow_sell_no_stock)">
                      </el-switch>
                      <span v-if="data.pos_disallow_sell_no_stock == 0">{{ lang.no }}</span>
                      <span v-if="data.pos_disallow_sell_no_stock == 1">{{ lang.yes }}</span>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item name="2">
                  <template slot="title">
                    <label>{{ lang.check_stock_mode }}</label>
                  </template>
                  <el-alert
                    :title="lang.info_always_check_stock_before_add_item"
                    show-icon :closable="false"
                    style="background-color:#DDF2FA;">
                  </el-alert>
                  <div style="margin-bottom: 20px;"></div>
                  <el-row :gutter="20">
                    <el-col :sm="12">
                      <p style="margin: -5px 0 0 0; text-align: right;">
                        {{ lang.always_check_stock_before_add_item }}
                      </p>
                    </el-col>
                    <el-col :sm="12">
                      <el-switch v-model="data.pos_always_check_stock" :disabled="!checkCustomPermission('settings/posstockmode', 'edit')"
                        :active-value="1"
                        :inactive-value="0"
                        @change="update('pos_always_check_stock', data.pos_always_check_stock)">
                      </el-switch>
                      <span v-if="data.pos_always_check_stock == 0">{{ lang.no }}</span>
                      <span v-if="data.pos_always_check_stock == 1">{{ lang.yes }}</span>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item name="3">
                  <template slot="title">
                    <label>{{ lang.transfer_stock }}</label>
                  </template>
                  <el-row :gutter="20">
                    <el-col :sm="12">
                      <p style="text-align: right; font-weight: bold;">{{ lang.require_recipient_store_acknowledgement }}</p>
                      <p style="margin: -5px 0 0 0; text-align: right;">
                        {{ lang.info_require_recipient_store_acknowledgement }}
                      </p>
                    </el-col>
                    <el-col :sm="12">
                      <el-switch v-model="data.transfer_stock_manual_posting" :disabled="!checkCustomPermission('settings/posstockmode', 'edit')"
                        :active-value="1"
                        :inactive-value="0"
                        @change="update('transfer_stock_manual_posting', data.transfer_stock_manual_posting)">
                      </el-switch>
                      <span v-if="data.transfer_stock_manual_posting == 0">{{ lang.no }}</span>
                      <span v-if="data.transfer_stock_manual_posting == 1">{{ lang.yes }}</span>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item name="3">
                  <template slot="title">
                    <label>{{ this.$lang[this.$store.state.userStores.langId].stoct_profit }}</label>
                  </template>
                  <el-row :gutter="20">
                    <el-col :sm="12">
                      <p style="text-align: right; font-weight: bold;">{{ this.$lang[this.$store.state.userStores.langId].stoct_profit_post }}</p>
                   
                    </el-col>
                    <el-col :sm="12">
                      <el-switch v-model="data.stock_auto_post_profit_loss"
                        :active-value="1"
                        :inactive-value="0"
                        @change="update('stock_auto_post_profit_loss', data.stock_auto_post_profit_loss)">
                      </el-switch>
                      <span v-if="data.stock_auto_post_profit_loss == 0">{{ lang.no }}</span>
                      <span v-if="data.stock_auto_post_profit_loss == 1">{{ lang.yes }}</span>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item v-if="stageLevel === 'dev' || stageLevel === 'sit'" name="4">
                  <template slot="title">
                    <label>Email untuk menerima notifikasi transfer stock</label>
                  </template>
                  <div class="flex-container">
                    <div class="full-width text-right px-8">Email</div>
                    <div class="full-width">
                      <el-input v-model="emailNotif" @keyup.native.enter="update('transfer_stock_email_notification')"></el-input>
                      <el-tag v-for="(email, idx) in dataEmail" :key="idx" class="mr-4" closable @close="handleDelEmail(idx)">{{ email }}</el-tag>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            <!-- </el-form> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'posstockmode/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'PosModeStock',
  mixins: [checkCustomPermission],
  data: function() {
    return {
      loading: true,
      data: {},
      collapse: ['1', '2', '3', '4'],
      disabledButton: false,
      emailNotif: '',
      dataEmail: []
    }
  },

  mixins: [basicComputedMixin],

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
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        headers: headers
      })
        .then(response => {
          this.data = response.data.data

          this.emailNotif = ''
          this.dataEmail = []
          if (this.data.transfer_stock_email_notification !== null) {
            this.dataEmail = this.data.transfer_stock_email_notification.split(',')
          }
          
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },
    update(block, val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      // let data = {
      //   [ block ]: val
      // }
      let data = { ...this.data}
      if (block === 'transfer_stock_email_notification') {
        if (this.emailNotif.length > 0) { this.dataEmail.push(this.emailNotif) }
        data.transfer_stock_email_notification = this.dataEmail.join(',')
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'store-update'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.loading = false
          this.getData()
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          console.log(error)
          this.loading = false
        })
    },

    handleDelEmail (index) {
      this.dataEmail.splice(index, 1)
      console.log('eee', this.dataEmail)
      this.update('transfer_stock_email_notification')
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
