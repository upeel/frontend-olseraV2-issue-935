<template>
  <vue-croppie
    ref="croppieRef"
    :viewport="viewport"
    :enable-resize="false"
    :mouse-wheel-zoom="false"
    @update="update"
    @result="result"
  />
</template>

<script>
import Vue from 'vue'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css'
Vue.use(VueCroppie)

export default {
  props: {
    viewport: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  methods: {
    update(data) {
      this.$emit('update', data)
    },
    result(data) {
      this.$emit('result', data)
    },
    refresh() {
      this.$refs.croppieRef.refresh()
    }
  }
}
</script>
