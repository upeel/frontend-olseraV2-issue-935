<template>
  <div id="app" class="wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    window.userGuiding.hideChecklist()
  }
}
</script>
