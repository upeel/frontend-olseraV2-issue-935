<template>
  <div class="icons-multiple">
    <el-avatar
      v-for="(photo, photoKey) in items"
      :key="photoKey"
      :src="photo[photoObject]"
      class="icons-multiple__item"
    />
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    photoObject: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-multiple {
  display: flex;
  align-items: center;
  padding-right: 20px;
  max-width: fit-content;
  &:hover {
    .icons-multiple__item {
      margin-left: 0px;
    }
  }
  &__item {
    margin-left: -15px;
    position: relative;
    border: 2px solid #fff;
    transition: all 0.1s ease-in-out;
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>