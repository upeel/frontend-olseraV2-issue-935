<template>
  <div class="pos-relative">
    <el-avatar
      :src="avatarSrc"
      :size="32"
      shape="square"
    />
    <el-avatar
      :size="20"
      :src="tagSrc"
      class="mr-4"
      style="position: absolute; left: 18px"
    />
  </div>
</template>

<script>
export default {
  props: {
    avatarSrc: {
      type: String,
      default: ''
    },
    tagSrc: {
      type: String,
      default: ''
    }
  }
}
</script>
