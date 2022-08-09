<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand">
        <i class="el-icon-rank"></i>
      </div>

      <div style="flex-grow: 1;">
        {{ item.name }} 
        <span v-if="item.total_product" class="grey">({{item.total_product}})</span>
      </div>

      <el-button
        v-if="checkCustomPermission('catalog/collections', 'edit')"
        type="text"
        @click="edit">
        edit
      </el-button>
    </div>
  </div>
</template>

<script>
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },

  mixins: [checkCustomPermission],

  methods: {
    edit() {
      this.$emit('edit', this.item)
    }
  }
}
</script>
