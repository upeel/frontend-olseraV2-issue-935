<template>
  <div
    v-loading="loading"
    v-if="pendingData.length"
    class="flex-container color-warning--soft--bg color-warning p-16 radius-10 mb-24">
    <div class="mr-8">
      <svg-icon icon-class="clock" class="style-clock" style="font-size: 20px"/>
    </div>
    <div style="line-height: 1;">
      <div class="font-semi-bold notif-text-style">
        <span style="color: #000000">Anda memiliki Tagihan Tertunda dengan nomor </span>
        <el-button type="text" v-for="item in pendingData" :key="item.id" class="color-warning p-null" @click="showPendingBilling(item)">#{{ item.billing_no }}, </el-button>
        <span style="color: #000000"> Segera informasikan ke kami setelah melakukan pembayaran.</span>
      </div>
    </div>

    <dialog-trx-payment-detail
      :detail-billing="pendingBilling"
      :show="visibleDialogTrxPaymentDetail"
      :table-total="tableTotal"
      :table-tax="tableTax"
      @cancel-upgrade="cancelUpgrade"
      @close="cancelUpgrade"
    />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import DialogTrxPaymentDetail from '@/components/DialogTrxPaymentDetail'
import { HTTP } from 'src/http-common'

export default {
  mixins: [basicComputedMixin],

  components: {
    DialogTrxPaymentDetail
  },

  data() {
    return {
      loading: false,
      visibleDialogListBilling: false,
      visibleDialogTrxPaymentDetail: false,
      pendingBilling: false,
      pendingData: [],
      pendingBilling: {},
      tableTotal: {},
      tableTax: []
    }
  },

  watch: {
    selectedStore() {
      this.getPendingBilling()
    }
  },

  mounted() {
    this.getPendingBilling()
  },

  methods: {
    getPendingBilling() {
      var param = {
        search_column: 'status',
        search_text: 'P',
        sort_column: 'id',
        sort_type: 'desc'
      }
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        },
        params: param
      }
      HTTP.get('api/admin/v1/id/billings/order', paramsRequest).then(response => {
        this.pendingBilling = true
        this.pendingData = []
        response.data.data.map((i, idx) => {
          if (idx <= 2) {
            this.pendingData.push(i)
          }
        })
      }).catch(() => {
        this.pendingBilling = false
      })
    },

    showPendingBilling(data) {
      this.loading = true
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        }
      }
      HTTP.get('api/admin/v1/id/billings/order/' + data.id, paramsRequest).then(response => {
        this.loading = false
        this.pendingBilling = response.data.data
        this.visibleDialogTrxPaymentDetail = true
        this.tableTotal = [{
          total_qty: response.data.data.total_qty,
          fprice: '',
          ftotal_amount: response.data.data.ftotal_amount 
        }]
        this.tableTax = [
          {
            tax_amount: response.data.data.tax_amount,
            ftax_amount: response.data.data.ftax_amount 
          }
        ]
      }).catch(() => {
        this.loading = false
        // this.btnCreate = false
        // this.loadingBillingDetail = false
      })
    },

    cancelUpgrade() {
      this.getPendingBilling()
      this.visibleDialogTrxPaymentDetail = false
    }
  }
}
</script>
