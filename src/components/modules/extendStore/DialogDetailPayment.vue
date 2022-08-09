<template>
  <div>
    <el-dialog
      fullscreen
      :visible.sync="show"
      :before-close="handleClose"
      :title="'Tagihan #' + data.billing_no"
      append-to-body
      class="dialog-detail-payment">
      <div class="mw-1020">
        <div class="radius-10 color-blue-dark-active--bg flex-container p-16 mb-24">
          <div class="flex-grow-1 font-18 color-white font-bold">
            Olsera Indonesia Pratama
          </div>
        </div>

        <div class="box-shadow border border--grey mb-16 bg-white p-16">
          <div class="mb-16">
            <div class="flex-container color-primary--soft--bg color-primary p-16 radius-10">
              <div class="mr-4">
                <svg-icon icon-class="clock" class="style-clock" style="font-size: 20px"/>
              </div>
              <div style="flex-grow: 1; text-align: left">
                <div class="font-semi-bold notif-text-style">{{ rootLang.complete_payment_before }}</div>
              </div>
              <div v-if="stageLevel === 'dev' || stageLevel === 'sit'">
                <el-button v-if="data.payment_mode_id === '5'" @click="handleConfirm" type="primary"> {{ rootLang.confirm_payment }} </el-button>
                <el-button v-else @click="handleDetailVa" type="warning"> {{ rootLang.payment }} </el-button>
              </div>
              <div v-else>
                <el-button @click="handleConfirm" type="primary"> {{ rootLang.confirm_payment }} </el-button>
              </div>
            </div>
          </div>

          <div class="text-left font-14 mb-16">
            <span>{{ rootLang.total_to_be_paid }}</span>
            <div class="border border--grey radius-10 p-16">
              <span class="font-semi-bold" style="font-size: 20px;">{{ data.ftotal_amount }}</span>
            </div>
          </div>

          <div class="text-left font-14 mb-16">
            <span>{{ rootLang.pay_to }}</span>
            <div class="border border--grey radius-10 p-16">
              <div class="font-20">{{ data.payment_mode.bt_bank_name }}</div>
              <div class="font-semi-bold font-20">{{ data.payment_mode.bt_account_no }}</div>
              <div class="font-20">{{ data.payment_mode.bt_account_name }}</div>
            </div>
          </div>
        </div>

        <div class="box-shadow border border--grey mb-16 bg-white p-16">
          <div class="font-20">{{ data.payment_mode.instructions}}</div>
        </div>

        <el-row
          :gutter="24">
          <el-col :sm="12">
            <el-button
              class="btn-block color-danger"
              @click="showBtnCancel = true">
              {{ rootLang.canceled }}
            </el-button>
          </el-col>
          <el-col :sm="12">
            <el-button
              class="btn-block"
              @click="visibleDialogDetailPayment = true">
              {{ rootLang.bill_detail }}
            </el-button>
          </el-col>
        </el-row>

        <dialog-detailva
          ref="detailva"
          :show="visibleDetailVa"
          :data="detailBilling"
          :loading="loadingConfirm"
          @confirm="setPaymentConfirm"
          @hide="visibleDetailVa = false"
        />

      </div>
    </el-dialog>

    <!-- dialog cancel -->
    <el-dialog
      :visible.sync="showBtnCancel"
      append-to-body
      custom-class="mw-348">
      <div class="text-center">
        <span>Apakah Anda yakin membatalkan transaksi?</span>
        <div style="margin-top: 24px">
          <el-button
            :loading="loading"
            type="danger"
            class="btn-block mb-8"
            @click="cancelUpgrade">
            {{ rootLang.canceled }}
          </el-button>
          <el-button
            class="btn-block mb-8"
            @click="showBtnCancel = false">
            {{ rootLang.back }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- dialog detail tagihan -->
    <dialog-trx-payment-detail
      :detail-billing="data"
      :table-total="tableTotal"
      :table-tax="tableTax"
      :show="visibleDialogDetailPayment"
      @close="visibleDialogDetailPayment = false"
    />

    <dialog-confirm
      :show="visibleDialogConfirm"
      :data="detailBilling"
      :loading="loadingConfirm"
      @confirm="setPaymentConfirm"
      @hide="visibleDialogConfirm = false"
    />

  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import DialogTrxPaymentDetail from '@/components/DialogTrxPaymentDetail'
import DialogConfirm from '@/components/DialogConfirm'
import DialogDetailva from './dialogDetailVa.vue'
import axios from 'axios'
import { BASE_URL } from '../../../http-common'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  mixins: [basicComputedMixin],

  components: {
    DialogTrxPaymentDetail,
    DialogConfirm,
    DialogDetailva
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    store() {
      return this.$store.state 
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    token() {
      return this.$store.state.user.token
    },
    tableTotal() {
      return [
        {
          total_qty: this.data.total_qty,
          fprice: '',
          ftotal_amount: this.data.ftotal_amount 
        }
      ]
    },
    tableTax () {
      return [
        {
          tax_amount: this.data.tax_amount,
          ftax_amount: this.data.ftax_amount 
        }
      ]
    }
  },

  data() {
    return {
      showBtnCancel: false,
      visibleDialogDetailPayment: false,
      visibleDialogConfirm: false,
      detailBilling: {},
      loading: false,
      loadingConfirm: false,
      visibleDetailVa: false
    }
  },

  methods: {
    cancelUpgrade() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: BASE_URL + 'api/admin/v1/id/billings/order/cancelled/' + this.data.id,
        headers: headers
      }).then(response => {
        // console.log('cancel billing', response)
        // this.$router.push('/selectstore')
        this.loading = false
        this.showBtnCancel = false
        this.show = false
        this.$emit('cancel-upgrade', this.data)
      }).catch(() => {
        // this.btnCreate = false
        this.loading = false
      })
    },

    handleClose() {
      this.visibleDialogDetailPayment = false
      this.showBtnCancel = false
      this.$emit('close')
    },

    handleConfirm() {
      this.visibleDialogConfirm = true
      this.detailBilling = this.data
    },

    handleDetailVa () {
      this.visibleDetailVa = true
      this.detailBilling = this.data
      this.detailBilling.payment_mode.data_va = JSON.parse(this.detailBilling.payment_mode.detail)
      this.$refs.detailva.setDataShowDetail(this.detailBilling)
    },

    setPaymentConfirm() {
      //
    }
  }
}
</script>
