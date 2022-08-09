<template>
  <div v-loading="loading">
    <div class="customer-profile">
      <el-card class="box-card">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <div v-if="!isEditing">
                <div v-if="!profileData.name" />
                <h3 v-else>
                  {{ profileData.name }}
                </h3>
              </div>

              <div v-else>
                <el-input v-model="formEdit.nameHeader"></el-input>
              </div>
              <p v-if="!isEditing">{{ profileData.fcreated_time }}</p>
            </div>
            <div class="col-md-8 text-right">
              <el-button v-if="!isEditing" plain type="primary" @click="back">
                {{ lang.back }}
              </el-button>
              <button-action-authenticated :permission="['customer/customers', 'edit']" type="primary" v-if="!isEditing" @click="editHandle" icon="el-icon-edit">
                {{ lang.edit }}
              </button-action-authenticated>
              <el-button type="text" v-if="isEditing" @click="cancelHandle">
                {{ lang.cancel }}
              </el-button>
              <el-button type="success" v-if="isEditing" @click="saveHandle">
                <svg-icon icon-class="save"></svg-icon>
                {{ lang.save }}
              </el-button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-md-4 tablet-style">
              <h4 class="font-bold font-14">{{ lang.customer_detail }}</h4>
              <ul class="list-unstyled">
                <li>
                  <p>{{ lang.code }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="!profileData.code">-</h5>
                    <h5 v-else>{{ profileData.code }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formEdit.code"></el-input>
                  </div>
                </li>
                <li>
                  <p>{{ lang.customer_type }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="!profileData.customer_type_name">-</h5>
                    <h5 v-else>{{ profileData.customer_type_name }}</h5>
                  </div>
                  <div v-else>
                    <el-select class="inline-form" v-model="formEdit.customerTypes" filterable :placeholder="lang.please_select">
                      <el-option v-for="item in customerType" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <p>{{ lang.company_name }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="!profileData.company">-</h5>
                    <h5 v-else>{{ profileData.company }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formEdit.companyName"></el-input>
                  </div>
                </li>
                <li>
                  <p>{{ lang.accept_newsletter }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="profileData.accept_newsletter === null">-</h5>
                    <h5 v-if="profileData.accept_newsletter === 0">{{ lang.no }}</h5>
                    <h5 v-if="profileData.accept_newsletter === 1">{{ lang.yes }}</h5>
                  </div>
                  <div v-else>
                    <el-switch v-model="formEdit.switchValue" :active-value="1" :inactive-value="0">
                    </el-switch>
                    <span v-if="formEdit.switchValue === 0">{{ lang.no }}</span>
                    <span v-if="formEdit.switchValue === 1">{{ lang.yes }}</span>
                  </div>
                </li>
                <li>
                  <p>{{ lang.date_of_birth }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="profileData.dob === null">-</h5>
                    <h5 v-else>{{ profileData.fdob }}</h5>
                  </div>
                  <div v-else>
                    <el-date-picker
                      v-model="formEdit.dob"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                    />
                  </div>
                </li>
                <li>
                  <p>{{ lang.expiry_date }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="profileData.expiry_date === null">-</h5>
                    <h5 v-else>{{ profileData.fexpiry_date }}</h5>
                  </div>
                  <div v-else>
                    <el-date-picker
                      v-model="formEdit.expiry_date"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                    />
                  </div>
                    
                </li>
              </ul>
              <el-button type="default" v-if="!isEditing" @click="deleteDialog = true" icon="el-icon-delete">
                <!-- <svg-icon icon-class="trash"></svg-icon> -->
                {{ $lang[langId].delete }} {{ lang.customer }}
              </el-button>
            </div>
            <div class="col-md-4 tablet-style">
              <h4 class="font-bold font-14">{{ lang.contact }}</h4>
              <ul class="list-unstyled">
                <li>
                  <p>{{ lang.phone }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="!profileData.phone">-</h5>
                    <h5 v-else>{{ profileData.phone }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formEdit.phone"></el-input>
                  </div>
                </li>
                <li>
                  <p>{{ lang.email }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="!profileData.email">-</h5>
                    <h5 v-else>{{ profileData.email }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formEdit.email"></el-input>
                  </div>
                </li>
                <li>
                  <p>{{ lang.address }}</p>
                  <div v-if="!isEditing">
                    <h5 v-if="!profileData.address">-</h5>
                    <h5 v-else>{{ profileData.address }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formEdit.address"></el-input>
                  </div>
                </li>
                <li v-if="isEditing">
                  <p>{{ lang.country }}</p>
                  <el-select filterable class="inline-form" v-model="formEdit.country" :placeholder="lang.please_select" size="small" @change="editCountry">
                    <el-option v-for="item in country" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </li>
                <li v-if="isEditing">
                  <p>{{ lang.province }}</p>
                  <el-select filterable class="inline-form" v-model="profileData.state_name" :placeholder="lang.please_select" size="small" @change="editStateCountry">
                    <el-option v-for="item in stateCountry" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </li>
                <li v-if="isEditing">
                  <p>{{ lang.city }}</p>
                  <el-select filterable class="inline-form" v-model="profileData.city_name" :placeholder="lang.please_select" size="small" @change="editCity">
                    <el-option v-for="item in shippingCity" :key="item.id" :label="item.city" :value="item.id"></el-option>
                  </el-select>
                </li>
                <li v-if="isEditing">
                  <p>{{ lang.district }}</p>
                  <el-select filterable class="inline-form" v-model="profileData.city_subdistrict_name" :placeholder="lang.please_select" size="small" @change="editSubdistrict">
                    <el-option v-for="item in subDistrict" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </li>
                <li v-if="isEditing">
                  <p>{{ lang.postal_code }}</p>
                  <el-input v-model="formEdit.postalCode"></el-input>
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <h4 class="font-bold font-14">{{ $lang[langId].credit_limit }}</h4>
              <div v-if="!isEditing">
                <h5>{{ profileData.fredit_limit }}</h5>
              </div>
              <div v-else class="el-input el-input--mini">
                <input-money v-model="formEdit.credit_limit" />
              </div>
            </div>
            <div
              v-if="!isEditing"
              class="col-md-4">
              <h4 class="font-bold font-14">{{ rootLang.outstanding_payment }}</h4>
              <h5>{{ profileData.foutstanding_payment}}</h5>
            </div>
            <div class="col-md-4">
              <h4 class="font-bold font-14">{{ $lang[langId].is_frozen }}</h4>
              <div v-if="!isEditing">
                <h5 v-if="profileData.is_frozen === null">-</h5>
                <h5 v-if="profileData.is_frozen === 0">{{ lang.no }}</h5>
                <h5 v-if="profileData.is_frozen === 1">{{ lang.yes }}</h5>
              </div>
              <div v-else>
                <el-switch v-model="formEdit.is_frozen" :active-value="1" :inactive-value="0">
                </el-switch>
                <span v-if="formEdit.is_frozen === 0">{{ lang.no }}</span>
                <span v-if="formEdit.is_frozen === 1">{{ lang.yes }}</span>
              </div>
            </div>
            <div class="col-md-4">
              <h4 class="font-bold font-14">{{ lang.notes }}</h4>
              <div v-if="!isEditing">
                <h5 v-if="!profileData.notes">{{ $lang[langId].there_is_no }}</h5>
                <h5 v-else>{{ profileData.notes }}</h5>
              </div>
              <div v-else>
                <el-input type="textarea" v-model="formEdit.notes"></el-input>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.customer }}</p>
        <h5>{{ profileData.name }}</h5>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="deleteHandle">{{ $lang[langId].delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'CustomerDetailProfile',
  props: ['dataDetail'],
  components: {
    InputMoney
  },
  data() {
    return {
      loading: false,
      profileData: {},
      isEditing: false,
      deleteDialog: false,
      customerType: [],
      country: [],
      stateCountry: [],
      shippingCity: [],
      subDistrict: [],
      formEdit: {
        nameHeader: '',
        code: '',
        customerTypes: 0,
        companyName: '',
        dob: '',
        switchValue: 0,
        is_frozen: 0,
        phone: null,
        email: '',
        address: '',
        country: '',
        stateCountry: '',
        shippingCity: '',
        subDistrict: '',
        postalCode: null,
        notes: '',
        expiry_date: ''
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
      return this.$lang[this.langId]
    }
  },
  watch: {
    dataDetail: {
      handler(data) {
        this.profileData = {...data}
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    editHandle() {
      if (this.profileData.name) {
        this.formEdit.nameHeader = this.profileData.name
      }
      if (this.profileData.code) {
        this.formEdit.code = this.profileData.code
      }
      if (this.profileData.customer_type_id) {
        this.formEdit.customerTypes = this.profileData.customer_type_id
      }
      if (this.profileData.company) {
        this.formEdit.companyName = this.profileData.company
      }
      if (this.profileData.accept_newsletter) {
        this.formEdit.switchValue = this.profileData.accept_newsletter
      }
      if (this.profileData.address) {
        this.formEdit.address = this.profileData.address
      }
      if (this.profileData.email) {
        this.formEdit.email = this.profileData.email
      }
      if (this.profileData.phone) {
        this.formEdit.phone = this.profileData.phone
      }
      if (this.profileData.country_id) {
        this.formEdit.country = this.profileData.country_id
      }
      if (this.profileData.state_id) {
        this.formEdit.stateCountry = this.profileData.state_id
      }
      if (this.profileData.city_id) {
        this.formEdit.shippingCity = this.profileData.city_id
      }
      if (this.profileData.subdistrict_id) {
        this.formEdit.subDistrict = this.profileData.subdistrict_id
      }
      if (this.profileData.postal_code) {
        this.formEdit.postalCode = this.profileData.postal_code
      }
      if (this.profileData.notes) {
        this.formEdit.notes = this.profileData.notes
      }
      if (this.profileData.credit_limit) {
        this.formEdit.credit_limit = this.profileData.credit_limit
      }
      if (this.profileData.is_frozen) {
        this.formEdit.is_frozen = this.profileData.is_frozen
      }
      if (this.profileData.expiry_date !== null) {
        if (this.profileData.expiry_date === '0000-00-00') {
          this.formEdit.expiry_date = ''
        } else {
          this.formEdit.expiry_date = this.profileData.expiry_date
        }
      }
      if (this.profileData.dob !== null) {
        this.formEdit.dob = this.profileData.dob
      }
      this.getCustomerType()
      this.getCountry()
      this.getStateCountry()
      this.getShippingCity()
      this.getSubDistrict()
      this.isEditing = true
    },
    cancelHandle() {
      this.isEditing = false
      this.formEdit = {
        nameHeader: '',
        code: '',
        customerTypes: 0,
        companyName: '',
        switchValue: 0,
        phone: null,
        email: '',
        address: '',
        country: '',
        stateCountry: '',
        shippingCity: '',
        subDistrict: '',
        postalCode: null,
        notes: ''
      }
    },
    saveHandle() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        name: this.formEdit.nameHeader,
        customer_type_id: this.formEdit.customerTypes,
        code: this.formEdit.code,
        company: this.formEdit.companyName,
        dob: this.formEdit.dob,
        email: this.formEdit.email,
        phone: this.formEdit.phone,
        address: this.formEdit.address,
        country_id: this.formEdit.country,
        state_id: this.formEdit.stateCountry,
        city_id: this.formEdit.shippingCity,
        subdistrict_id: this.formEdit.subDistrict,
        postal_code: this.formEdit.postalCode,
        accept_newsletter: this.formEdit.switchValue,
        notes: this.formEdit.notes,
        credit_limit: this.formEdit.credit_limit,
        is_frozen: this.formEdit.is_frozen,
        expiry_date: this.formEdit.expiry_date
      }
      axios({
        method: 'PUT',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          'customer/' + this.profileData.id
        ),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.profileData = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          } else {
            this.$message({
              message: 'error',
              type: 'error'
            })
          }
          this.loading = false
          this.isEditing = false
          // this.getProfileData()
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },
    deleteHandle() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer/' + this.profileData.id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.deleteDialog = false
          this.loading = false
          this.deleteBack()
          // this.$router.push({
          //   path: '/customersupplier/customer'
          // })
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.deleteDialog = false
          this.loading = false
        })
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
    getCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: '',
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcountry'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.country = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editCountry(item) {
      this.formEdit.country = item
      this.formEdit.stateCountry = null
      this.profileData.state_name = ''
      this.profileData.city_name = ''
      this.profileData.city_subdistrict_name = ''
      this.formEdit.shippingCity = null
      this.formEdit.subDistrict = null
      this.getStateCountry()
    },
    getStateCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formEdit.country) {
        searchText = 0
      } else {
        searchText = this.formEdit.country
      }
      let params = {
        // search_column: 'country_id',
        // search_operator: '=',
        // search_text: searchText
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.stateCountry = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editStateCountry(item) {
      this.formEdit.stateCountry = item
      this.profileData.city_name = ''
      this.profileData.city_subdistrict_name = ''
      this.formEdit.shippingCity = null
      this.formEdit.subDistrict = null
      this.getShippingCity()
    },
    getShippingCity() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formEdit.stateCountry) {
        searchText = 0
      } else {
        searchText = this.formEdit.stateCountry
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        search_text: searchText,
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.shippingCity = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editCity(item) {
      this.formEdit.shippingCity = item
      this.profileData.city_subdistrict_name = ''
      this.formEdit.subDistrict = null
      this.getSubDistrict()
    },
    getSubDistrict() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formEdit.shippingCity) {
        searchText = 0
      } else {
        searchText = this.formEdit.shippingCity
      }
      let params = {
        search_column: 'city_id',
        search_operator: '=',
        search_text: searchText,
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcitysubdistrict'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.subDistrict = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editSubdistrict(item) {
      this.formEdit.subDistrict = item
    },
    back() {
      this.profileData = {}
      this.$emit('back')
    },
    deleteBack() {
      this.profileData = {}
      this.$emit('deleteBack')
    }
  }
}
</script>

