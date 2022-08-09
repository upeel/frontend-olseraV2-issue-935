<template>
  <div v-loading="loadingDetail" class="inner-page-navigation-wrapper">
    <div
      ref="innerPageNavigation"
      class="inner-page-navigation">
      <el-button
        type="text"
        :class="isProfile ? 'active' : ''"
        @click="activateProfile">
        {{ lang.profile }}
      </el-button>
      <el-button
        type="text"
        :class="isOrder ? 'active' : ''"
        @click="activateOrder">
        {{ lang.orders }}
      </el-button>
      <el-button
        type="text"
        :class="isItems ? 'active' : ''"
        @click="activateItem">
        {{ lang.item }}
      </el-button>
      <el-button
        type="text"
        :class="isReturn ? 'active' : ''"
        @click="activateReturn">
        {{ lang.returns }}
      </el-button>
      <el-button
        type="text"
        :disabled="methodFeatureNameIsHidden('customer-loyaltypoint')"
        :class="isLoyaltyPoints ? 'active' : ''"
        @click="activateLoyaltyPoint">
        {{ lang.loyalty_point }}
      </el-button>
    </div>

    <div class="tab-content" style="margin-top: 0;">
      <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isProfile}" v-if="isProfile">
        <customer-profile :dataDetail="profileData" @back="backDetail" @deleteBack="deleteDetail"></customer-profile>
      </div>
      <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isOrder}" v-if="isOrder">
        <customer-order :root-id="idDetail"></customer-order>
      </div>
      <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isItems}" v-if="isItems">
        <customer-items :root-id="idDetail"></customer-items>
      </div>
      <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isReturn}" v-if="isReturn">
        <customer-return :root-id="idDetail"></customer-return>
      </div>
      <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isLoyaltyPoints}" v-if="isLoyaltyPoints">
        <customer-loyalty :root-id="idDetail"></customer-loyalty>
      </div>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

import CustomerProfile from './CustomerProfile'
import CustomerOrder from './CustomerOrder'
import CustomerItems from './CustomerItems'
import CustomerReturn from './CustomerReturn'
import CustomerLoyalty from './CustomerLoyaltyPoints'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'

export default {
  name: 'CustomerDetailIndex',
  props: ['detailId'],
  components: {
    CustomerProfile,
    CustomerOrder,
    CustomerItems,
    CustomerReturn,
    CustomerLoyalty
  },
  mixins: [mixinHiddenFeatureByPlanType],
  data() {
    return {
      loadingDetail: false,
      active_el: 1,
      isProfile: false,
      isOrder: false,
      isLoyaltyPoints: false,
      isReturn: false,
      isItems: false,
      idDetail: null,
      profileData: {}
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getProfileData()
    }
  },
  created() {
    this.idDetail = this.detailId
    if (this.$route.params.id) {
      this.idDetail = this.$route.params.id
    }
    this.getProfileData()
    this.activate()
  },

  mounted() {
    this.$nextTick(() => {
      this.affix()
      window.addEventListener('resize', this.affix)
    })
  },

  methods: {
    affix() {
      const ref = this.$refs.innerPageNavigation
      if (ref) {
        const parentWidth = ref.parentElement.offsetWidth
        ref.style.width = parentWidth + 'px'
      }
    },
    // loadPage() {
    //   this.getProfileData()
    //   this.isProfile = true
    // },
    initTabsState() {
      this.isProfile = false
      this.isOrder = false
      this.isItems = false
      this.isReturn = false
      this.isLoyaltyPoints = false
    },
    activateProfile() {
      this.initTabsState()
      this.active_el = 1
      this.isProfile = true
    },
    activateOrder() {
      this.initTabsState()
      this.active_el = 2
      this.isOrder = true
    },
    activateItem() {
      this.initTabsState()
      this.active_el = 3
      this.isItems = true
    },
    activateReturn() {
      this.initTabsState()
      this.active_el = 4
      this.isReturn = true
    },
    activateLoyaltyPoint() {
      this.initTabsState()
      this.active_el = 5
      this.isLoyaltyPoints = true
    },
    activate: function(el) {
      this.active_el = el
      this.isProfile = true
    },
    getProfileData() {
      this.loadingDetail = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          'customer/' + this.idDetail
        ),
        headers: headers
      })
        .then(response => {
          this.profileData = response.data.data
          this.loadingDetail = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadingDetail = false
          console.log(error)
        })
    },
    backDetail() {
      this.profileData = {}
      this.$emit('back')
    },
    deleteDetail() {
      this.profileData = {}
      this.$emit('delete')
    }
  }
}
</script>

