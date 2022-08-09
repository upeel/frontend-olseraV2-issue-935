<template>
  <el-image
    v-loading="loading"
    :src="src"
    :fit="fit"
    @load="loading = false">
  </el-image>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null
    },
    fit: {
      type: String,
      default: 'cover'
    }
  },

  data() {
    return {
      loading: true
    }
  }
}
</script>
