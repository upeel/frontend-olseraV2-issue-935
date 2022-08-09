<template>
  <div
    :class="'upgrade-banner__' + bannerType"
    class="upgrade-banner">
    <div
      class="upgrade-banner__main">
      <div
        v-if="closeAble"
        class="upgrade-banner__close"
        @click="handleClose">
        <svg-icon icon-class="x" />
      </div>
      <!-- <div
        v-if="usePromoTag"
        class="upgrade-banner__promo_tag">
        Promo Terbatas
      </div> -->
      <template v-if="!bannerType">
        <div class="font-bold font-32 color-blue-dark">
          Upgrade Paketmu <svg-icon icon-class="unlock" />
        </div>
        <div class="font-20">
          Sesuaikan kebutuhanmu dengan paket Olsera, mulai dari Rp 2.700-an/hari
        </div>
      </template>
      <template v-else-if="bannerType === 'accounting'">
        <div class="flex-container">
          <div style="flex-shrink: 0;" class="mr-8">
            <img src="/static/img/banner-pro-akuntansi/calculator.png" width="80" />
          </div>
          <div>
            <div class="font-24 font-semi-bold">Akuntansi</div>
            <div class="font-16">Pencatatan lengkap! Dari laba rugi hingga arus kas</div>
            <div
              v-if="visibleBannerDescription"
              class="font-16 highlight-banner-description">
              Tersedia di <strong>Olsera PRO</strong>, gratis uprade dari Premium
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="bannerType === 'tokopedia'">
        <div class="flex-container">
          <div style="flex-shrink: 0;" class="mr-8">
            <img src="/static/img/banner-pro-tokopedia/logo-tokopedia.png" width="80" />
          </div>
          <div>
            <div class="font-24 font-semi-bold">Integrasi Tokopedia</div>
            <div class="font-16">Jual di Tokopedia kelola di Olsera</div>
            <div
              v-if="visibleBannerDescription"
              class="font-16 highlight-banner-description">
              Tersedia di <strong>Olsera PRO</strong>, gratis uprade dari Premium
            </div>
          </div>
        </div>
      </template>
    </div>

    <div
      class="upgrade-banner__actions flex-container flex-container--wrap pointer"
      @click="handleUpgrade">
      <div class="flex-grow-1 flex-container">
        <div class="font-18 mr-8">Fitur ini tersedia di</div>
        <plan-type-chip
          v-for="planTypeId in computedUpperPlanTypeIds"
          :key="planTypeId"
          :plan-type-id="planTypeId"
        />
      </div>
      <div
        class="font-18">
        <template v-if="planType !== 'F' || selectedStore.is_store_can_upgrade_trial || selectedStore.pos_left_label === 'danger'">
          Pelajari lebih lanjut <svg-icon icon-class="arrow-right-circle" />
        </template>
        <template v-else>
          Coba gratis khusus Premium <svg-icon icon-class="arrow-right-circle" />
        </template>
      </div>
    </div>

    <dialog-global
      :show="visibleDialogFreeUpgradePro"
      :show-footer="false"
      custom-class="dialog-without-header mw-460"
      @close="visibleDialogFreeUpgradePro = false">
      <div class="text-center mb-12">
        <img
          :src="'/static/img/store-types/icon-plan-P.png'"
          width="72">
      </div>
      <div class="color-blue-dark font-bold text-center mb-12 font-18">
        Anda akan mengaktifkan Olsera Pro
      </div>
      <div class="text-center font-16 mb-12">
        <strong class="color-blue-dark">Olsera Pro</strong> dapat Anda gunakan gratis sampai dengan masa aktif Anda saat ini berakhir. Biaya perpanjangan Olsera Pro sebesar <strong>Rp 298.000 / bulan atau Rp 2.388.000 / tahun</strong>
      </div>
      <div class="text-center mb-12">
        <img src="/static/img/additional-banner-upgrade-premium-to-pro.png" />
      </div>
      <div class="mb-8">
        <el-button
          type="primary"
          class="btn-block"
          @click="doFreeUpgradePro">
          {{ lang.continue }}
        </el-button>
      </div>
      <div>
        <el-button
          class="btn-block"
          @click="visibleDialogFreeUpgradePro = false">
          {{ lang.cancel }}
        </el-button>
      </div>
    </dialog-global>
  </div>
</template>

<script>
import { getPlanTypeHasFeatureByRoute } from '@/utils/hiddenFeaturesByPlanType'
import PlanTypeChip from '@/components/modules/planType/PlanTypeChip.vue'
import DialogGlobal from '@/components/DialogGlobal'

export default {
  components: {
    PlanTypeChip,
    DialogGlobal
  },

  data() {
    return {
      bannerType: null,
      visibleDialogFreeUpgradePro: false
    }
  },

  computed: {
    planType() {
      return this.$store.getters.selectedStore.plan_type_id
    },
    computedUpperPlanTypeIds() {
      if (this.bannerType) {
        return ['P']
      } else {
        return getPlanTypeHasFeatureByRoute(this.$route.path)
      }
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores ? this.$store.state.userStores.lang : {}
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    closeAble() {
      const bannerTypes = ['tokopedia']
      return bannerTypes.includes(this.bannerType)
    },
    usePromoTag() {
      const bannerTypes = ['tokopedia', 'accounting']
      return (bannerTypes.includes(this.bannerType) && this.planType !== 'F')
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    visibleBannerDescription() {
      return this.selectedStore.is_store_can_upgrade_trial || (!this.selectedStore.is_store_can_upgrade_trial && this.selectedStore.plan_type_id !== 'F') || this.selectedStore.pos_left_label === 'danger'
    }
  },

  watch: {
    '$route.path': {
      immediate: true,
      handler(path) {
        // take out path !== '/accounting-third/accounting-software' setelah pro release
        if (path && path.includes('accounting') && path !== '/accounting-third/accounting-software') {
          this.bannerType = 'accounting'
        } else if (path && path.includes('service-activation-v2')) {
          this.bannerType = 'tokopedia'
        } else {
          this.bannerType = null
        }
      }
    }
  },

  methods: {
    handleUpgrade() {
      if (this.$store.getters.selectedStore.plan_type_id === 'F' && !this.selectedStore.is_store_can_upgrade_trial && this.selectedStore.pos_left_label !== 'danger') {
        this.visibleDialogFreeUpgradePro = true
        // if (this.bannerType) {
        //   window.open('https://docs.google.com/forms/d/e/1FAIpQLSe-C6petazJTATAHMgsgW3O2s7h4SKt5K1pSOubCGqX9wARgQ/viewform', '_blank')
        //   return
        // } else {
        //   this.visibleDialogFreeUpgradePro = true
        // }
      } else if (this.bannerType) {
        if (this.bannerType === 'tokopedia') {
          this.$router.push({
            path: '/whatsnew',
            query: {
              slug: 'olsera-x-tokopedia'
            }
          })
        } else if (this.bannerType === 'accounting') {
          this.$router.push({
            path: '/whatsnew',
            query: {
              slug: 'olsera-accounting'
            }
          })
        }
      } else {
        this.$router.push({
          path: '/extendstore',
          query: {
            path: this.$store.getters.selectedStore.store_id,
            redirect_to: this.$route.path,
            trial_upgrade: 0
          }
        })
      }
    },
    doFreeUpgradePro() {
      //
       window.open('https://docs.google.com/forms/d/e/1FAIpQLSe-C6petazJTATAHMgsgW3O2s7h4SKt5K1pSOubCGqX9wARgQ/viewform', '_blank')
    },
    handleClose() {
      this.$store.dispatch('toggleUpgradeBanner', false)
      document.getElementById('app').classList.remove('dummy-page')
    }
  }
}
</script>

<style lang="scss" scoped>
  .highlight-banner-description {
    background: rgba(#fff, 0.4);
    padding: 8px;
    border-radius: 10px;
  }
</style>
