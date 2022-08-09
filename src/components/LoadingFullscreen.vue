<template>
  <transition name="el-fade-in">
    <div
      v-if="show"
      class="loading-fullscreen">
      <div class="mb-16">
        <img width="64px" src="/static/img/logo-olsera-icon.png"/>
      </div>
      <loading-bar />
    </div>
  </transition>
</template>

<script>
import LoadingBar from './LoadingBar'
export default {
  components: {
    LoadingBar
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .loading-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 999;
  }
</style>
