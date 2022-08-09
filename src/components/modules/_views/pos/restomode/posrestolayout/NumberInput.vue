<template>
  <span class="number-input button-group">
    {{ value }}
    <el-button size="small" @click.prevent.stop="setValue(-1)">
      -
    </el-button>
    <el-button size="small" @click.prevent.stop="setValue(+1)">
      +
    </el-button>
  </span>
</template>

<script>
export default {
  name: 'number-input',
  props: [ 'value' ],

  methods: {
    setValue(v) {
      this.$emit('input', this.value + v)
    }
  }
}
</script>
