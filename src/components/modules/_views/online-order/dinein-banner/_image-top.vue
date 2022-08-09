<template>
  <div class="imagetop">
    <img class="garpu" src="/static/dineinbanner/images/icons/garpu-besar.svg" />
    <div class="dinding">
      <div :class="!potrait ? 'table-number' : 'table-number-potrait'">
        {{ tableNumber }}
      </div>
      <div>
        <img src="/static/dineinbanner/images/icons/dinding.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableNumber: {
      type: String,
      default: ''
    },
    potrait: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
  /* line 170, ../sass/screen.scss */
  .imagetop {
    display: flex;
    justify-content: space-between;
    margin-bottom: 60px;
  }
  .table-number {
    font-size: 162px;
    text-align: center;
    font-weight: bold;
  }
  .table-number-potrait {
    font-size: 162px;
    text-align: center;
    font-weight: bold;
  }
</style>
