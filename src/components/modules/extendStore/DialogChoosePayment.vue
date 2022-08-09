<template>
  <el-dialog
    :visible.sync.show="show"
    :show-close="false"
    :before-close="beforeClose"
    append-to-body
    title="Pembayaran"
    custom-class="mw-536">
    <div
      v-if="selectedPlanType"
      class="flex-container mb-16">
      <div class="flex-container flex-grow-1">
        <div class="mr-8">
          <el-avatar
            :alt="selectedPlanType.name"
            :size="48"
            :src="'/static/img/store-types/icon-plan-' + selectedPlanType.id + '.png'"
          />
        </div>
        <div>
          <div class="font-bold font-20">
            {{ selectedPlanType.name }}
          </div>
          <div class="color-info">Upgrade</div>
        </div>
      </div>
      <div class="text-right">
        <div class="color-info font-12">
          Total yang harus dibayar
        </div>
        <div class="font-bold font-20 color-blue-dark">
          {{ data.ftotal_amount }}
        </div>
        <div
          v-if="parseFloat(data.tax_amount) > 0"
          class="color-info font-12">
          *Termasuk PPN 11%
        </div>
      </div>
    </div>

    <div
      v-if="data && data.detail_upgraded_plan && data.detail_upgraded_plan.name_id"
      class="p-16 color-info--bg radius-10 box-shadow-4">
      <div class="flex-container flex-grow-1 mb-24">
        <div class="mr-8">
          <el-avatar
            :alt="selectedStore.name"
            :size="24"
            :src="selectedStore.logo"
          />
        </div>
        <div class="font-semi-bold font-18">
          {{ selectedStore.name }}
        </div>
      </div>
      <div class="px-8">
        <div class="flex-container">
          <div class="flex-grow-1">
            {{ data.detail_upgraded_plan.name_id }}
          </div>
          <div class="text-right">
            {{ data.ftotal_amount }}
          </div>
        </div>

        <div class="divider-dash"></div>

        <div class="flex-container mt-8">
          <div class="flex-grow-1">
            Subtotal
          </div>
          <div class="text-right">
            {{ data.sub_total }}
          </div>
        </div>
        <div class="flex-container mt-8">
          <div class="flex-grow-1">
            PPN 11%
          </div>
          <div class="text-right">
            {{ data.tax_amount }}
          </div>
        </div>
        <div class="flex-container mt-8">
          <div class="flex-grow-1">
            Rounding ({{ data.flag_round }})
          </div>
          <div class="text-right">
            {{ data.round_amount }}
          </div>
        </div>
        <div class="flex-container mt-8">
          <div class="flex-grow-1 font-bold">
            Total
          </div>
          <div class="text-right font-bold">
            {{ data.ftotal_amount }}
          </div>
        </div>
      </div>
    </div>

    <div
      slot="footer" class="dialog-footer">
      <el-button
        :loading="loading"
        type="primary"
        class="btn-block"
        @click="confirm">
        Bayar {{ data.ftotal_amount }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchPaymentModes } from '@/api/storeBilling'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    selectedPlanType: {
      type: Object,
      default: () => {}
    },
    selectedStore: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      paymentModes: []
    }
  },

  mounted() {
    this.doFetchPaymentModes()
  },

  methods: {
    doFetchPaymentModes() {
      fetchPaymentModes().then(response => {
        this.paymentModes = response.data.data
        // console.log(this.paymentModes)
      }).catch(error => {
        // console.log(error)
      })
    },
    beforeClose() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
