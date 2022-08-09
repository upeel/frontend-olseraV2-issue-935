<template>
  <div v-loading="loadings" class="customer-create">
    <section>
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1;">{{ lang.add_customer }}</h4>
          <div>
            <el-button type="text" @click="cancel">{{ lang.cancel }}</el-button>

            <el-button
              @click="save"
              icon="el-icon-check"
              :disabled="disabledSave"
              type="success">
              {{ lang.save }}
            </el-button>
          </div>
        </div>

        <div class="card-body">
          <el-form>
            <div class="row">
              <div class="col-md-7 tablet-style">
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label class="header">{{ lang.customer_detail }}</label>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.customer_name }}
                        <span class="required">*</span>
                      </label>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-input v-model="formAdd.name" :placeholder="this.$lang[langId].please_input +' '+lang.customer_name"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.customer_type }}
                      </label>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-select class="inline-form" v-model="formAdd.customer_type_id" filterable :allow-create="true" :placeholder="lang.please_select">
                        <el-option v-for="item in customerTypeData" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.date_of_birth }}
                      </label>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-date-picker
                        v-model="formAdd.dob"
                        type="date"
                        :placeholder="$lang[langId].pick_a_day"
                        format="dd-MM-yyyy"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.password }}
                      </label>
                      <p>{{ this.$lang[langId].password_for_login_store }}</p>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-input v-model="formAdd.password" :type="showPassword" :placeholder="this.$lang[langId].input_code">
                        <el-button type="text" icon="el-icon-view" slot="suffix" @click="handlePassword(showPassword)"></el-button>
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.company_name }}
                      </label>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-input v-model="formAdd.company" :placeholder="this.$lang[langId].please_input +' '+lang.company_name"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.customer_code }}</label>
                      <p>{{ lang.info_customer_code }}</p>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-input v-model="formAdd.code" :placeholder="this.$lang[langId].please_input +' '+lang.customer_code"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.accept_newsletter }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-switch v-model="formAdd.accept_newsletter" :active-value="1" :inactive-value="0">
                      </el-switch>
                      <span v-if="formAdd.accept_newsletter === 0" class="switch">{{ lang.no }}</span>
                      <span v-if="formAdd.accept_newsletter === 1" class="switch">{{ lang.yes }}</span>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ $lang[langId].credit_limit }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <div class="el-input el-input--mini">
                      <input-money v-model="formAdd.credit_limit" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5">
                    <el-form-item>
                      <label>{{ lang.notes }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-7">
                    <el-form-item>
                      <el-input v-model="formAdd.notes" :placeholder="this.$lang[langId].please_input +' '+lang.notes"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>

              <div class="col-md-5">
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label class="header">{{ lang.contact }}</label>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ lang.email }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-input v-model="formAdd.email" :placeholder="this.$lang[langId].input_email"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ lang.phone }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-input type="number" v-model="formAdd.phone" :placeholder="this.$lang[langId].input_number"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ lang.address }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-input v-model="formAdd.address" :placeholder="this.$lang[langId].please_input +' '+lang.address"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ lang.country }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-select filterable class="inline-form" v-model="formAdd.country_id" :placeholder="lang.please_select" size="small" @change="editChangeCountry">
                        <el-option v-for="item in country" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ $lang[langId].province }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-select filterable class="inline-form" v-model="formAdd.state_id" :placeholder="lang.please_select" size="small" @change="editProvince">
                        <el-option v-for="item in stateCountry" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ lang.city }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-select filterable class="inline-form" v-model="formAdd.city_id" :placeholder="lang.please_select" size="small" @change="editCity">
                        <el-option v-for="item in shippingCity" :key="item.id" :label="item.city" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ lang.district }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-select class="inline-form" v-model="formAdd.subdistrict_id" :placeholder="lang.please_select" size="small">
                        <el-option v-for="item in subDistrict" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <el-form-item>
                      <label>{{ lang.postal_code }}</label>
                    </el-form-item>
                  </div>
                  <div class="col-md-8">
                    <el-form-item>
                      <el-input type="number" v-model="formAdd.postal_code" :placeholder="this.$lang[langId].input_number"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
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
import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'CustomerCreate',
  props: ['loading', 'saved', 'customerType'],

  components: {
    InputMoney
  },

  data() {
    return {
      loadings: true,
      disabledSave: true,
      customerTypeData: null,
      country: null,
      stateCountry: null,
      shippingCity: null,
      subDistrict: null,
      showPassword: 'password',
      formAdd: {
        name: '',
        customer_type_id: 0,
        password: '',
        company: '',
        code: '',
        accept_newsletter: 0,
        notes: '',
        email: '',
        phone: null,
        address: '',
        country_id: 'ID',
        state_id: '',
        city_id: '',
        subdistrict_id: '',
        postal_code: null
      },
      dataStore: {},
      isFromMount: false
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
    formAdd: {
      handler(formAdd) {
        if (formAdd.name && formAdd.name !== '') {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true,
      immediate: true
    },
    loading: {
      handler(bool) {
        if (bool === true) {
          this.loadings = true
        } else {
          this.loadings = false
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.disabledSave = true
        } else {
          this.disabledSave = false
        }
      },
      deep: true
    },
    customerType: {
      handler(data) {
        this.customerTypeData = [...data]
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getCountry() {
      this.loadings = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: '',
        per_page: 300
      }
      await axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcountry'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.country = response.data.data
          this.loadings = false
          this.getStateCountry()
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            message: error.response.data.message
          })
          this.loadings = false
        })
    },
    editChangeCountry() {
      this.formAdd.state_id = ''
      this.formAdd.city_id = ''
      this.formAdd.subdistrict_id = ''
      this.getStateCountry()
    },
    getStateCountry() {
      this.loadings = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formAdd.country_id) {
        searchText = 0
      } else {
        searchText = this.formAdd.country_id
      }
      let params = {
        search_column: 'country_id',
        search_operator: '=',
        search_text: searchText,
        per_page: 100,
        sort_column: 'name',
        sort_type: 'asc'
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.stateCountry = response.data.data
          if (!this.isFromMount) {
            this.formAdd.state_id = this.stateCountry[0].id
          }
          this.loadings = false
          this.getShippingCity()
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            message: error.response.data.message
          })
          this.loadings = false
        })
    },
    editProvince() {
      this.formAdd.city_id = ''
      this.formAdd.subdistrict_id = ''
      this.getShippingCity()
    },

    getShippingCity() {
      this.loadings = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formAdd.state_id) {
        searchText = 0
      } else {
        searchText = this.formAdd.state_id
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        search_text: searchText,
        per_page: 100,
        sort_column: 'id',
        sort_type: 'asc'
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.shippingCity = response.data.data
          if (!this.isFromMount) {
            this.formAdd.city_id = this.shippingCity[0].id
          }
          this.loadings = false
          this.getSubDistrict()
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            message: error.response.data.message
          })
          this.loadings = false
        })
    },
    editCity() {
      this.formAdd.subdistrict_id = ''
      this.getSubDistrict()
    },

    getSubDistrict() {
      this.loadings = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formAdd.city_id) {
        searchText = 0
      } else {
        searchText = this.formAdd.city_id
      }
      let params = {
        search_column: 'city_id',
        search_operator: '=',
        search_text: searchText,
        per_page: 100,
        sort_column: 'id',
        sort_type: 'asc'
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcitysubdistrict'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.subDistrict = response.data.data
          if (!this.isFromMount) {
            this.formAdd.subdistrict_id = this.subDistrict[0].id
          }
          this.isFromMount = false
          this.loadings = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            message: error.response.data.message
          })
          this.loadings = false
        })
    },
    handlePassword(val) {
      if (val === 'password') {
        this.showPassword = 'text'
      } else {
        this.showPassword = 'password'
      }
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      this.$emit('save', this.formAdd)
    },

    getStoreData() {
      this.loadings = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/'),
        headers: headers
      })
        .then(response => {
          this.dataStore = response.data.data
          if (this.dataStore.country_id) {
            this.formAdd.country_id = this.dataStore.country_id
          }
          if (this.dataStore.state_id) {
            this.formAdd.state_id = this.dataStore.state_id
          }
          if (this.dataStore.city_id) {
            this.formAdd.city_id = this.dataStore.city_id
          }
          if (this.dataStore.subdistrict_id) {
            this.formAdd.subdistrict_id = this.dataStore.subdistrict_id
          }
          console.log('dd', this.formAdd)
          this.getCountry()
          // this.checkAddressDetail()
          this.loadings = false
        })
        .catch(error => {
          this.loadings = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },
  },
  mounted() {
    // this.getCountry()
    this.isFromMount = true
    this.getStoreData()
  }
}
</script>
