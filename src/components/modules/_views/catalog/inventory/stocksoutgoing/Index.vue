<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.outgoing_stock }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.outgoing_stock }}</p>
        </div>

        <div>
          <button-action-authenticated
            :permission="['inventory/stockoutgoings', 'store']"
            icon="el-icon-upload"
            @click="importDialog =  true">
            {{ lang.import }}
          </button-action-authenticated>
          <el-dropdown class="drop-complete" @command="addData">
            <button-action-authenticated
              :permission="['inventory/stockoutgoings', 'store']"
              type="primary"
              icon="el-icon-plus"
              :disabled="isButtonDisabled">
              {{ lang.add }}
            </button-action-authenticated>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(command, index) in downloadSelect"
                :key="index"
                :command="index"
                :disabled="command.locked">
                <div class="flex-container">
                  <div class="flex-grow-1">
                    {{ command.label }}
                  </div>
                  <svg-icon v-if="command.locked" icon-class="lock" />
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div class="table-handler-flex mb-16">
        <div class="mb-8" style="flex-grow: 1;">
          <el-select
            v-model="params.per_page"
            :placeholder="lang.please_select"
            filterable
            size="small"
            @change="changePageTable"
            class="inline-form">
            <el-option
              v-for="item in pages"
              :key="item"
              :value="item"
              :label="item + ' ' + lang.rows"
            />
          </el-select>
        </div>

        <div class="mb-8">
          <el-input
            class="inline-form input-search"
            clearable
            :placeholder="lang.search+' '+lang.outgoing_stock_no"
            prefix-icon="el-icon-search"
            v-model="searchValue"
            @change="handleSearch" size="small">
          </el-input>
        </div>
      </div>

      <el-table :data="tableData" border stripe v-loading="loading" @sort-change="changeSortTable" >
        <el-table-column :label="$lang[langId].number" sortable prop="trans_no" width="160">
          <template slot-scope="props">
            <router-link :to="{path: '/inventory/stocksoutgoing/' + props.row.id}">
              {{ props.row.trans_no }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="lang.transfer_to" sortable prop="transfer_to_store_name" width="220"></el-table-column>
        <el-table-column :label="lang.date" sortable prop="date" width="120">
          <template slot-scope="props">
            {{props.row.fdate}}
          </template>
        </el-table-column>
        <el-table-column :label="lang.notes" sortable prop="note" width="200"></el-table-column>
        <el-table-column :label="lang.status" sortable prop="status" width="80">
          <template slot-scope="props">
            <el-tag size="mini"
              v-if="props.row.status === 'D'"
              type="warning">
              {{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini"
              v-else-if="props.row.status === 'P'"
              type="success">
              {{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini"
              v-else-if="props.row.status === 'X'"
              type="danger">{{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini" v-else>
              {{ props.row.status_desc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="lang.received_by" prop="modified_by"></el-table-column>
        <el-table-column v-if="wejayafoodAccessByStore.includes(selectedStore.url_id)" :label="rootLang.post_to_profitloss" prop="already_post_to_profitloss">
          <template slot-scope="scope">
            <div class="full-width" v-if="scope.row.status !== 'D'">
              <el-button v-if="scope.row.already_post_to_profitloss === 0" class="btn-block" type="primary" :loading="scope.row.loadingPost" @click="postDataToProfitLoss(scope.row.id, scope.$index)">Post</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="changePageTable"
        @current-change="changeCurrentPage"
        :current-page.sync="params.currentPage"
        :page-size="params.per_page"
        layout="prev, pager, next, jumper"
        :total="params.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="lang.update+lang.status"
      :visible.sync="importDialog"
      max-width="760px">
      <el-row :gutter="10">
        <el-col :md="8">
          <a
            :href="baseURL + 'olsera_stockout_import_template.csv'"
            class="btn btn-default">
            {{ lang.download_template }}
          </a>
        </el-col>

        <el-col :md="16">
          <el-card v-if="dropdownForm">
            <div slot="header" class="clearfix">
              <span>{{ lang.import_from_csv_info }}</span>
            </div>
            <vue-dropzone
              ref="dropzone"
              id="drop1"
              :options="{
                url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/stockoutgoing/importfromcsv',
                headers: {
                  'Authorization' : 'Bearer ' + this.token.access_token,
                  'Cache-Control': null,
                },
                method: 'post',
                acceptedFiles: '.csv'
                }"
              @vdropzone-success="afterComplete"
              @vdropzone-error="failed"
            />
            <el-button
              style="margin-top: 8px"
              @click="removeAllFiles">
              {{ $lang[langId].remove_all_file }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import { postProfitloss } from '@/api/catalog/inventory/outgoing'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { isHiddenByFeature } from '@/utils/hiddenFeaturesByPlanType'
import ButtonActionAuthenticated from '../../../../../ButtonActionAuthenticated.vue'
// var moment = require('moment')
// const today = moment().format('YYYY-MM-DD')
export default {
  name: 'OpenOrderList',
  components: {
    vueDropzone: vue2Dropzone,
    tokenc: '',
    ButtonActionAuthenticated
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: true,
      isButtonDisabled: false,
      tableData: [],
      statusValue: null,
      searchValue: null,
      importDialog: false,
      dropdownForm: true,
      pages: [5, 10, 20],
      statusSelect: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },
        {
          value: 'Pending',
          label: this.$lang[this.$store.state.userStores.langId].pending
        },
        {
          value: 'Shipping',
          label: this.$lang[this.$store.state.userStores.langId].has_confirm
        },
        {
          value: 'Shipped',
          label: this.$store.state.userStores.lang.delivered
        }
      ],
      downloadSelect: [
        {
          value: 'transfer',
          label: this.$store.state.userStores.lang.transfer_to_store,
          locked: isHiddenByFeature(this.$store.getters.selectedStore.plan_type_id, '/inventory/stocksoutgoing/create?path=transfer')
        },
        {
          value: 'add',
          label: this.$store.state.userStores.lang.add + ' ' + this.$store.state.userStores.lang.outgoing_stock,
          locked: false
        }
      ],
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 10,
        page: 1
      },
      storeBrances: []
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
  watch: {
    '$store.getters.selectedStore'() {
      this.getData()
      // this.getStoreBrance()
    }
  },
  mounted() {
    this.getData()
    this.getStoreBrance()
  },
  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockoutgoings'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.tableData = response.data.data
          this.tableData.map(i => {
            i.loadingPost = false
          })
          this.params.total = response.data.meta.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.params.total = 0
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },
    getStoreBrance: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storebranches/'),
        headers: headers
      }).then(response => {
        this.storeBrances = response.data.data
        this.params.total = response.data.meta.total
        // this.data.map(() => {
        //   this.isEditing.push({
        //     editing: false,
        //     block: ''
        //   })
        // })
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.params.total = 0
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
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
      this.params.search = this.searchValue
      this.getData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type
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
    addData(file) {
      var add = ''
      if(file === 0) {
        add = 'transfer'
      } else {
        add = 'add'
      }
      this.$router.push({ path: '/inventory/stocksoutgoing/create', query: { path: add } })
    },
    // importDialog() {
    //   this.$router.push({path: '/inventory/importstockout'})
    // }
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        this.$notify({
          title: 'Sukses',
          message: response.data + ' Produk.'
        })
        this.importDialog = false
        this.$router.push({path: '/inventory/stocksoutgoing/' + response.id})
      }
    },
    failed(file, message, xhr) {
      console.log('file', file)
      console.log('message', message)
      console.log('xhr', xhr)
      const $ = require('jquery')
      $('.dz-error-message span').text(message.error.error)
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles()
    },
    goToSinglePage(row) {
      this.$router.push({path: '/inventory/stocksoutgoing/' + row.id})
    },

    postDataToProfitLoss(dataId, index) {
      this.tableData[index].loadingPost = true
      postProfitloss(dataId)
        .then(response => {
          this.getData()
          this.tableData[index].loadingPost = false
          this.$notify({
            type: 'success',
            title: 'Success',
            message: 'Sukses post ke laba rugi'
          })
        })
        .catch(error => {
          this.tableData[index].loadingPost = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },
  }
}
</script>
