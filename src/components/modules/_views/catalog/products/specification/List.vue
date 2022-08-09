<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand">
        <i class="el-icon-rank"></i>
      </div>

      <div style="flex-grow: 1;">
        {{ item.name }} <span class="grey" v-if="item.total_product">({{item.total_product}})</span>
      </div>

      <div v-if="checkCustomPermission('catalog/specifications', 'edit')">
        <el-button type="text" @click="edit">
          edit
        </el-button>
      </div>
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
