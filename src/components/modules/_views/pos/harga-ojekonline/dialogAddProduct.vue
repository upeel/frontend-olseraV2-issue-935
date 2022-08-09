<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    append-to-body >
    <div slot="title" class="flex-container">
      <div class="full-width font-24">
        {{ lang.add }} {{ lang.product}}
      </div>
      <div class="full-width text-right">
        <el-button
          type="info"
          @click="handleClose">
          {{ lang.cancel }}
        </el-button>
        <el-button :disabled="!dataChecked.length" :loading="loadingAdd" type="success" @click="saveProduct">
          {{ lang.add }}
        </el-button>
      </div>
    </div>
    <div>
      <div class="table-handler-flex full-width text-right" style="display: unset">
        <el-input class="input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="searchProduct" @change="getProductSearch" size="small"></el-input>
        <div class="mt-16 text-left">
          <perfect-scrollbar :options="scrollOption" class="horizontal-scroll">
            <div class="flex-container">
              <!-- <el-button id="paketbtn" size="mini" round :class="isPaket? 'color-grey--placeholder--bg color-white' : 'color-grey--bg'" @click="isPaket = !isPaket">Paket</el-button> -->
              <el-button id="paketbtn" size="mini" round :class="isAllFilter? 'color-grey--placeholder--bg color-white' : 'color-grey--bg'" @click="handleSelectAllFilter">{{ lang.all }}</el-button>
              <el-button id="paketbtn" size="mini" round :class="isPaketFilter? 'color-grey--placeholder--bg color-white' : 'color-grey--bg'" @click="handleSelectPackageProduct">{{ lang.product_combo }}</el-button>
            <template v-for="(item, idx) in grupData">
              <el-button :key="item.id" size="mini" round :class="visibleItem[idx]? 'active color-grey--placeholder--bg color-white' : 'color-grey--bg'" @click="selectFilter(item)">{{ item.name }}</el-button>
            </template>
            </div>
          </perfect-scrollbar>
        </div>
      </div>

      <div class="mr-8 mt-16 full-width flex-container" >
        <div class="font-12 full-width">
          {{ rootLang.select }} {{ lang.product }} {{ this.dataChecked.length ? '(' + this.dataChecked.length + ')' : ''}}
        </div>
        <div class="mr-24">
          <el-checkbox v-model="checkAll" :disabled="disabledCheckAll" @change="handleCheckAll"></el-checkbox>
        </div>
      </div>
      <template v-if="searchData.length">
        <perfect-scrollbar class="scrollBulkPair">
          <div class="like-table-wrapper border border--table-border">
            <div v-loading="loadingSearch" class="like-table-wrapper border border--table-border" >
              <div v-for="(item) in dataProd"
                :key="item.id" class="like-table-wrapper--item pointer">
                <div class="flex-container full-width">
                  <div class="mr-8 flex-container full-width" @click="handleCheck(item)">
                    <div class="flex-container">
                      <el-avatar
                        :src="item.photo_md"
                        :size="32"
                        shape="square"
                      />
                    </div>
                    <div class="font-bold font-14 ml-8 word-break">
                      <div>{{ item.name }}</div>
                      <div class="font-12 color-old-grey">{{ item.fsell_price }} • {{ item.stock_qty }} stock</div>
                    </div>
                  </div>
                  <div class="mr-8"><el-checkbox v-model="item.checked" @change="handleCheck(item)"></el-checkbox></div>
                </div>
              </div>
            </div>
          </div>
          <div class="load-more mt-24" v-if="moreLink" v-loading="loadingSearch">
            <el-button
              @click="loadMore"
              class="btn-block">
              {{ $lang[langId].load_more }}
            </el-button>
          </div>
        </perfect-scrollbar>
      </template>
      
    </div>
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
// import { productvariantonlysearch } from '@/api/product'
import { getProduct, addProduct } from '@/api/ojekonline'
import { fetchProductPackage } from '@/api/catalog/packageproduct'
import { productGrup } from '@/api/product'
import InputAutocomplete from '@/components/modules/InputAutocomplete'
export default {
  name: 'dialogAddProduct',
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataMaster: {
      type: Object,
      default: {}
    },
  },
  components: {
    InputAutocomplete
  },
  computed: {
    dataProd () {
      if (!this.isPaketFilter) {
        return this.searchData.map(i => {
          i.checked = false
          if (this.dataChecked.length > 0) {
            this.dataChecked.map(j => {
              if (i.product_id === j.product_id) {
                i.checked = true
              }
            })
          }
          return i
        })
      } else {
        return this.searchData.map(i => {
          i.checked = false
          if (this.dataChecked.length > 0) {
            this.dataChecked.map(j => {
              if (i.id === j.id) {
                i.checked = true
              }
            })
          }
          return i
        })
      }
    },
    disabledCheckAll () {
      if (this.dataChecked.length > 49) {
        return true
      } else if (!this.searchData.length) {
        return true
      } else {
        return false
      }
    },
    dataGroup () {
      let data = []
      this.grupData.map(i => {
        if (i.children.length) {
          i.children.map(j => {
            data.push(j)
          })
        } else {
          data.push(i)
        }
      })
      data.map(k => { k.active = false})
      return data
    }
  },
  data() {
    return {
      loadingSearch: false,
      searchProduct: '',
      searchData: [],
      dataChecked: [],
      moreLink: false,
      currentPage: 1,
      checkAll: false,
      loadingAdd: false,
      scrollOption: {
        suppressScrollY: true,
        suppressScrollX: false
      },
      grupData: [],
      isPaket: false,
      visibleItem: [],
      params: {
        sort_column: 'name',
        sort_type: 'asc',
        search: '',
        per_page: 20
      },
      isAllFilter: true,
      isPaketFilter: false
    }
  },
  mounted () {
    this.getProductGrup()
  },
  methods: {
    handleClose () {
      this.dataChecked = []
      this.searchData = []
      this.searchProduct = ''
      this.$emit('close')
    },
    getProductGrup() {
      this.loadingSearch = true
      let params = {
        per_page: 1000
      }
      productGrup(params).then(response => {
        let data = response.data.data
        data.map(i => {
          if (i.children.length) {
            i.children.map(j => {
              this.grupData.push(j)
              this.visibleItem.push(false)
            })
          } else {
            this.grupData.push(i)
            this.visibleItem.push(false)
          }
        })
        this.grupData.map(k => { k.active = false})
        this.loadingSearch = false
      })
      .catch(error => {
        this.grupData = []
        this.loadingSearch = false
      })
    },
    getProductSearch() {
      this.loadingSearch = true
      this.params.search = this.searchProduct
      if (!this.searchPackage) {
        this.searchData = []
        getProduct(this.params).then(response => {
          this.searchData = response.data.data
          this.loadingSearch = false
          this.currentPage = response.data.meta.current_page
          if (response.data.links.next !== null) {
            this.moreLink = true
          } else {
            this.moreLink = false
          }
        })
        .catch(error => {
          this.searchData = []
          this.loadingSearch = false
        })
      } else {
        fetchProductPackage(this.params).then(response => {
          this.searchData = response.data.data
          this.loadingSearch = false
          this.currentPage = response.data.meta.current_page
          if (response.data.links.next !== null) {
            this.moreLink = true
          } else {
            this.moreLink = false
          }
        })
        .catch(error => {
          this.searchData = []
          this.loadingSearch = false
        })
      }
    },
    loadMore() {
      this.loadingSearch = true
      this.params.page = this.currentPage + 1
      if (!this.searchPackage) {
        getProduct(this.params).then(response => {
          response.data.data.map(i => { this.searchData.push(i) })
          this.loadingSearch = false
          this.currentPage = response.data.meta.current_page
          if (response.data.links.next !== null) {
            this.moreLink = true
          } else {
            this.moreLink = false
          }
        })
        .catch(error => {
          this.searchData = []
          this.loadingSearch = false
        })
      } else {
        fetchProductPackage(this.params).then(response => {
          response.data.data.map(i => { this.searchData.push(i) })
          this.loadingSearch = false
          this.currentPage = response.data.meta.current_page
          if (response.data.links.next !== null) {
            this.moreLink = true
          } else {
            this.moreLink = false
          }
        })
        .catch(error => {
          this.searchData = []
          this.loadingSearch = false
        })
      }
    },
    handleCheck (item) {
      // console.log('aaa')
      if (!this.isPaketFilter) {
        const exist = this.dataChecked.some(({product_id}) => product_id === item.product_id)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.product_id === item.product_id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          if (this.dataChecked.length < 50) {
            this.dataChecked.push(item)
          } else {
            this.$notify({
              type: 'warning',
              message: this.rootLang.max_selected_product + '50'
            })
          }
        }
      } else {
        const exist = this.dataChecked.some(({id}) => id === item.id)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.id === item.id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          if (this.dataChecked.length < 50) {
            this.dataChecked.push(item)
          } else {
            this.$notify({
              type: 'warning',
              message: this.rootLang.max_selected_product + '50'
            })
          }
        }
      }
    },

    handleCheckAll (arg) {
      if (arg) {
        this.dataChecked = []
        this.dataProd.map((i, idx) => {
          if (idx < 50) {
            this.dataChecked.push(i)
          }
        })
        // this.checkAll = this.dataChecked.length > 50 ? true : false
      } else {
        this.dataChecked = []
        // this.checkAll = false
      }
    },
    saveProduct() {
      this.loadingAdd = true
      let data = {
        ojek_online_food_id: this.dataMaster.ojek_online_food_id,
        items: []
      }
      if (!this.isPaketFilter) {
        this.dataChecked.map(i => {
          data.items.push({
            id: i.product_id,
            is_product_combo: ''
          })
        })
      } else {
        this.dataChecked.map(i => {
          data.items.push({
            id: i.id,
            is_product_combo: 1
          })
        })
      }
      addProduct(data).then(response => {
        this.$emit('addproduct')
        this.loadingAdd = false
        this.checkAll = false
        this.dataChecked = []
        this.handleSelectAllFilter()
        console.log('res', response)
        this.$notify({
          type: 'success',
          // title: response.data.message,
          message: response.data.message
        })
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingAdd = false
      })
    },
    selectFilter (data) {
      if (this.isPaketFilter) {
        this.dataChecked = []
      }
      
      this.grupData.map((i, idx) => {
        if (i.id === data.id) {
            i.active = true
           this.visibleItem[idx] = true
        } else {
          i.active = false
          this.visibleItem[idx] = false
        }
      })
      this.checkAll = false
      this.isAllFilter = false
      this.isPaketFilter = false
      this.params.search_column = 'product_group_id'
      this.params.search_text = data.id
      this.params.page = 1
      this.searchPackage = false
      this.$forceUpdate()
      this.getProductSearch()
      // document.getElementById('paketbtn').focus()
    },
    loadProduct() {
      this.params.search = ''
      this.$delete(this.params, 'search_column')
      this.$delete(this.params, 'search_text')
      this.getProductSearch()
    },
    handleSelectAllFilter () {
      if (this.isPaketFilter) {
        this.dataChecked = []
      }
      this.checkAll = false
      this.isAllFilter = true
      this.isPaketFilter = false
      this.params.search_column = 'product_group_id'
      this.params.search_text = 0
      this.params.page = 1
      this.grupData.map((i, idx) => { this.visibleItem[idx] = false })
      this.searchPackage = false
      this.$forceUpdate()
      this.getProductSearch()
    },

    handleSelectPackageProduct () {
      this.isAllFilter = false
      this.isPaketFilter = true
      this.$delete(this.params, 'search_column')
      this.$delete(this.params, 'search_text')
      this.params.page = 1
      this.grupData.map((i, idx) => { this.visibleItem[idx] = false })
      this.searchPackage = true
      this.dataChecked = []
      this.checkAll = false
      this.$forceUpdate()
      this.getProductSearch()
    }
  }
}
</script>