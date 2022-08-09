<template>
  <div v-loading="loading">
    <div class="panel tab-list-secondary mb-0">
      <ul class="nav nav-tabs nav-tabs-line nav-tabs-shop-devin nav-tabs-secondary pointer" role="tablist">
        <li :class="{ active : active_el == 1 }" data-wow-delay="0.14s">
          <a @click="activateProfile" data-toggle="tab" aria-expanded="false">
            {{ lang.profile }}
          </a>
        </li>
        <li :class="{ active : active_el == 2 }" data-wow-delay="0.12s">
          <a @click="activateProduct" data-toggle="tab" aria-expanded="false">
            {{ lang.product }}
          </a>
        </li>
      </ul>
    </div>
    <div class="tab-content" style="margin-top:0;">
      <div v-bind:class="{'active in': isProfile}" v-if="isProfile">
        <supplier-profile></supplier-profile>
      </div>
      <div v-bind:class="{'active in': isProduct}" v-if="isProduct">
        <supplier-product></supplier-product>
      </div>
    </div>
  </div>
</template>

<script>
import SupplierProfile from './SupplierProfile'
import SupplierProduct from './SupplierProduct'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'SupplierDetailIndex',
  mixins: [checkCustomPermission],
  components: {
    SupplierProfile,
    SupplierProduct
  },

  data() {
    return {
      active_el: 1,
      isProfile: true,
      isProduct: false
    }
  },
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  beforeMount() {
    this.handleCustomPermissionSinglePage('customer/suppliers', 'show')
  },

  methods: {
    // loadData(data) {
    //   if (data) {
    //     this.customerData = data
    //   }
    // },
    initTabsState() {
      this.isProfile = false
      this.isProduct = false
    },
    activateProfile() {
      this.initTabsState()
      this.active_el = 1
      this.isProfile = true
    },
    activateProduct() {
      this.initTabsState()
      this.active_el = 2
      this.isProduct = true
    },
    activate: function(el) {
      this.active_el = el
    }
  }

  // mounted() {
  //   this.loadData()
  // }
}
</script>

