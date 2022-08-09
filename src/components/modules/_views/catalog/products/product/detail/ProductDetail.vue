<template>
  <div class="inner-page-navigation-wrapper">
    <div
      ref="innerPageNavigation"
      class="inner-page-navigation">
      <el-button @click="$router.push('/catalog/product')">
        {{ lang.back }}
      </el-button>
      <el-button
        :class="isProfile ? 'active' : ''"
        type="text"
        @click="activateProfile">
        {{ lang.profile }}
      </el-button>
      <el-button
        :class="isVariants ? 'active' : ''"
        type="text"
        @click="activateVariants">
        {{ lang.variant }}
      </el-button>
      <el-button
        :class="[
          isMaterials ? 'active' : '',
          methodRouteIsHiddenButtonClass('product-materials')
        ]"
        :disabled="methodFeatureNameIsHidden('product-materials')"
        type="text"
        @click="activateMaterials">
        {{ lang.material }}
      </el-button>
      <el-button
        :class="[
          isPriceTiers ? 'active' : '',
          methodRouteIsHiddenButtonClass('product-price-tier')
        ]"
        :disabled="methodFeatureNameIsHidden('product-price-tier')"
        type="text"
        @click="activatePriceTiers">
        {{ lang.price_tiers }}
      </el-button>
      <el-button
        v-if="userRole.is_pos_only !== 1"
        :disabled="methodFeatureNameIsHidden('product-related')"
        :class="[
          isRelateds ? 'active' : '',
          methodRouteIsHiddenButtonClass('product-related')
        ]"
        type="text"
        @click="relatedNotMore">
        {{ lang.related }}
      </el-button>
      <el-button
        :disabled="methodFeatureNameIsHidden('product-series')"
        :class="[
          isSeries ? 'active' : '',
          methodRouteIsHiddenButtonClass('product-series')
        ]"
        type="text"
        @click="seriesNotMore">
        {{ lang.serial }}
      </el-button>
      <el-button
        v-if="userRole.is_pos_only !== 1"
        :disabled="methodFeatureNameIsHidden('product-spec')"
        :class="[
          isSpecs ? 'active' : '',
          methodRouteIsHiddenButtonClass('product-spec')
        ]"
        type="text"
        @click="specNotMore">
        {{ lang.specification }}
      </el-button>
      <el-button
        v-if="selectedStore.pos_resto_mode === 1"
        :disabled="methodFeatureNameIsHidden('product-notes')"
        :class="[
          isNotes ? 'active' : '',
          methodRouteIsHiddenButtonClass('product-notes')
        ]"
        type="text"
        @click="notesNotMore">
        {{ lang.order_notes }}
      </el-button>
    </div>

    <div :class="{'active in': isProfile}" v-if="isProfile">
      <detail-profile ref="detailProfile" v-on:dataloaded="loadData"></detail-profile>
    </div>
    <div :class="{'active in': isVariants}" v-if="isVariants">
      <detail-varian :product-data="product"></detail-varian>
    </div>
    <div :class="{'active in': isRelateds}" v-if="isRelateds">
      <detail-terkait></detail-terkait>
    </div>
    <div :class="{'active in': isPriceTiers}" v-if="isPriceTiers">
      <detail-pricetiers></detail-pricetiers>
    </div>
    <div :class="{'active in': isMaterials}" v-if="isMaterials">
      <detail-material :product-data="product"></detail-material>
    </div>
    <div :class="{'active in': isSeries}" v-if="isSeries">
      <detail-seri></detail-seri>
    </div>
    <div :class="{'active in': isSpecs}" v-if="isSpecs">
      <detail-spesifikasi></detail-spesifikasi>
    </div>
    <div :class="{'active in': isNotes}" v-if="isNotes">
      <detail-note :form-data="product" @update="refreshData"></detail-note>
    </div>
  </div>
</template>
<script>
import DetailProfile from './ProductDetailProfile'
import DetailVarian from './ProductDetailVarian'
import DetailMaterial from './ProductDetailMaterial'
import DetailTerkait from './ProdukDetailTerkait'
import DetailPricetiers from './ProductDetailPricetiers'
import DetailSeri from './ProductDetailSeri'
import DetailSpesifikasi from './ProductDetailSpesifikasi'
import DetailNote from './ProductDetailNotes'
import PlanTypeChip from '@/components/modules/planType/PlanTypeChip'
// import data from '../../../../tutorial/data'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'DetailIndex',
  components: {
    DetailProfile,
    DetailVarian,
    DetailMaterial,
    DetailTerkait,
    DetailPricetiers,
    DetailSeri,
    DetailSpesifikasi,
    DetailNote,
    PlanTypeChip
  },

  mixins: [mixinHiddenFeatureByPlanType, checkCustomPermission],

  data() {
    return {
      product: {},
      active_el: 1,
      slideProduk: false,
      isTabMore: false,
      slideStyle: [
        {
          top: '150px',
          height: '70%'
        },
        {
          paddingTop: '4rem',
          paddingBottom: '1rem'
        },
        {},
        {
          color: '#555',
          textDecoration: 'none',
          top: '8px',
          left: '50%'
        }
      ],
      isProfile: true,
      isVariants: false,
      isSpecs: false,
      isSeries: false,
      isRelateds: false,
      isPriceTiers: false,
      isMaterials: false,
      isNotes: false
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  },

  beforeMount() {
    this.handleCustomPermissionSinglePage('catalog/products', 'show')
  },

  mounted() {
    this.loadData()
  },

  watch: {
    $route(to, from) {
      // react to route changes...
      if (to.params.id !== from.params.id) {
        // console.log(this.$refs.detailProfile)
        if (!this.isProfile) {
          this.activateProfile()
          this.$refs.detailProfile.loadData()
        } else {
          this.$refs.detailProfile.loadData()
        }
        
        // this.$router.push(to.fullPath)
      }
    }
  },

  methods: {
    loadData(data) {
      if (data) {
        this.product = data
      }
    },
    initTabsState() {
      this.isProfile = false
      this.isVariants = false
      this.isMaterials = false
      this.isPriceTiers = false
      this.isSpecs = false
      this.isSeries = false
      this.isRelateds = false
      this.isNotes = false
    },
    activateProfile() {
      this.initTabsState()
      this.active_el = 1
      this.isProfile = true
      this.isTabMore = false
    },
    activateVariants() {
      this.initTabsState()
      this.active_el = 2
      this.isVariants = true
      this.isTabMore = false
    },
    activateMaterials() {
      this.initTabsState()
      this.active_el = 3
      this.isMaterials = true
      this.isTabMore = false
    },
    activatePriceTiers() {
      this.initTabsState()
      this.active_el = 4
      this.isPriceTiers = true
    },
    specNotMore() {
      this.initTabsState()
      this.active_el = 5
      this.isSpecs = true
      this.isTabMore = false
    },
    seriesNotMore() {
      this.initTabsState()
      this.active_el = 6
      this.isSeries = true
      this.isTabMore = false
    },
    relatedNotMore() {
      this.initTabsState()
      this.active_el = 7
      this.isRelateds = true
      this.isTabMore = false
    },
    notesNotMore() {
      this.initTabsState()
      this.active_el = 8
      this.isNotes = true
      this.isTabMore = false
    },
    activate: function(el) {
      this.active_el = el
    },

    refreshData (data) {
      // this.$refs.detailProfile.loadData()
      console.log('aa', data)
      this.loadData(data)
    }
  }
}
</script>
