<template>
  <div>
    <div>
      <el-form label-width="220px">
        <el-form-item
          :label="lang.payment_methods"
          :required="true"
        >
          <el-select
            v-model="data.payment_type_id"
            :disabled="inputDisabled"
            filterable
          >
            <el-option
              v-for="(item) in PaymentMethod"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <div v-if="data.payment_type_id === 'BT'">
          <el-collapse>
            <el-collapse-item>
              <template slot="title">
                <label style="margin-left: 35%;">{{ lang.bank_transfer }}</label>
                <span>
                  <hr style="display: inline-block; width: 45%; margin:0 0 0 30px; border-top: 1px solid #E1E2E1;" /></span>
              </template>
              <el-form-item :label="lang.bank" :required="true">
                <el-select v-model="data.bt_bank_id">
                  <el-option v-for="(item) in allBank" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="lang.branch_code" :required="true">
                <el-input v-model="data.bt_branch_code"></el-input>
              </el-form-item>
              <el-form-item :label="lang.bank_account_no" :required="true">
                <el-input type="number" v-model="data.bt_account_no"></el-input>
              </el-form-item>
              <el-form-item :label="lang.bank_account_name" :required="true">
                <el-input v-model="data.bt_account_name"></el-input>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
          <el-form-item style="margin-top: 10px;">
            <template slot="label">
              <label>{{ lang.activate_unique_code_label }}</label>
              <p class="input-desc size-12 oldgrey" style="margin-top: 0;">
                {{ lang.activate_unique_code_desc }}
              </p>
            </template>
            <el-switch v-model="data.activate_unique_code" :active-value="1" :inactive-value="0">
            </el-switch>
            <span v-if="data.activate_unique_code == 0">{{ lang.no }}</span>
            <span v-if="data.activate_unique_code == 1">{{ lang.yes }}</span>
          </el-form-item>
          <hr />
        </div>

        <div v-if="data.payment_type_id === 'CO'">
          <hr />
          <el-form-item :label="$lang[langId].payment_on_delivery"></el-form-item>
          <el-form-item :label="$lang[langId].alias" :required="true">
            <el-input v-model="data.name"></el-input>
          </el-form-item>
          <el-form-item :label="lang.apply_to_cities" :required="true">
            <el-autocomplete v-model="searchValue" :fetch-suggestions="searchCity" :placeholder="lang.search+' '+lang.city" @select="handleSelectCity">
            </el-autocomplete>
            <div>
              <el-tag :key="tag.id" v-for="tag in dataTag" closable :disable-transitions="false" @close="handleClose(tag)">
                {{tag.name}}
              </el-tag>
            </div>
          </el-form-item>
          <hr />
        </div>

        <div v-if="data.payment_type_id === 'PP'">
          <hr />
          <el-form-item :label="lang.paypal"></el-form-item>
          <el-form-item :label="lang.paypal_user_name" :required="true">
            <el-input v-model="data.pp_user_name"></el-input>
          </el-form-item>
          <el-form-item :label="lang.paypal_password" :required="true">
            <el-input v-model="data.pp_password" :type="showPassword">
              <el-button type="text" icon="el-icon-view" slot="suffix" @click="handlePassword(showPassword)"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item :label="lang.paypal_signature" :required="true">
            <el-input v-model="data.pp_signature"></el-input>
          </el-form-item>
          <el-form-item :label="lang.payment_accepted_in_currency" :required="true">
            <el-select v-model="data.pp_currency_id">
              <el-option v-for="(item) in allCurrency" :key="item.id" :label="item.currency_name" :value="item.currency_id">
              </el-option>
            </el-select>
          </el-form-item>
          <hr />
        </div>

        <div v-if="data.payment_type_id === 'SN' || data.payment_type_id === 'VT'">
          <hr />
          <el-form-item :label="$lang[langId].veritrans"></el-form-item>
          <el-form-item :label="$lang[langId].alias" :required="true">
            <el-input v-model="data.name"></el-input>
          </el-form-item>
          <el-form-item :label="$lang[langId].server_key" :required="true">
            <el-input v-model="data.vt_server_key"></el-input>
          </el-form-item>
          <el-form-item :label="$lang[langId].client_key" :required="true">
            <el-input v-model="data.vt_client_key"></el-input>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <label>{{ lang.production_mode }}</label>
              <p class="input-desc size-12 oldgrey" style="margin-top: 0;">
                {{ lang.help_vt_production_mode }}
              </p>
            </template>
            <div>
              <el-switch v-model="data.vt_production_mode" :active-value="1" :inactive-value="0">
              </el-switch>
              <span v-if="data.vt_production_mode == 0">{{ lang.no }}</span>
              <span v-if="data.vt_production_mode == 1">{{ lang.yes }}</span>
            </div>
          </el-form-item>
          <hr />
        </div>

        <el-form-item v-if="data.payment_type_id" :label="lang.payment_instructions">
          <el-input type="textarea" v-model="data.instructions"></el-input>
        </el-form-item>

        <el-form-item v-if="data.id">
          <el-button @click="remove" type="danger" icon="el-icon-delete" style="width: 100%;">
            {{ $lang[langId].delete }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="text-align: center;">
      <el-button @click="cancel" style="margin-right: 10px;">{{ lang.cancel }}</el-button>
      <el-button :disabled="disabledSave" @click="save" type="success" icon="el-icon-check">
        {{ lang.save }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  props: ['saved', 'loading', 'formData'],

  data() {
    return {
      loadingForm: false,
      disabledSave: true,
      PaymentMethod: [
        { value: 'BT', title: this.$store.state.userStores.lang.bank_transfer },
        { value: 'CO', title: this.$lang[this.$store.state.userStores.langId].payment_on_delivery },
        { value: 'PP', title: this.$store.state.userStores.lang.paypal },
        { value: 'SN', title: this.$lang[this.$store.state.userStores.langId].payment_mid_snap },
        { value: 'VT', title: this.$lang[this.$store.state.userStores.langId].payment_mid_web }
      ],
      allBank: null,
      allCurrency: null,
      loadingCityTags: false,
      searchResultCity: [],
      dataTag: [],
      searchValue: '',
      isEditing: false,
      showPassword: 'password',
      data: {}
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    inputDisabled() {
      if (this.data.id) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    data: {
      handler(data) {
        if (data.payment_type_id && data.payment_type_id === 'BT') {
          if (
            data.bt_bank_id &&
            (data.bt_branch_code && data.bt_branch_code !== '') &&
            (data.bt_branch_code && data.bt_branch_code !== '') &&
            (data.bt_account_no && data.bt_account_no !== 0) &&
            (data.bt_account_name && data.bt_account_name !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else if (data.payment_type_id && data.payment_type_id === 'CO') {
          if (
            data.name &&
            data.name !== '' &&
            (data.cities && data.cities.length > 0)
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else if (data.payment_type_id && data.payment_type_id === 'PP') {
          if (
            data.pp_currency_id &&
            (data.pp_user_name && data.pp_user_name !== '') &&
            (data.pp_password && data.pp_password !== '') &&
            (data.pp_signature && data.pp_signature !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else if (
          data.payment_type_id &&
          (data.payment_type_id === 'SN' || data.payment_type_id === 'VT')
        ) {
          if (
            data.name &&
            data.name !== '' &&
            (data.vt_server_key && data.vt_server_key !== '') &&
            (data.vt_client_key && data.vt_client_key !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
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
        this.data = { ...data }
        if (data.id && data.payment_type_id === 'CO' && !this.isEditing) {
          this.isEditing = true
          this.setCity(data)
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    getAllBank() {
      this.loadingForm = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'bank'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.allBank = response.data.data
          this.loadingForm = false
        })
        .catch(error => {
          this.loadingForm = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    getCurrency() {
      this.loadingForm = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'currency'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.allCurrency = response.data.data
          this.loadingForm = false
        })
        .catch(error => {
          this.loadingForm = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    setCity(val) {
      for (let index = 0; index < val.cities.length; index++) {
        this.dataTag[index] = {
          name: val.cities[index].city,
          id: JSON.parse(val.cities[index].city_id)
        }
        this.data.cities[index] = JSON.parse(val.cities[index].city_id)
      }
    },

    searchCity(queryString, callback) {
      this.loadingCityTags = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'city',
        sort_type: 'asc',
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loadingCityTags = false
          for (let i of response.data.data) {
            i.value = i.city
          }
          this.searchResultCity = response.data.data
          callback(this.searchResultCity)
        })
        .catch(error => {
          console.log(error)
        })
    },

    handleSelectCity(item) {
      this.searchValue = item.city
      this.handleInputConfirm(item)
    },

    handleInputConfirm(item) {
      let inputValue = this.searchValue
      let idData = item.id
      if (inputValue) {
        this.dataTag.push({
          name: inputValue,
          id: idData
        })
        if (!this.data.cities) {
          this.data.cities = []
          this.data.cities.push(idData)
        } else {
          this.data.cities.push(idData)
        }
      }
      this.searchValue = ''
    },

    handleClose(tag) {
      this.dataTag.splice(this.dataTag.indexOf(tag.name), 1)
      this.data.cities.splice(this.data.cities.indexOf(tag.id), 1)
    },

    cancel() {
      this.data = {}
      this.$emit('cancel')
    },

    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },

    remove() {
      this.$emit('remove', { id: this.data.id })
    },

    handlePassword(val) {
      if (val === 'password') {
        this.showPassword = 'text'
      } else {
        this.showPassword = 'password'
      }
    }
  },

  mounted() {
    this.getAllBank()
    this.getCurrency()
  }
}
</script>

