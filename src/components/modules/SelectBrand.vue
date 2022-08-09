<template>
  <el-select
    v-model="selectedId"
    :placeholder="lang.please_select"
    :allow-create="allowCreate"
    :filterable="true"
    clearable
    class="inline-form"
    @change="change">
    <template
      v-for="item in brands">
      <!-- <template v-if="item.children.length">
        <el-option-group
          :key="item.id"
          :label="item.name">
          <el-option
            v-for="child in item.children"
            :key="child.id"
            :label="child.name"
            :value="child.name">
          </el-option>
        </el-option-group>
      </template> -->
      <template>
        <el-option
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </template>
    </template>
  </el-select>
</template>

<script>
export default {
  props: [
    'brands',
    'selectedId',
    'lang',
    'allowCreate'
  ],

  methods: {
    change(value) {
      this.brands.map(i => {
        if (i.id === value) {
          // console.log('trace', i)
          this.$emit('change', i)
        }
      })
      // this.$emit('change', value)
    }
  }
}
</script>
