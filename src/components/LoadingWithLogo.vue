<template>
  <div class="loading-with-logo">
    <div class="mb-16">
      <img width="64px" src="/static/img/logo-olsera-icon.png"/>
    </div>
    <loading-bar />
  </div>
</template>

<script>
import LoadingBar from './LoadingBar'
export default {
  components: {
    LoadingBar
  }
}
</script>

<style lang="scss" scoped>
  .loading-with-logo {
    padding: 40px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
</style>
