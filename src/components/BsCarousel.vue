<template>
  <div
    v-if="items.length"
    id="carousel-example-generic"
    class="carousel slide"
    data-ride="carousel">
    <!-- Indicators -->
    <ol
      v-show="items.length > 1"
      class="carousel-indicators">
      <li
        v-for="(item, index) in items"
        :key="index"
        :data-slide-to="index"
        :class="index === 0 ? 'active' : ''"
        data-target="#carousel-example-generic"
      />
    </ol>

    <!-- Wrapper for slides -->
    <div class="carousel-inner" role="listbox">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="index === 0 ? 'active' : ''"
        class="item">
        <el-image
          :src="item.photo_md"
          :alt="item.title"
        />
      </div>
    </div>

    <!-- Controls -->
    <a v-show="items.length > 1" class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
      <span class="arrow prev el-icon-arrow-left" aria-hidden="true"></span>
    </a>
    <a v-show="items.length > 1" class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
      <span class="arrow next el-icon-arrow-right" aria-hidden="true"></span>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
