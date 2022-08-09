<template>
  <div class="chacheli-layout">
    <template v-for="c in chachelis">
      <div class="chacheli"
        v-if="!c.available"
        :key="c.id"
        :style="{ top: (c.y * v) + '%', left: (c.x * h) + '%', width: (c.w * h) + '%', height: (c.h * v) + '%'}">
        <component :is="c.comp" :meta="c" :data="data[c.id]"/>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'chacheli-layout',
  props: [ 'layout', 'chachelis', 'data' ],

  data() {
    return {
      v: 0,
      h: 0
    }
  },

  watch: {
    'layout.cols'() {
      this.calc()
    },
    'layout.rows'() {
      this.calc()
    }
  },

  created() {
    this.calc()
  },

  methods: {
    calc() {
      this.v = 100 / this.layout.rows
      this.h = 100 / this.layout.cols
    }
  }
}
</script>
