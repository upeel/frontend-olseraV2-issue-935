<template>
  <el-dialog
    :visible.sync="show"
    :before-close="beforeClose"
    custom-class="mw-460 bg-primary--dialog"
    append-to-body>
    <div slot="title" style="color: #FFFFFF">
      <div class="font-24">Pilih Paket</div>
    </div>

    <div
      v-loading="loading"
      v-for="moduleList in modulesList"
      :key="moduleList.type"
      class="color-white--bg radius-10 mb-16 py-16">
      <div
        class="flex-container px-16 pointer"
        @click.stop="moduleList.show = !moduleList.show">
        <div class="mr-16">
          <el-avatar
            :src="'/static/img/store-types/' + moduleList.icon"
            :size="40"
          />
        </div>
        <div class="font-bold font-16 color-black flex-grow-1">
          {{ moduleList.name }}
        </div>
        <el-button
          :class="tempPackage[moduleList.model] !== null ? 'color-danger' : ''"
          type="text"
          class="font-20 p-null"
          @click.stop="tempPackage[moduleList.model] = null, moduleList.show = !moduleList.show">
          <svg-icon :icon-class="tempPackage[moduleList.model] !== null ? 'x' : 'plus'" />
        </el-button>
      </div>
      <el-radio-group
        v-model="tempPackage[moduleList.model]"
        v-show="moduleList.show"
        class="full-width mt-8">
        <el-radio
          v-for="option in $data[moduleList.arr]"
          :key="option.id"
          :label="option.id"
          class="radio-custom full-width"
          style="padding-left: 24px;">
          <div class="flex-container">
            <div class="flex-grow-1">{{ option.package_option_name }}</div>
            <div v-if="moduleList.type === 'plant_type'">
              IDR <span v-mask-money="option.price" />
            </div>
          </div>
        </el-radio>
      </el-radio-group>
    </div>

    <div class="flex-container color-white font-18 mt-16">
      <div style="flex-grow: 1;">Total</div>
      <div class="font-bold">{{ totalPrice.total }}</div>
    </div>

    <el-button
      :disabled="computedDisablePayNow"
      class="btn-block mt-16"
      @click="handlePayNow">
      {{ rootLang.pay_now }} →
    </el-button>

    <dialog-tax-option
      :show="visibleDialogTaxOption"
      @close="visibleDialogTaxOption = false"
      @next="handlePayAfterTax"
    />

    <dialog-payment
      :loading="loadingOrder"
      :data="tempPackage"
      :total-price="totalPrice"
      :store="activeStore"
      :show="visibleDialogPayment"
      :data-va="dataVaBank"
      @update="postUpdate"
      @close="visibleDialogPayment = false"
    />
  </el-dialog>
</template>

<script>
import DialogPayment from '@/components/modules/extendStore/DialogPayment'
import DialogTaxOption from '@/components/modules/extendStore/DialogTaxOption'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import { HTTP } from '@/http-common'
import { fetchBillingPackagesByStoreId, fetchListVABank } from '@/api/storeBilling'

export default {
  components: {
    DialogPayment,
    DialogTaxOption
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    planType: {
      type: Object,
      default: () => {}
    },
    activeStore: {
      type: Object,
      default: () => {}
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      showPremiumPackage: false,
      showMobilePackage: false,
      showOnlinestorePackage: false,
      tempPackage: {
        pos_package_id: null,
        online_package_id: null,
        mobile_package_id: null,
        is_business_entity: null
      },
      onlineList: [],
      mobileList: [],
      planTypeList: [],
      selectedPlanType: {},
      modulesList: [
        {
          type: 'plant_type',
          name: '',
          arr: 'planTypeList',
          model: 'pos_package_id',
          icon: '',
          show: true
        },
        {
          type: 'online',
          name: 'Toko Online',
          arr: 'onlineList',
          model: 'online_package_id',
          icon: 'icon-with-ol.png',
          show: false
        },
        {
          type: 'mobile',
          name: 'Toko Mobile',
          arr: 'mobileList',
          model: 'mobile_package_id',
          icon: 'icon-with-mobile.png',
          show: false
        }
      ],
      isHaveTax: false,
      visibleDialogPayment: false,
      visibleDialogTaxOption: false,
      loadingOrder: false,
      dataVaBank: []
    }
  },

  computed: {
    totalPrice() {
      let total = 0
      let ppn = 0
      let totalplusppn = 0
      this.modulesList.map(item => {
        if (this.tempPackage[item.model]) {
          // console.log(this.tempPackage)
          const findPrice = this[item.arr].find(list => {
            return list.id === this.tempPackage[item.model]
          })
          let xkey = 'price'
          if (item.type !== 'plant_type') {
            xkey = 'amount'
          }
          if (findPrice) {
            total = total + parseFloat(findPrice[xkey])
          }
        }
      })
      if (this.tempPackage.is_business_entity) {
        ppn = total * 0.11
      }
      totalplusppn = total + ppn
      var formatter = new Intl.NumberFormat('id', {
        style: 'currency',
        currency: 'IDR',
      })
      let data = {
        subtotal: formatter.format(total),
        total: formatter.format(totalplusppn),
        ppn: formatter.format(ppn),
        xtotal: totalplusppn
      }
      return data
    },
    computedDisablePayNow() {
      // console.log(this.totalPrice)
      if (this.totalPrice.xtotal <= 0) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    show: {
      immediate: true,
      handler(show) {
        if (show) {
          this.getPosPackage()
          this.selectedPlanType = { ...this.planType }
          this.$set(this.modulesList, 0, {
            ...this.modulesList[0],
            name: this.selectedPlanType.name,
            icon: 'icon-plan-' + this.selectedPlanType.id + '.png'
          })
          this.planTypeList = []
          if (this.selectedPlanType.billing_ids) {
            this.selectedPlanType.billing_ids.map(item => {
              this.planTypeList.push({
                id: item.id,
                package_option_name: item.name,
                price: item.price
              })
            })
          }
        } else {
          this.resetForm()
        }
      }
    }
  },

  methods: {
    beforeClose() {
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.isHaveTax = null
      this.selectedPlanType = {}
      this.tempPackage = {
        pos_package_id: null,
        online_package_id: null,
        mobile_package_id: null,
        is_business_entity: null
      }
    },
    getPosPackage() {
      this.loading = true
      const params = {
        storeId: this.selectedStore.store_id,
        planTypeId: this.planType.id
      }
      fetchBillingPackagesByStoreId(params).then(response => {
        this.onlineList = []
        this.mobileList = []
        if (response.data.data && response.data.data.length) {
          const onlineList = response.data.data[0].list.find(item => {
            return item.name_key === 'TOL'
          })
          this.onlineList = onlineList ? onlineList.package : []
          const mobileList = response.data.data[0].list.find(item => {
            return item.name_key === 'TMB'
          })
          this.mobileList = mobileList ? mobileList.package : []
        }
        this.loading = false
      }).catch(() => {
        //
        this.loading = false
      })
    },
    handlePayNow() {
      this.visibleDialogTaxOption = true
    },
    handlePayAfterTax(payload) {
      this.getListVABank()
      this.tempPackage.is_business_entity = payload.is_business_entity
      this.isHaveTax = payload.is_have_tax
      this.visibleDialogPayment = true
      this.visibleDialogTaxOption = false
    },
    postUpdate(payment_id, dataBank) {
      console.log('loggg', dataBank)
      this.loadingOrder = true
      let pid = []
      if (this.tempPackage.pos_package_id) {
        pid.push(this.tempPackage.pos_package_id)
      }
       if (this.tempPackage.mobile_package_id) {
        pid.push(this.tempPackage.mobile_package_id)
      }
       if (this.tempPackage.online_package_id) {
        pid.push(this.tempPackage.online_package_id)
      }
      const paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        }
      }
      const data = {
        store_id: this.activeStore.store_id,
        payment_mode_id: payment_id,
        package_id: pid.join(','),
        is_business_entity: this.tempPackage.is_business_entity,
        bank_code: null
      }

      if (payment_id !== 5) { data.bank_code = dataBank.bank_code }
      
      HTTP.post('api/admin/v1/id/billings/order', data, paramsRequest).then(response => {
        this.visibleDialogUpgrade = false
        this.visibleDialogPayment = false
        this.isHaveTax = null
        this.loadingOrder = false
        this.$emit('done', response.data.data)
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: error.message
        })
        // this.btnCreate = false
        this.loadingOrder = false
      })
    },

    async getListVABank () {
      await fetchListVABank().then(response => {
        console.log('resp', response)
        this.dataVaBank = response.data.data[1]
        this.dataVaBank.map(i => {
          i.selected = false
        })
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: error.message
        })
        // this.btnCreate = false
        this.loadingOrder = false
      })
    }
  }
}
</script>
