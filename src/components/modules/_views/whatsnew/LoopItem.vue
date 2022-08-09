<template>
  <div class="post-loop-item box-shadow-2">
    <lazy-image
      :src="computedData.feature_image"
      class="feature-image"
    />
    <div class="excerpt">
      <div class="font-18 font-bold title-ellipsis">
        {{ computedData.title }}
      </div>
      <div class="meta">
        <i class="el-icon-watch"></i> {{ computedData.date }}
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
