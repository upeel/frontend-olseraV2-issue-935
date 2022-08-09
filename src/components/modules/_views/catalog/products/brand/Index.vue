<template>
  <div>
    <div class="affix-wrapper flex-container flex-container--start flex-container--desktop">
      <div
        v-if="checkCustomPermission('catalog/brands', 'store')"
        class="affix-container mr-16">
        <group-form @save="save" :loading="loading" :saved="saved"></group-form>
      </div>

      <el-card v-loading="loading" class="box-card flex-grow-1" shadow="never">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1;">{{ $lang[langId].list }} {{ lang.brand }}</h4>
          <div v-if="showSaveSorts">
            <button-action-authenticated
              :permission="['catalog/brands', 'edit']"
              :disabled="disabledSaveSorts"
              type="success"
              icon="el-icon-check"
              @click="saveSorts">
              {{ lang.save }}
            </button-action-authenticated>
          </div>
        </div>

        <div
          class="card-body">
          <draggable
            v-model="data"
            :list="data"
            :options="{group:{ name:'brand'}}"
            handle=".hand"
            class="dd-list dragArea"
            @change="sortsChanged">
            <div class="dd-item" v-for="(item) in data" :key="item.id">
              <list :item="item" @edit="handleEditItem" />
            </div>
          </draggable>

          <div class="load-more" v-if="moreLink" v-loading="loadingItems">
            <el-button
              @click="loadMore"
              class="btn-block">
              {{ $lang[langId].load_more }}..
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <edit-item
      :is-editing="isEditing"
      :item="singleData"
      :loading="loading"
      @close="isEditing = false"
      @save="update"
      @delete="remove"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import GroupForm from './Form'
import List from './List'
import EditItem from './EditItem'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: {
    GroupForm,
    draggable,
    List,
    EditItem
  },

  mixins: [checkCustomPermission],

  data() {
    return {
      loading: true,
      loadingItems: false,
      saved: false,
      data: [],
      tmpData: [],
      moreLink: null,
      disabledSaveSorts: true,
      showSaveSorts: false,
      managingItems: false,
      disabledButton: false,
      singleData: null,
      isEditing: false,
      tmp: {
        data: []
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
    '$store.getters.selectedStore': function() {
      this.getData()
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
        this.moreLink = response.data.links.next
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

    sortsChanged(data) {
      this.disabledSaveSorts = false
      this.showSaveSorts = true
    },

    save(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
        headers: headers,
        data
      }).then(response => {
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.getData()
        this.saved = true
        this.loading = false
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

    saveSorts() {
      this.disabledSaveSorts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        per_page: this.data.length
      }
      let sortedIds = this.data.slice(0)
      sortedIds = sortedIds.map((item) => {
        return {id: item.id}
      })
      let data = {
        sorted_ids: sortedIds
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand/sorting'),
        headers: headers,
        params,
        data
      }).then(response => {
        this.data = response.data.data
        this.showSaveSorts = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.disabledSaveSorts = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    loadMore() {
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: this.moreLink,
        headers: headers
      }).then(response => {
        this.data = this.data.concat(response.data.data)
        this.loadingItems = false
        this.moreLink = response.data.links.next
      }).catch(error => {
        this.loadingItems = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    remove(data) {
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand/' + data.id),
        headers: headers,
        params: {
          name: data.name
        }
      }).then(response => {
        this.data.map((item, idx) => {
          if (item.id === data.id) {
            this.data.splice(idx, 1)
          }
        })
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingItems = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingItems = false
      })
    },

    handleEditItem(data) {
      this.singleData = { ...data }
      this.isEditing = true
    },

    update(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand' + '/' + data.id),
        headers: headers,
        data
      }).then(response => {
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.getData()
        this.saved = true
        this.loading = false
      }).catch(error => {
        this.saved = false
        this.loading = false
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
