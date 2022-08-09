<template>
  <div class="wrapper-webview-downloading">
    Please wait while file being downloaded....
  </div>
</template>

<script>
export default {
  mounted() {
    /**
     * fallback
     */
    setTimeout(() => {
      this.$router.push({
        path: localStorage.getItem('olsbo_downloadfromurl'),
        query: {
          path: localStorage.getItem('olsbo_downloadfrompath'),
          lang: this.$store.state.userStores.langId
        }
      })
    }, 3000)
  }
}
</script>
