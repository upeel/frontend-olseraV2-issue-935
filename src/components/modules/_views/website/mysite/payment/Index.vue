<template>
  <div v-loading="loading">
    <el-card class="box-card" v-if="!showForm">
      <div slot="header" class="clearfix">
        <div class="row">
          <div class="col-sm-7">
            <h4>{{ lang.payment_methods }}</h4>
            <p>{{ params.total }} {{ lang.payment }}</p>
          </div>
          <div class="col-sm-5 text-right">
            <button-action-authenticated
              :permission="['settings/paymentmodes', 'store']"
              :disabled="disabledButton"
              type="success"
              icon="el-icon-plus"
              size="small"
              @click="add">
              {{ lang.add }}
            </button-action-authenticated>
          </div>
        </div>
      </div>

      <div class="card-body">
        <draggable
          :option="{group: { name: 'payment'}}"
          class="dd-list dragArea"
          v-model="data"
          @change="saveSorts">
          <div class="dd-item" v-for="(item) in data" :key="item.id">
            <list :item="item" @edit="edit"></list>
          </div>
        </draggable>

        <div class="load-more" v-if="moreLink" v-loading="loadingItems">
          <el-button
            :disabled="disabledButton"
            @click="loadMore"
            class="btn-block">
            {{ $lang[langId].load_more }}
          </el-button>
        </div>
      </div>
    </el-card>

    <item-form
      v-if="showForm"
      :saved="saved"
      :loading="loading"
      :form-data="tmp"
      @remove="remove"
      @save="save"
      @cancel="cancel">
    </item-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import draggable from 'vuedraggable'
import List from './List'
import ItemForm from './Form'
const apiEndpoint = 'paymentmode/'

export default {
  components: {
    draggable,
    List,
    ItemForm
  },
  data() {
    return {
      loading: true,
      loadingItems: false,
      data: [],
      tmp: {},
      moreLink: null,
      disabledButton: false,
      showForm: false,
      saved: false,
      params: {
        per_page: 100
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
    }
  },
  watch: {
    'store.getters.selectedStore': function () {
      this.getData()
    }
  },
  methods: {
    getData: function () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: this.params
      }).then(response => {
        this.data = response.data.data
        this.params.total = response.data.meta.total
        this.moreLink = response.data.links.next
        this.loading = false
      }).catch(error => {
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
    getSingleData(id) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers,
        params: this.params
      }).then(response => {
        this.tmp = response.data.data
        this.loading = false
        this.showForm = true
      }).catch(error => {
        this.loading = false
        this.showForm = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    saveSorts() {
      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let sortedIds = [...this.data]
      sortedIds = sortedIds.map((item, idx) => {
        let data = {
          id: item.id
        }
        return data
      })
      let data = {
        sorted_ids: sortedIds
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'sorting'),
        headers: headers,
        params: {
          per_page: this.data.length
        },
        data
      }).then(response => {
        this.data = response.data.data
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    loadMore() {
      this.disabledButton = true
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: this.moreLink,
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = this.data.concat(response.data.data)
        this.moreLink = response.data.links.next
        this.loadingItems = false
        this.disabledButton = false
      }).catch(error => {
        this.loadingItems = false
        this.disabledButton = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    edit(item) {
      let id = item.id
      this.getSingleData(id)
    },
    add() {
      this.showForm = true
    },
    cancel() {
      this.showForm = false
      this.tmp = {}
    },
    save(data) {
      if (data.payment_type_id === 'BT') {
        let saveData = {
          payment_type_id: data.payment_type_id,
          instructions: data.instructions,
          bt_bank_id: data.bt_bank_id,
          bt_branch_code: data.bt_branch_code,
          bt_account_no: data.bt_account_no,
          bt_account_name: data.bt_account_name,
          activate_unique_code: data.activate_unique_code
        }
        if (data.id) {
          this.$set(saveData, 'id', data.id)
        }
        this.savePayment(saveData)
      } else if (data.payment_type_id === 'CO') {
        data.cities = [...data.cities]
        data.cities = data.cities.join(',')
        let saveData = {
          payment_type_id: data.payment_type_id,
          instructions: data.instructions,
          name: data.name,
          cd_cities: data.cities
        }
        if (data.id) {
          this.$set(saveData, 'id', data.id)
        }
        this.savePayment(saveData)
      } else if (data.payment_type_id === 'PP') {
        let saveData = {
          payment_type_id: data.payment_type_id,
          instructions: data.instructions,
          pp_user_name: data.pp_user_name,
          pp_password: data.pp_password,
          pp_signature: data.pp_signature,
          pp_currency_id: data.pp_currency_id
        }
        if (data.id) {
          this.$set(saveData, 'id', data.id)
        }
        this.savePayment(saveData)
      } else if (data.payment_type_id === 'SN' || data.payment_type_id === 'VT') {
        let saveData = {
          payment_type_id: data.payment_type_id,
          instructions: data.instructions,
          vt_name: data.name,
          vt_server_key: data.vt_server_key,
          vt_client_key: data.vt_client_key,
          vt_production_mode: data.vt_production_mode
        }
        if (data.id) {
          this.$set(saveData, 'id', data.id)
          this.$set(saveData, 'name', data.name)
        }
        this.savePayment(saveData)
      }
    },
    savePayment(saveData) {
      let method = 'POST'
      let id = ''

      if (saveData.id) {
        method = 'PUT'
        id = saveData.id
      }

      this.loading = true
      let data = saveData
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers,
        data
      }).then(response => {
        this.tmp = {}
        this.saved = true
        this.showForm = false
        this.loading = false
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    remove(data) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + data.id),
        headers: headers
      }).then(response => {
        this.tmp = {}
        this.saved = true
        this.showForm = false
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

