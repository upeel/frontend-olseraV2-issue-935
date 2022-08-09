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
      v-for="item in categories">
      <template v-if="!item.children.length">
        <el-option
          :key="item.id"
          :label="item.name"
          :value="item">
        </el-option>
      </template>
      <template v-else-if="item.children.length">
        <el-option-group
          :key="item.id"
          :label="item.name">
          <el-option
            v-for="child in item.children"
            :key="child.id"
            :label="child.name"
            :value="child">
          </el-option>
        </el-option-group>
      </template>
    </template>
  </el-select>
</template>

<script>
export default {
  props: [
    'categories',
    'selectedId',
    'lang',
    'allowCreate'
  ],

  methods: {
    change(value) {
      this.$emit('change', value)
    }
  }
}
</script>
