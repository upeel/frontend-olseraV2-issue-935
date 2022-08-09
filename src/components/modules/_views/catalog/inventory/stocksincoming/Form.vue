<template>
  <el-card class="box-card">
    <div slot="header">
      <h4>{{ lang.add }} {{ lang.incoming_stock }}</h4>
    </div>

    <div class="card-body">
      <el-form
        :model="formData"
        label-position="top"
        @submit.native.prevent>
        <el-row :gutter="12">
          <el-col :md="12">
            <el-form-item :label="lang.date" prop="date">
              <el-date-picker
                v-model="formData.date"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                :placeholder="$lang[langId].pick_a_day">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item :label="lang.notes" prop="note">
              <el-input v-model="formData.note" @keyup.native.enter="save"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="card-footer text-right">
      <el-button @click="cancel" :disabled="isButtonDisabled" type="default">{{ lang.cancel }}</el-button>
      <el-button @click="save" :loading="loading" :disabled="isButtonDisabled" type="primary">{{ lang.continue_add_incoming_stock }}</el-button>
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
      formData: {
        note: null,
        date: new Date(today),
      },
      toStoreId: null
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts'),
        headers,
        data: {
          type: 'I',
          date: this.formData.date,
          note: this.formData.note
        }
      }).then(response => {
        this.loading = false
        this.isButtonDisabled = false
        this.$message({
          message: 'Saved',
          type: 'success'
        })
        this.$router.push({ path: '/inventory/stocksincoming/' + response.data.data.id })
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
      this.$router.push({ path: '/inventory/stocksincoming/' })
    }
  }
}
</script>
