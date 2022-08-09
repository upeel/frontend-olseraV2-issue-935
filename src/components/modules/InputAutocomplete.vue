<template>
  <el-select
    ref="ElSelect"
    style="width: 100%;"
    v-model="items"
    multiple
    filterable
    remote
    :placeholder="lang.info_auto_complete_product"
    :remote-method="fetchSuggestions"
    :loading="searchingProducts"
    popper-class="autocomplete-product"
    @change="handleSelect"
    @remove-tag="handleRemove">
    <el-option
      v-for="item in searchResultProducts"
      :key="item.product_id"
      :label="item.name"
      :value="item.product_id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: ['fetchSuggestions', 'searchResultProducts', 'searchingProducts'],

  data() {
    return {
      items: []
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  methods: {
    setFocus() {
      this.$nextTick(() => {
        this.$refs.ElSelect.focus()
      })
    },
    handleSelect(data) {
      this.$emit('select', data)
    },
    resetKeyword() {
      this.items = []
    },
    handleRemove (data) {
      this.$emit('remove', data)
    }
  }
}
</script>
