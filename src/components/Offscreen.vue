<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div
          class="offscreen-right-sidebar--header color-white--bg"
          style="z-index: 10">
          {{ title }}
          <close-esc
            :hide-esc="hideEsc"
            @close="beforeClose"
          />
        </div>

        <div
          :style="{ ...styleBody }"
          class="offscreen-right-sidebar--body">
          <slot/>
        </div>

        <div
          v-if="!hideFooter"
          class="offscreen-right-sidebar--footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import CloseEsc from '@/components/modules/CloseEsc'

export default {
  components: {
    CloseEsc
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    hideEsc: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    styleBody: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    beforeClose() {
      this.$emit('close')
    }
  }
}
</script>
