<template>
  <div v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
        <h4 style="flex-grow: 1;">{{ lang.add }} {{ lang.orders }}</h4>
        <div>
          <router-link to="/purchase/openpurchase">
            <el-button type="text">{{ lang.cancel }}</el-button>
          </router-link>
          <el-button type="success" disabled v-if="!formAdd.supplierValue && !formAdd.nameSupplier">
            {{ lang.save }}
          </el-button>
          <el-button @click="save" type="success" v-else>
            {{ lang.save }}
          </el-button>
        </div>
      </div>

      <div class="card-body">
        <el-form label-position="left" label-width="160px">
          <div class="font-bold font-16 color-success mb-12">
            <h4>{{ lang.purchase }}</h4>
          </div>

          <el-form-item :label="lang.order_date">
            <el-date-picker
              v-model="formAdd.dateBuy"
              type="date"
              :placeholder="$lang[langId].pick_a_day"
              format="dd-MM-yyyy"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item :label="lang.purchase_currency">
            <el-select class="inline-form" v-model="formAdd.currencyTypes.currency_id" filterable :placeholder="lang.please_select">
              <el-option v-for="item in currencyType" :key="item.currency_id" :label="item.currency_name" :value="item.currency_id">
              </el-option>
            </el-select>
          </el-form-item>

          <div class="font-bold font-16 color-success mb-12">
            <h4>{{ lang.supplier }}<span class="required">*</span></h4>
          </div>

          <el-form-item :label="lang.supplier_name">
            <el-autocomplete @select="handleSelectSupplier" v-model="formAdd.supplierValue" :fetch-suggestions="getSupplierSuggest" :debounce="autoCompleteStartOn" :placeholder="lang.search+' '+lang.supplier" :disabled="isDisableSupplier">
            </el-autocomplete>
          </el-form-item>

          <el-form-item>
            <el-button class="add-button" type="primary" @click="addSupplier" :disabled="isDisableSupplier" icon="el-icon-plus">
              {{ lang.add_new_supplier }}
            </el-button>
          </el-form-item>

          <div v-if="createSupplier == true">
            <el-form-item :label="lang.supplier_name" required>
              <el-input v-model="formAdd.nameSupplier" :placeholder="$lang[langId].please_input+lang.supplier_name"></el-input>
            </el-form-item>

            <el-form-item :label="lang.email">
              <el-input v-model="formAdd.nameSupplierEmail" :placeholder="$lang[langId].input_email"></el-input>
            </el-form-item>

            <el-form-item :label="lang.phone">
              <el-input type="number" v-model="formAdd.phone" :placeholder="$lang[langId].input_number"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="info" @click="cancelAddCust">{{ lang.cancel }}</el-button>
            </el-form-item>
          </div>

          <div class="font-bold font-16 color-success mb-12">
            <h4>{{ lang.notes }}</h4>
          </div>
          <el-form-item style="position: relative; bottom: 30px">
            <el-input type="textarea" v-model="formAdd.notes" :placeholder="$lang[langId].please_input+lang.notes"></el-input>
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
const startDate = moment().format('YYYY-MM-DD')

export default {
  name: 'OpenPurchaseCreate',
  data() {
    return {
      loading: true,
      createSupplier: false,
      isDisableSupplier: false,
      suggestData: [],
      currencyType: [],
      autoCompleteStartOn: 300,
      formAdd: {
        supplierValue: null,
        nameSupplierEmail: '',
        nameSupplier: '',
        supplierId: null,
        phone: '',
        dateBuy: startDate,
        currencyTypes: {
          currency_id: ''
        },
        notes: ''
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
      this.getCurrency()
    }
  },
  methods: {
    handleSelectSupplier(data) {
      this.formAdd.supplierId = data.id
    },

    getCurrency() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'currency'),
        headers: headers
      })
        .then(response => {
          this.currencyType = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    getSupplierSuggest(queryString, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search: queryString
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.suggestData = response.data.data
          callback(this.suggestData)
        })
        .catch(error => {
          console.log(error)
        })
    },
    addSupplier: function() {
      this.createSupplier = true
      this.isDisableSupplier = true
      this.formAdd.supplierId = null
      this.formAdd.supplierValue = null
    },
    cancelAddCust: function() {
      this.createSupplier = false
      this.isDisableSupplier = false
      this.formAdd.nameSupplier = ''
      this.formAdd.nameSupplierEmail = ''
      this.formAdd.phone = ''
    },
    save() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        purchase_date: this.formAdd.dateBuy,
        currency_id: this.formAdd.currencyTypes.currency_id,
        notes: this.formAdd.notes
      }
      if (this.createSupplier) {
        this.$set(data, 'supplier_name', this.formAdd.nameSupplier)
        this.$set(data, 'supplier_email', this.formAdd.nameSupplierEmail)
        this.$set(data, 'supplier_phone', this.formAdd.phone)
      } else {
        this.$set(data, 'supplier_id', this.formAdd.supplierId)
      }
      // console.log(data)
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase'),
        headers: headers,
        data
      })
        .then(response => {
          this.$router.push({
            path: '/purchase/openpurchase/' + response.data.data.id
          })
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            message: error.string
          })
        })
    }
  },
  mounted() {
    this.getCurrency()
  }
}
</script>
