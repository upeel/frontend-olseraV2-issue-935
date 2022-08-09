<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener('offline', () => {
      this.$notify({
        type: 'error',
        title: 'You\'re offline',
        message: 'Please check your internet connection'
      })
    })
    window.addEventListener('online', () => {
      this.$notify({
        type: 'success',
        title: 'You\'re back online',
        message: 'Please refresh the page'
      })
    })
  }
}
</script>
