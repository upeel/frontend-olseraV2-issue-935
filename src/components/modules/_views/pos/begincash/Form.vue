<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header" class="table-handler-flex">
        <h4 class="box-title" style="flex-grow: 1;">
          {{ lang.add }} {{ $lang[langId].begin_cash_daily }}
        </h4>
        <div>
          <el-button
            type="text"
            @click="cancel">
            {{ lang.cancel }}
          </el-button>
          <el-button
            :disabled="disabledSave"
            type="success"
            icon="el-icon-check"
            @click="save">
            {{ lang.save }}
          </el-button>
        </div>
      </div>

      <div class="card-body">
        <el-form v-model="data" label-width="120px">
          <el-form-item :label="lang.cashier" :required="true">
            <template v-if="!data.id">
              <el-select
                v-model="data.cashier_id"
                filterable
                remote
                multiple
                :placeholder="lang.search"
                reserve-keyword
                :loading="control.searchingCashier"
                :remote-method="searchCashier">
                <el-option
                  v-for="item in cashier"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-select
                disabled
                v-model="data.cashier_id" >
              </el-select>
            </template>
          </el-form-item>
          <el-form-item :label="lang.shift" :required="true">
            <template v-if="!data.id">
              <el-select
                v-model="data.shift_id"
                filterable
                remote
                :placeholder="lang.search"
                reserve-keyword
                :loading="control.searchingShift"
                :remote-method="searchShift">
                <el-option
                  v-for="item in shift"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-select
                disabled
                v-model="data.shift_id" >
              </el-select>
            </template>
          </el-form-item>
          <el-form-item :label="lang.beginning_cash">
            <div class="el-input">
              <input-money v-model="data.begin_amount" />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'

const apiEndPoint = 'begincash/'
var moment = require('moment')
export default {
  props: ['saved', 'loading', 'formData'],

  components: {
    InputMoney
  },

  data() {
    return {
      disabledSave: true,
      data: {},
      control: {},
      cashier: [],
      shift: []
    }
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
        if ((data.shift_id && data.shift_id !== '') && (data.cashier_id && data.cashier_id !== '')) {
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
    searchCashier(query) {
      this.control.searchingCashier = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'cashier'),
        params: {
          search: query
        },
        headers: headers
      }).then(response => {
        this.control.searchingCashier = false
        this.cashier = response.data.data.map(item => {
          return item
        })
      }).catch(() => {
        this.control.searchingCashier = false
        this.cashier = []
      })
    },
    searchShift(query) {
      this.control.searchingShift = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'shift'),
        params: {
          search: query
        },
        headers: headers
      }).then(response => {
        this.control.searchingShift = false
        this.shift = response.data.data.map(item => {
          return item
        })
      }).catch(() => {
        this.control.searchingShift = false
        this.shift = []
      })
    },
    cancel() {
      this.data = {}
      this.control = {}
      this.$emit('cancel')
    },
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      data.cashier_ids = data.cashier_id.join(',')
      data.cash_date = moment().format('YYYY-MM-DD')
      this.$emit('save', data)
    }
  }
}
</script>
