<template>
  <el-card class="box-card">
    <div slot="header">
      <h4>{{ lang.add }} {{ $lang[langId].stock_production }}</h4>
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
          <el-input type="textarea" size="small" autosize v-model="note"></el-input>
        </div>
      </div>
    </div>

    <div class="card-footer text-right">
      <el-button
        @click="cancel" :disabled="isButtonDisabled" type="default">{{ lang.cancel }}</el-button>
      <el-button @click="save" :disabled="isButtonDisabled" type="primary">
        {{ $lang[langId].continue_add }} {{ $lang[langId].stock_production }}
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
      toStoreId: null
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    userStores() {
      return this.$store.state.userStores
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
        type: 'P',
        note: this.note
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
        this.$router.push({ path: '/inventory/stocksproduction/' + response.data.data.id })
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
      this.$router.push({ path: '/inventory/stocksproduction/' })
    }
  },

  mounted() {
    console.log(this.$store.state.userStores)
  }
}
</script>
