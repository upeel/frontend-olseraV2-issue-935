<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div class="flex-grow-1">
          <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.product_combo }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.product_combo }}</p>
        </div>

        <div>
          <button-action-authenticated
            v-if="$store.getters.selectedStore.pos_freemium === 0 || selectedStore.is_onlineshop === 1"
            :permission="['catalog/productcombo', 'store']"
            @click="copyDialogList(false)">
            <svg-icon icon-class="copy-product" /> {{ $lang[langId].copy_package_product }}
          </button-action-authenticated>
          <el-dropdown v-if="stageLevel === 'sit' || stageLevel === 'dev'" @command="handleClick" class="px-4">
            <button-action-authenticated :permission="['catalog/productcombo', 'show']" :loading="loadingExport" type="primary">
              Export Excel<i class="el-icon-arrow-down el-icon--right"></i>
            </button-action-authenticated>
            <el-dropdown-menu slot="dropdown" style="overflow-y: scroll; height: 300px">
              <el-dropdown-item v-for="item in labelRow" :key="item.key" :command ="item">{{ lang.rows }} {{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <button-action-authenticated :permission="['catalog/productcombo', 'store']" type="primary" icon="el-icon-plus" @click="addData">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="table-handler-flex sticky-top-has-submenu">
        <div style="flex-grow: 1;" class="mb-12">
          <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
            <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="mb-12">
          <el-input
            class="inline-form input-search"
            :placeholder="lang.search"
            clearable
            prefix-icon="el-icon-search"
            v-model="params.search"
            size="small"
            @change="handleSearch">
          </el-input>
        </div>
      </div>

      <el-divider></el-divider>

      <el-table
        v-loading="loading"
        v-if="lang.product_name"
        :data="tableData"
        stripe
        @sort-change="changeSortTable">
        <el-table-column
          :label="lang.product_name"
          min-width="160">
          <template slot-scope="scope">
            <div class="flex-container pointer" @click="goToSinglePage(scope.row)">
              <el-image
                v-if="scope.row.photo_xs"
                :src="scope.row.photo_xs"
                fit="cover"
                style="width: 50px; height: 50px; border-radius: 50%; margin-right: 8px;"
              />
              <strong>{{ scope.row.name }}</strong>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock_qty"
          sortable
          :label="lang.qty"
          width="120">
        </el-table-column>
        <el-table-column
          prop="fsell_price"
          sortable
          :label="lang.online_selling_price"
          width="160">
        </el-table-column>
        <el-table-column
          prop="fsell_price_pos"
          sortable
          :label="lang.offline_selling_price"
          width="140">
        </el-table-column>
        <el-table-column
          prop="published_date"
          sortable
          :label="lang.publish"
          width="140">
        </el-table-column>
        <el-table-column
          v-if="stageLevel === 'dev' || stageLevel === 'sit'"
          fixed="right"
          align="center"
          width="40px">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
              <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                <router-link :to="{ name: 'Package Copy', params: { id: scope.row.id, copy: true }}">
                  <el-dropdown-item>
                    <el-button type="text" style="color: #000000">
                      <svg-icon icon-class="file-text"></svg-icon>
                      {{ $lang[langId].copy }}
                    </el-button>
                  </el-dropdown-item>
                </router-link>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :params="params"
        @size-change="changePageTable"
        @current-change="changeCurrentPage"
      />
    </div>

    <el-dialog
      :visible.sync="dialogCopyProductStoreList"
      title="Copy Product">
      <div v-loading="loadingGetCopyProduct">
        <div
          v-for="item in activeStores"
          :key="item.store_id"
          class="box-in-loop pointer"
          @click="getCopyProduct(item, false)">
          <div v-if="!item.disable" class="flex-container">
            <el-avatar
              :src="item.logo"
              :size="32"
              style="flex-basis: 32px; min-width: 32px;"
            />
            <div class="ml-8" style="flex-grow: 2;">{{ item.name }}</div>
            <el-button
              round
              type="text"
              size="small"
              icon="el-icon-arrow-right">
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogCopyProduct"
      :destroy-on-close="true"
      :show-close="false"
      fullscreen
      custom-class="unset-border-radius pos-relative">
      <div slot="title">
        <div>{{ lang.copy_from_store }}</div>
        <el-button
          class="btn-block mb-12"
          @click="copyDialogList(true)">
          <div class="flex-container">
            <el-avatar
              :src="storeCopy.logo"
            />
            <div>
              {{ storeCopy.name }}
              <i class="el-icon-caret-bottom"/>
            </div>
          </div>
        </el-button>
      </div>

      <div style="padding-bottom: 40px;">
        <el-input
          v-model="params.search_text"
          :placeholder="lang.search"
          clearable
          prefix-icon="el-icon-search"
          class="mb-24 bg-f5"
          @change="handleSearchCopy">
        </el-input>

        <div class="mb-12">
          <div class="mb-12">
            <el-checkbox
              v-model="checkAllProductToCopy"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange">
              {{ $lang[langId].copy_all }}
            </el-checkbox>
          </div>

          <div>
            <el-checkbox-group
              v-model="checkedProductsToCopy"
              :max="20"
              class="flex-container flex-container--wrap"
              @change="handleCheckedProductToCopyChange">
              <div
                v-for="item in dataCopyProduct"
                :key="item.id"
                class="flex-grid-2 px-12">
                <el-checkbox
                  :label="item.id"
                  class="p-8 unset-height block checkbox-right"
                  border>
                  <div class="font-14 font-bold overflow-ellipsis">
                    {{ item.name }}
                  </div>
                  <!-- {{ item.klasifikasi }} -->
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <div v-if="disableMore">
          <el-button
            class="btn-block"
            icon="el-icon-arrow-down"
            @click="loadMore">
            {{ $lang[langId].load_more }}
          </el-button>
        </div>
      </div>

      <el-button
        :loading="loadingSaveCopyProduct"
        :disabled="btnCopy"
        type="success"
        class="btn-save-copy-product"
        @click="saveCopyProduct">
        {{ lang.save }}
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
var moment = require('moment')
import { baseApi } from 'src/http-common'
import axios from 'axios'
import checkPersistentParam from '@/mixins/checkPersistentParam'

import { exportPackage } from '@/api/catalog/packageproduct'
import { mixinPaginationComponent } from '@/mixins/mixinPaginationComponent'

export default {
  mixins: [checkPersistentParam, mixinPaginationComponent],

  data() {
    return {
      loading: true,
      tableData: [],
      statusValue: null,
      pages: [
        {
          value: 5,
          label: '5 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 10,
          label: '10 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 20,
          label: '20 ' + this.$store.state.userStores.lang.rows
        }
      ],
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 10,
        page: 1,
        search_text: ''
      },
      isButtonDisabled: false,
      dialogCopyProductStoreList: false,
      loadingGetCopyProduct: false,
      activeStores: [],
      storeCopy: {},
      copyStoreId: '',
      dataCopyProduct: [],
      dialogCopyProduct: false,
      disableMore: false,
      isIndeterminate: false,
      checkAllProductToCopy: false,
      checkedProductsToCopy: [],
      loadingSaveCopyProduct: false,
      loadingExport: false
    }
  },

  computed: {
    labelRow () {
      var a = 0
      var b = []
      var start = 0
      var end = 0
      for (let i = 1; i <= 200; i++) {
        start = i * 1000 - 999
        end = i * 1000
        b.push(
          { 
            value: start + ' - ' + end,
            key: i-1,
            string: start + '_' + end
          }
        )
      }
      return b
    },

    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    columns () {
      let columns = []
      let mid = Math.ceil(this.dataCopyProduct.length / this.cols)
      for (let col = 0; col < this.cols; col++) {
        columns.push(this.dataCopyProduct.slice(col * mid, col * mid + mid))
      }
      return columns
    },
    btnCopy() {
      let btnCopy = true
      if (this.checkedProductsToCopy.length > 0) {
        btnCopy = false
      } else {
        btnCopy = true
      }
      return btnCopy
    },
    userStores() {
      return this.$store.getters.stores
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
  },

  mounted() {
    this.checkPersistentMeta()
    this.getData()
    this.userStores.map(i => {
      if (!i.disable) {
        this.activeStores.push(i)
      }
    })
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo'),
        params: this.params,
        headers: headers
      }).then(response => {
        this.tableData = response.data.data
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.tableData = []
        this.params.total = 0
        this.loading = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.getData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    addData() {
      this.$router.push({path: '/catalog/package/create'})
    },
    goToSinglePage(row) {
      this.$router.push({path: '/catalog/package/' + row.id})
    },
    copyDialogList(copy) {
      if (!copy) {
        this.dialogCopyProductStoreList = true
      } else {
        this.dialogCopyProductStoreList = true
        this.dialogCopyProduct = false
      }
    },
    getCopyProduct (item, search) {
      this.loadingGetCopyProduct = true
      let param = {}
      if (!search) {
        this.storeCopy = item
        this.copyStoreId = ''
        this.copyStoreId = item.store_id
        param = {
          per_page: 20
        }
      } else {
        param = {
          per_page: 20,
          search_column: 'name',
          search_text: this.params.search_text
        }
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/copyfromstore/' + item.store_id),
        headers: headers,
        params: param
      })
        .then(response => {
          this.dataCopyProduct = response.data.data
          this.dialogCopyProductStoreList = false
          this.dialogCopyProduct = true
          if (response.data.links.next !== null) {
            this.disableMore = true
            this.next_page = response.data.links.next
          } else {
            this.disableMore = false
          }
          this.loadingGetCopyProduct = false
        })
        .catch(error => {
          console.log(error)
          this.dataCopyProduct = []
          this.loadingGetCopyProduct = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },
    handleSearchCopy(item) {
      if (item.length > 0) {
        this.getCopyProduct(this.storeCopy, true)
      } else {
        this.getCopyProduct(this.storeCopy, false)
      }
    },
    handleCheckAllChange(bool) {
      const chkl = [...this.dataCopyProduct].slice(0, 20)
      if (bool) {
        this.checkedProductsToCopy = chkl.map(item => {
          return item.id
        })
      } else {
        this.checkedProductsToCopy = []
      }
      this.isIndeterminate = false
    },
    saveCopyProduct() {
      this.loadingSaveCopyProduct = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        store_id: this.copyStoreId,
        product_combo_id: this.checkedProductsToCopy.join(', ')
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/cloneproductcombofromstore'),
        headers: headers,
        data: data
      }).then(response => {
        this.loadingSaveCopyProduct = false
        this.dialogCopyProductStoreList = false
        this.checkedProductsToCopy = []
        let url = baseApi(this.selectedStore.url_id, this.langId, 'product')
        this.getProducts(url)
        this.dialogCopyProduct = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingSaveCopyProduct = false
      })
    },
    handleCheckedProductToCopyChange(value) {
      const checkedCount = value.length
      this.checkAllProductToCopy = checkedCount === this.dataCopyProduct.length || 20
      this.isIndeterminate = false
    },
    loadMore() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let param = {
        per_page: 20
      }

      axios({
        method: 'GET',
        url: this.next_page,
        headers: headers,
        params: param
      })
        .then(response => {
          response.data.data.map(i => {
            this.dataCopyProduct.push(i)
          })
          if (response.data.links.next !== null) {
            this.disableMore = true
            this.next_page = response.data.links.next
          } else {
            this.disableMore = false
          }
          this.loading = false
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loading = false
        })
    },

    handleClick(data) {
      // console.log('logdat', data)
      this.loadingExport = true
      this.loading = true
      let param = { ...this.params}
      param.p = data.key
      exportPackage(param).then(response => {
        console.log('r', response)
        const fileName = 'product_package' + '-' + data.string + '-' + moment().format('YYYY-MM-DD') + '__' + '.xlsx'
        console.log('r', fileName)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingExport = false
        this.loading = false
      }).catch(error => {
        console.log(error, 'error')
        this.loadingExport = false
        this.loading = false
      })
    },
  }
}
</script>
