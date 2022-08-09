<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :md="12">
            <template v-if="!data.reseller_store_id">
              <h4>{{ lang.add_reseller }}</h4>
            </template>
            <template v-else>
              {{ lang.edit }}:
              <h4>{{data.name}}</h4>
            </template>
          </el-col>
          <el-col :md="12" class="text-right">
            <el-button
              size="small"
              @click="cancel"
              type="info">
              {{ lang.cancel }}
            </el-button>
            <el-button
              :disabled="disabledSave"
              size="small"
              @click="save"
              type="success"
              icon="el-icon-check">
              {{ lang.save }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="card-body">
        <el-form v-model="data" label-width="140px">
          <el-form-item :label="this.$lang[langId].url_id" :required="true">
            <el-input type="text" v-model="data.url_id">
            </el-input>
            <p class="input-desc oldgrey size-12">
              {{ lang.url_id }}
            </p>
          </el-form-item>

          <el-form-item :label="lang.reseller_type" :required="true">
            <el-select
              v-model="data.resellerPackage"
              filterable
              remote
              :placeholder="this.$lang[langId].please_input+lang.reseller_type"
              reserve-keyword
              :loading="control.searchingResellerTypes"
              :remote-method="searchResellerTypes">
              <el-option
                v-for="item in resellertypes"
                :label="item.name"
                :value="item.id"
                :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="lang.active_date" :required="true">
            <el-date-picker
              v-model="data.resellerActiveFrom"
              type="date"
              :placeholder="this.$lang[langId].pick_a_day">
            </el-date-picker>
          </el-form-item>

          <el-form-item :label="lang.end_date" :required="true">
            <el-date-picker
              v-model="data.resellerActiveUntil"
              type="date"
              :placeholder="this.$lang[langId].pick_a_day">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

var moment = require('moment')
const apiEndPoint = 'reseller/type'

export default {
  props: ['saved', 'loading', 'formData', 'roleOptions'],

  data() {
    return {
      disabledSave: true,
      dialogVisible: false,
      data: {},
      control: {},
      resellertypes: []
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
    data: {
      handler(data) {
        if ((data.resellerPackage && data.resellerPackage !== '') && (data.url_id && data.url_id !== '') && (data.resellerActiveFrom && data.resellerActiveFrom !== '') && (data.resellerActiveUntil && data.resellerActiveUntil !== '')) {
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
        this.data = data
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    searchResellerTypes(query) {
      this.control.searchingResellerTypes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: {
          search: query
        },
        headers: headers
      }).then(response => {
        this.resellertypes = response.data.data
        this.control.searchingResellerTypes = false
      }).catch(() => {
        this.control.searchingResellerTypes = false
        this.resellertypes = []
      })
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      data.resellerActiveFrom = moment(data.resellerActiveFrom).format('DD-MMM-YYYY')
      data.resellerActiveUntil = moment(data.resellerActiveUntil).format('DD-MMM-YYYY')
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    }
  }
}
</script>
