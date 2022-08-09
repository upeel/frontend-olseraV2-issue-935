<template>
  <div class="container-close-esc">
    <div v-if="!circle" class="close-esc">
      <template v-if="!hideEsc">
        <el-button
          v-if="listenEsc"
          type="info"
          size="mini"
          @click="handleClose">
          ESC
        </el-button>
      </template>
      <el-button
        v-if="!caretDown"
        type="text"
        @click="handleClose">
        <span class="font-24">
          <svg-icon icon-class="x" />
        </span>
      </el-button>
      <el-button
        v-else
        type="text"
        @click="handleClose">
        <i class="el-icon-arrow-down font-24 color-white"/>
      </el-button>
    </div>
    <div v-else>
      <el-button
        circle
        @click="handleClose"
        :class="computedBackground"
        style="box-shadow: 0px 3px 6px #0000001F;">
        <span class="font-24">
          <svg-icon icon-class="x" />
        </span>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listenEsc: {
      type: Boolean,
      default: true
    },
    circle: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    hideEsc: {
      type: Boolean,
      default: false
    },
    caretDown: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },

    esc($event) {
      if ($event.keyCode === 27) {
        // console.log($event.keyCode)
        this.handleClose()
      }
    }
  },

  mounted() {
    if (this.listenEsc && !this.hideEsc) {
      window.addEventListener('keyup', this.esc)
    }
  },

  computed: {
    computedBackground () {
      if (this.color === 'Primary') {
        return 'color-primary--bg color-white border border--primary'
      } else if (this.color === 'Blackview') {
        return 'bg-blackview color-white border border--black'
      } else {
        return ''
      }
    }
  },

  beforeDestroy() {
    if (this.listenEsc) {
      window.removeEventListener('keyup', this.esc)
    }
  }
}
</script>
