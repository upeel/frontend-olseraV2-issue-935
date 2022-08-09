<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="18">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ lang.shift_settings }}</h4>
            <div>
              <button-action-authenticated
                :permission="['settings/shiftsetting', 'edit']"
                :disabled="disabledButton"
                type="success"
                icon="el-icon-check"
                @click="save">
                {{ lang.save }}
              </button-action-authenticated>
            </div>
          </div>

          <div class="card-body">
            <el-alert :title="lang.info_for_pos_v2" show-icon :closable="false" style="background-color:#DDF2FA;">
            </el-alert>
            <div style="margin-bottom: 20px;"></div>
            <el-form>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.activate_shift }}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-switch v-model="data.with_shift" :active-value="1" :inactive-value="0"></el-switch>
                  <span v-if="data.with_shift == 0">{{ lang.no }}</span>
                  <span v-if="data.with_shift == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.default_starting_cash_in_drawer }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_default_starting_cash_in_drawer }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <input-money v-bind="money" v-model="data.shift_start_cash" />
                </el-col>
              </el-row>
              <el-collapse v-model="activeCollapse">
                <el-collapse-item name="1">
                  <template slot="title">
                    <label style="margin-left: 38%;">{{ lang.closing }} {{ lang.shift }}</label>
                  </template>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <p style="margin: -5px 0 0 0; text-align: right;">
                        {{ lang.hide_shift_closing_amount }}
                      </p>
                    </el-col>
                    <el-col :span="12">
                      <el-switch v-model="data.pos_hide_closing_expected_amount" :active-value="1" :inactive-value="0"></el-switch>
                      <span v-if="data.pos_hide_closing_expected_amount == 0">{{ lang.no }}</span>
                      <span v-if="data.pos_hide_closing_expected_amount == 1">{{ lang.yes }}</span>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'

const apiEndPoint = 'shiftsetting/'

export default {
  name: 'PosShiftSetting',
  components: {
    InputMoney
  },
  data: function() {
    return {
      loading: true,
      data: {},
      activeCollapse: '1',
      disabledButton: false,
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: ' ',
        precision: 2,
        masked: false
      }
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
    '$store.getters.selectedStore': function() {
      this.getData()
    },
    data: {
      handler(data) {
        if (data) {
          this.disabledButton = false
        } else {
          this.disabledButton = true
        }
      },
      deep: true
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
          this.money.prefix = this.data.currency_id + ' '
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
    save() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        pos_hide_closing_expected_amount: this.data.pos_hide_closing_expected_amount,
        shift_start_cash: this.data.shift_start_cash,
        with_shift: this.data.with_shift
      }
      axios({
        method: 'POST',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          apiEndPoint + 'store-update'
        ),
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
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          console.log(error)
          this.loading = false
        })
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
