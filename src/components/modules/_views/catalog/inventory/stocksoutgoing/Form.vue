<template>
  <el-card class="box-card">
    <div slot="header">
      <h4>{{ lang.add }} {{ lang.outgoing_stock }}</h4>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-md-4">
          <h5>{{ lang.date }}</h5>
          <el-date-picker
            size="small"
            style="width: 100%;"
            v-model="date"
            type="date"
            :placeholder="$lang[langId].pick_a_day">
          </el-date-picker>
        </div>

        <div class="col-md-4">
          <h5>{{ lang.notes }}</h5>
          <el-input type="textarea" size="small" autosize v-model="note"></el-input>
        </div>

        <div v-if="$route.query.path === 'transfer'" class="col-md-4">
          <h5>{{ lang.transfer_to }}</h5>
          <!-- <el-select
            v-model="toStoreId"
            :placeholder="lang.please_select"
            filterable>
            <el-option
              size="small"
              style="width: 100%;"
              v-for="item in userStores"
              :key="item.store_id"
              :label="item.name"
              :value="item.store_id">
            </el-option>
          </el-select> -->
          <el-autocomplete
            v-model="tempStoreId"
            :fetch-suggestions="getUserStores"
            :placeholder="lang.please_select + ' (Autocomplete)'"
            @select="setToStoreId"
            style="width: 100%"
          />
        </div>
      </div>
    </div>

    <div class="card-footer text-right">
      <el-button @click="cancel" :disabled="isButtonDisabled" type="default">{{ lang.cancel }}</el-button>
      <el-button @click="save" :disabled="isButtonDisabled" type="primary">{{ lang.continue_add_outgoing_stock }}</el-button>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'
import {baseApi} from 'src/http-common'

import { fetchStores } from '@/api/store'

const moment = require('moment')
const today = moment().format('YYYY-MM-DD')

export default {
  data() {
    return {
      loading: false,
      isButtonDisabled: false,
      note: null,
      date: new Date(today),
      toStoreId: null,
      recentStore: this.$store.getters.selectedStore.store_id,
      tempStoreId: ''
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    userStores() {
      const stores = [...this.$store.state.userStores.stores]
      stores.unshift({
        store_id: null,
        name: '-'
      })
      return stores
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

  methods: {
    save() {
      if (this.toStoreId === this.recentStore) {
        this.$message({
          message: this.$lang[this.$store.state.userStores.langId].error_transfer_stock_outgoing,
          type: 'warning'
        })
      } else {
        this.loading = true
        this.isButtonDisabled = true

        let data = {
          date: moment(this.date).format('YYYY-MM-DD'),
          to_store_id: this.toStoreId,
          type: 'O',
          note: this.note
        }

        if (this.$route.query.path === 'transfer') {
          data.is_transfer = 1
        }

        if (!data.to_store_id) {
          this.$delete(data, 'to_store_id')
        }

        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts'),
          headers,
          data
        }).then(response => {
          this.loading = false
          this.isButtonDisabled = false
          this.$message({
            message: 'Saved',
            type: 'success'
          })
          this.$router.push({ path: '/inventory/stocksoutgoing/' + response.data.data.id })
        }).catch(error => {
          this.loading = false
          this.isButtonDisabled = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      }
    },
    cancel() {
      this.$router.push({ path: '/inventory/stocksoutgoing/' })
    },

    getUserStores(queryString, callback) {
      let params = {
        per_page: 1000,
        sort_type: 'desc',
        sort_column: 'is_store_active',
        search: queryString
      }
      fetchStores(params).then(response => {
        let data = response.data.data
        data.map(i => { i.value = i.name})
        callback(data)
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        callback([])
      })
    },

    setToStoreId (data) {
      this.toStoreId = data.store_id
    }
  }
}
</script>
