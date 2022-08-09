<template>
  <div v-loading="loading">
    <section>
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <h3 class="box-title" style="flex-grow: 1;">
            {{ lang.add }} {{ lang.orders }}
          </h3>

          <div>
            <router-link to="/sales/openorder">
              <el-button type="text">{{ lang.cancel }}</el-button>
            </router-link>

            <el-button
              v-if="(!formAdd.customerValue || !formAdd.dateBuy || !formAdd.currencyTypes.currency_id) && (!formAdd.nameCustomer || !formAdd.dateBuy || !formAdd.currencyTypes.currency_id)"
              type="info"
              disabled>
              {{ lang.save }}
            </el-button>

            <el-button v-else icon="el-icon-check" type="success" @click="save">
              {{ lang.save }}
            </el-button>
          </div>
        </div>

        <div class="box-body">
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
                  :placeholder="lang.search_by_name_email"
                  :disabled="isDisableCustomer"
                  class="w-fit"
                  @select="handleSelectCustomer"
                />
              </el-form-item>

              <el-form-item :label="lang.info_or_add_new_customer">
                <el-button
                  :disabled="isDisableCustomer"
                  icon="el-icon-plus"
                  type="primary"
                  class="add-button"
                  @click="addCustomer"
                />
              </el-form-item>

              <div v-if="createCustomer == true">
                <el-form-item :label="lang.customer_name">
                  <el-input
                    v-model="formAdd.nameCustomer"
                    :placeholder="$lang[langId].please_input+lang.customer_name"
                    class="inline-form"
                  />
                </el-form-item>

                <el-form-item :label="lang.customer_type">
                  <el-select class="inline-form" v-model="formAdd.customerTypes.id" filterable :placeholder="lang.please_select">
                    <el-option v-for="item in customerType" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="lang.email">
                  <el-input v-model="formAdd.nameCustomerEmail" :placeholder="$lang[langId].input_email" class="inline-form"></el-input>
                </el-form-item>

                <el-form-item :label="lang.phone">
                  <el-input type="number" v-model="formAdd.phone" :placeholder="$lang[langId].input_number" class="inline-form"></el-input>
                </el-form-item>

                <el-button type="info" @click="cancelAddCust">{{ lang.cancel }}</el-button>
              </div>
            </div>

            <div>
              <div class="color-primary font-bold mb-12">
                {{ lang.sales }}
              </div>

              <el-form-item :label="lang.order_date">
                <el-date-picker
                  v-model="formAdd.dateBuy"
                  type="date"
                  :disabled="disabledDate"
                  :placeholder="$lang[langId].pick_a_day"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>

              <el-form-item :label="lang.sales_currency">
                <el-select class="inline-form" v-model="formAdd.currencyTypes.currency_id" filterable :placeholder="lang.please_select">
                  <el-option v-for="item in currencyType" :key="item.currency_id" :label="item.currency_name" :value="item.currency_id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="lang.notes">
                <el-input type="textarea" v-model="formAdd.notes" :placeholder="$lang[langId].please_input + lang.notes"></el-input>
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
import moment from 'moment'

export default {
  name: 'OpenOrderCreate',
  data: function() {
    return {
      loading: true,
      createCustomer: false,
      isDisableCustomer: false,
      customerType: null,
      suggestData: [],
      currencyType: [],
      autoCompleteStartOn: 300,
      formAdd: {
        customerValue: null,
        nameCustomerEmail: '',
        nameCustomer: '',
        customerId: null,
        customerTypes: {
          id: null
        },
        phone: '',
        dateBuy: moment().format('YYYY-MM-DD'),
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
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    disabledDate () {
      if (this.$store.state.userStores.userRole.role_id === 'ST') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getCustomerType()
      this.getCurrency()
    }
  },
  methods: {
    handleSelectCustomer(data) {
      this.formAdd.customerId = data.id
    },

    getCustomerType() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: '',
        per_page: 100
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.customerType = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
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
          response.data.data.map(i => {
            if (i.currency_id === 'IDR') {
              this.formAdd.currencyTypes.currency_id = i.currency_id
            }
          })
          this.loading = false
        })
        .catch(error => {
          console.log(error)
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
      }).then(response => {
        if (response) {
          for (let i of response.data.data) {
            i.value = i.customer_text
          }
          this.suggestData = response.data.data
          callback(this.suggestData)
        }
      }).catch(() => {
        this.suggestData = []
        callback(this.suggestData)
      })
    },
    addCustomer: function() {
      this.createCustomer = true
      this.isDisableCustomer = true
      this.formAdd.customerValue = null
    },
    cancelAddCust: function() {
      this.createCustomer = false
      this.isDisableCustomer = false
      this.formAdd.customerTypes.id = null
      this.formAdd.nameCustomer = ''
      this.formAdd.nameCustomerEmail = ''
      this.formAdd.phone = ''
    },
    save() {
      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_date: this.formAdd.dateBuy,
        currency_id: this.formAdd.currencyTypes.currency_id,
        notes: this.formAdd.notes
      }

      if (this.createCustomer) {
        this.$set(data, 'customer_name', this.formAdd.nameCustomer)
        this.$set(data, 'customer_type_id', this.formAdd.customerTypes.id)
        this.$set(data, 'customer_email', this.formAdd.nameCustomerEmail)
        this.$set(data, 'customer_phone', this.formAdd.phone)
      } else {
        this.$set(data, 'customer_id', this.formAdd.customerId)
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder'),
        headers: headers,
        data
      }).then((response) => {
        this.loading = false
        this.$router.push({
          path: '/sales/openorder/' + response.data.data.id
        })
      }).catch(error => {
        this.loading = false
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    }
  },

  mounted() {
    this.getCustomerType()
    this.getCurrency()
  }
}
</script>

