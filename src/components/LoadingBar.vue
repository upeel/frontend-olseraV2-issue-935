<template>
  <div class="loader">
    <div class="loaderBar"></div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.loader { 
  width: 142px; 
  height: 4px;
  background: #EEEEEE;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}
.loader:before {
  content: '';
  border-radius: 10px;
  position: absolute;
  background: #EEEEEE;
  top: -4px; 
  right: -4px; 
  bottom: -4px; 
  left: -4px;
}
.loader .loaderBar { 
  position: absolute;
  border-radius: 10px;
  top: 0;
  right: 100%;
  bottom: 0;
  left: 0;
  background: #2BC5F4;
  width: 0;
  animation: borealisBar 1s linear infinite;
}
@keyframes borealisBar {
  0% {
    left: 0%;
    right: 100%;
    width: 0%;
  }
  10% {
    left: 0%;
    right: 75%;
    width: 25%;
  }
  90% {
    right: 0%;
    left: 75%;
    width: 25%;
  }
  100% {
    left: 100%;
    right: 0%;
    width: 0%;
  }
}
</style>
