<template>
  <el-dialog
    :visible.sync="$store.getters.visibleSmartFinder"
    :before-close="handleCloseSmartFinder"
    title="Smart Finder"
    custom-class="mw-980 smart-finder-dialog">
    <div class="smart-finder-dialog--input">
      <el-input
        ref="smartFinderSearch"
        v-model="searchKeyword"
        placeholder="Search by product name, customer name, or order no"
        type="search"
        clearable
        @keyup.native.enter="getData"
        @clear="getData"
      />
    </div>

    <div
      class="smart-finder-dialog--search-result scrollable-dialog-body">
      <el-row :gutter="10">
        <el-col :md="8">
          <h3>{{ rootLang.products }}</h3>
          <div
            v-loading="loading.products"
            v-if="searchResults.products.length || loading.products"
            class="like-table-wrapper">
            <div
              v-for="(item) in searchResults.products"
              :key="item.id"
              class="like-table-wrapper--item pointer"
              @click="handleGoToDetail('/catalog/product/' + item.id)">
              <div class="mr-4">
                <el-avatar
                  :src="item.photo_md"
                  shape="square"
                />
              </div>
              <div style="flex-grow: 1;">
                <div class="font-bold font-14">
                  {{ item.name }}
                </div>
                <div class="font-12 color-old-grey">
                  {{ item.fsell_price_pos }}
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            No data
          </div>
        </el-col>

        <el-col :md="8">
          <h3>{{ rootLang.customers }}</h3>
          <div
            v-loading="loading.customers"
            v-if="searchResults.customers.length || loading.customers"
            class="like-table-wrapper">
            <div
              v-for="(item) in searchResults.customers"
              :key="item.id"
              class="like-table-wrapper--item pointer"
              @click="handleGoToDetail('/customersupplier/customer/' + item.id)">
              <div style="flex-grow: 1;">
                <div class="font-bold font-14">
                  {{ item.name }}
                </div>
                <div class="font-12 color-old-grey">
                  {{ item.customer_type_name }} <span class="dot"></span> {{ item.fcreated_time }}
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            No data
          </div>
        </el-col>

        <el-col :md="8">
          <h3>{{ rootLang.open_orders }}</h3>
          <div
            v-loading="loading.orders"
            v-if="searchResults.orders.length || loading.orders"
            class="like-table-wrapper">
            <div
              v-for="(item) in searchResults.orders"
              :key="item.id"
              class="like-table-wrapper--item pointer"
              @click="handleGoToDetail('/sales/openorder/' + item.id)">
              <div style="flex-grow: 1;">
                <div class="font-bold font-14">
                  {{ item.order_no }}
                </div>
                <div class="font-12 color-old-grey">
                  {{ item.status_desc }} <span class="dot"></span> {{ item.forder_date }}
                </div>
                <div class="font-12 font-bold">
                  {{ item.ftotal_amount }}
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            No data
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { product } from '@/api/product'
import { customer } from '@/api/customer-supplier'
import { openorder } from '@/api/salesOrder'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],

  data() {
    return {
      loading: {
        products: false,
        customers: false,
        orders: false
      },
      searchKeyword: '',
      searchResults: {
        products: [],
        customers: [],
        orders: []
      }
    }
  },

  computed: {
    params() {
      const params = {
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 10
      }
      if (this.searchKeyword) {
        params.search = this.searchKeyword
      }
      return params
    }
  },

  watch: {
    '$store.getters.visibleSmartFinder': {
      immediate: true,
      handler(shown) {
        if (shown) {
          this.$nextTick(() => {
            this.$refs.smartFinderSearch.focus()
          })
          this.getData()
        }
      }
    }
  },

  methods: {
    handleCloseSmartFinder() {
      this.$store.commit('SET_VISIBLE_SMART_FINDER')
    },
    handleGoToDetail(route) {
      this.handleCloseSmartFinder()
      this.$router.push(route)
    },
    getData() {
      this.searchProducts()
      this.searchCustomers()
      this.searchOrders()
    },
    async searchProducts() {
      this.loading.products = true
      const params = { ...this.params }
      await product(params).then(response => {
        this.searchResults.products = response.data.data
      }).catch(() => {
        this.searchResults.products = []
      })
      this.loading.products = false
    },
    async searchCustomers() {
      this.loading.customers = true
      const params = { ...this.params }
      await customer(params).then(response => {
        this.searchResults.customers = response.data.data
      }).catch(() => {
        this.searchResults.customers = []
      })
      this.loading.customers = false
    },
    async searchOrders() {
      this.loading.orders = true
      const params = { ...this.params }
      await openorder(params).then(response => {
        this.searchResults.orders = response.data.data
      }).catch(() => {
        this.searchResults.orders = []
      })
      this.loading.orders = false
    }
  }
}
</script>
