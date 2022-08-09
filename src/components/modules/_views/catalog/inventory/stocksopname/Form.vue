<template>
  <el-card class="box-card">
    <div slot="header">
      <h4>{{ lang.add }} {{ lang.stock_opname }}</h4>
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
            :placeholder="this.$lang[langId].pick_a_day">
          </el-date-picker>
        </div>

        <div class="col-md-4">
          <h5>{{ lang.notes }}</h5>
          <el-input type="textarea" autosize v-model="note"></el-input>
        </div>
      </div>
    </div>

    <div class="card-footer text-right">
      <el-button @click="cancel" :disabled="isButtonDisabled" type="default">{{ lang.cancel }}</el-button>
      <el-button @click="save" :disabled="isButtonDisabled" type="primary">
        {{ this.$lang[langId].continue_add }} {{ lang.stock_opname }}
      </el-button>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'
import {baseApi} from 'src/http-common'
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
  methods: {
    save(attr) {
      this.loading = true
      this.isButtonDisabled = true
      let data = {
        date: moment(this.date).format('YYYY-MM-DD'),
        note: this.note
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockopname'),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.isButtonDisabled = false
        this.$message({
          message: 'Saved',
          type: 'success'
        })
        this.$router.push({ path: '/inventory/stocksopname/' + response.data.data.id })
      }).catch(error => {
        this.loading = false
        this.isButtonDisabled = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    cancel() {
      this.$router.push({ path: '/inventory/stocksopname/' })
    },
    // save(attr) {
    //    if (this.toStoreId === this.recentStore) {
    //     this.$message({
    //       message: this.$lang[this.$store.state.userStores.langId].error_transfer_stock_outgoing,
    //       type: 'warning'
    //     })
    //   } else {
    //     this.loading = true
    //     this.isButtonDisabled = true
    //     let data = {
    //       date: moment(this.date).format('YYYY-MM-DD'),
    //       to_store_id: this.toStoreId,
    //       note: this.note,
    //     }
    //     let headers = {
    //       Authorization: 'Bearer ' + this.token.access_token
    //     }
    //     if (!data.to_store_id) {
    //       this.$delete(data, 'to_store_id')
    //     }
    //     axios({
    //       method: 'POST',
    //       url: baseApi(this.selectedStore.url_id, this.langId, 'stockopname'),
    //       headers,
    //       data
    //     }).then(response => {
    //       this.loading = false
    //       this.isButtonDisabled = false
    //       this.$message({
    //         message: 'Saved',
    //         type: 'success'
    //       })
    //       this.$router.push({ path: '/inventory/stocksopname/' + response.data.data.id })
    //     }).catch(error => {
    //       this.loading = false
    //       this.isButtonDisabled = false
    //       this.$notify({
    //         type: 'warning',
    //         title: error.response.data.error.message,
    //         message: error.response.data.error.error
    //       })
    //     })
    //   }
    // },
    // setToStoreId (data) {
    //   this.toStoreId = data.store_id
    // }
  }
}
</script>
