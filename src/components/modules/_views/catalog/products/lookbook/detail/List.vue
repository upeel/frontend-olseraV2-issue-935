<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand">
        <i class="el-icon-rank"></i>
      </div>

      <div class="mr-8">
        <el-avatar :src="item.photo_md" />
      </div>
      <div>
        {{ item.name }}<br/>
        <span><i class="fa fa-tag fa-fw"></i></span> {{item.product_group_name}}
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
  }
}
</script>
