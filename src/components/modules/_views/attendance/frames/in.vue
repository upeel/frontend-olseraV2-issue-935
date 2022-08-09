<template>
  <transition name="el-fade-in-linear">
    <div
      v-show="show"
      ref="FrameIn"
      :class="going ? 'attendance-frame--out' : 'attendance-frame--in'"
      class="attendance-frame">
      <div class="flex-container">
        <div v-if="data" class="human-attendance-info">
          <div class="human-attendance-info--label">
            <template v-if="!going">
              Datang
            </template>
            <template v-else>
              Pulang
            </template>
          </div>
          <div class="font-bold human-attendance-info--content">
            {{ data.clock_in }}
          </div>
        </div>
        <div class="human-walking">
          <img src="/static/img/attendance/human-walking.svg" alt="">
        </div>
        <div class="pintu">
          <div class="pintu--lubang" />
          <div class="pintu--daun" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: null
    },

    data: {
      type: Object,
      default: null
    },

    going: {
      type: Boolean,
      default: null
    },
  },

  watch: {
    show(payload) {
      if (payload) {
        setTimeout(() => {
          this.$refs.FrameIn.classList.add('animate-done')
        }, 500)
        setTimeout(() => {
          this.$emit('close')
        }, 1200)
      }
    }
  }
}
</script>
