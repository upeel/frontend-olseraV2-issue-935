<template>
  <section class="content scroll-container">
    <div v-if="checkDateForPopup && $route.path !== '/whatsnew-mobile'" class="banner-introduction">
      <div class="flex-container">
        <div class="mr-8">
          <svg-icon icon-class="icon-think-lamp" class="font-40"/>
        </div>
        <div class="flex-grow-1 font-bold font-16">
          Pelajari panduan awal penggunaan Olsera office
        </div>
        <el-button type="success" @click="showPopup2 = true">Panduan</el-button>
      </div>
    </div>

    <div class="mw-1056 whatsnew-lp">
      <div v-show="!singleData">
        <template v-for="(item, key) in firstData">
          <loop-item-first
            :data="item"
            :key="key"
            @click.native="handleSingleData(item)"
          />
        </template>

        <div class="font-bold mb-16">
          Sebelumnya
        </div>

        <el-row
          :gutter="12">
          <template
            v-for="(item, key2) in restData">
            <el-col
              v-if="checkArticleIsVisible(item) && key2 !== 0"
              :key="key2"
              :md="6">
              <loop-item
                :data="item"
                @click.native="handleSingleData(item)"
              />
            </el-col>
          </template>
        </el-row>
      </div>

      <single
        v-show="singleData"
        :data="singleData"
        @close="handleCloseSingle"
      />

      <welcome-popup
        :showPopup="showPopup"
        :step="1"
        @close="showPopup = false" />

      <welcome-popup-2
        :showPopup="showPopup2"
        :step="1"
        @close="showPopup2 = false" />

      <add-popup
        :showPopup="showAdd"
        @close="showAdd = false"
      />
    </div>
  </section>
</template>

<script>
import moment from 'moment'
import data from 'static/whatsnew/data'
import LoopItem from './LoopItem'
import LoopItemFirst from './LoopItemFirst'
import Single from './Single'
import { tracking } from '@/api/whatsnew'
import WelcomePopup from './welcomePopup.vue'
import WelcomePopup2 from './welcomePopup2.vue'
import AddPopup from './addPopup'

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  components: {
    LoopItem,
    LoopItemFirst,
    Single,
    WelcomePopup,
    WelcomePopup2,
    AddPopup
  },

  mixins: [basicComputedMixin],

  props: {
    propStore: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      data: [...data],
      singleData: null,
      setTracking: null,
      showPopup: false,
      showPopup2: false,
      showAdd: false
    }
  },

  computed: {
    firstData() {
      const data = [...this.restData]
      return data.splice(0, 1)
    },
    restData() {
      const data = [...this.data]
      const filtered = data.filter(item => {
        return (item.exclude_trial && !this.computedSelectedStore.is_store_can_upgrade_trial && this.computedSelectedStore.pos_left_label !== 'danger' && this.computedSelectedStore.plan_type_id !== 'L') || !item.exclude_trial
      })
      return filtered
    },
    newUser () {
      return this.$store.state.user.newUser
    },
    stageLevel() {
      // console.log(process.env.ENV_CONFIG)
      return process.env.ENV_CONFIG
    },
    checkDateForPopup () {
      if (this.selectedStore !== null) {
        var created = moment(this.selectedStore.created_time).subtract(1, 'd').format('YYYY-MM-DD')
        var current = moment().format('YYYY-MM-DD')
        var dateEnd = moment(created).add(15, 'd').format('YYYY-MM-DD')
        // return [created, current, dateEnd]
        var inDate = moment(current).isBetween(created, dateEnd)
        if (inDate && this.selectedStore.plan_type_id === 'L') {
          return true
        } else if (inDate && this.selectedStore.plan_type_id !== 'L') {
          if (this.selectedStore.is_store_can_upgrade_trial === 1) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return false
      }
    },
    computedSelectedStore() {
      if (this.propStore) {
        return this.propStore
      } else {
        return this.selectedStore
      }
    }
  },

  watch: {
    checkDateForPopup: {
      immediate: true,
      handler(payload) {
        if (payload) {
          document.body.classList.add('has-introduction')
        } else {
          document.body.classList.remove('has-introduction')
        }
      }
    }
  },

  mounted() {
    if (this.$route.query.slug !== '') {
      this.getDataFromSlug(this.$route.query.slug)
    }
    if (this.newUser) {
      this.showPopup = true
    }
  },

  methods: {
    async handleSingleData(item) {
      this.singleData = await { ...item }
      this.tracking()
      if (this.singleData.setting.new) {
        this.$store.commit('SET_WHATSNEW_HIGHLIGHT', false)
      }
    },
    handleCloseSingle() {
      this.singleData = null
      clearTimeout(this.setTracking)
    },
    tracking() {
      if (this.singleData) {
        this.setTracking = setTimeout(() => {
          tracking({
            slug: this.singleData.slug
          }).then(response => {
            //
          }).catch(() => {
            //
          })
        }, 5000)
      }
    },
    getDataFromSlug(slug) {
      this.data.map(i => {
        if (i.slug === slug) { this.handleSingleData(i)}
      })
    },
    checkArticleIsVisible(item) {
      return (item.exclude_trial && !this.computedSelectedStore.is_store_can_upgrade_trial && this.computedSelectedStore.pos_left_label !== 'danger' && this.computedSelectedStore.plan_type_id !== 'L') || !item.exclude_trial
    }
  }
}
</script>

<style lang="scss" scoped>
.has-introduction .whatsnew-lp {
  padding-top: 47px;
}
.banner-introduction {
  position: fixed;
  top: 60px;
  z-index: 99;
  left: 250px;
  right: 0;
  background: #FFF8C5;
  padding: 12px;
}
.sidebar-collapse {
  .banner-introduction {
    left: 60px;
  }
}
</style>
