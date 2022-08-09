<template>
  <el-select
    v-loading="loading"
    v-model="selectedIdLocal"
    :placeholder="lang.please_select"
    :allow-create="allowCreate"
    :filterable="true"
    value-key="id"
    clearable
    class="inline-form"
    @change="change">
    <template
      v-for="item in categories">
      <template v-if="item.children.length">
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
      <template v-else>
        <el-option
          :key="item.id"
          :label="item.name"
          :value="item">
        </el-option>
      </template>
    </template>
  </el-select>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common.js'
import axios from 'axios'

export default {
  props: [
    'selectedId',
    'allowCreate'
  ],

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      categories: [],
      selectedIdLocal: this.selectedId
    }
  },

  mounted() {
    this.getSelectCategory()
  },

  methods: {
    reset() {
      this.selectedIdLocal = ''
    },
    change(value) {
      if (!value) {
        this.$emit('change', {
          category_id: null,
          category_name: '',
          id: null,
          name: '',
          parent_id: null,
          status: null,
          total_product: 0,
          view_order: null
        })
        return
      }
      if (typeof value === 'object') {
        this.$emit('change', value)
      } else {
        if (this.allowCreate) {
          this.$emit('create', value)
        }
      }
    },
    getSelectCategory() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
        headers: headers,
        params: {
          per_page: 1000
        }
      })
        .then(response => {
          this.categories = response.data.data
          this.loading = false
        })
        .catch(error => {
          this.categories = []
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loading = false
        })
    }
  }
}
</script>
