<template>
  <div>
    <el-card  
      v-loading="loading"
      class="box-card">
      <div slot="header" class="flex-container flex-container--wrap">
        <div style="flex-grow: 1;">
          <h3 class="box-title">{{ $lang[langId].list }} {{ lang.related_products }}</h3>
          <p v-if="showRelated">{{ total }} {{ lang.related_products }}</p>
          <p v-else>0 {{ lang.related_products }}</p>
        </div>
        <button-action-authenticated
          :permission="['catalog/products', 'edit']"
          type="primary"
          @click="dialogCreate">
          {{ lang.add }}
        </button-action-authenticated>
      </div>
      <div class="card-body">
        <div v-if="!showRelated" class="no-product">
          <p>{{ $lang[langId].no_product }}</p>
          <img src="/static/img/no-data.svg" alt="No Data Picture">
        </div>
        <div v-else>
          <div v-for="(item, index) in relatedsData" :key="index" class="card-related">
            <el-col :span="12">
              <el-card>
                <div class="row">
                  <div class="col-md-10">
                    <p>
                      <strong>{{ item.name }}</strong>
                    </p>
                  </div>
                  <div class="col-md-2 text-right">
                    <el-dropdown trigger="click" class="pull-right">
                      <el-button type="text" style="color:#909399">
                        <i class="material-icons md-18">more_vert</i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <el-button type="text" style="color: #FF0000" @click="deleteRelated(item)">
                            <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                            {{ $lang[langId].delete }}
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4 card-image">
                    <img :src="item.photo_xs" :alt="item.name" class="rounded">
                  </div>
                  <div class="col-md-8">
                    <div>
                      <el-row>
                        <el-col :span="11">
                          {{ lang.sku }}
                        </el-col>
                        <el-col :span="11">
                          {{ lang.category }}
                        </el-col>
                      </el-row>
                    </div>
                    <div>
                      <el-row>
                        <el-col :span="11">
                          {{ item.sku }}
                        </el-col>
                        <el-col :span="11">
                          {{ item.product_group_name }}
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog
      :visible.sync="relatedDialog"
      width="800px">
      <el-form
        v-loading="reladtedDialogLoading">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <p>{{ lang.search }} {{ lang.related_products }}</p>
          </el-col>
          <el-col :span="12" :offset="6">
            <el-autocomplete
              v-model="searchText"
              :fetch-suggestions="getProductSearch"
              :placeholder="$lang[langId].product_sku"
              clearable
              @select="getProductSelect"
              prefix-icon="el-icon-search"
            />
          </el-col>
        </el-row>

        <div v-if="productSearchData">
          <el-table stripe ref="multipleTable" v-loading="loading" :data="productSearchData">
            <el-table-column :label="labelTotal" class="text-center" width="auto" min-width="150px">
              <template slot-scope="props">
                <img v-if="props.row.photo_md" class="table-image" :src="props.row.photo_md" />
                <img v-else class="table-image" :src="props.row.photo_xs" />
              </template>
            </el-table-column>

            <el-table-column prop="name" min-width="150px">
              <template slot-scope="props">
                <el-row>
                  <p>
                    <strong>{{ props.row.name }}</strong>
                  </p>
                  <p>{{ lang.sku}}</p>
                  <p>
                    <strong>{{ props.row.sku }}</strong>
                  </p>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column prop="name" min-width="100px">
              <template slot-scope="props">
                <el-row>
                  <p> </p>
                  <p>{{ lang.category }}</p>
                  <p>
                    <strong>{{ props.row.category_name }}</strong>
                  </p>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column min-width="100px">
              <template slot-scope="scope">
                <el-button v-if="isDisabled" disabled>
                  <i class="el-icon-plus" />
                </el-button>
                <el-button :plain="true" @click="createNewRelated(scope.row.id)" v-else>
                  <i class="el-icon-plus" />
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- <el-row :gutter="20" v-else>
          <el-col :span="12" :offset="6">
            <p style="margin-left: 40px;">{{ lang.search }} {{ lang.related_products }}</p>
          </el-col>
        </el-row> -->
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'DetailRelated',

  data() {
    return {
      loading: true,
      relatedsData: null,
      total: null,
      formLabelWidth: '40%',
      relatedDialog: false,
      searchData: [],
      productSearchData: null,
      totalProduct: null,
      labelTotal: '',
      isDisabled: false,
      deleteData: null,
      showRelated: false,
      reladtedDialogLoading: false,
      searchText: ''
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
    }
  },

  methods: {
    clearDataCreate() {
      this.searchData = []
      this.productSearchData = null
      this.totalProduct = 0
      this.labelTotal = ''
      this.isDisabled = false
    },

    getRelated() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        product_id: this.$route.params.id
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productrelateds'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.relatedsData = response.data.data
          this.total = response.data.meta.total
          this.showRelated = true
          this.loading = false
        })
        .catch(() => {
          this.relatedsData = []
          this.total = 0
          this.showRelated = false
          this.loading = false
        })
    },

    getProductSelect(item) {
      this.reladtedDialogLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        page: 1,
        currentPage: 1,
        search_text: '',
        search_column: null,
        search: item.name
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.productSearchData = response.data.data
          this.totalProduct = response.data.meta.total
          this.changeHeaderTable()
          this.reladtedDialogLoading = false
        })
        .catch(error => {
          console.log(error)
          this.reladtedDialogLoading = false
        })
    },

    getProductSearch(queryString, callback) {
      // this.reladtedDialogLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        name: queryString
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productsearchname'),
        headers: headers,
        params: params
      }).then(response => {
        for (let i of response.data) {
          i.value = i.name
        }
        this.searchData = response.data
        callback(this.searchData)
        // this.reladtedDialogLoading = false
      }).catch(() => {
        this.searchData = []
        callback(this.searchData)
        // this.reladtedDialogLoading = false
      })
    },

    dialogCreate() {
      this.relatedDialog = true
      this.clearDataCreate()
    },

    deleteRelated(item) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        product_id: item.product_id,
        rel_product_id: item.rel_product_id
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productrelateds'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loading = false
          this.deleteData = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.getRelated()
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
          this.getRelated()
        })
    },

    changeHeaderTable() {
      this.labelTotal = this.totalProduct + ' ' + this.lang.product + ' ' + this.$lang[this.langId].found
    },

    createNewRelated(val) {
      this.loading = true
      let data = {
        product_id: this.$route.params.id,
        product_ids: val
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productrelateds'),
        headers: headers,
        data: data
      })
        .then(response => {
          if (!response.data.data) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          } else {
            this.loading = false
            this.relatedsData = response.data.data
            this.total = response.data.meta.total
            if (response.data.status === 200) {
              this.$message({
                message: 'Success',
                type: 'success'
              })
            }
          }
          this.relatedDialog = false
          this.getRelated()
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    }
  },
  mounted() {
    this.getRelated()
  }
}
</script>

