<template>
  <div>
    <close-esc @close="handleClose" style="display: block !important"/>
    <div class="wrapper-content">
      <div class="font-24 font-bold">
        {{ computedData.title }}
      </div>
      <div
        v-if="computedData.setting.single_show_excerpt"
        class="font-16 color-black">
        {{ computedData.excerpt }}
      </div>
      <div
        v-if="computedData.setting.single_show_date"
        class="font-12 color-info">
        <i class="el-icon-watch"></i> {{ computedData.date }}
      </div>

      <el-row
        :gutter="24"
        style="margin-top: 40px;">
        <el-col
          v-if="computedData.setting.single_show_feature"
          :md="computedCol"
          class="mb-24">
          <el-image
            :src="computedData.single_image"
            fit="cover"
            class="radius-24 border border--grey box-shadow mb-24 overflow-hidden pos-relative"
            style="width: 100%; height: 100%;"
          />
          <div v-if="computedData.content_bottom_single_feature_image">
            <div v-html="computedData.content_bottom_single_feature_image" />
          </div>
        </el-col>
        <el-col
          :md="computedCol">
          <div
            v-if="computedData.content"
            v-html="computedData.content"
          />
          <div
            v-if="!computedData.content && computedData.slug"
            class="iframe-container">
            <iframe
              :ref="'iframeContainer-' + computedData.slug"
              :src="'/static/whatsnew/content/' + computedData.slug + '/index.html'"
              frameborder="0"
              class="iframe-content"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
import CloseEsc from '@/components/modules/CloseEsc'
export default {
  mixins: [mixin],

  components: { CloseEsc },

  computed: {
    computedCol() {
      if (this.data && this.data.setting.fullwidth_thumbnail) {
        return 24
      } else {
        return 12
      }
    }
  },

  watch: {
    data(data) {
      if (data) {
        this.$nextTick(() => {
          this.handleIframe()
        })
      }
    }
  },

  methods: {
    handleIframe() {
      if (!this.computedData.content) {
        this.resizeIframe()
      }
    },
    handleClose() {
      this.$emit('close')
    },
    resizeIframe(e) {
      const theIframe = this.$refs['iframeContainer-' + this.computedData.slug]
      if (theIframe) {
        theIframe.onload = function(e) {
          theIframe.style.height = theIframe.contentWindow.document.body.scrollHeight + 80 + 'px'
        }
      }
    }
  }
}
</script>
