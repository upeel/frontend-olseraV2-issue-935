<template>
  <div class="chacheli-designer-control">
    <div class="flex-container">
      <div class="mr-8">
        {{ lang.columns }} <number-input :value="layout.cols" @input="setCols" />
      </div>
      <div>
        {{ lang.rows }} <number-input :value="layout.rows" @input="setRows" />
      </div>
    </div>
  </div>
</template>

<script>
import NumberInput from './NumberInput.vue'
export default {
  name: 'LayoutControl',
  components: { NumberInput },
  props: [ 'layout', 'lang' ],

  methods: {
    setCols(v) {
      this.$emit('cols', v)
    },
    setRows(v) {
      this.$emit('rows', v)
    }
  }
}
</script>
