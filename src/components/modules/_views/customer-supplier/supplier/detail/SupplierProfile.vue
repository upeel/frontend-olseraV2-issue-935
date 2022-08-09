<template>
  <div v-loading="loading">
    <div class="supplier-profile">
      <el-form :model="formEdit" ref="formEdit">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <div style="flex-grow: 1;">
              <div v-if="!isEditing">
                <div v-if="!profileData.name"></div>
                <h4 v-else>{{ profileData.name }}</h4>
              </div>
              <div v-else>
                <el-form-item
                  prop="nameHeader"
                  :placeholder="rootLang.please_input+lang.supplier_name"
                  :rules="[
                    { required: true, message: rootLang.please_input+lang.supplier_name, trigger: 'blur' }
                    ]"
                  class="mb-0">
                  <el-input v-model="formEdit.nameHeader" class="inline-form"></el-input>
                </el-form-item>
              </div>
            </div>
            <div>
                <button-action-authenticated :permission="['customer/suppliers', 'edit']" type="primary" v-if="!isEditing" @click="editHandle" icon="el-icon-edit">
                  {{ lang.edit }}
                </button-action-authenticated>
                <el-button type="text" v-if="isEditing" @click="cancelHandle">
                  {{ lang.cancel }}
                </el-button>
                <el-button type="success" @click="submitForm('formEdit')" v-if="isEditing" :disabled="disableSave">
                  {{ lang.save }}
                </el-button>
            </div>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-md-4 tablet-style mb-24">
                <div class="font-16 color-primary font-bold mb-12">
                  {{ lang.supplier_detail }}
                </div>

                <ul class="list-unstyled">
                  <li>
                    <p>{{ lang.contact_person }}</p>
                    <div v-if="!isEditing">
                      <h5 v-if="!profileData.contact_person">-</h5>
                      <h5 v-else>{{ profileData.contact_person }}</h5>
                    </div>
                    <div v-else>
                      <el-form-item
                        prop="contactPerson">
                          <el-input v-model="formEdit.contactPerson" :placeholder="rootLang.please_input+lang.contact_person"></el-input>
                      </el-form-item>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.phone }}</p>
                    <div v-if="!isEditing">
                      <h5 v-if="!profileData.phone">-</h5>
                      <h5 v-else>{{ profileData.phone }}</h5>
                    </div>
                    <div v-else>
                      <el-form-item
                        prop="phone">
                        <el-input v-model="formEdit.phone" type="number" :placeholder="$lang[langId].input_number"></el-input>
                      </el-form-item>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.email }}</p>
                    <div v-if="!isEditing">
                      <h5 v-if="!profileData.email">-</h5>
                      <h5 v-else>{{ profileData.email }}</h5>
                    </div>
                    <div v-else>
                      <el-form-item
                        prop="email"
                        :rules="[
                          { type: 'email', message: rootLang.email_error_input, trigger: ['blur', 'change'] }
                        ]">
                        <el-input v-model="formEdit.email" :placeholder="rootLang.input_email"></el-input>
                      </el-form-item>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="col-md-4 tablet-style mb-24">
                <div class="font-16 color-primary font-bold mb-12">
                  {{ lang.address }}
                </div>

                <ul class="list-unstyled">
                  <li>
                    <div v-if="!isEditing">
                      <h5 v-if="!profileData.address">-</h5>
                      <h5 v-else>{{ profileData.address }}</h5>
                    </div>
                    <div v-else>
                      <el-form-item
                        prop="address">
                          <el-input v-model="formEdit.address" :placeholder="rootLang.please_input+lang.address"></el-input>
                      </el-form-item>
                    </div>
                  </li>
                  <li v-if="isEditing">
                    <p>{{ lang.country }}</p>
                    <el-form-item
                      prop="country"
                      :rules="[
                      { required: true, message: lang.please_select+' '+lang.country, trigger: 'change' }
                      ]">
                        <el-select filterable class="inline-form" v-model="formEdit.country" :placeholder="lang.please_select" size="small" @change="editCountry">
                          <el-option v-for="item in country" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                  </li>
                  <li v-if="isEditing">
                    <p>{{ lang.province }}</p>
                    <el-form-item
                      prop="stateCountry"
                      :rules="[
                      { required: true, message: lang.please_select+' '+lang.province, trigger: 'change' }
                      ]">
                        <el-select filterable class="inline-form" v-model="formEdit.stateCountry" :placeholder="lang.please_select" size="small" @change="editStateCountry">
                          <el-option v-for="item in stateCountry" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                  </li>
                  <li v-if="isEditing">
                    <p>{{ lang.city }}</p>
                    <el-form-item
                      prop="shippingCity"
                      :rules="[
                      { required: true, message: lang.please_select+' '+lang.city, trigger: 'change' }
                      ]">
                        <el-select filterable class="inline-form" v-model="formEdit.shippingCity" :placeholder="lang.please_select" size="small" @change="editCity">
                          <el-option v-for="item in shippingCity" :key="item.id" :label="item.city" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                  </li>
                  <li v-if="isEditing">
                    <p>{{ lang.postal_code }}</p>
                    <el-form-item
                      prop="postalCode">
                      <el-input v-model="formEdit.postalCode" type="number" :placeholder="$lang[langId].input_number"></el-input>
                    </el-form-item>
                  </li>
                </ul>
              </div>

              <div class="col-md-4 tablet-style mb-24">
                <div class="font-16 color-primary font-bold mb-12">
                  {{ lang.notes }}
                </div>

                <div v-if="!isEditing">
                  <h5 v-if="!profileData.notes">{{ $lang[langId].there_is_no }}</h5>
                  <h5 v-else>{{ profileData.notes }}</h5>
                </div>
                <div v-else>
                  <el-form-item
                    prop="notes">
                    <el-input v-model="formEdit.notes" type="textarea" :placeholder="rootLang.please_input+lang.notes"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>

            <button-action-authenticated
              v-if="!isEditing"
              :permission="['customer/suppliers', 'destroy']"
              type="danger"
              icon="el-icon-delete"
              @click="deleteDialog = true">
              {{ $lang[langId].delete }} {{ lang.supplier }}
            </button-action-authenticated>
          </div>
        </el-card>
      </el-form>
    </div>

    <el-dialog
      :visible.sync="deleteDialog"
      :close-on-click-modal="false"
      :show-close="false"
      center
      width="300px">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.supplier }}</p>
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
import moment from 'moment'

export default {
  name: 'SupplierDetailProfile',
  data() {
    return {
      loading: false,
      profileData: {},
      labelDate: '',
      isEditing: false,
      deleteDialog: false,
      disableSave: false,
      country: [],
      stateCountry: [],
      shippingCity: [],
      formEdit: {
        nameHeader: '',
        contactPerson: '',
        phone: null,
        email: '',
        address: '',
        country: '',
        stateCountry: '',
        shippingCity: '',
        postalCode: null,
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
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getProfileData()
    }
  },
  mounted() {
    this.getProfileData()
  },
  methods: {
    getProfileData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier/' + this.$route.params.id),
        headers: headers
      })
        .then(response => {
          this.profileData = response.data.data
          this.profileData.created_time = moment(this.profileData.created_time).format('DD-MMM-YYYY')
          this.loading = false
          this.$emit('dataloaded', this.profileData)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          console.log(error)
        })
    },
    editHandle() {
      if (this.profileData.name) {
        this.formEdit.nameHeader = this.profileData.name
      }
      if (this.profileData.contact_person) {
        this.formEdit.contactPerson = this.profileData.contact_person
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
      if (this.profileData.postal_code) {
        this.formEdit.postalCode = this.profileData.postal_code
      }
      if (this.profileData.notes) {
        this.formEdit.notes = this.profileData.notes
      }
      this.getCountry()
      this.getStateCountry()
      this.getShippingCity()
      this.isEditing = true
    },
    cancelHandle() {
      this.isEditing = false
      this.formEdit = {
        nameHeader: '',
        contactPerson: '',
        phone: null,
        email: '',
        address: '',
        country: '',
        stateCountry: '',
        shippingCity: '',
        postalCode: null,
        notes: ''
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveHandle()
        } else {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          return false
        }
      })
    },
    saveHandle() {
      this.disableSave = true
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      if (this.formEdit.phone === null) {
        this.formEdit.phone = ''
      }
      if (this.formEdit.postalCode === null) {
        this.formEdit.postalCode = ''
      }
      let data = {
        name: this.formEdit.nameHeader,
        contact_person: this.formEdit.contactPerson,
        email: this.formEdit.email,
        phone: this.formEdit.phone,
        address: this.formEdit.address,
        country_id: this.formEdit.country,
        state_id: this.formEdit.stateCountry,
        city_id: this.formEdit.shippingCity,
        postal_code: this.formEdit.postalCode,
        notes: this.formEdit.notes
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier/' + this.$route.params.id),
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
          }
          this.loading = false
          this.isEditing = false
          this.disableSave = false
          this.getProfileData()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          console.log(error)
          this.loading = false
          this.disableSave = false
          this.isEditing = true
        })
    },
    deleteHandle() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier/' + this.$route.params.id),
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
          this.$router.push({
            path: '/customersupplier/supplier'
          })
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          console.log(error)
          this.deleteDialog = false
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
      this.formEdit.shippingCity = null
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
    editStateCountry(item) {
      this.formEdit.stateCountry = item
      this.profileData.city_name = ''
      this.formEdit.shippingCity = null
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
    }
  }
}
</script>

