<template>
  <div>
    <el-card class="box-card with-left-poster" v-loading="loading">
      <div class="left-poster domestic">
        <i class="fa fa-truck fa-4x" aria-hidden="true"></i>
        <h3>{{ lang.domestic_shipping }}</h3>
        <p>{{ lang.info_domestic_shipping }}</p>
      </div>

      <div class="floating-buttons text-right">
        <button-action-authenticated
          v-if="!isEditing"
          :permission="['settings/shippings', 'store']"
          type="success"
          icon="el-icon-plus"
          @click="add">
          {{ lang.add }}
        </button-action-authenticated>
        <el-button
          v-if="isEditing"
          type="info"
          @click="cancel">
          {{ lang.cancel }}
        </el-button>
        <el-button
          v-if="isEditing"
          type="success"
          icon="el-icon-check"
          @click="save">
          {{ lang.save }}
        </el-button>
      </div>

      <div
        v-if="!isEditing"
        class="shipping-desc">
        <div class="like-tr-wrapper">
          <div v-for="(item, key) in data" :key="key" v-loading="loading" class="like-tr clearfix">
            <div class="width-220 like-tr-item">
              <div class="clearfix">
                <div class="pull-left" style="width: 45px; height: 100%;">
                  <img :src="item.photo_xs" :alt="item.name" class="img-40 img-circle">
                </div>
                <div class="pull-left" @click="item.edit = !item.edit">
                  <strong v-if="!item.edit" @click="item.edit = !item.edit">{{ item.name }}</strong>
                  <el-input v-else v-model="item.name"></el-input>
                </div>
              </div>
            </div>

            <div v-if="!item.is_custom" class="width-140 like-tr-item">
              <div class="editable-field">
                <span class="size-12 editable-field-header">
                  {{ lang.additional_fee }}
                </span>
                <el-input @change="save(item)" :disabled="!checkCustomPermission('settings/shippings', 'edit')" v-model="item.additional_fee" type="number" size="small" :placeholder="$lang[langId].input_number" />
              </div>
            </div>

            <div v-if="item.has_service" class="width-140 like-tr-item">
              <div class="editable-field">
                <span class="size-12 editable-field-header">
                  {{ lang.filter_service_types }}
                </span>
                <el-input @change="save(item)" :disabled="!checkCustomPermission('settings/shippings', 'edit')" v-model="item.service_types" type="text" size="small" :placeholder="$lang[langId].please_input+lang.filter_service_types" />
              </div>
            </div>

            <div class="width-60 like-tr-item">
              <button-action-authenticated :permission="['settings/shippings', 'destroy']" @click="remove(item)" class="btn-delete" type="text" icon="el-icon-delete" size="default" />
            </div>

            <div v-if="item.is_custom" class="width-60 like-tr-item">
              <button-action-authenticated :permission="['settings/shippings', 'edit']" @click="showShippingRates(item)" type="text" class="btn-text" icon="el-icon-edit">{{ lang.tariff }}</button-action-authenticated>
            </div>
          </div>
        </div>
      </div>

      <el-form
        v-if="isEditing"
        class="form-sidebyside">
        <el-form-item :label="lang.shipping_courier">
          <el-input
            v-model="data.free_shipping_min_order_amount"
            :disabled="disabledField"
            type="number"
            min="1"
            style="max-width: 200px;"
          />
        </el-form-item>
      </el-form>

    </el-card>

    <el-dialog v-model="showDialog" v-loading="loadingDialog" :before-close="beforeCloseDialog" :visible.sync="showDialog" :title="$lang[langId].add_shipping_courier_custom">
      <div v-if="!isCreatingCustom">
        <div v-for="(item, key) in couriers" :key="key" @click="createShipping(item)" class="flex-container pointer border border--grey-border border--with-shadow mb-12 radius-10">
          <div class="container-icon">
            <svg-icon icon-class="truck"/>
          </div>
          <div class="full-width">{{ item.name }}</div>
          <div class="container-icon">
            <svg-icon icon-class="arrow-right"/>
          </div>
        </div>
      </div>

      <el-form v-if="isCreatingCustom" v-model="formData" label-width="220px">
        <el-form-item :label="lang.custom_shipping_courier_name" prop="name">
          <el-input type="text" v-model="formData.name" />
        </el-form-item>

        <hr/>

        <el-form-item :label="lang.province" prop="province">
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

        <el-form-item :label="lang.cities_destination" prop="city">
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

      <span v-if="isCreatingCustom" slot="footer" class="dialog-footer">
        <el-button @click="beforeCloseDialog">{{ lang.cancel }}</el-button>
        <el-button @click="asyncCreate(formData)" type="success" icon="el-icon-check">{{ lang.save }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
const apiEndpoint = 'shippings/domestic'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: {
    InputMoney
  },
  mixins: [checkCustomPermission],
  data() {
    return {
      loading: true,
      loadingDialog: false,
      isEditing: false,
      servedData: [],
      data: [],
      couriers: [],
      disabledButton: false,
      disabledField: false,
      params: {
        per_page: 30
      },
      showDialog: false,
      formData: {},
      provinces: [],
      cities: [],
      weightCollapse: ['1'],
      isCreatingCustom: false,
      creatingCustomShippingData: {}
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
    }
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getData()
    }
  },
  methods: {
    getData: function () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers,
        params: this.params
      }).then(response => {
        // console.log('data', response.data.data)
        this.servedData = response.data.data
        this.data = [...this.servedData]
        this.data.map(i => {
          if (i.is_custom) {
            i.edit = false
          }
        })
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.loading = false
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
          search: '',
          per_page: 30
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
    asyncCreate(data) {
      const promise = new Promise((resolve, reject) => {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/store'),
          headers,
          data: {
            courier_id: this.creatingCustomShippingData.id,
            international: 0,
            courier_name: data.name
          }
        }).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
      promise.then(response => {
        this.data.unshift(response.data.data)
        this.createShippingRate(data, response.data.data.id)
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    createShippingRate(shippingRate, courierId) {
      this.loadingDialog = true

      let data = {...shippingRate}
      data.unit_weight = 'kg'
      data.courier_id = courierId
      data.shipping_cities = [...shippingRate.shipping_cities]
      data.shipping_cities = data.shipping_cities.join(',')
      data.international = 0

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/shippingrate/store'),
        headers,
        data
      }).then(response => {
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
    create(data) {
      this.loadingDialog = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/store'),
        headers,
        data: {
          courier_id: data.id,
          international: 0,
          courier_name: data.name
        }
      }).then(response => {
        this.data.unshift(response.data.data)
        this.loadingDialog = false
        this.showDialog = false
        this.resetDialogData()
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
    save(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      data.international = 0
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/updateattr/' + data.courier_id),
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
    edit(row) {
      this.isEditing = true
      this.data = [...this.data]
      this.disabledField = false
    },
    cancel() {
      this.isEditing = false
      this.data = [...this.servedData]
      this.disabledField = true
    },
    remove(item) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippings/delete'),
        headers,
        params: {
          international: 0,
          courier_id: item.courier_id
        }
      }).then(response => {
        this.getData()
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
          search_text: this.formData.shipping_state_id
        }
      }).then(response => {
        this.cities = response.data.data
      })
    },
    createShipping(item) {
      if (item.is_custom) {
        this.creatingCustomShippingData = item
        this.isCreatingCustom = true
      } else {
        this.create(item)
      }
    },
    beforeCloseDialog() {
      this.resetDialogData()
      this.showDialog = false
    },
    showShippingRates(item) {
      // console.log(item)
      this.$router.push({path: '/settings/shippings/rates/' + item.courier_id})
    },
    resetDialogData() {
      this.formData = {}
      this.provinces = []
      this.cities = []
      this.isCreatingCustom = false
      this.creatingCustomShippingData = {}
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
