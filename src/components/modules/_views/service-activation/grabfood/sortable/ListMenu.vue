<template>
  <!-- <div class="like-table-wrapper"> -->
    <div class="like-table-wrapper--item">
      <div class="hand handle container-icon">
        <svg-icon icon-class="icon-sort"></svg-icon>
      </div>
      <div class="mr-8">
      <div>
        <el-avatar
          :src="item.detail.default_photo"
          :size="40"
          shape="square"
        />
      </div>
      </div>
      <div class="mr-8" style="flex-grow: 1;">
        <div class="font-bold font-14">
          {{ item.alias_name ? item.alias_name : item.detail.name }}
        </div>
        <div class="color-info font-12">
          <span v-if="item.alias_price">
            {{ item.falias_price }}
          </span>
          <span v-else>
            {{ item.detail.sell_price_pos }}
          </span>
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>
<script>
export default {
  components: { 
    // ListItem,
    // draggable
  },
  props: {
    item: {
      type: Object,
      default: null
    },
    visibleItem: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  methods: {
    sortsChanged () {
      this.$emit('changeitem', this.item.addon_items)
    }
  }
}
</script>
