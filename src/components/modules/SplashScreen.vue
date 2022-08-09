<template>
  <transition name="el-fade-in-linear">
    <div
      v-if="visibleSplashScreen"
      id="olsera-splash-screen">
      <div style="text-align: center;">
        <div>
          <img src="/static/img/olsera-office.png" />
        </div>
        <div>
          Please wait...
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SplashScreen',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visibleSplashScreen: true
    }
  },
  watch: {
    loading: {
      immediate: true,
      handler(loading) {
        if (!loading) {
          setTimeout(() => {
            this.visibleSplashScreen = false
          }, 1000)
        } else {
          this.visibleSplashScreen = loading
        }
      }
    }
  }
}
</script>
