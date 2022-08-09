<template>
  <div v-loading="loading">
    <el-card
      v-if="showVarian"
      class="box-card">
      <div slot="header" class="table-handler-flex">
        <div class="box-title" style="flex-grow: 1;">
          <h4>{{ $lang[langId].list }} {{ lang.variant }}</h4>
          <p>{{ total }} {{ $lang[langId].variant_product }}</p>
        </div>

        <variant-manage
          :variant-data="variantData"
          @saved="handleNewVariant"
        />
      </div>

      <div class="card-body">
        <div style="flex-grow: 1;" class="mb-12">
          <button-action-authenticated
            :permission="['catalog/products', 'edit']"
            :disabled="IsDelBtnDisabled"
            type="text"
            class="bulk-delete"
            icon="el-icon-delete"
            @click="dialogDeleteProducts = true"
          />
          <el-select class="inline-form" v-model="pagination.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
            <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <!-- <el-table-draggable v-if="expandedRows === 0" handle=".handle" @drop="sortTable"> -->
        <el-table-draggable handle=".handle" @drop="sortTable">
          <el-table
            ref="variantsTable"
            :data="variants"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @expand-change="handleExpansion">
            <el-table-column
              type="selection"
              width="40"
              fixed
              class-name="text-center"
            />
            <el-table-column width="40">
              <template>
                <div class="handle">
                  <i class="el-icon-rank"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.photo" class-name="text-center" width="auto">
              <template slot-scope="props">
                <el-avatar :src="props.row.photo_xs" />
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="lang.variant" width="150">
            </el-table-column>
            <el-table-column prop="sku" :label="lang.sku">
            </el-table-column>
            <el-table-column prop="stock_qty" :label="lang.stock_qty">
              <template slot-scope="props">
                <div v-if="productData.track_inventory">
                  {{ props.row.stock_qty }}
                </div>
                <div v-else>
                  Unlimited
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.price" width="200">
              <template slot-scope="scope">
                <el-row :gutter="20">
                  <el-col :span="5">
                    <i class="dripicons-web"></i>
                  </el-col>
                  <el-col :span="19">
                    <p>{{ scope.row.sell_price }}</p>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="5">
                    <i class="dripicons-store"></i>
                  </el-col>
                  <el-col :span="19">
                    <p>{{ scope.row.sell_price_pos }}</p>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkCustomPermission('catalog/products', 'edit')"
              type="expand">
              <template slot-scope="props">
                <variant-detail
                  :variant-id="props.row.id"
                  :product-data="product"
                  @variant-deleted="getVariants"
                  @update="getVariants"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-table-draggable>

        <!-- <el-table
            v-if="expandedRows > 0"
            ref="variantsTable"
            :data="variants"
            stripe
            style="width: 100%"
            @expand-change="handleExpansion">
            <el-table-column width="40">
              <template>
                <div class="handle">
                  <i class="el-icon-rank"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.photo" class-name="text-center" width="auto">
              <template slot-scope="props">
                <el-avatar :src="props.row.photo_xs" />
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="lang.variant" width="150">
            </el-table-column>
            <el-table-column prop="sku" :label="lang.sku">
            </el-table-column>
            <el-table-column prop="stock_qty" :label="lang.stock_qty">
              <template slot-scope="props">
                <div v-if="productData.track_inventory">
                  {{ props.row.stock_qty }}
                </div>
                <div v-else>
                  Unlimited
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.price" width="200">
              <template slot-scope="scope">
                <el-row :gutter="20">
                  <el-col :span="5">
                    <i class="dripicons-web"></i>
                  </el-col>
                  <el-col :span="19">
                    <p>{{ scope.row.sell_price }}</p>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="5">
                    <i class="dripicons-store"></i>
                  </el-col>
                  <el-col :span="19">
                    <p>{{ scope.row.sell_price_pos }}</p>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <variant-detail
                  :variant-id="props.row.id"
                  :product-data="product"
                  @variant-deleted="getVariants"
                  @update="getVariants"
                />
              </template>
            </el-table-column>
          </el-table> -->

        <div class="block" style="margin-top: 12px;">
          <el-pagination
            @current-change="handleCurrentPage"
            :current-page.sync="pagination.currentPage"
            :page-size="pagination.per_page"
            layout="prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <el-card v-else class="card-body">
      <div slot="header" class="table-handler-flex">
        <h4 class="box-title" style="flex-grow: 1;">{{ $lang[langId].list }} {{ lang.variant }}</h4>
        <div>
          <variant-create :product-sku="productData.sku" :product-data="productData" v-on:saved="handleNewVariants" :product-new="false" />
        </div>
      </div>
      <div class="card-body">
        <div class="no-product text-center">
          <p>{{ $lang[langId].no_product }}</p>
          <img src="/static/img/no-data.svg" alt="No Data Picture">
        </div>
      </div>
    </el-card>

    <div v-if="isEdit" class="floating_div" :style="computedRes">
      <floating-div :show-cancel="false" @confirm="updateSorting" @cancel="cancelSorting"></floating-div>
    </div>

    <el-dialog :visible.sync="dialogDeleteProducts">
      <div style="background-color: #FFFFFF;">
        <div v-for="(item, index) in chosenProducts" :key="index">
          <div class="flex-container mt-12">
              <div style="width: 40px; height: 40px">
                <img :src="item.photo_md" :alt="item.name">
              </div>
              <div class="ml-8">
                <h4 style="font-weight: bold; text-transform: capitalize">{{item.name}}</h4>
              </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div>
          <div class="text-center word-break">
            {{ $lang[langId].are_you_want_remove }}
            <strong style="text-transform: capitalize">{{ rootLang.all_variant_selected }} ?</strong>
          </div>
          <div class="flex-container mt-12">
            <el-button type="danger" class="btn-plain btn-block" @click="handleDeleteBulk" >
              <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
              {{ $lang[langId].delete }}
            </el-button>
            <el-button class="btn-block btn-plain" @click="dialogDeleteProducts = false">Batal</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VariantCreate from '../create/ProductVariantCreate'
import VariantManage from '../edit/VariantManage'
import VariantDetail from './ProductDetailVariantDetail'
import {baseApi} from 'src/http-common'
import { deleteBulkVariant } from '@/api/product'
import axios from 'axios'
import ElTableDraggable from 'element-ui-el-table-draggable'

import basicComputedMixin from '@/mixins/basicComputedMixin'

import FloatingDiv from '@/components/modules/FloatingDiv'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'DetailVariant',

  mixins: [checkCustomPermission],

  components: {
    VariantDetail,
    VariantManage,
    VariantCreate,
    ElTableDraggable,
    FloatingDiv
  },

  mixins: [basicComputedMixin],

  props: {
    productData: {
      default: null,
      type: Object
    }
  },

  data() {
    return {
      variants: [],
      product: {},
      loading: true,
      showVarian: false,
      variantData: null,
      dialogFormVisible: false,
      pagination: {
        currentPage: 1,
        total: 0,
        per_page: 15
      },
      tmp: [],
      expandedRows: 0,
      pages: [
        {
          value: 5,
          label: '5 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 15,
          label: '15 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 30,
          label: '30 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 50,
          label: '50 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 100,
          label: '100 ' + this.$store.state.userStores.lang.rows
        }
      ],
      isEdit: false,
      IsDelBtnDisabled: true,
      chosenProducts: [],
      dialogDeleteProducts: false
    }
  },

  watch: {
    productData(val) {
      this.product = val
    },
    tableChange(newVal) {
      // console.log(newVal)
      // if (this.tableChange.length > 1) {
      //   // this.updateSorting()
      // }
    }
  },
  computed: {
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
    tableChange() {
      return this.variants
    },

    computedRes () {
      // var elmt = document.getElementsByClassName('tab-content')[0].offsetWidth
      var w = document.getElementsByClassName('tab-content')[0].offsetWidth
      // var h = window.innerHeight
      let cls = 'max-width: ' + w + 'px; padding-right: unset !important'
      return cls
    }
  },

  methods: {
    getVariants() {
      this.loading = true

      let headers = {
        'Authorization': 'Bearer ' + this.token.access_token
      }

      let params = {
        product_id: this.$route.params.id,
        page: this.pagination.currentPage,
        per_page: this.pagination.per_page
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariants'),
        headers: headers,
        params: params
      }).then(response => {
        this.variants = response.data.data
        this.tmp = { ...response.data.data}
        this.variantData = response.data
        this.total = response.data.meta.total
        this.showVarian = true
        this.loading = false
        this.pagination.total = response.data.meta.total
        this.pagination.per_page = parseInt(response.data.meta.per_page)
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.total = 0
        this.showVarian = false
        this.loading = false
      })
    },

    updateProduct(data) {
      let headers = {
        'Authorization': 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/' + this.product.id),
        headers: headers,
        data: {
          product: {
            variant_label: data.variant_label
          }
        }
      }).then( response => {
        this.product = response.data.data
      })
    },

    handleNewVariant(data) {
      if (this.product.variant_label !== data.variant_label) {
        this.updateProduct(data)
      }
      this.getVariants()
    },

    handleNewVariants(formData, formLabels) {
      var newVar = {
        product: {
          variant_label: formLabels.join(',')
        },
        variant: formData
      }
      // console.log('data', newVar)
      let headers = {
        'Authorization': 'Bearer ' + this.token.access_token
      }
      axios({
          method: 'PUT',
          url: baseApi(this.selectedStore.url_id, this.langId, 'product/updatevariantmultiple/' + this.product.id),
          headers: headers,
          data: newVar
        }).then(response => {
          // console.log(response)
          this.getVariants()
        }).catch(error => {
          // this.loading = true
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },

    handleExpansion(row, expandedRows) {
      this.expandedRows = expandedRows.length
      this.isEdit = false
    },

    handleCurrentPage(page) {
      this.pagination.currentPage = page
      this.getVariants()
    },

    updateSorting(data) {
      // console.log(this.expandedRows)
      if (!this.expandedRows) {
        let headers = {
          'Authorization': 'Bearer ' + this.token.access_token
        }
        this.loading = true
        var sorted_ids = []
        this.variants.map(i => {
          sorted_ids.push({
            id: i.id
          })
        })
  
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productvariants/sorting'),
          headers: headers,
          data: {
            product_id: this.product.id,
            sorted_ids: sorted_ids
          }
        }).then(response => {
            // console.log(response)
            this.loading = false
            this.isEdit = false
        }).catch(error => {
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
    },

    changePageTable(val) {
      this.pagination.per_page = val
      this.getVariants()
    },

    sortTable (data) {
      console.log(data)
      // if (this.expandedRows === 0) {
        this.expandedRows = 0
        this.isEdit = true
      // }
    },

    cancelSorting () {
      this.variants = this.tmp
    },

    handleSelectionChange(val) {
      if (val.length > 0) {
        this.IsDelBtnDisabled = false
        this.chosenProducts = val
      } else {
        this.IsDelBtnDisabled = true
      }
    },

    handleDeleteBulk() {
      this.loadingDeleteBulk = true
      let data = {
        variant_id: []
      }
      this.chosenProducts.map(i => {
        data.variant_id.push(i.id)
      })
      deleteBulkVariant(data).then(response => {
        // this.$message({
        //   message: response.data.data.message,
        //   type: 'success'
        // })
        this.loadingDeleteBulk = false
        this.dialogDeleteProducts = false
        this.getVariants()
      }).catch(error => {
        this.loadingDeleteBulk = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
  },

  mounted() {
    this.getVariants()
    if (this.productData) {
      this.product = this.productData
    }
  }
}
</script>
