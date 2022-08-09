<template>
  <el-dialog
    :visible.sync="show"
    :show-close="showClose"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    title="Apakah lokasi usaha Anda di Batam, Bintan, Karimun, dan Sabang?"
    custom-class="mw-536"
    append-to-body>
    <el-radio-group
      v-model="isHaveTax"
      class="radio-group-block input-right">
      <el-radio :label="0">
        Ya
      </el-radio>
      <el-radio :label="1">
        Tidak
      </el-radio>
    </el-radio-group>

    <template v-if="isHaveTax === 1">
      <div class="font-20 font-bold mb-8 mt-24">Bayar sebagai...</div>
      <el-radio-group 
        v-model="isBusinessEntity"
        class="radio-group-block input-right">
        <el-radio :label="0">
          Perseorangan
        </el-radio>
        <el-radio :label="1">
          Badan Usaha
          <div class="font-12 color-grey--placeholder">*akan dikenakan PPN 11%</div>
        </el-radio>
      </el-radio-group>
    </template>

    <div class="mt-8">
      <el-button
        :loading="loading"
        type="success"
        class="btn-block"
        @click="handlePayAfterTax">
        {{ rootLang.next }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'

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
    showClose: {
      type: Boolean,
      default: false
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      isHaveTax: 0,
      isBusinessEntity: null
    }
  },

  methods: {
    handlePayAfterTax() {
      this.$emit('next', {
        is_have_tax: this.isHaveTax,
        is_business_entity: this.isBusinessEntity
      })
    },
    setTaxOption (data) {
      this.isHaveTax = data
    },
    beforeClose() {
      this.$emit('close')
    }
  }
}
</script>
