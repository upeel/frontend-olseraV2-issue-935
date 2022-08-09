<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :show-close="showClose"
    :custom-class="customClass"
    append-to-body>
    <div v-if="title" slot="title" class="flex-container">
      <h4 class="dialog-title flex-grow-1">
        {{ title }}
      </h4>
      <div class="btn_save_dialog text-right">
        <slot name="top-buttons">
          <close-esc :hide-esc="hideEsc" @close="handleClose" />
        </slot>
      </div>
    </div>
    <div class="dialog-global__content">
      <slot />
    </div>
    <div
      v-if="showFooter"
      slot="footer"
      class="dialog-footer">
      <slot name="footer" />
    </div>
  </el-dialog>
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
    showClose: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: null
    },
    customClass: {
      type: String,
      default: 'mw-536'
    },
    hideEsc: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
