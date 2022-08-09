<template>
  <div v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="back" type="info"><i class="el-icon-back" /></el-button>
        <template v-if="dataShip">
          <template v-if="dataShip">
            {{ dataShip.name }}
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

      <el-table :data="data" stripe>
        <el-table-column :label="lang.postal_code" prop="postal_code" />
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

        <el-table-column :label="lang.weight">
          <template slot-scope="scope">
            {{ scope.row.weight_from }} - {{ scope.row.weight_to }} {{ scope.row.unit_weight }}
          </template>
        </el-table-column>

        <el-table-column :label="lang.remove">
          <template slot-scope="scope">
            <el-button @click="remove(scope.$index)" icon="el-icon-delete" type="text-danger" />
          </template>
        </el-table-column>
      </el-table>
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
          :label="lang.postal_code"
          prop="postal_code">
          <el-input v-model="formData.postal_codes" type="text" />
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
const apiEndpoint = 'shippingrate'

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
        per_page: 30
      },
      showDialog: false,
      formData: {},
      provinces: [],
      cities: [],
      countries: [],
      weightCollapse: ['1'],
      isEditing: [],
      dataShip: {}
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
      this.getShipment()

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/bycourier/' + this.$route.params.id),
        headers,
        params
      }).then(response => {
        this.data = response.data.data
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
    getShipment() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingpostalcodes/detail/' + this.$route.params.id),
        headers
      }).then(response => {
        this.dataShip = response.data.data
        // this.params.total = response.data.meta.total
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
    save(shippingRate) {
      this.loadingDialog = true

      let data = {...shippingRate}
      data.unit_weight = 'kg'
      data.courier_id = this.$route.params.id

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/store'),
        headers,
        data
      }).then(response => {
        this.getData()
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
          search_text: this.formData.shipping_state_id
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingrate/updatetariff/' + data.id),
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
      this.$router.push({ path: '/settings/shippings/postalcodes' })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

