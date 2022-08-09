<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="12" v-for="(block, key) in blocks" :key="key">
        <block-nav
          :outlet="selectedStore.url_id"
          :position="block.position"
          :position-name="block.positionName"
          :position-desc="block.positionDesc" >
        </block-nav>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BlockNav from './BlockNav'

export default {
  components: {BlockNav},

  data() {
    return {
      blocks: [
        {id: 0, position: 'H', positionName: 'Header', positionDesc: this.$lang[this.$store.getters.selectedStore.lang_code].info_navigate_header},
        {id: 1, position: 'F', positionName: 'Footer', positionDesc: this.$lang[this.$store.getters.selectedStore.lang_code].info_navigate_footer}
      ]
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  }
}
</script>
