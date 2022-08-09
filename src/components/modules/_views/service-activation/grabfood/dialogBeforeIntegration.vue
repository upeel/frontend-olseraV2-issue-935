<template>
  <el-dialog
    :visible.sync="show"
    :before-close="cancel"
    :title="rootLang.integration_grabfood"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div class="flex-container no-flex-sm">
      <div
        style="flex-basis: 50%"
        class="flex-container flex-container--content-center color-grabfood--bg">
        <img
          width="264"
          src="/static/img/service-activation/form-activation.svg">
      </div>
      <div class="p-24" style="flex-basis: 50%">
        <div class="like-list">
          <div class="like-list--item">
            <span><i class="el-icon-user"></i></span>
            {{ rootLang.grabfood_desc_1 }}
          </div>
          <div class="like-list--item">
            <span><i class="el-icon-date"></i></span>
            <div>
              {{ rootLang.grabfood_desc_2 }}
            </div>
          </div>
          <div class="like-list--item">
            <span><i class="el-icon-check"></i></span>
            <div>
              {{ rootLang.grabfood_desc_3 }}
            </div>
          </div>
        </div>
        <el-button
          class="btn-block color-grabfood--bg color-white"
          @click="submit">
          {{ rootLang.ok_integrate_now }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'GrabfoodDialogBeforeIntegration',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  mixins: [basicComputedMixin],

  methods: {
    cancel() {
      this.$emit('cancel')
    },

    submit() {
      this.$emit('submit')
    }
  }
}
</script>
