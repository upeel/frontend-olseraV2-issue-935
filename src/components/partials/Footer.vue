<template>
  <footer class="main-footer">
    <div class="pull-right hidden-xs">
      <b>Version</b> 1
    </div>
    <vue-json-pretty
      v-if="env === 'development'"
      :data="lang"
      selectable-type="tree">
    </vue-json-pretty>
  </footer>

</template>

<script>
  import VueJsonPretty from 'vue-json-pretty'
  export default {
    name: 'DashboardFooter',
    components: {
      VueJsonPretty
    },
    computed: {
      lang() {
        return this.$store.state.userStores.lang
      }
    },
    data() {
      return {
        env: process.env.NODE_ENV
      }
    }
  }
</script>

