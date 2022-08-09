<template>
  <div
    :class="flat ? 'data-empty__flat' : ''"
    class="data-empty">
    <img v-if="useImage" :src="image" class="data-empty__image" />
    <div v-html="desc" class="mt-16 font-18 color-black data-empty__desc" />
  </div>
</template>

<script>
export default {
  props: {
    flat: {
      type: Boolean,
      default: false
    },
    useImage: {
      type: Boolean,
      default: true
    },
    image: {
      type: String,
      default: () => '/static/img/data-empty/product.png'
    },
    desc: {
      type: String,
      default: 'No data'
    }
  }
}
</script>

<style lang="scss" scoped>
  .data-empty {
    background: #F5F5F5 0% 0% no-repeat padding-box;
    box-shadow: 0px 2px 2px #0000001F;
    border: 0.5px solid #EEEEEE;
    border-radius: 5px;
    text-align: center;
    padding: 32px;
    &__flat {
      background: none;
      box-shadow: none;
      border: none;
      .data-empty__desc {
        display: none;
      }
    }
    &__image {
      max-width: 300px;
      height: auto;
    }
    &__desc {
      max-width: 300px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>