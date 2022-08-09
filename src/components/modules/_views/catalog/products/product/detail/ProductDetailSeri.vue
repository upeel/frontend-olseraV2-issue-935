<template>
  <div v-loading="loading" class="row">
    <div class="col-md-12">
      <el-card class="box-card">
        <div slot="header" class="flex-container flex-container--wrap">
          <div style="flex-grow: 1;">
            <h3 class="box-title">
              {{ $lang[langId].list }} {{ lang.serial }}
            </h3>
            <p v-if="showSerial">{{ total }} {{ lang.serial }}</p>
            <p v-else>0 {{ lang.serial }}</p>
          </div>

          <el-input
            clearable
            class="inline-form"
            prefix-icon="el-icon-search"
            v-model="params.search"
            @change="handleSearch" size="small"
          />
          <button-action-authenticated
            :permission="['catalog/products', 'edit']"
            type="primary"
            icon="el-icon-plus"
            @click="handleDialog">
            {{ lang.add }}
          </button-action-authenticated>
        </div>

        <div class="card-body">
          <div v-if="!showSerial" class="no-product">
            <p>{{ $lang[langId].no_product }}</p>
            <img src="/static/img/no-data.svg" alt="No Data Picture">
          </div>
          <div v-else>
            <div class="table-handler">
              <el-select class="inline-form" v-model="params.per_page" @change="handleSizeChange" filterable :placeholder="lang.please_select" size="small">
                <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>

            <el-table :data="serialsData" stripe>
              <el-table-column prop="serial_no" :label="lang.serial_no" sortable></el-table-column>
              <el-table-column prop="product_variant_name" :label="lang.variant" sortable></el-table-column>
              <el-table-column prop="stock_in_out_ref" :label="lang.order_no" sortable>
                <template slot-scope="scope">
                  <div v-if="scope.row.is_closedorders">
                    <router-link :to="'/sales/completeorder/' + scope.row.sales_order_id">
                      {{ scope.row.order_no }}
                    </router-link>
                  </div>
                  <div v-else>
                    <router-link :to="'/inventory/stocksoutgoing/' + scope.row.stock_in_out_id">
                      {{ scope.row.stock_in_out_ref }}
                    </router-link>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="lang.registered" align="center" sortable>
                <template slot-scope="scope">
                  <p v-if="scope.row.registered = 1">{{ lang.yes }}</p>
                  <p v-else>{{ lang.no }}</p>
                </template>
              </el-table-column>
              <el-table-column :label="$lang[langId].action" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click">
                    <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                    <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                      <el-dropdown-item>
                        <el-button type="text" style="color: #FF0000" @click="deleteSingleSerials(scope.row)">
                          <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                          {{ $lang[langId].delete }}
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 12px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="params.currentPage" :page-size="params.per_page" layout="prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :title="lang.add_serial" :visible.sync="createDialog">
      <el-form :model="form">
        <el-form-item :label="lang.variant" :label-width="formLabelWidth">
          <el-select class="inline-form" v-model="form.variant" filterable :placeholder="lang.please_select">
            <el-option v-for="item in variantsData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="lang.serial_no" :label-width="formLabelWidth">
          <el-input v-model="form.noSeri" :placeholder="$lang[langId].input_number" @keyup.enter.native="createNewSerial"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false">{{ lang.cancel }}</el-button>
        <el-button type="primary" :disabled="disableAdd" @click="createNewSerial" >{{ lang.add }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'DetailSeri',
  data() {
    return {
      loading: true,
      serialsData: [],
      variantsData: [],
      total: null,
      createDialog: false,
      showSerial: false,
      formLabelWidth: '40%',
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
        currentPage: 1,
        per_page: 5,
        page: 1,
        product_id: this.$route.params.id
      },
      form: {
        variant: '',
        noSeri: ''
      }
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

    disableAdd () {
      if (this.form.noSeri) {
        return this.form.noSeri.length > 1 ? false : true
      } else {
        return true
      }
    }
  },
  methods: {
    clearDataCreate() {
      this.form = {
        variant: null,
        noSeri: null
      }
    },
    getSerials() {
      this.loading = true
      this.serialsData = []
      this.showSerial = false
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productserials'),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.serialsData = response.data.data
          this.total = response.data.meta.total
          this.showSerial = true
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.total = 0
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
          this.variantsData = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },

    handleSearch(val) {
      this.params.search = val
      this.getSerials()
    },

    handleSizeChange(val) {
      this.params.per_page = val
      this.getSerials()
    },
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getSerials()
    },
    handleDialog() {
      this.clearDataCreate()
      this.createDialog = true
    },
    changeValue() {
      this.form.noSeri = parseInt(this.form.noSeri)
    },
    deleteSingleSerials(row) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productserials/' + row.id),
        headers: headers
      })
        .then(response => {
          this.responseDeleteRow = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.createDialog = false
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.getSerials()
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    createNewSerial() {
      this.loading = true
      let data = {
        product_id: this.$route.params.id,
        serial_no: this.form.noSeri,
        product_variant_id: this.form.variant
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productserials'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.loading = false
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.relatedsData = response.data.data
          this.createDialog = false
          this.getSerials()
        })
        .catch(error => {
          this.$message({
            message: error.response.data.error.error,
            type: 'error'
          })
          this.loading = false
        })
    }
  },
  mounted() {
    this.clearDataCreate()
    this.getSerials()
    this.getVariants()
  }
}
</script>
