<template>
  <div class="dd-handle">
    <span class="hand">
      <i class="el-icon-rank"></i>
    </span>
    <el-row :gutter="10">
      <el-col :sm="18">
        {{ item.name }} <br/>
        <span class="size-10 oldgrey">{{ item.table_name }}</span>
      </el-col>
      <el-col :sm="6" class="text-right">
        <button-action-authenticated 
          :permission="['settings/posrestolayout', 'show']"
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
      // let data = {...this.item}
      // this.$emit('edit', data)
      this.$router.push({path: '/restomode/posrestolayout/' + this.item.id})
    }
  }
}
</script>
