<template>
  <div class="block mt-12 sticky-bottom">
    <el-pagination
      :current-page.sync="params.page"
      :page-size="params.per_page"
      :total="params.total"
      layout="total, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    autoScrollTo: {
      type: Number,
      default: 0
    }
  },

  methods: {
    handleSizeChange(payload) {
      this.$emit('size-change', payload)
    },
    handleCurrentChange(payload) {
      scrollTo(this.autoScrollTo, 800)
      this.$emit('current-change', payload)
    }
  }
}
</script>
