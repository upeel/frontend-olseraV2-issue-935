<template>
  <div>
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="clearfix">
        <h4>{{positionName}}</h4>
        <span class="oldgrey size-12">
          {{positionDesc}}
        </span>
        <div class="card-buttons">
          <button-action-authenticated :permission="['website/sitenav', 'store']" type="success" size="small" @click="addItem">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="card-body">
        <draggable
          :options="{group:{ name: position}}"
          class="dd-list dragArea"
          v-model="navItems"
          @change="sortsChanged('H')">
          <div
            v-for="(item, key) in navItems"
            :key="key"
            class="dd-item">
            <list :item="item" @edit="editItem"></list>
          </div>
        </draggable>
      </div>
    </el-card>

    <el-dialog
      :title="$lang[langId].menu+' ' + positionName"
      :visible.sync="dialogFormItem"
      @closed="resetState"
      v-loading="loading">
      <el-form v-model="form">
        <el-form-item :label="lang.title" label-width="180px">
          <el-input type="text" :placeholder="$lang[langId].please_input+lang.menu_title" v-model="form.title">
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.link_type" label-width="180px">
          <el-select filterable v-model="form.link_type_id">
            <el-option
              v-for="(item) in arrLinkType"
              :key="item.value"
              :label="item.title"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.link_type_id === 'PGR'"
          label-width="180px"
          :label="lang.product_groups">
          <el-select
            style="width: 100%;"
            v-model="form.product_group_id"
            filterable
            clearable
            remote
            :placeholder="lang.info_auto_complete_product_group"
            :remote-method="searchProductGroups"
            :loading="searchingProductGroups">
            <el-option
              v-for="item in searchResultProductGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.link_type_id === 'PCL'"
          label-width="180px"
          :label="$lang[langId].collection_product">
          <el-select
            style="width: 100%;"
            v-model="form.collection_id"
            filterable
            remote
            clearable
            reserve-keyword
            :placeholder="lang.info_auto_complete_collection"
            :remote-method="searchCollections"
            :loading="searchingCollections">
            <el-option
              v-for="item in searchResultCollections"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.link_type_id === 'PRD'"
          label-width="180px"
          :label="lang.product">
          <el-select
            style="width: 100%;"
            v-model="form.product_id"
            filterable
            remote
            clearable
            reserve-keyword
            :placeholder="lang.info_auto_complete_product"
            :remote-method="searchProducts"
            :loading="searchingProducts">
            <el-option
              v-for="item in searchResultProducts"
              :key="item.product_id"
              :label="item.name"
              :value="item.product_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.link_type_id === 'ATT'"
          label-width="180px"
          :label="lang.tag">
          <el-select
            v-model="form.article_tag_id"
            :multiple="false"
            :placeholder="lang.info_auto_complete_product"
            :remote-method="searchArticleTags"
            :loading="searchingArticleTags"
            filterable
            remote
            clearable
            reserve-keyword
            style="width: 100%;">
            <el-option
              v-for="item in searchResultArticleTags"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.link_type_id === 'PAG'"
          label-width="180px"
          :label="lang.page">
          <el-select
            style="width: 100%;"
            v-model="form.page_id"
            filterable
            remote
            clearable
            reserve-keyword
            :placeholder="lang.info_auto_complete_page"
            :remote-method="searchPages"
            :loading="searchingPages">
            <el-option
              v-for="item in searchResultPages"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.link_type_id === 'EXL'"
          :label="$lang[langId].link" label-width="180px">
          <el-input type="text" v-model="form.link_url" :placeholder="lang.info_external_url">
          </el-input>
        </el-form-item>

        <el-form-item label-width="180px">
          <button-action-authenticated
            v-if="editingItem.id"
            :permission="['website/sitenav', 'destroy']"
            @click="removeItem"
            :disabled="disabledButton"
            type="danger"
            class="btn-plain"
            icon="el-icon-delete">
          </button-action-authenticated>
          <el-button
            @click="cancelEditItem"
            :disabled="disabledButton"
            type="info"
            icon="el-icon-close">
            {{ lang.cancel }}
          </el-button>
          <el-button
            :disabled="disabledButton"
            type="success"
            @click="saveEditItem"
            icon="el-icon-check">
            {{ lang.save }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import List from './List'
import draggable from 'vuedraggable'

export default {
  components: {List, draggable},
  props: {
    position: {
      default: 'H',
      type: String
    },
    outlet: {
      default: '',
      type: String
    },
    positionName: {
      default: '',
      type: String
    },
    positionDesc: {
      default: '',
      type: String
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

  data() {
    return {
      loading: false,
      navItems: [],
      dialogFormItem: false,
      form: {},
      editingItem: {},
      arrLinkType: [
        {id: 0, value: 'HOM', judul: 'Beranda', title: this.$store.state.userStores.lang.home},
        {id: 1, value: 'CTL', judul: 'Semua Kategori', title: this.$lang[this.$store.state.userStores.langId].all_category},
        {id: 2, value: 'PGR', judul: 'Kategori Produk', title: this.$store.state.userStores.lang.product_category},
        {id: 3, value: 'PCL', judul: 'Koleksi Produk', title: this.$lang[this.$store.state.userStores.langId].collection_product},
        {id: 4, value: 'FEA', judul: 'Unggulan', title: this.$store.state.userStores.lang.featured},
        {id: 5, value: 'NRL', judul: 'Rilis Baru', title: this.$store.state.userStores.lang.new_release},
        {id: 6, value: 'POP', judul: 'Populer', title: this.$store.state.userStores.lang.popular},
        {id: 7, value: 'PRO', judul: 'Pre-order', title: this.$store.state.userStores.lang.preorder},
        {id: 8, value: 'SAL', judul: 'Sale', title: this.$store.state.userStores.lang.sales},
        {id: 9, value: 'PRD', judul: 'Produk', title: this.$store.state.userStores.lang.product},
        {id: 10, value: 'PCB', judul: 'Paket Produk', title: this.$store.state.userStores.lang.product_combo},
        {id: 11, value: 'PAG', judul: 'Halaman Web', title: this.$store.state.userStores.lang.page},
        {id: 12, value: 'ART', judul: 'Semua Artikel', title: this.$lang[this.$store.state.userStores.langId].all_article},
        {id: 13, value: 'ATT', judul: 'Artikel berdasarkan Tag', title: this.$lang[this.$store.state.userStores.langId].article_based_tag},
        {id: 14, value: 'FAQ', judul: 'Pertanyaan Umum', title: this.$store.state.userStores.lang.f_a_q},
        {id: 15, value: 'LBK', judul: 'Lookbook', title: this.$store.state.userStores.lang.look_book},
        {id: 16, value: 'TES', judul: 'Testimoni', title: this.$lang[this.$store.state.userStores.langId].testimoni},
        {id: 17, value: 'TOU', judul: 'Ketentuan Penggunaan', title: this.$lang[this.$store.state.userStores.langId].term_of_use},
        {id: 18, value: 'PPO', judul: 'Kebijakan Privasi', title: this.$lang[this.$store.state.userStores.langId].privacy_policy},
        {id: 19, value: 'RFP', judul: 'Kebijakan Pengembalian', title: this.$lang[this.$store.state.userStores.langId].return_policy},
        {id: 20, value: 'EXL', judul: 'Link Eksternal', title: this.$store.state.userStores.lang.external_url}
      ],
      searchingProductGroups: false,
      searchingCollections: false,
      searchingProducts: false,
      searchingPages: false,
      searchingArticleTags: false,
      searchResultProductGroups: [],
      searchResultCollections: [],
      searchResultProducts: [],
      searchResultPages: [],
      searchResultArticleTags: [],
      disabledButton: false
    }
  },

  watch: {
    outlet() {
      this.loadData()
    }
  },

  methods: {
    loadData() {
      this.resetState()
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.outlet, this.langId, 'sitenav'),
        headers,
        params: {
          position: this.position,
          per_page: 100
        }
      }).then(response => {
        this.navItems = response.data.data
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.navItems = []
        this.loading = false
      })
    },
    updateSorts(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.outlet, this.langId, 'sitenav/sorting'),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.loadData()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },
    sortsChanged() {
      let navItemIds = [...this.navItems]
      let data = {
        sorted_ids: navItemIds,
        position: this.position
      }
      this.updateSorts(data)
    },

    addItem() {
      this.dialogFormItem = true
    },

    editItem(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.outlet, this.langId, 'sitenav/' + data.id),
        headers
      }).then(response => {
        this.editingItem = response.data.data
        this.form = {...this.form, ...this.editingItem}
        if (this.form.link_type_id === 'PGR') {
          this.$set(this.form, 'product_group_id', response.data.data.link_id)
          this.searchResultProductGroups.push({
            name: this.form.link_name,
            id: this.form.link_id
          })
        } else if (this.form.link_type_id === 'PCL') {
          this.$set(this.form, 'collection_id', response.data.data.link_id)
          this.searchResultCollections.push({
            name: this.form.link_name,
            id: this.form.link_id
          })
        } else if (this.form.link_type_id === 'PRD') {
          this.$set(this.form, 'product_id', response.data.data.link_id)
          this.searchResultProducts.push({
            name: this.form.link_name,
            product_id: this.form.link_id
          })
        } else if (this.form.link_type_id === 'ATT') {
          this.$set(this.form, 'article_tag_id', response.data.data.link_id)
          this.searchResultArticleTags.push({
            name: this.form.link_name,
            id: this.form.link_id
          })
        } else if (this.form.link_type_id === 'PAG') {
          this.$set(this.form, 'page_id', response.data.data.link_id)
          this.searchResultPages.push({
            title: this.form.link_name,
            id: this.form.link_id
          })
        }
        this.dialogFormItem = true
        this.loading = false
      })
    },
    cancelEditItem() {
      this.resetState()
      this.dialogFormItem = false
    },
    saveEditItem() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let method = 'PUT'
      let endpoint = 'sitenav/' + this.editingItem.id
      let data = this.form
      if (!this.editingItem.id) {
        method = 'POST'
        endpoint = 'sitenav/'
        data.position = this.position
      }
      axios({
        method,
        url: baseApi(this.outlet, this.langId, endpoint),
        headers,
        data
      }).then(response => {
        this.loadData()
        this.dialogFormItem = false
        this.loading = false
        this.$message({
          message: 'Success',
          type: 'success'
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },
    removeItem() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.outlet, this.langId, 'sitenav/' + this.editingItem.id),
        headers
      }).then(response => {
        this.loadData()
        this.dialogFormItem = false
        this.loading = false
        this.$message({
          message: 'Success',
          type: 'danger'
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },
    searchProductGroups(query) {
      //
      this.searchingProductGroups = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc',
        per_page: 100,
      }
      if (query) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProductGroups = false
          this.searchResultProductGroups = response.data.data
        }).catch(() => {
          this.searchingProductGroups = false
          this.searchResultProductGroups = []
        })
      }
    },
    searchCollections(query) {
      //
      this.searchingCollections = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'collection'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingCollections = false
          this.searchResultCollections = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingCollections = false
          this.searchResultCollections = []
        })
      }
    },
    searchProducts(query) {
      //
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
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProducts = false
          this.searchResultProducts = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProducts = false
          this.searchResultProducts = []
        })
      }
    },
    searchPages(query) {
      //
      this.searchingPages = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'title',
        search_text: query,
        sort_column: 'title',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'page'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingPages = false
          this.searchResultPages = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingPages = false
          this.searchResultPages = []
        })
      }
    },
    searchArticleTags(query) {
      //
      this.searchingArticleTags = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        name: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'article/searchtags'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingArticleTags = false
          this.searchResultArticleTags = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingArticleTags = false
          this.searchResultArticleTags = []
        })
      }
    },
    resetState() {
      this.editingItem = {}
      this.form = {}
    },
    
    handleSelectPGR (data) {
      console.log(data)
    }
  },

  mounted() {
    this.loadData()
  }
}
</script>
