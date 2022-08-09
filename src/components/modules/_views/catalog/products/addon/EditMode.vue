<template>
  <el-form
    :data="formData"
    @submit.native.prevent>
    <el-form-item :label="lang.name">
      <el-input v-model="formData.name" />
    </el-form-item>

    <el-form-item :label="lang.price">
      <div class="el-input">
        <input-money v-model="formData.price" />
      </div>
    </el-form-item>

    <hr/>

    <h4 style="margin-bottom: 20px;">{{ lang.link_to_product_stock }}</h4>

    <el-row :gutter="10">
      <el-col :md="12">
        <el-form-item :label="lang.product">
          <el-select
            v-model="formData.link_product"
            :remote-method="searchProducts"
            :loading="searchingProducts"
            remote
            filterable
            clearable
            style="width: 100%;">
            <el-option
              v-for="(item, key) in searchResultProducts"
              :key="key"
              :label="item.name"
              :value="item.product_id"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item :label="lang.qty">
          <el-input v-model="formData.product_qty" />
        </el-form-item>
      </el-col>
    </el-row>

    <hr/>

    <h4 style="margin-bottom: 20px;">{{ lang.valid_for_products }}</h4>
    <el-form-item :label="lang.valid_for_product_groups">
      <select-multiple-items
        :prop-selected-items="formData.valid_product_groups"
        value-key="id"
        end-point="productgroup"
        option-label="name"
        @change="handleSelectedValidProductGroups"
        @remove="handleRemoveValidProductGroup"
      />
      <p class="size-10">
        {{ lang.info_product_addon_for_product_groups }}
      </p>
    </el-form-item>

    <el-form-item :label="lang.valid_for_products">
      <select-multiple-items
        :prop-selected-items="formData.valid_products"
        value-key="product_id"
        end-point="productsearch"
        option-label="name"
        @change="handleSelectedValidProducts"
        @remove="handleRemoveValidProduct"
      />
      <p class="size-10">
        {{ lang.info_product_addon_for_products }}
      </p>
    </el-form-item>
  </el-form>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import SelectMultipleItems from 'src/components/modules/SelectMultipleItems'
import InputMoney from '@/components/InputMoneyV2'

export default {
  components: {
    SelectMultipleItems,
    InputMoney
  },

  props: ['data'],

  data() {
    return {
      formData: this.data,
      searchingProducts: false,
      searchResultProducts: [],
      searchResultProductGroups: [],
      searchResultValidProducts: []
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

  watch: {
    formData: {
      handler(data) {
        if (data.name && data.price !== null) {
          this.$emit('save-disabled', false)
        } else {
          this.$emit('save-disabled', true)
        }
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    if (this.formData.id) {
      this.appendLinkToProduct()
    }
  },

  methods: {
    searchProducts(query = '') {
      this.searchingProducts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc',
        per_page: 50
      }
      if (query) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
          headers,
          params: params
        }).then(response => {
          this.searchingProducts = false
          this.searchResultProducts = response.data.data
        }).catch(() => {
          this.searchingProducts = false
          this.searchResultProducts = []
        })
      }
    },

    appendLinkToProduct() {
      let name = this.formData.product_name
      let product_id = this.formData.product_id
      if (this.formData.product_variant_id) {
        name = this.formData.product_name + ' - ' + this.formData.product_variants_name
        product_id = this.formData.product_id + '|' + this.formData.product_variant_id
      }

      this.formData.link_product = product_id

      this.searchResultProducts.push({
        name,
        product_id
      })
    },

    handleSelectedValidProductGroups(item) {
      this.formData.valid_product_groups.push(item)
    },

    handleRemoveValidProductGroup(key) {
      this.formData.valid_product_groups.splice(key, 1)
    },

    handleSelectedValidProducts(item) {
      this.formData.valid_products.push(item)
    },

    handleRemoveValidProduct(key) {
      this.formData.valid_products.splice(key, 1)
    },

    save() {
      console.log('save')
      // this.$emit('save')
    }
  }
}
</script>

