<template>
  <div class="dd-handle">
    <span class="hand">
      <i class="el-icon-rank"></i>
    </span>
    <el-row :gutter="10">
      <el-col :sm="18">
        {{ item.name }} 
        <p class="input-desc size-12 oldgrey" style="margin-bottom: 0; margin-top: 0;">
          {{ item.message }}
        </p>
      </el-col>
      <el-col :sm="6" class="text-right">
        <button-action-authenticated
          :permission="['website/pages', 'edit']"
          @click="edit" 
          size="mini"
          type="text" 
          icon="el-icon-edit-outline">
        </button-action-authenticated>
      </el-col>
    </el-row>
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
      let data = {...this.item}
      this.$emit('edit', data)
    }
  }
}
</script>
