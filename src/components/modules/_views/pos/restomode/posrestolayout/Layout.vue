<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header" class="table-handler-flex">
        <h4 class="box-title">{{ lang.restaurant_layout }} {{ data.name }}</h4>
        <div>
          <el-button type="text" @click="back" icon="el-icon-back">{{ lang.back }}</el-button>
          <button-action-authenticated
            :permission="['settings/posrestolayout', 'edit']"
            type="success"
            @click="addTable"
            icon="el-icon-plus">
            {{ $lang[langId].manage_table }}
          </button-action-authenticated>
        </div>
      </div>

      <layout-control
        v-if="checkCustomPermission('settings/posrestolayout', 'edit')"
        :layout="layout"
        :lang="lang"
        @cols="setCols"
        @rows="setRows"
      />

      <designer
        @cell-clicked="add"
        @update-position="addByDrag"
        @remove="removeData"
        :layout="layout"
        :chachelis="chachelis"
        ref="designer"
      />
    </el-card>

    <el-dialog v-model="showDialog" :visible.sync="showDialog" :title="$lang[langId].select_table" width="220px">
      <el-select v-model="maybeInserted.id">
        <el-option
          v-for="item in availableChachelis"
          :value="item.id"
          :key="item.id"
          :label="item.text"
        />
      </el-select>
      <div slot="footer">
        <el-button @click="okAdd" type="success">
          {{ lang.add }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="no-header"
      :visible.sync="showManageTables"
      width="80%">
      <div class="dialog-body" v-loading="loadingDialog">
        <table-form
          :form-data="data"
          @remove="removeDialog"
          @save="save"
          :saved="saved"
        />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ lang.are_you_sure_to_remove_this_data }}
          <span style="font-weight: bold;">"{{ data.name }}"</span>
        </p>
        <p style="color: #AFB0AF;">{{ rootLang.info_delete_item }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="remove">{{ rootLang.delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { baseApi } from 'src/http-common'
import { Designer } from 'components/modules/layoutbuilder'
import LayoutControl from './LayoutControl'
import TableForm from './Form'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
const apiEndPoint = 'posrestolayout/'

export default {
  components: {
    Designer,
    LayoutControl,
    TableForm
  },

  mixins: [checkCustomPermission],

  data() {
    return {
      loading: false,
      loadingDialog: false,
      chachelis: [],
      saved: false,
      maybeInserted: {
        id: null,
        row: null,
        col: null
      },
      showDialog: false,
      showManageTables: false,
      layout: {
        cols: 0,
        rows: 0
      },
      data: {},
      deleteDialog: false,
      dataTmp: []
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    availableChachelis() {
      return this.chachelis.filter(item => {
        if (item.available) {
          return item
        }
        // if (item.y <= 0) {
        //   item.y = -1
        //   item.x = -1
        //   item.available = true
        //   return item
        // }
      })
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'detail/' + this.$route.params.id),
        headers: headers
      }).then(response => {
        this.chachelis = []
        this.data = response.data.data
        this.layout.cols = this.data.cols
        this.layout.rows = this.data.rows
        this.data.items.map(item => {
          let braw = {
            id: item.id,
            x: item.col,
            y: item.row,
            w: 1,
            h: 1,
            text: item.name,
            available: true
          }
          if (item.col > -1 || item.row > -1) {
            braw.available = false
          }
          this.chachelis.push(braw)
        })
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    save(data) {
      this.loadingDialog = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'update' + '/' + data.id),
        headers: headers,
        data
      }).then(response => {
        this.chachelis = []
        this.data = response.data.data
        this.layout.cols = this.data.cols
        this.layout.rows = this.data.rows
        this.data.items.map(item => {
          let braw = {
            id: item.id,
            x: item.col,
            y: item.row,
            w: 1,
            h: 1,
            text: item.name,
            available: true
          }
          if (item.col > -1 || item.row > -1) {
            braw.available = false
          }
          this.chachelis.push(braw)
        })

        this.saved = true
        this.loadingDialog = false
        this.showManageTables = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loadingDialog = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    setCols(v) {
      if (v >= this.$refs.designer.minColumns() && v <= 15) {
        this.layout.cols = v
      }
      this.saveGrid()
    },

    setRows(v) {
      if (v >= this.$refs.designer.minRows() && v <= 15) {
        this.layout.rows = v
      }
      this.saveGrid()
    },

    resetMaybeInserted() {
      this.maybeInserted.id = null
      this.maybeInserted.x = null
      this.maybeInserted.y = null
    },

    add(item) {
      this.resetMaybeInserted()

      this.maybeInserted.row = item.row
      this.maybeInserted.col = item.col
      this.showDialog = true
    },

    addByDrag(item) {
      if (!this.checkCustomPermission('settings/posrestolayout', 'edit')) {
        return
      }
      this.resetMaybeInserted()

      this.maybeInserted.id = item.id
      this.maybeInserted.row = item.row
      this.maybeInserted.col = item.col

      const data = {
        id: this.data.id,
        items: [this.maybeInserted]
      }

      const promise = new Promise((resolve, reject) => {
        this.promiseSave(data, resolve, reject)
      })

      promise.then(response => {
        this.resetMaybeInserted()
        this.showDialog = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    okAdd() {
      this.chachelis.map(item => {
        if (item.id === this.maybeInserted.id) {
          item.available = false
          item.y = this.maybeInserted.row
          item.x = this.maybeInserted.col
        }
      })

      const data = {
        id: this.data.id,
        items: [this.maybeInserted]
      }

      const promise = new Promise((resolve, reject) => {
        this.promiseSave(data, resolve, reject)
      })

      promise.then(response => {
        this.resetMaybeInserted()
        this.showDialog = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    saveGrid() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'updategrid'),
        headers: headers,
        data: {
          id: this.$route.params.id,
          cols: this.layout.cols,
          rows: this.layout.rows
        }
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    promiseSave(data, resolve, reject) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'updatelayout'),
        headers: headers,
        data
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'success'
        })
        resolve(response.data.data)
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    back() {
      this.$router.push({ path: '/restomode/posrestolayout' })
    },

    addTable() {
      this.showManageTables = true
    },

    remove() {
      this.loadingDialog = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + this.data.id),
        headers
      }).then(response => {
        this.loadingDialog = false
        this.deleteDialog = false
        this.dataTmp = []
        this.back()
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingDialog = false
        this.deleteDialog = false
        this.dataTmp = []
      })
    },
    removeDialog(data) {
      this.deleteDialog = true
      this.dataTmp = data
    },
    cancelDeleteDialog() {
      this.deleteDialog = false
      this.dataTmp = []
    },

    removeData(item) {
      // console.log('trace', command)
      // this.loadingCategory = true
      let message = 'Nomor meja ' + item.text + ' akan dihapus dari layout?'
      this.$confirm(message, '', {
        confirmButtonText: this.rootLang.yes,
        cancelButtonText: this.lang.cancel,
        showClose: false,
        type: ''
      }).then(() => {
        this.loading = true
        this.resetMaybeInserted()

        this.maybeInserted.id = item.id
        this.maybeInserted.row = -1
        this.maybeInserted.col = -1

        const data = {
          id: this.data.id,
          items: [this.maybeInserted]
        }

        const promise = new Promise((resolve, reject) => {
          this.promiseSave(data, resolve, reject)
        })

        promise.then(response => {
          this.resetMaybeInserted()
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      }).catch(() => {
        this.chachelis.map(i => {
          if (i.id === item.id) {
            i.available = false
          }
        })
      })
    },
  },

  mounted() {
    this.getData()
  }
}
</script>

