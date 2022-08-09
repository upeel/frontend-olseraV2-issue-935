<template>
  <el-select
    v-loading="loading"
    :value="value"
    :placeholder="lang.please_select"
    :allow-create="allowCreate"
    :filterable="true"
    value-key="id"
    clearable
    class="inline-form"
    @change="change">
    <template
      v-for="item in categories">
      <!-- <template v-if="item.children.length">
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
      </template> -->
      <template>
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
import { fetchGrabfoodCategory } from '@/api/thirdParty/grabfood'

export default {
  props: [
    'value',
    'allowCreate',
    'isEdit',
    'itemCategory'
  ],

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      categories: []
    }
  },

  mounted() {
    this.getSelectCategory()
  },

  watch: {
    isEdit(isEdit) {
      if (!isEdit) {
        this.getSelectCategory()
      } else {
        this.categories = this.itemCategory
      }
    }
  },

  methods: {
    change(value) {
      console.log(value)
      this.$emit('input', value)
      this.$emit('change', value)
    },

    getSelectCategory() {
      this.loading = true

      var params = {
        per_page: 1000
      }

      if (!this.isEdit) {
        fetchGrabfoodCategory(params)
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
      } else {
        this.categories = this.itemCategory
        this.loading = false
      }
    }
  }
}
</script>
