<template>
  <el-card v-loading="loading" class="box">
    <div slot="header" class="table-handler-flex">
      <h4 class="box-title" style="flex-grow: 1;">{{ lang.add_supplier }}</h4>
      <div>
        <router-link to="/customersupplier/supplier">
          <el-button type="text">{{ lang.cancel }}</el-button>
        </router-link>
        <el-button type="success" @click="submitForm('formAdd')" :disabled="disableSave">
          {{ lang.save }}
        </el-button>
      </div>
    </div>

    <div class="box-body">
      <el-form :model="formAdd" ref="formAdd" label-width="30%">
        <el-row :gutter="20">
          <el-col :sm="12">
            <label class="font-16 font-bold mb-12 color-success">{{ lang.customer_detail }}</label>
            <el-form-item
              prop="nameSupplier"
              :label="lang.supplier_name"
              :rules="[
                { required: true, message: rootLang.please_input+lang.supplier_name, trigger: 'blur' }
                ]">
                <el-input v-model="formAdd.nameSupplier" :placeholder="rootLang.please_input+lang.supplier_name"></el-input>
            </el-form-item>
            <el-form-item
              prop="contactPersonal"
              :label="lang.contact_person">
                <el-input v-model="formAdd.contactPersonal" :placeholder="rootLang.please_input+lang.contact_person"></el-input>
            </el-form-item>
            <el-form-item
              prop="email"
              :label="lang.email"
              :rules="[
                { type: 'email', message: rootLang.email_error_input, trigger: ['blur', 'change'] }
              ]">
              <el-input v-model="formAdd.email" :placeholder="rootLang.input_email"></el-input>
            </el-form-item>
            <el-form-item
              prop="phone"
              :label="lang.phone"
              :placeholder="rootLang.input_number">
              <el-input v-model="formAdd.phone" type="number" :placeholder="$lang[langId].input_number"></el-input>
            </el-form-item>
            <el-form-item
              prop="notes"
              :label="lang.notes">
                <el-input v-model="formAdd.notes" :placeholder="rootLang.please_input+lang.notes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <label class="font-16 font-bold mb-12 color-success">{{ lang.address }}</label>
            <el-form-item
              prop="address"
              :label="lang.address">
                <el-input v-model="formAdd.address" :placeholder="rootLang.please_input+lang.address"></el-input>
            </el-form-item>
            <el-form-item
              prop="countryName"
              :label="lang.country">
                <el-select filterable class="inline-form" v-model="formAdd.countryName" :placeholder="lang.please_select" size="small" @change="editChangeCountry">
                  <el-option v-for="item in country" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
              prop="stateCountry"
              :label="lang.province">
                <el-select filterable class="inline-form" v-model="formAdd.stateCountry" :placeholder="lang.please_select" size="small" @change="editProvince">
                  <el-option v-for="item in stateCountry" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
              prop="shippingCity"
              :label="lang.city">
                <el-select filterable class="inline-form" v-model="formAdd.shippingCity" :placeholder="lang.please_select" size="small">
                  <el-option v-for="item in shippingCity" :key="item.id" :label="item.city" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
              prop="postalCode"
              :label="lang.postal_code">
              <el-input v-model="formAdd.postalCode" type="number" :placeholder="$lang[langId].input_number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'SupplierCreate',
  data: function() {
    return {
      loading: true,
      country: null,
      stateCountry: null,
      shippingCity: null,
      disableSave: false,
      formAdd: {
        nameSupplier: '',
        contactPersonal: '',
        notes: '',
        email: '',
        phone: null,
        address: '',
        countryName: 'ID',
        stateCountry: '',
        shippingCity: '',
        postalCode: null
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
    }
  },
  // watch: {
  //   '$store.getters.selectedStore': function() {
  //     this.getCustomerType()
  //   }
  // },
  mounted() {
    this.getCountry()
    this.getStateCountry()
    this.getShippingCity()
  },
  methods: {
    getCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
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
    editChangeCountry() {
      this.formAdd.stateCountry = ''
      this.formAdd.shippingCity = ''
      this.getStateCountry()
    },
    getStateCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formAdd.countryName) {
        searchText = 0
      } else {
        searchText = this.formAdd.countryName
      }
      let params = {
        search_column: 'country_id',
        search_operator: '=',
        search_text: searchText,
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
    editProvince() {
      this.formAdd.shippingCity = ''
      this.getShippingCity()
    },

    getShippingCity() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.formAdd.stateCountry) {
        searchText = 0
      } else {
        searchText = this.formAdd.stateCountry
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save()
        } else {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          return false
        }
      })
    },
    save() {
      this.disableSave = true
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      if (this.formAdd.phone === null) {
        this.formAdd.phone = ''
      }
      if (this.formAdd.postalCode === null) {
        this.formAdd.postalCode = ''
      }
      let data = {
        name: this.formAdd.nameSupplier,
        contact_person: this.formAdd.contactPersonal,
        email: this.formAdd.email,
        phone: this.formAdd.phone,
        notes: this.formAdd.notes,
        address: this.formAdd.address,
        country_id: this.formAdd.countryName,
        state_id: this.formAdd.stateCountry,
        city_id: this.formAdd.shippingCity,
        postal_code: this.formAdd.postalCode
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.disableSave = false
          this.$router.push({
            path: '/customersupplier/supplier/' + response.data.data.id
          })
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          console.log(error)
          this.disableSave = false
        })
    }
  }
}
</script>
