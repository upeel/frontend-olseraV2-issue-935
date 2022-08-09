<template>
  <offscreen
    :show="show"
    :style-body="{
      paddingLeft: 0,
      paddingRight: 0
    }"
    hide-footer
    hide-esc
    title="Log Sync"
    @close="handleClose">
    <div class="like-table-wrapper border-null">
      <div
        v-for="(item, key) in logs"
        :key="key"
        class="like-table-wrapper--item">
        {{ item.action }}, {{ item.tanggal }}, {{ item.user }}
      </div>
    </div>
    <el-button
      :disabled="meta && parseInt(meta.current_page) >= parseInt(meta.last_page)"
      :loading="loading"
      class="btn-block mt-16"
      @click="handleLoadMore">
      Load more
    </el-button>
  </offscreen>
</template>

<script>
import Offscreen from '@/components/Offscreen'

export default {
  components: {
    Offscreen
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    logs: {
      type: Array,
      default: () => []
    },
    meta: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      //
    }
  },

  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleLoadMore() {
      this.$emit('load-more')
    }
  }
}
</script>
