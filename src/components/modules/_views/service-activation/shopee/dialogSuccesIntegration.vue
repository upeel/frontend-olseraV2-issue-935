<template>
  <el-dialog
    :visible.sync="show"
    width="536px"
    class="dialog-shopee-authorization--success"
    append-to-body>
    <div class="text-center">
      <img
        src="/static/img/service-activation/shopee/success_integrate.png"
      />
      <div class="font-18 mt-24">Yeay ! 🎉 Integrasi Shopee dan Olsera berhasil!</div>
    </div>
    <div slot="footer" class="text-center">
      <div class="mt-24 color-shopee--bg p-8 color-white radius-50 flex-container justify-center pointer" @click="manageShopee">
        <div class="full-width flex-container justify-center">
          <img
            src="/static/img/shopee.png"
          />
          Shopee
        </div>
        <div class="container-icon mr-8">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'ShopeeSuccessIntegration',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    loadingSubmit: {
      type: Boolean,
      default: false
    }
  },

  mixins: [basicComputedMixin],

  methods: {
    manageShopee () {
      this.$emit('close')
      this.$router.push('service-activation-v2')
    }
  }
}
</script>