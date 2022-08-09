<template>
  <div v-loading="loading">
    <section>
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <h3 class="box-title" style="flex-grow: 1;">
            {{ lang.add }} {{ lang.return_orders }}
          </h3>
          <div>
            <router-link to="/sales/returnorder">
              <el-button type="text">{{ lang.cancel }}</el-button>
            </router-link>
            <el-button type="info" disabled v-if="!formAdd.orderNo">
              {{ lang.save }}
            </el-button>
            <el-button v-else @click.once="save" type="success">
              {{ lang.save }}
            </el-button>
          </div>
        </div>

        <div class="box-body sales-create-body">
          <el-form
            label-position="left"
            label-width="220px"
            @submit.native.prevent>
            <div class="mb-24">
              <div class="color-primary font-bold mb-12">
                {{ lang.customer }} *
              </div>

              <el-form-item :label="lang.name_or_email">
                <el-autocomplete
                  v-model="formAdd.customerValue"
                  :fetch-suggestions="getCustomerSuggest"
                  :debounce="autoCompleteStartOn"
                  :placeholder="lang.search+' '+lang.customer"
                  class="w-fit"
                  @select="handleSelectCustomer"
                />
              </el-form-item>

              <el-form-item :label="lang.order_no">
                <el-autocomplete
                  v-model="formAdd.orderNo"
                  :fetch-suggestions="getOrderNoCust"
                  :debounce="autoCompleteStartOn"
                  :placeholder="lang.search+' '+lang.order_no"
                  class="w-fit"
                  @select="handleSelectOrderNo"
                />
              </el-form-item>
            </div>

            <div>
              <div class="color-primary font-bold mb-12">
                {{ lang.returns }} *
              </div>

              <el-form-item :label="lang.return_date">
                <el-date-picker v-model="formAdd.dateBuy" type="date" :placeholder="this.$lang[langId].pick_a_day" format="dd-MM-yyyy" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>

              <el-form-item :label="lang.base_currency">
                <el-select class="inline-form" v-model="formAdd.currencyTypes.currency_id" filterable :placeholder="lang.please_select">
                  <el-option v-for="item in currencyType" :key="item.currency_id" :label="item.currency_name" :value="item.currency_id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="lang.notes">
                <el-input type="textarea" v-model="formAdd.notes" :placeholder="this.$lang[langId].please_input+lang.notes"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'RturnOrderCreate',
  data: function() {
    return {
      loading: true,
      createCustomer: false,
      isDisableCustomer: false,
      customerType: null,
      currencyType: [],
      autoCompleteStartOn: 300,
      formAdd: {
        customerValue: null,
        customerId: null,
        dateBuy: '',
        currencyTypes: {
          currency_id: ''
        },
        notes: '',
        orderNo: null,
        order_id: null,
        suggestCustomer: [],
        suggestOrderNo: []
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
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    getCustomerSuggest(queryString, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search: queryString
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.customer_text
          }
          this.formAdd.suggestCustomer = response.data.data
          callback(this.formAdd.suggestCustomer)
        })
        .catch(() => {
          this.formAdd.suggestCustomer = []
          callback(this.formAdd.suggestCustomer)
        })
    },
    save() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      if (this.formAdd.orderNo === '') {
        this.formAdd.orderNo = 0
      }
      let data = {
        return_date: this.formAdd.dateBuy,
        currency_id: this.formAdd.currencyTypes.currency_id,
        order_id: this.formAdd.order_id,
        order_no: this.formAdd.orderNo,
        notes: this.formAdd.notes,
        customer_id: this.formAdd.customerId
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn'),
        headers: headers,
        data
      })
        .then(response => {
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.$router.push({
            path: '/sales/returnorder/' + response.data.data.id
          })
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },
    handleSelectCustomer(data) {
      this.formAdd.customerId = data.id
      this.formAdd.orderNo = ''
      this.formAdd.suggestOrderNo = []
      // this.getOrderNoCust()
    },
    handleSelectOrderNo (data) {
      console.log('data', data)
      this.formAdd.orderNo =  data.order_no
      this.formAdd.order_id = data.id
    },
    getOrderNoCust(data, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {}

      if (this.formAdd.customerValue !== null) {
        if (data !== '') {
          params = {
            customer_id: this.formAdd.customerId,
            search_text: data,
            search_column: 'order_no'
          }
        } else {
          params = {
            customer_id: this.formAdd.customerId
          }
        }
      } else {
        params = {
          search: data
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/refundableorders'),
        headers: headers,
        params: params
      })
        .then(response => {
          // this.formAdd.suggestOrderNo = response.data.data
          for (let i of response.data.data) {
            i.value = i.order_no
          }
          this.formAdd.suggestOrderNo = response.data.data
          callback(this.formAdd.suggestOrderNo)
        })
        .catch(() => {
          this.formAdd.suggestOrderNo = []
          callback(this.formAdd.suggestOrderNo)
        })
    }
  },
  mounted() {
    this.getCurrency()
  }
}
</script>
