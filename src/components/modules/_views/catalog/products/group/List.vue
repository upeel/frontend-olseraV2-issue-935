<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand handle">
        <i class="el-icon-rank"></i>
      </div>

      <div style="flex-grow: 1;">
        {{ item.name }} 
        <span v-if="item.total_product" class="grey">({{item.total_product}})</span>
      </div>

      <div>
        <button-action-authenticated :permission="['catalog/productgroups', 'edit']" type="text" @click="edit">
          edit
        </button-action-authenticated>
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

  methods: {
    edit() {
      this.$emit('edit', this.item)
    }
  }
}
</script>
