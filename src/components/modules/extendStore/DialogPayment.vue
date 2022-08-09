<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    :before-close="beforeClose"
    append-to-body
    width="680px"
    class="text-left">
    <div slot="title">
      <div class="font-24">{{ rootLang.payment }}</div>
    </div>

    <div class="box-shadow-3 p-8 radius-10" style="padding: unset">
      <div class="flex-container" style="align-items: unset !important">
        <div class="full-width border-list-extend py-12 color-info--bg">
          <div class="flex-container mb-8 ml-8">
            <el-avatar
              :src="store.logo"
              :size="24"
              style="margin-right: 6px;"
            />
            <div style="flex-grow: 1; text-align: left">
              <div class="font-18 font-semi-bold">{{ store.name }}</div>
            </div>
          </div>

          <ul style="list-style-type:none; margin-left: -30px">
            <div class="flex-container" >
              <div class="full-width">{{ data.package_pos_name }}</div>
            </div>
            <div class="flex-container mt-4" >
              <div class="full-width">{{ data.package_online_name }}</div>
            </div>
            <div class="flex-container mt-4" >
              <div class="full-width">{{ data.package_mobile_name }}</div>
            </div>
            <hr>
            <li >
              <div class="flex-container" >
                <div class="full-width">Subtotal</div>
                <div class="full-width text-right">{{ totalPrice.subtotal }}</div>
              </div>
            </li>
            <li >
              <div class="flex-container mt-4" >
                <div class="full-width">PPN 11%</div>
                <div class="full-width text-right">{{ totalPrice.ppn }}</div>
              </div>
            </li>
            <li >
              <div class="flex-container font-bold mt-4" >
                <div class="full-width">Total</div>
                <div class="full-width text-right">{{ totalPrice.total }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="full-width" style="padding: 10px;">
          {{ rootLang.total_to_be_paid }}
          <div class="font-24 font-semi-bold">{{ totalPrice.total }}</div>
          <span v-if="data.is_business_entity" class="font-12 color-grey--placeholder">*Termasuk PPN 11%</span>
        </div>
      </div>
    </div>

    <div
      style="margin-top: 24px"
      class="">
      <div class="font-semi-bold font-18">{{ rootLang.choose_payment_method }}</div>
      <div class="flex-container div-payment-metode pointer" @click="handleChoosePayment(5, {})">
        <div style="flex-grow: 1; text-align: left">
          <div class="font-semi-bold font-14">Transfer Bank Central Asia (BCA)</div>
        </div>
        <el-radio v-model="paymentMethod" :label="5"><span style="opacity: 0">5</span></el-radio>
      </div>
      <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
        <div class="font-semi-bold font-18 mt-24">Transfer Virtual Account</div>
        <template v-for="(item, key) in dataVa.detail">
        <div :key="key" class="flex-container div-payment-metode pointer" @click="handleChoosePayment(6, item)">
          <div style="flex-grow: 1; text-align: left">
            <div class="font-semi-bold font-14">{{ item.bank_code }} ( {{ item.bank_name }} )</div>
          </div>
          <el-radio v-model="paymentMethodVa" :label="item.id"><span style="opacity: 0">{{ item.id }}</span></el-radio>
        </div>
        </template>
      </template>
    </div>
    <el-button
      :loading="loading"
      :disabled="!paymentMethod"
      class="full-width mt-24 btn-block" 
      type="primary"
      @click="update">
      {{ rootLang.pay_now }}
    </el-button>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  props: ['show', 'store', 'totalPrice', 'data', 'loading', 'dataVa'],

  mixins: [basicComputedMixin],

  data() {
    return {
      paymentMethod: 1,
      paymentMethodVa: 0,
      selectedBank: {}
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

  methods: {
    update() {
      if (this.stageLevel === 'sit' || this.stageLevel === 'dev') {
        if (this.paymentMethodVa !== 0) {
          this.$emit('update', 6, this.selectedBank)
        } else {
          this.$emit('update', this.paymentMethod, this.selectedBank)
        }
      } else {
        this.$emit('update', this.paymentMethod, this.selectedBank)
      }
    },
    beforeClose() {
      this.$emit('close')
    },

    handleChoosePayment (idPayment, dataBank) {
      this.paymentMethod = idPayment
      if (idPayment !== 5) {
        this.selectedBank = dataBank
      } else {
        this.paymentMethodVa = 0
      }
    }
  }
}
</script>
