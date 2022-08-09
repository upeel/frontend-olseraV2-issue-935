<template>
  <div>
    <section class="content sales-list no-subpage">
      <div class="color-warning--bg flex-container radius-10 mb-24 p-18 warning-onlineorder-dashboard" style="height: 56px !important">
        <div>
          <svg-icon icon-class="ico-warning-online-order" class="font-40"/>
        </div>
        <div class="color-white full-width">
          Loyalty Point Baru ✨. ✔ Tukar Point dengan Produk. ✔ Atur hingga beberapa penukaran. Beralih ke versi baru sekarang!
        </div>
        <div class="text-right">
          <el-button class="color-warning color-warning--soft--bg" @click="showWarning = true">Pelajari</el-button>
        </div>
      </div>
      <el-card class="box-card">

        <div class="card-body flex-container">
          <div class="full-width font-18 font-bold">
            Loyalty Point
          </div>
          <div>
            <el-switch v-model="data.with_lpoint"
              @change="save(data)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </div>
        </div>
      </el-card>

      <el-alert class="oldgrey mb-24">
        <svg-icon icon-class="information-circle"></svg-icon>
        Setelah diaktifkan, masukkan loyalty point untuk setiap produk. 
        Masa berlaku loyalty point adalah 1 tahun dari tanggal pembelian
      </el-alert>

      <el-card class="box-card">
        <div slot="header">
          <el-row :gutter="10">
            <el-col :md="12">
              <h4>Konversi Penggunaan</h4>
            </el-col>
          </el-row>
        </div>

        <div class="card-body">
          <el-form v-model="data" label-position="top" :disabled="disabledForm"> 
            <el-row :gutter="10">
              <el-col :md="12">
                <el-form-item>
                  <div class="font-12 text-left">Besar Point</div>
                  <el-input @keyup.native.enter="save(data)" type="number" v-model="data.lpoint_redeem_point">
                    <template slot="append">Points</template>
                  </el-input>
                  <!-- <p class="size-12 input-desc oldgrey">
                    Total loyalty point yang digunakan
                  </p> -->
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <!-- <el-form-item label="Jumlah ditebus">
                  <el-input @change="save(data)" type="number" v-model="data.lpoint_redeem_amount">
                    <template slot="prepend">=</template>
                    <template slot="append">{{data.currency_name}}</template>
                  </el-input>
                  <p class="size-12 input-desc oldgrey">
                    Total tukar (uang) yang didapat
                  </p>
                </el-form-item> -->
                <el-form-item>
                  <div class="font-12 text-left">Diskon yang diperoleh</div>
                  <el-input v-model="discount" type="number" class="switch-discount" @keyup.native.enter="saveDiscount">
                    <template slot="append">
                      <el-radio-group v-model="discount_type" class="flex-container" @change="changeDiscount">
                        <el-radio-button class="lpoint-type" :label="0">
                          IDR
                        </el-radio-button>
                        <el-radio-button class="lpoint-type" :label="1">
                          %
                        </el-radio-button>
                      </el-radio-group>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="header">
          <el-row :gutter="10">
            <el-col :md="12">
              <h4>Customer</h4>
              <template
                v-if="data.valid_all_customer_types !== 1 && data.valid_customer_types">
                <p class="size-12 oldgrey" style="margin-bottom: 0;">
                  {{ data.valid_customer_types.length }} customer type(s)
                </p>
              </template>
            </el-col>
            <el-col :md="12" class="text-right">
              <template v-if="!isEditingCustomerTypes">
                <el-button
                  :disabled="disabledSave"
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editCustomerTypes">
                  Edit
                </el-button>
              </template>
              <template v-else>
                <el-button
                  :disabled="disabledSave"
                  size="small"
                  type="text"
                  @click="cancelEditCustomerTypes">
                  Cancel
                </el-button>
                <el-button
                  :disabled="disabledSave"
                  size="small"
                  icon="el-icon-check"
                  type="success"
                  @click="saveEditCustomerTypes">
                  Save
                </el-button>
              </template>
            </el-col>
          </el-row>
        </div>

        <div class="card-body">
          <template v-if="isEditingCustomerTypes || data.valid_all_customer_types === 0">
            <i class="el-icon-check"></i> Valid untuk tipe customer:
          </template>
          <div v-if="!isEditingCustomerTypes && data.valid_all_customer_types === 1">
            <el-alert
              title="valid for all customer types"
              type="success"
              show-icon>
            </el-alert>
          </div>
          <ul v-if="!isEditingCustomerTypes" 
            class="list-unstyled list-stripped list-table">
            <li 
              v-for="(item, idx) in data.valid_customer_types" 
              :key="idx"
              class="list-item-relative">
              <strong>{{item.name}}</strong>
            </li>
          </ul>
          <ul v-else 
            class="list-unstyled list-stripped list-table">
            <li 
              v-for="(item, idx) in tmp.valid_customer_types" 
              :key="idx"
              class="list-item-relative">
              <strong>{{item.name}}</strong>
              <span class="absolute-right">
                <el-button
                  @click="removeCustomerType(idx)"
                  type="text">
                  <i class="el-icon-close"></i>
                </el-button>
              </span>
            </li>
          </ul>
          <div v-if="isEditingCustomerTypes" class="add-discount-customer">
            <el-select
              style="width: 100%;"
              v-model="fresh.valid_customer_types"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Add customer types"
              :remote-method="searchCustomerTypes"
              :loading="searchingCustomerTypes">
              <el-option
                v-for="(item, idx) in searchResultCustomerTypes"
                :key="idx"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <hr/>
            <p class="input-desc oldgrey size-12">Valid untuk semua tipe customer</p>
            <el-switch 
              v-model="tmp.valid_all_customer_types"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </div>
        </div>
        </div>
      </el-card>
    </section>

    <el-dialog
      v-if="!isHiddenByFeature($store.getters.selectedStore.plan_type_id, '/settings/loyaltypoint')"
      :visible.sync="showWarning"
      :before-close="() => showWarning = false"
      width="536px"
      class="dialog-notif-online">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          Loyalty Point Baru ✨
        </h4>
      </div>
      <div class="px-8 mb-24">
        <div class="flex-container mb-16">
          <div><svg-icon icon-class="status_icon" class="font-24 mr-8"/></div>
          <div>Tukar point dengan Diskon dan Gratis Produk, Baru!</div>
        </div>
        <div class="flex-container mb-16">
          <div><svg-icon icon-class="status_icon" class="font-24 mr-8"/></div>
          <div>Sekarang Anda bisa mengatur beberapa penukaran point sekaligus</div>
        </div>
        <div class="flex-container mb-16">
          <div><svg-icon icon-class="information-circle" class="font-24 mr-8 color-warning"/></div>
          <div>Jika telah memutuskan menggunakan versi Baru, Anda tidak dapat menggunakan versi Lama kembali.</div>
        </div>
      </div>
      <div>
        <el-button type="primary" class="btn-block" @click="showAccept = true" >Gunakan Loyalty Point Baru</el-button>
        <el-button type="info" class="btn-block" @click="showWarning = false" >Tentukan nanti</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="!isHiddenByFeature($store.getters.selectedStore.plan_type_id, '/settings/loyaltypoint')"
      :visible.sync="showAccept"
      :before-close="closeAccept"
      :show-close="false"
      width="536px">
      <div slot="title" class="text-center font-18">
        Apakah Anda yakin beralih menggunakan Loyalty Point Baru?
      </div>
      <div>
        <el-button type="primary" class="btn-block" @click="handleAccept" :loading="loadingAccept">{{ lang.yes }}</el-button>
        <el-button type="info" class="btn-block" @click="showAccept = false" >{{ lang.back }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import SvgIcon from '../../../SvgIcon.vue'
import { useLpointRedeem } from '@/api/loyaltypoint'
import { isHiddenByFeature } from '@/utils/hiddenFeaturesByPlanType'
const apiEndPoint = 'loyaltypoint'

export default {
  components: { SvgIcon },
  data: function() {
    return {
      loading: true,
      disabledSave: false,
      disabledForm: false,
      isEditingCustomerTypes: false,
      searchingCustomerTypes: false,
      searchResultCustomerTypes: [],
      tmp: {},
      fresh: {
        valid_customer_types: []
      },
      data: {},
      discount_type: 0,
      discount: 0,
      showWarning: false,
      showAccept: false,
      loadingAccept: false,
      isHiddenByFeature
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
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    },
    data: {
      handler(data) {
        if (data.with_lpoint === 1) {
          this.disabledForm = false
        } else {
          this.disabledForm = true
        }
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    this.getData(true)
  },

  methods: {
    getData(showWarning = false) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, 'en', apiEndPoint),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        if (this.data.lpoint_redeem_discount_pct && this.data.lpoint_redeem_discount_pct !== 0) {
          this.discount = this.data.lpoint_redeem_discount_pct
          this.discount_type = 1
        } else {
          this.discount = this.data.lpoint_redeem_amount
          this.discount_type = 0
        }
        if (showWarning) {
          this.showWarning = !response.data.data.use_new_version_lpoint
        }
        this.loading = false
      }).catch(error => {
        this.data = []
        this.loading = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error
        })
      })
    },
    save(data) {
      this.loading = true
      this.disabledSave = true

      if (data.valid_all_customer_types === 1) {
        this.$delete(data, 'valid_customer_types')
      } else {
        data.valid_customer_types = data.valid_customer_types.map(item => {
          return item.id
        })
        data.valid_customer_types = data.valid_customer_types.join(',')
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, 'en', apiEndPoint + '/update'),
        headers: headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.getData()
        this.disabledSave = false
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
      }).catch(error => {
        this.disabledSave = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    saveCusomerTypes(data) {
      this.loading = true
      this.disabledSave = true
      this.searchResultCustomerTypes = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, 'en', apiEndPoint + '/update'),
        headers: headers,
        data
      }).then(response => {
        this.isEditingCustomerTypes = false
        this.fresh.valid_customer_types = []
        this.tmp = response.data.data
        this.data = response.data.data
        this.disabledSave = false
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
      }).catch(error => {
        this.isEditingCustomerTypes = false
        this.fresh.valid_customer_types = []
        this.tmp = {...this.data}
        this.disabledSave = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    searchCustomerTypes(query) {
      //
      this.searchingCustomerTypes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, 'en', 'customertype'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = []
        })
      }
    },
    removeCustomerType(idx) {
      //
      this.tmp.valid_customer_types.splice(idx, 1)
    },
    editCustomerTypes() {
      //
      this.isEditingCustomerTypes = true
      this.tmp = {...this.data}
      this.tmp.valid_customer_types = [...this.data.valid_customer_types]
    },
    cancelEditCustomerTypes() {
      //
      this.isEditingCustomerTypes = false
      this.tmp = {}
    },
    saveEditCustomerTypes() {
      let data = {...this.tmp}
      data.valid_customer_types = [...this.tmp.valid_customer_types]
      if (this.fresh.valid_customer_types.length > 0 || this.tmp.valid_all_customer_types === 0) {
        let newCustomerTypes = this.fresh.valid_customer_types
        let existCustomerTypes = [...this.tmp.valid_customer_types]
        existCustomerTypes = existCustomerTypes.map(item => {
          return item.id
        })
        let customerTypes = existCustomerTypes.concat(newCustomerTypes)
        let dataCustomerTypes = [...customerTypes]
        dataCustomerTypes = dataCustomerTypes.join(',')
        //
        data.valid_customer_types = dataCustomerTypes
        data.valid_all_customer_types = 0
      } else if (this.tmp.valid_all_customer_types === 1) {
        this.$delete(data, 'valid_customer_types')
      }
      this.saveCusomerTypes(data)
    },

    changeDiscount (data) {
      if (data === 0) {
        this.discount = this.data.lpoint_redeem_amount
      } else if (data === 1) {
        this.discount = this.data.lpoint_redeem_discount_pct
      }
    },

    saveDiscount () {
      if (this.discount_type === 0) {
        this.data.lpoint_redeem_amount = this.discount
        this.data.lpoint_redeem_discount_pct = 0
      } else if (this.discount_type === 1) {
        this.data.lpoint_redeem_discount_pct = this.discount
      }

      this.save(this.data)
    },

    closeAccept () {
      this.showAccept = false
    },

    handleAccept () {
      // this.$emit('accept')
      this.loadingAccept = true
      let data = {
        use_new_version_lpoint: 1
      }
      useLpointRedeem(data).then(response => {
        // this.statusData = response.data.data
        this.$emit('accept')
        this.showWarning = false
        this.loadingAccept = false
      }).catch(() => {
        this.showWarning = false
        // this.visibleDialogStatus = false
        this.loadingAccept = false
      })
    }
  }
}
</script>
