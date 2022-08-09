<template>
  <div v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="back" type="info" class="mr-8"><i class="el-icon-back" /></el-button>
        <template v-if="!editCourier" v-loading="loadingCourier">
          <template >
            {{ courierDetail.name }}
          </template>
          <template class="font-10">
            <el-button type="text" size="small" @click="editCourier = true">
              <svg-icon icon-class="edit-2"></svg-icon>
              {{ lang.edit }}
            </el-button>
          </template>
        </template>
        <template v-else v-loading="loadingCourier">
          <template>
            <el-input v-model="courierDetail.name" style="width: unset !important" @keyup.native.enter="saveCourier"></el-input>
          </template>
          <template class="font-10">
            <el-button size="small" type="primary" @click="saveCourier">
              {{ lang.save }}
            </el-button>
          </template>
        </template>
        <div class="pull-right">
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="add">
            {{ lang.add }}
          </el-button>
        </div>
      </div>

      <div class="table-handler-flex mb-16">
        <div
          class="mb-4"
          style="flex-grow: 1;">
          <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
            <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="mb-4">
          <el-input class="inline-form input-search" 
            clearable 
            :placeholder="lang.search +' '+ lang.shipping" 
            prefix-icon="el-icon-search" 
            v-model="params.search" 
            @change="getData" 
            size="small">
          </el-input>
        </div>
      </div>

      <el-table :data="data" stripe>
        <el-table-column v-if="!$route.query.international" :label="lang.province" prop="state_name" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.state_name" disabled v-if="!rowState[scope.$index].edited"></el-input>
            <el-autocomplete
              v-else
              v-model="searchQuery"
              :fetch-suggestions="searchProvinceEdit"
              :debounce="300"
              @select="getProvinceSelect"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column v-if="!$route.query.international" :label="lang.city" prop="city_name" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.city_name" disabled v-if="!rowState[scope.$index].edited"></el-input>
            <el-autocomplete
              v-else
              v-model="searchQueryCity"
              :fetch-suggestions="searchCityEdit"
              :debounce="300"
              @select="getCitySelect"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column v-if="!$route.query.international" :label="lang.district" prop="city_district" />

        <el-table-column v-if="$route.query.international" :label="lang.country" prop="country_name" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.country_name" disabled v-if="!rowState[scope.$index].edited"></el-input>
            <el-autocomplete
              v-else
              v-model="searchQueryCountry"
              :fetch-suggestions="searchCountryEdit"
              :debounce="300"
              @select="getCountrySelect"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column :label="lang.tariff" prop="tariff">
          <template slot-scope="scope">
              <span
                v-if="!isEditing[scope.$index]"
                class="editable"
                @click="beginUpdateTariff(scope.row, scope.$index)">
                {{ scope.row.tariff }}
              </span>
              <div
                v-if="isEditing[scope.$index]"
                class="form-in-cell">
                <el-input v-model="tmp.tariff" type="number" min="1" size="small" />
                <el-button size="mini" icon="el-icon-close"
                  @click="cancelUpdateTariff(scope.$index)"
                  type="info">
                </el-button>
                <el-button size="mini" icon="el-icon-check"
                  @click="updateTariff(tmp, scope.$index)"
                  type="success">
                </el-button>
              </div>
            </template>
        </el-table-column>

        <el-table-column :label="lang.weight" width="100">
          <template slot-scope="scope">
            {{ scope.row.weight_from }} - {{ scope.row.weight_to }} {{ scope.row.unit_weight }}
          </template>
        </el-table-column>

        <!-- <el-table-column :label="lang.remove">
          <template slot-scope="scope">
            <el-button @click="remove(scope.$index)" icon="el-icon-delete" type="text-danger" />
          </template>
        </el-table-column> -->

        <el-table-column width="200px">
              <template slot-scope="scope">
                <el-button type="default" v-if="rowState[scope.$index].edited" @click="pricetiersCancel(scope.$index)" size="mini">{{ lang.cancel }}</el-button>
                <el-button type="primary" v-if="rowState[scope.$index].edited" @click="handleSimpanRow(scope.$index, scope.row)" size="mini">{{ lang.save }}</el-button>
                <el-button type="primary" v-if="!rowState[scope.$index].edited" @click="handleEditRow(scope.row, scope.$index)" size="mini">{{ lang.edit }}</el-button>
                <el-button type="danger" v-if="!rowState[scope.$index].edited" @click="remove(scope.$index)" size="mini">{{ rootLang.delete }}</el-button>
              </template>
            </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="changePageTable"
          @current-change="changeCurrentPage"
          :current-page.sync="params.currentPage"
          :page-size="params.per_page"
          layout="prev, pager, next, jumper"
          :total="params.total"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="showDialog"
      v-loading="loadingDialog"
      :before-close="beforeCloseDialog"
      :visible.sync="showDialog"
      :title="lang.info_manage_shipping +' - '+ $lang[langId].custom">
      <el-form
        v-model="formData"
        label-width="220px">
        <el-form-item
          v-if="$route.query.international"
          :label="lang.country"
          prop="country">
          <el-select
            v-model="formData.shipping_countries"
            :remote-method="searchCountry"
            filterable
            remote
            multiple
            reserve-keyword>
            <el-option
              v-for="item in countries"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!$route.query.international"
          :label="lang.province"
          prop="province">
          <el-select
            v-model="formData.shipping_state_id"
            @change="searchCity"
            filterable
            remote
            reserve-keyword
            :remote-method="searchProvince">
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!$route.query.international"
          :label="lang.cities_destination"
          prop="city">
          <el-select
            v-model="formData.shipping_cities"
            multiple
            filterable
            remote
            reserve-keyword
            :remote-method="searchCity">
            <el-option
              v-for="item in cities"
              :key="item.id"
              :label="item.city"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-collapse v-model="weightCollapse">
          <el-collapse-item :title="lang.weight" name="1">
            <el-form-item :label="lang.weight_from" prop="weight_from">
              <el-input v-model="formData.weight_from" type="number" min="1">
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>

            <el-form-item :label="lang.weight_to" prop="weight_to">
              <el-input v-model="formData.weight_to" type="number" min="1">
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <div style="padding-top: 12px;" />

        <el-form-item prop="tariff" :label="lang.tariff">
          <template v-if="selectedStore.currency_id === 'IDR'">
            <div class="el-input el-input--small">
              <input-money v-model="formData.tariff" />
            </div>
          </template>
          <template v-else>
            <el-input type="number" min="1" v-model="formData.tariff" />
          </template>
        </el-form-item>

        <el-form-item prop="etd_days" :label="lang.estimated_delivery_days">
          <el-input type="number" min="1" v-model="formData.etd_days">
            <template slot="append">{{ lang.days }}</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="beforeCloseDialog">{{ lang.cancel }}</el-button>
        <el-button @click="save(formData)" type="success" icon="el-icon-check">{{ lang.save }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
const apiEndpoint = 'shippings/shippingrate'

export default {
  components: {
    InputMoney
  },
  data() {
    return {
      loading: true,
      loadingDialog: false,
      data: [],
      tmp: {},
      couriers: [],
      params: {
        per_page: 20,
        search: null,
        currentPage: 1,
        total: 0
      },
      showDialog: false,
      formData: {},
      provinces: [],
      cities: [],
      countries: [],
      weightCollapse: ['1'],
      isEditing: [],
      courierDetail: {},
      editCourier: false,
      loadingCourier: false,
      rowState: [],
      searchQuery: '',
      searchQueryCity: '',
      searchQueryCountry: '',
      form: {
        state_id: '',
        city_id: '',
        country_id: ''
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
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    pages () {
      return [
        {
          value: 5,
          label: '5 ' + this.$store.getters.lang.rows
        },
        {
          value: 10,
          label: '10 ' + this.$store.getters.lang.rows
        },
        {
          value: 20,
          label: '20 ' + this.$store.getters.lang.rows
        },
        {
          value: 50,
          label: '50 ' + this.$store.getters.lang.rows
        },
        {
          value: 100,
          label: '100 ' + this.$store.getters.lang.rows
        }
      ]
    }
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getData()
    },
    data(data) {
      let isEditing = []
      if (data.length > 0) {
        data.map(() => {
          isEditing.push(false)
        })
      }
      this.isEditing = isEditing
    }
  },
  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {...this.params}
      params.international = 0
      if (this.$route.query.international) {
        params.international = 1
      }
      params.courier_id = this.$route.params.id

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/bycourier'),
        headers,
        params
      }).then(response => {
        this.data = response.data.data
        this.rowState = this.data.map(row => {
          return { edited: false }
        })
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.params.total = 0
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    getCourier() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/getcourier'),
        headers,
        params: {
          search: ''
        }
      }).then(response => {
        this.couriers = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getCourierDetail() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let url = ''
      this.$route.query.international ? url = 'shippings/international/detail/' : url = 'shippings/domestic/detail/'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, url + this.$route.params.id),
        headers,
      }).then(response => {
        this.courierDetail = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    save(shippingRate) {
      this.loadingDialog = true

      let data = {...shippingRate}
      data.unit_weight = 'kg'
      data.courier_id = this.$route.params.id

      if (this.$route.query.international) {
        data.shipping_countries = data.shipping_countries.join(',')
        data.international = 1
      } else {
        data.shipping_cities = [...shippingRate.shipping_cities]
        data.shipping_cities = data.shipping_cities.join(',')
        data.international = 0
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/shippingrate/store'),
        headers,
        data
      }).then(response => {
        // this.data = response.data.data
        this.getData()
        this.creatingCustomShippingData = {}
        this.loadingDialog = false
        this.showDialog = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loadingDialog = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    udpate(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/updateattr/' + data.id),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    add() {
      this.getCourier()
      this.showDialog = true
    },
    remove(index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        international: 0,
        id: this.data[index].id
      }
      if (this.$route.query.international) {
        params.international = 1
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/delete'),
        headers,
        params
      }).then(() => {
        this.data.splice(index, 1)
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    searchProvince(query) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers,
        params: {
          search_column: 'name',
          search_text: query
        }
      }).then(response => {
        this.provinces = response.data.data
      })
    },
    searchCity(query) {
      this.cities = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers,
        params: {
          search_column: 'state_id',
          search_operator: '=',
          search_text: this.formData.shipping_state_id,
          per_page: 100
        }
      }).then(response => {
        this.cities = response.data.data
      })
    },
    searchCountry(query) {
      this.countries = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/getcountry'),
        headers,
        params: {
          search_column: 'name',
          search_text: query
        }
      }).then(response => {
        this.countries = response.data.data
      })
    },
    beforeCloseDialog() {
      this.resetDialogData()
      this.showDialog = false
    },
    resetDialogData() {
      this.formData = {}
      this.provinces = []
      this.cities = []
      this.isCreatingCustom = false
      this.creatingCustomShippingData = {}
    },
    beginUpdateTariff(data, index) {
      //
      this.isEditing = this.isEditing.map(() => {
        return false
      })
      this.isEditing[index] = true
      this.tmp = {...data}
      console.log(this.tmp)
    },
    cancelUpdateTariff(index) {
      //
      this.isEditing[index] = false
      this.tmp = {}
    },
    updateTariff(data, index) {
      //
      this.loading = true

      data.international = 0
      if (this.$route.query.international) {
        data.international = 1
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/shippingrate/updatetariff/' + data.id),
        headers,
        data
      }).then(response => {
        this.data[index] = response.data.data
        this.tmp = {}
        this.isEditing[index] = false
        this.loading = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    back() {
      this.$router.push({ path: '/settings/shippings' })
    },
    saveCourier () {
      this.loadingCourier = true

      let data = {
        international: 0,
        name: this.courierDetail.name
      }
      if (this.$route.query.international) {
        data.international = 1
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/updatename/' + this.courierDetail.courier_id),
        headers,
        data
      }).then(response => {
        this.courierDetail = response.data.data
        this.editCourier = false
        this.loadingCourier = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loadingCourier = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },

    editShipping (data) {
      this.formData = data
      this.$set(this.formData, 'shipping_cities', [this.formData.city_id])
      this.showDialog = true
    },

    handleEditRow(data, index) {
      this.rowState[index].edited = true
      this.searchQuery = data.state_name
      this.searchQueryCity = data.city_name
      this.searchQueryCountry = data.country_name
      this.form.state_id = data.state_id
      this.form.city_id = data.city_id
    },

    handleSimpanRow(index, row) {
      this.rowState[index].edited = false
      this.shippingSave(row)
    },

    pricetiersCancel(index) {
      this.rowState[index].edited = false
      this.form = {
        country_id: '',
        state_id: '',
        city_id: ''
      }
    },

    getProvinceSelect(item) {
      this.form.state_id = item.id
      this.searchQueryCity = ''
    },

    getCitySelect(item) {
      this.form.city_id = item.id
    },

    getCountrySelect(item) {
      this.form.country_id = item.id
    },

    searchProvinceEdit(query, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers,
        params: params
      }).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.provinces = response.data.data
        callback(this.provinces)
      }).catch(error => {
        console.log(error)
        this.provinces = []
        // this.loading = false
      })
    },

    searchCityEdit(query, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {}
      if (this.form.state_id) {
        params = {
          search_column: 'state_id',
          search_operator: '=',
          search_text: this.form.state_id,
          per_page: 100,
          search: query
        }
      } else {
        let params = {
          search: query
        }
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers,
        params: params
      }).then(response => {
        for (let i of response.data.data) {
          i.value = i.city
        }
        this.cities = response.data.data
        callback(this.cities)
      }).catch(error => {
        console.log(error)
        this.cities = []
        callback(this.cities)
        // this.loading = false
      })
    },

    searchCountryEdit(query, callback) {
      // this.countries = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/getcountry'),
        headers,
        params: params
      }).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.countries = response.data.data
        callback(this.countries)
      }).catch(error => {
        console.log(error)
        this.countries = []
        callback(this.countries)
        // this.loading = false
      })
    },

    shippingSave(row) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = row.id
      let data = {
        international: !this.$route.query.international ? 0 : 1,
        tariff: row.tariff,
        state_id: this.form.state_id ? this.form.state_id : row.state_id,
        shipping_city_id: this.form.city_id ? this.form.city_id : row.city_id,
        shipping_country_id: this.form.country_id ? this.form.country_id : row.country_id,
        weight_from: row.weight_from,
        weight_to: row.weight_to,
        unit_weight: row.unit_weight
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/shippingrate/updateallatribute/' + id),
        headers: headers,
        data: data
      })
        .then(response => {
          // this.responseUpdate = response.data
          this.form = {
            state_id: '',
            city_id: '',
            country_id: ''
          }
          this.loading = false
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.getData()
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
  },
  mounted() {
    this.getData()
    this.getCourierDetail()
  }
}
</script>

