<template>
  <div class="webview-unauthorized">
    <data-empty
      :use-image="false"
      desc="The system can not be authorized, please try again"
    />
  </div>
</template>

<script>
import DataEmpty from '@/components/modules/DataEmpty.vue'
export default {
  components: {
    DataEmpty
  }
}
</script>

<style lang="scss" scoped>
  .webview-unauthorized {
    padding: 16px;
    margin: auto;
    width: 100%;
    max-width: 480px;
  }
</style>
