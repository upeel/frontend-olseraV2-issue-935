<template>
  <div v-loading="loading" class="innerpage-fullscreen">
    <div class="innerpage-fullscreen--header">
      <el-button
        class="innerpage-fullscreen--back"
        type="text"
        @click="handleClose">
        <svg-icon icon-class="arrow-left" />
      </el-button>
      <h4 class="innerpage-fullscreen--title">{{ title }}</h4>
    </div>

    <div
      class="innerpage-fullscreen--body">
      <div class="innerpage-fullscreen--sticky-top">
        <slot name="sticky-top" />
      </div>
      <slot />
      <div class="innerpage-fullscreen--sticky-bottom">
        <slot name="sticky-bottom" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Page Title'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    document.body.classList.add('overflow-hidden')
  },

  beforeDestroy() {
    document.body.classList.remove('overflow-hidden')
  },

  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
