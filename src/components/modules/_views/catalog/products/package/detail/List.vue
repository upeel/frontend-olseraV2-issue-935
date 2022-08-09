<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand">
        <i class="el-icon-rank"></i>
      </div>

      <div class="mr-4">
        <el-avatar
          :src="item.photo_md"
        />
      </div>

      <div>
        {{ item.product_name }}
        <div class="flex-container">
          <div>
            <div v-if="item.product_variant_id !== 0 && item.product_variant_name">
              <small>{{ lang.variant }}</small> {{ item.product_variant_name }}
            </div>
            <div v-if="item.product_variant_id === 0">
              <small>{{ lang.variant }}</small> {{ lang.all }}
            </div>
            <div>
              <small>{{ lang.qty }}</small> {{ item.qty }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  }

}
</script>
