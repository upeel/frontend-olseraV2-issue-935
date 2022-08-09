<template>
  <div>
    <el-select
      ref="SelectInput"
      v-model="selectedItem"
      :remote-method="searchItems"
      :loading="loading"
      :placeholder="lang.search+' '+placeHolderSearch"
      :value-key="valueKey"
      :reserve-keyword="false"
      :disabled="disabled"
      remote
      filterable
      @change="handleChange"
      style="width: 100%;">
      <el-option
        v-for="(item, key) in searchResults"
        :key="key"
        :label="item[optionLabel]"
        :value="item"
      />
    </el-select>
    <div class="tag-in-loop-wrapper">
      <el-tag
        v-for="(item, key) in propSelectedItems"
        :key="key"
        closable
        @close="removeItem(key)">
        {{ item[propSelectedItemsLabel] }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  props: {
    endPoint: {
      type: String,
      required: true
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    optionLabel: {
      type: String,
      default: 'name'
    },
    placeHolderSearch: {
      type: String,
      default: ''
    },
    propSelectedItems: {
      type: Array,
      default: 'name'
    },
    propSelectedItemsLabel: {
      type: String,
      default: 'name'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      selectedItem: {},
      searchResults: []
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  },

  methods: {
    searchItems(query) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc',
        per_page: 1000
      }
      if (query) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, this.endPoint),
          headers,
          params: params
        }).then(response => {
          this.loading = false
          this.searchResults = response.data.data
        }).catch(() => {
          this.loading = false
          this.searchResults = []
        })
      }
    },
    handleChange() {
      let exist = false
      this.propSelectedItems.map(item => {
        if (item[this.valueKey] === this.selectedItem[this.valueKey]) {
          exist = true
        }
      })

      if (!exist) {
        this.$emit('change', this.selectedItem)
        this.selectedItem = {}
        this.setFocus()
      } else {
        this.$message({
          type: 'warning',
          message: 'item already added'
        })
        return
      }
    },
    removeItem(item) {
      this.$emit('remove', item)
    },
    setFocus() {
      this.$refs.SelectInput.focus()
    }
  }
}
</script>
