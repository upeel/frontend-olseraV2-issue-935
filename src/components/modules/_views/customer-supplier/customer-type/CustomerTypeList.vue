<template>
  <div>
    <el-card
      v-loading="loading"
      class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ $lang[langId].list }} {{ lang.customer_type }}</h4>
          <p v-if="!showCustomerType">0 {{ lang.customer }}</p>
          <p v-else>{{ total }} {{ lang.customer }}</p>
        </div>

        <button-action-authenticated :permission="['customer/customertypes', 'store']" type="success" @click="showCreateDialog" icon="el-icon-plus">
          {{ lang.add }}
        </button-action-authenticated>
      </div>

      <div class="card-body">
        <div v-if="!showCustomerType" class="no-product">
          <p>{{ $lang[langId].no_data }}</p>
          <img src="/static/img/no-data.svg" alt="No Data Picture">
        </div>
        <div v-else>
          <div v-for="(group, index) in customerTypeData" :key="index">
            <div class="col-md-4">
              <div class="box box-banner-info">
                <div class="box-header">
                  <h3 class="box-title" v-if="!rowState[index].edited">{{ group.name }}</h3>
                  <el-input v-if="rowState[index].edited" v-model="formEdit.name" class="mr-4"></el-input>
                  <el-button type="text" v-if="rowState[index].edited" class="mr-4" @click="cancelHandle(index)">{{ lang.cancel }}</el-button>
                  <el-button type="success" v-if="rowState[index].edited" @click="saveHandle(index)">{{ lang.save }}</el-button>
                  <el-dropdown trigger="click" v-if="!rowState[index].edited">
                    <el-button type="text">
                      <svg-icon icon-class="more-vertical"></svg-icon>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <button-action-authenticated :permission="['customer/customertypes', 'destroy']" type="text" @click="showDeleteDialog(group)" class="delete-button btn-block text-left">
                          <svg-icon icon-class="trash"></svg-icon>
                          {{ rootLang.delete }}
                        </button-action-authenticated>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <button-action-authenticated :permission="['customer/customertypes', 'edit']" type="text" @click="editHandle(index, group)" class="edit-button btn-block text-left">
                          <svg-icon icon-class="edit"></svg-icon>
                          {{ lang.edit }}
                        </button-action-authenticated>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="box-body text-center pointer" @click="handleShowCustomer(group)">
                  <i class="dripicons-user"></i>
                  <span>{{ group.total_customer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog
      class="type-dialog"
      :title="lang.add"
      :visible.sync="createDialog"
      :close-on-click-modal="false">
      <div v-loading="loadingAdd">
        <span>{{ lang.name+' '+lang.customer_type }}?</span>
        <el-input v-model="formAdd.name" @keyup.native.enter="createTypeSave"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" @click="createDialog = false" class="cancel-button">{{ lang.cancel }}</el-button>
          <el-button type="text" @click="createTypeSave" class="save-button">
            <svg-icon icon-class="save" style="stroke: #6EBE46;"></svg-icon>
            {{ lang.save }}
          </el-button>
        </span>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="deleteDialog"
      append-to-body
      center
      custom-class="dialog-warning">
      <span slot="title">
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ lang.are_you_sure_to_remove_this_data }}?</p>
        <span style="font-weight: bold;">{{ lang.customer_type }}: {{ deleteData.name }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="deleteHandle">{{ $lang[langId].delete }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'CustomerTypeList',
  data() {
    return {
      loading: false,
      customerTypeData: [],
      rowState: [],
      deleteData: {},
      showCustomerType: false,
      total: 0,
      createDialog: false,
      deleteDialog: false,
      formLabelWidth: '40%',
      form: {},
      formAdd: {
        name: ''
      },
      formEdit: {
        id: '',
        name: ''
      },
      loadingAdd: false
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
    '$store.getters.selectedStore'() {
      this.getCustomerType()
    }
  },
  methods: {
    getCustomerType() {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        let params = {
          search_text: '',
          per_page: 300
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
          params: params,
          headers: headers
        }).then(response => {
          this.customerTypeData = response.data.data
          this.rowState = this.customerTypeData.map(row => {
            return { edited: false }
          })
          this.total = response.data.meta.total
          this.showCustomerType = true
          this.loading = false
          // console.log(response)
        }).catch((error) => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loading = false
          // console.log(error)
        })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.showCustomerType = true
      this.total = 10
      this.customerTypeData = require('/static/data/mockupCustomerTypes.json')
      this.customerTypeData.map(() => {
        this.rowState.push({
          edited: false
        })
      })
    },
    showCreateDialog() {
      this.formAdd.name = ''
      this.createDialog = true
    },
    createTypeSave() {
      console.log('aaaaa')
      this.loading = true
      this.loadingAdd = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        name: this.formAdd.name
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          // if (response.data.status === 200) {
          //   this.customerTypeData = response.data.data
          //   this.$message({
          //     message: 'Success',
          //     type: 'success'
          //   })
          // }
          this.loading = false
          this.loadingAdd = false
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.createDialog = false
          this.getCustomerType()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.loadingAdd = false
          this.createDialog = false
        })
    },
    editHandle(index, row) {
      this.formEdit.id = row.id
      this.formEdit.name = row.name
      this.rowState[index].edited = true
    },
    cancelHandle(index) {
      this.rowState[index].edited = false
      this.formEdit.id = ''
      this.formEdit.name = ''
    },
    saveHandle(index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        pk: this.formEdit.id,
        name: 'name',
        value: this.formEdit.name
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customertype/updateattr'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          this.loading = false
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.rowState[index].edited = false
          this.getCustomerType()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.rowState[index].edited = false
        })
    },
    showDeleteDialog(row) {
      // let data = row
      // console.log(data)
      this.deleteData = row
      this.deleteDialog = true
    },
    cancelDeleteDialog() {
      this.deleteData = {}
      this.deleteDialog = false
    },
    deleteHandle() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = this.deleteData.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customertype/' + id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          // this.rowState[index].edited = false
          this.deleteDialog = false
          this.getCustomerType()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          // this.rowState[index].edited = false
          this.deleteDialog = false
          // console.log(error)
        })
    },

    handleShowCustomer (data) {
      this.$router.push(
        { 
          path: '/customersupplier/customer', 
          query: { type: data.name } 
        }
      )
    }
  },
  mounted() {
    this.getCustomerType()
  }
}
</script>
