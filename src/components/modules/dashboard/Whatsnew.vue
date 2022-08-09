<template>
  <div
    v-loading="loading"
    class="bg-white box-shadow mb-16 whatsnew-dashboard">
    <div class="flex-container p-16 pointer">
      <div class="font-18 font-bold full-width">
        <router-link to="/whatsnew">{{ rootLang.new_in }} Olsera</router-link>
      </div>
      <div> <i class="el-icon-arrow-right"/> </div>
    </div>
    <el-carousel
      :autoplay="false"
      trigger="click"
      indicator-position="none"
      class="carousel-whatsnew">
      <el-carousel-item
        v-for="(item, index) in dataNew"
        :key="index">
        <el-image
          :src="item.feature_image"
          fit="cover"
          class="pointer"
          @click="showInfo(index)"
        />
        <div class="p-8 mb-8">
          <div class="font-bold color-body full-width wrap-text wrap-text--width">
            {{ item.title }}
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      loading: false,
      dataNew: []
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.langId]
    },
  },

  mounted() {
    this.loading = true
    axios.get('/static/whatsnew/data.json').then(response => {
      this.dataNew = response.data
      this.dataNew = this.dataNew.filter(item => {
        return (item.exclude_trial && !this.selectedStore.is_store_can_upgrade_trial && this.selectedStore.pos_left_label !== 'danger' && this.selectedStore.plan_type_id !== 'L') || !item.exclude_trial
      })
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  },

  methods: {
    showInfo (index) {
      this.$router.push({
        path: '/whatsnew',
        query: {
          item: index
        }
      })
    }
  }
}
</script>
