<template>
  <div class="wrapper-whatsnew-header">
    <div class="whatsnew-header-background"></div>
    <!-- -->
    <div class="whatsnew-header">
      <div
        v-if="computedData.setting.new && $store.state.whatsnewHighlight"
        class="tag-new">
        New
      </div>
      <div class="whatsnew-header__thumbnail">
        <lazy-image
          :src="computedData.feature_image"
          class="feature-image"
        />
      </div>
      <div class="whatsnew-header__excerpt">
        <div class="whatsnew-header__excerpt-title">
          {{ computedData.title }}
        </div>
        <div class="whatsnew-header__excerpt-meta">
          <i class="el-icon-watch"></i> {{ computedData.date }}
        </div>
        <div class="whatsnew-header__excerpt-excerpt">
          {{ computedData.excerpt }}
        </div>
        <div class="whatsnew-header__excerpt-readmore">
          Selengkapnya...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin]
}
</script>
