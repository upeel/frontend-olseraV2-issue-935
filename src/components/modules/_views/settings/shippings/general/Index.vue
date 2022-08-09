<template>
  <div class="shippings">
    <free/>
    <domestic/>
    <international/>
  </div>
</template>
<script>
import Domestic from './_domestic'
import International from './_international'
import Free from './_free'

export default {
  components: {
    Domestic,
    International,
    Free
  },
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  },
  watch: {
    '$store.getters.selectedStore': function () {
      this.getTest()
    }
  },
  methods: {
    getTest() {
      console.log('test', '')
    }
  }
}
</script>

