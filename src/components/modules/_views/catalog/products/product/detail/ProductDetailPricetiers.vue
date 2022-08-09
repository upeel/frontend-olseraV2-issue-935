<template>
  <el-card
    v-loading="loading"
    class="box-card">
    <div slot="header" class="table-handler-flex">
      <div class="box-title" style="flex-grow: 1;">
        <h4 class="box-title">{{ $lang[langId].list }} {{ lang.price_tiers }}</h4>
        <p v-if="showPricetiers">{{ total }} {{ lang.price_tiers }}</p>
        <p v-else>0 {{ lang.product }} {{ lang.price_tiers }}</p>
      </div>
      <div>
        <button-action-authenticated
          :permission="['catalog/products', 'edit']"
          type="primary"
          @click="pricetiersDialog = true">
          {{ lang.add }}
        </button-action-authenticated>
      </div>
    </div>

    <div class="card-body">
      <div class="table-handler-flex">
        <el-select
          v-model="params.per_page"
          :placeholder="lang.please_select"
          class="inline-form"
          filterable
          size="small"
          @change="handleSizeChange">
          <el-option
            v-for="item in pages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <el-divider></el-divider>

      <el-table :data="pricetiersData">
        <el-table-column :label="lang.customer_type">
          <template slot-scope="scope">
            <div v-if="!scope.row.customer_type_name">
              <el-input disabled value="-" v-if="!rowState[scope.$index].edited"></el-input>
              <!-- <el-select
                :placeholder="lang.please_select"
                v-model="scope.row.customer_type_id" v-else>
                <el-option v-for="item in customerType" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select> -->
              <el-autocomplete
                v-else
                v-model="searchQuery"
                :fetch-suggestions="getCustomerType"
                :placeholder="rootLang.info_auto_complete_tipe_customer"
                :debounce="300"
                style="width: 100%"
                @select="getCustomerSelect"
              />
            </div>
            <div v-else>
              <el-input v-model="scope.row.customer_type_name" disabled v-if="!rowState[scope.$index].edited"></el-input>
              <el-autocomplete
                v-else
                v-model="searchQuery"
                :fetch-suggestions="getCustomerType"
                :placeholder="rootLang.info_auto_complete_tipe_customer"
                :debounce="300"
                style="width: 100%"
                @select="getCustomerSelect"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="lang.variant">
          <template slot-scope="scope">
            <div v-if="!scope.row.product_variant_name">
              <el-input disabled :value="lang.all" v-if="!rowState[scope.$index].edited"></el-input>
              <el-select
                id="select_variant1"
                :automatic-dropdown="true"
                :placeholder="lang.please_select"
                v-model="scope.row.product_variant_id" v-else
                @change="handleMoreVariantsTable(scope.row.product_variant_id, scope.$index)">
                <el-option :label="lang.all" :value="0" />
                <el-option v-for="item in variants" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-option v-if="moreVariant" :value="9999" style="background: #767676; color: #F5F5F5;">
                  <span style="font-size: 13px; margin-right: 10px; float: left">
                    <el-button 
                      type="text" 
                      icon="el-icon-more" 
                      size="mini" 
                      style="color: #F5F5F5;">
                    </el-button>
                  </span>
                  <span>{{ $lang[langId].load_more }}</span>
                </el-option>
              </el-select>
            </div>
            <div v-else>
              <el-input
                v-model="scope.row.product_variant_name"
                disabled v-if="!rowState[scope.$index].edited"></el-input>
              <el-select
                id="select_variant1"
                :automatic-dropdown="true"
                :placeholder="lang.please_select"
                v-model="scope.row.product_variant_id" v-else
                @change="handleMoreVariantsTable(scope.row.product_variant_id, scope.$index)">
                <el-option :label="lang.all" :value="0" />
                <el-option v-for="item in variants" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-option v-if="moreVariant" :value="9999" style="background: #767676; color: #F5F5F5;">
                  <span style="font-size: 13px; margin-right: 10px; float: left">
                    <el-button 
                      type="text" 
                      icon="el-icon-more" 
                      size="mini" 
                      style="color: #F5F5F5;">
                    </el-button>
                  </span>
                  <span>{{ $lang[langId].load_more }}</span>
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="lang.qty_from" max-width="80px">
          <template slot-scope="scope">
            <div v-if="!scope.row.qty_from">
              <el-input disabled value="-" v-if="!rowState[scope.$index].edited"></el-input>
              <el-input-number id="input_qty1" controls-position="right" v-model="scope.row.qty_from" v-else></el-input-number>
            </div>
            <div v-else>
              <el-input v-model="scope.row.qty_from" disabled v-if="!rowState[scope.$index].edited"></el-input>
              <el-input type="number" ref="input_qty1" id="input_qty2" :min="0" v-model="scope.row.qty_from" v-else></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="lang.sale_price">
          <template slot-scope="scope">
            <div v-if="!scope.row.sell_price">
              <el-input disabled value="-" v-if="!rowState[scope.$index].edited"></el-input>
              <!-- <money v-model="scope.row.sell_price" class="el-input__inner" v-else></money> -->
              <input-money v-else v-model="scope.row.sell_price" />
            </div>
            <div v-else>
              <el-input v-model="scope.row.fsell_price" disabled v-if="!rowState[scope.$index].edited"></el-input>
              <input-money v-else v-model="scope.row.sell_price" />
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="100px">
          <template slot-scope="scope">
            <el-button type="default" v-if="rowState[scope.$index].edited" @click="pricetiersCancel(scope.$index)" size="mini">{{ lang.cancel }}</el-button>
            <el-button type="primary" v-if="rowState[scope.$index].edited" @click="handleSimpanRow(scope.$index, scope.row)" size="mini">{{ lang.save }}</el-button>
            <el-button type="primary" v-if="!rowState[scope.$index].edited" @click="handleEditRow(scope.row, scope.$index)" size="mini">{{ lang.edit }}</el-button>
            <el-button type="danger" v-if="!rowState[scope.$index].edited" @click="pricetiersDelete(scope.row)" size="mini">{{ rootLang.delete }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 12px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="params.currentPage" :page-size="params.per_page" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-dialog :title="lang.add_price_tier" :visible.sync="pricetiersDialog">
        <el-form :model="form">
          <el-form-item :label="lang.customer_type" :label-width="formLabelWidth">
            <!-- <el-select class="inline-form" v-model="form.customer" filterable :placeholder="lang.please_select">
              <el-option v-for="item in customerType" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select> -->
              <el-autocomplete
                v-model="searchQuery"
                :fetch-suggestions="getCustomerType"
                :placeholder="rootLang.info_auto_complete_tipe_customer"
                @select="getCustomerSelect"
                style="width: 100%"
              />
          </el-form-item>
          <el-form-item :label="lang.variant" :label-width="formLabelWidth">
            <el-select
              id="select_variant"
              :loading="loadingMore"
              class="inline-form"
              v-model="form.variant"
              filterable
              :placeholder="lang.please_select"
              @change="handleMoreVariants">
              <el-option
                :value="null"
                label="All"
              />
              <el-option
                v-for="item in variants"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
              <el-option v-if="moreVariant" :value="0" style="background: #767676; color: #F5F5F5;">
                <span style="font-size: 13px; margin-right: 10px; float: left">
                  <el-button 
                    type="text" 
                    icon="el-icon-more" 
                    size="mini" 
                    style="color: #F5F5F5;">
                  </el-button>
                </span>
                <span>{{ $lang[langId].load_more }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="lang.qty_from" :label-width="formLabelWidth">
            <el-input id="inputQty" type="number" :min="0" v-model="form.qty"></el-input>
          </el-form-item>
          <el-form-item :label="lang.sale_price" :label-width="formLabelWidth">
            <input-money v-model="form.sellPrice" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pricetiersDialog = false">{{ lang.cancel }}</el-button>
          <el-button type="primary" @click="createNewPricetiers">{{ lang.add }}</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'DetailPricetiers',

  components: {
    InputMoney
  },

  data() {
    return {
      loading: true,
      pricetiersData: [],
      total: null,
      pricetiersDialog: false,
      formLabelWidth: '40%',
      customerType: [],
      variants: [],
      showPricetiers: false,
      rowState: [],
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
        currentPage: 1,
        per_page: 5,
        page: 1,
        product_id: this.$route.params.id
      },
      form: {
        customer: null,
        variant: null,
        qty: 1,
        sellPrice: 0,
        save_type: 'one'
      },
      searchQuery: '',
      moreVariant: null,
      loadingMore: false
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
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

  watch: {
    'form.variant'(item) {
      this.handleSelectedVariant(item)
    }
  },

  methods: {
    getPricetiers() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productpricetiers'),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.pricetiersData = response.data.data
          this.rowState = this.pricetiersData.map(row => {
            return { edited: false }
          })
          this.total = response.data.meta.total
          this.showPricetiers = true
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.total = 0
          this.pricetiersData = []
          this.showPricetiers = false
          this.loading = false
        })
    },

    handleEditRow(data, index) {
      this.rowState[index].edited = true
      this.searchQuery = data.customer_type_name
    },

    handleSimpanRow(index, row) {
      this.rowState[index].edited = false
      this.pricetiersSave(row)
    },

    getCustomerSelect(item) {
      this.form.customer = item.id
      // this.formAddProduct.product = parseInt(this.formAddProduct.product)
    },

    getCustomerType(queryString, callback) {
      // this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: queryString
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.customerType = response.data.data
          callback(this.customerType)
          // this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.customerType = []
          this.loading = false
        })
    },

    getVariants() {
      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        product_id: this.$route.params.id
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariants'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.variants = response.data.data
          this.moreVariant = response.data.links.next
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },

    getMoreVariants(index) {
      console.log('trace', index)
      this.loadingMore = true
      if (index === null) {
        this.form.variant = this.variants[this.variants.length - 1].id
      } else {
        this.pricetiersData[index].product_variant_id = this.variants[this.variants.length - 1].id
      }
      

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        product_id: this.$route.params.id,
        // per_page: 50
      }

      axios({
        method: 'GET',
        url: this.moreVariant,
        headers: headers,
        params: params
      })
        .then(response => {
          this.variants = this.variants.concat(response.data.data)
          this.moreVariant = response.data.links.next
          console.log(this.$refs.input_qty2)
          // document.getElementById('inputQty').focus()
          if(index === null) {
            document.getElementById('inputQty').focus()
            document.getElementById('select_variant').focus()
          } else {
            document.getElementById('input_qty2').focus()
            document.getElementById('select_variant1').focus()
          }
          this.loadingMore = false
        })
        .catch(error => {
          console.log(error)
          this.loadingMore = false
        })
    },

    handleSizeChange(val) {
      this.params.per_page = val
      this.getPricetiers()
    },

    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getPricetiers()
    },

    pricetiersCancel(index) {
      this.rowState[index].edited = false
    },

    pricetiersEdit(row) {
      this.isEditPriceTiers = true
    },

    pricetiersSave(row) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = row.id
      let data = {
        product_ids: [row.product_id, row.product_variant_id].join('|'),
        customer_type_id: this.form.customer ? this.form.customer : row.customer_type_id,
        qty_from: row.qty_from,
        sell_price: row.sell_price
      }

      // let data = row.customer_type_id && row.qty_from && row.sell_price
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productpricetiers/' + id),
        headers: headers,
        data: data
      })
        .then(response => {
          this.responseUpdate = response.data
          this.form.customer = ''
          this.loading = false
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.getPricetiers()
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },

    pricetiersDelete(row) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = row.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productpricetiers/' + id),
        headers: headers
      })
        .then(response => {
          this.loading = false
          this.deleteData = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.isEditPriceTiers = false
            this.getPricetiers()
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
          this.getPricetiers()
        })
    },

    createNewPricetiers() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        product_ids: [this.$route.params.id, this.form.variant].join('|'),
        customer_type_id: this.form.customer,
        qty_from: this.form.qty,
        sell_price: this.form.sellPrice
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productpricetiers'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.responseCreate = response.data
          this.resetForm()
          this.loading = false
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.pricetiersDialog = false
          this.getPricetiers()
        })
        .catch(error => {
          console.log(error)
          this.loading = false
          this.pricetiersDialog = true
        })
    },

    resetForm() {
      this.searchQuery = ''
      this.form.customer = null
      this.form.variant = null
      this.form.qty = 1
      this.form.sellPrice = 0
      this.form.save_type = 'one'
    },

    handleSelectedVariant(item) {
      if (!item) {
        this.form.save_type = 'all'
        this.form.variant = null
      } else {
        this.form.save_type = 'one'
      }
    },

    handleMoreVariants (data) {
      if (data === 0) {
        this.getMoreVariants(null)
      }
    },

    handleMoreVariantsTable (data, index) {
      // console.log(data)
      if (data === 9999) {
        this.getMoreVariants(index)
      }
    }
  },

  mounted() {
    this.getPricetiers()
    // this.getCustomerType()
    this.getVariants()
  }
}
</script>

