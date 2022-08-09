<template>
  <el-select
    v-model="keyword"
    :loading="loading"
    :remote-method="searchProducts"
    :popper-append-to-body="true"
    :popper-class="'dropdown-select-product'"
    :class="grabCampaign? 'select-grab-product' : ''"
    value-key="id"
    remote
    filterable
    clearable
    reserve-keyword
    :placeholder="grabCampaign? 'Pilih item' : 'Please enter a keyword'"
    @change="handleChange">
    <el-option
      v-for="item in products"
      :key="item.id"
      :label="item.name"
      :value="item">
      <div class="flex-container">
        <div class="mr-4">
          <el-avatar
            :src="item.detail.default_photo"
            shape="square"
          />
        </div>
        <div>
          <div class="font-bold font-14">
            {{ item.alias_name }}
          </div>
          <div class="font-12 color-old-grey">
            {{ item.falias_price }}
          </div>
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script>
// import { fetchAll } from '@/api/product'
import { getListDataGrabfood as fetchAll } from '@/api/thirdParty/grabfood'
export default {
  props: {
    additionalParams: {
      type: Array,
      default: null
    },
    section: {
      type: Object,
      default: null
    },
    grabCampaign: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      keyword: '',
      products: []
    }
  },

  computed: {
    params() {
      const params = {
        search_column: ['alias_name'],
        search_operator: ['like'],
        search_text: [this.keyword],
        per_page: 100,
        section_id: this.section.id
      }
      if (this.additionalParams && this.additionalParams.length) {
        this.additionalParams.map(item => {
          params.search_column.push(item.search_column)
          params.search_operator.push(item.search_operator)
          params.search_text.push(item.search_text)
        })
      }
      return params
    }
  },

  methods: {
    searchProducts(query) {
      this.keyword = query
      this.loading = true
      fetchAll(this.params).then(response => {
        this.products = response.data.data
        this.loading = false
      }).catch(error => {
        this.products = []
        this.loading = false
      })
    },

    handleChange(item) {
      console.log(item)
      this.keyword = ''
      this.$emit('select', item)
    }
  }
}
</script>
