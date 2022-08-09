<template>
  <div>
    <div class="affix-wrapper flex-container flex-container--start flex-container--desktop">
      <div
        v-if="checkCustomPermission('catalog/productgroups', 'store')"
        class="affix-container mr-16">
        <group-form
          ref="formCreate"
          @save="save"
          :loading="loading"
          :specifications="specifications"
          :saved="saved"
        />
      </div>

      <el-card v-loading="loading" shadow="never" class="flex-grow-1">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1;">{{ $lang[langId].list }} {{ lang.group }}</h4>
          <div v-if="showSaveSorts">
            <button-action-authenticated
              :permission="['catalog/productgroups', 'edit']"
              :disabled="disabledSaveSorts"
              type="success"
              icon="el-icon-check"
              @click="saveSorts">
              {{ lang.save }}
            </button-action-authenticated>
          </div>
        </div>

        <div class="card-body">
          <draggable
            :options="{group:{ name:'groups'}}"
            :list="data"
            handle=".hand"
            class="dd-list dragArea"
            @change="sortsChanged">
            <div
              v-for="(item) in data"
              :key="item.id"
              class="dd-item">
              <list :item="item" @edit="handleEditItem" />

              <draggable
                :options="{group:{ name:'groups'}}"
                :list="item.children"
                handle=".hand"
                class="dd-list children dragArea"
                @change="sortsChanged">
                <div
                  v-for="(child) in item.children"
                  :key="child.id"
                  class="dd-item">
                  <list
                    :item="child"
                    @edit="handleEditItem"
                  />
                </div>
              </draggable>

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
    </div>

    <edit-item
      :is-editing="isEditing"
      :item="singleData"
      :specifications="specifications"
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
      specifications: [],
      singleData: {},
      isEditing: false,
      tmpData: [],
      moreLink: null,
      disabledSaveSorts: true,
      showSaveSorts: false,
      disabledButton: false,
      tmp: {
        data: []
      },
      list: [
        {
          name: "task 1",
          tasks: [
            {
              name: "task 2",
              tasks: []
            }
          ]
        },
        {
          name: "task 3",
          tasks: [
            {
              name: "task 4",
              tasks: []
            }
          ]
        },
        {
          name: "task 5",
          tasks: []
        }
      ]
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
    }
  },

  mounted() {
    this.getData()
    this.getSpecifications()
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let promise = new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
          params: this.params,
          headers: headers
        }).then(response => {
          let data = response.data.data.map(item => {
            item.category_id = item.category_id.toString()
            return item
          })
          this.data = data
          // console.log(this.data)
          this.moreLink = response.data.links.next
          // this.getSpecifications(resolve, reject)
          this.loading = false
        }).catch(error => {
          this.loading = false
          reject(error)
        })
      })

      promise.then(() => {
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },

    getSpecifications(resolve, reject) {
      const headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      // const specifications = (url = null, resolve, reject) => {
        // if (!url) {
        const url = baseApi(this.selectedStore.url_id, this.langId, 'category')
        // }
        axios({
          method: 'GET',
          url: url,
          params: {
            per_page: 100
          },
          headers: headers
        }).then(response => {
          this.specifications = response.data.data
          // resolve(response)
          this.loading = false
        }).catch(error => {
          // console.log(error)
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.message,
            message: error.string
          })
          reject(error)
        })
      // }
      // return specifications(null, resolve, reject)
    },

    async getSingleData(id) {
      await axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup/' + id),
        params: this.params,
        headers: {
          Authorization: 'Bearer ' + this.token.access_token
        }
      }).then(response => {
        this.singleData = response.data.data
      })
    },

    sortsChanged(data) {
      // console.log(data)
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
        headers: headers,
        data
      }).then(response => {
        this.getData()
        this.saved = true
        this.loading = false
        this.$refs.formCreate.refreshData()
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        // console.log(error)
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
      // let sortedIds = this.data.slice(0)
      let sortedIds = this.data
      sortedIds = sortedIds.map((item, idx) => {
        let data = {
          id: item.id,
          children: []
        }
        if (item.children && item.children.length > 0) {
          item.children.map(child => {
            // data.children.push({id: Number.parseInt(child.id, 0)})
            data.children.push({id: child.id, name: child.name})
          })
        }
        return data
      })
      let data = {
        sorted_ids: sortedIds
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup/sorting'),
        headers: headers,
        params: {
          per_page: this.data.length
        },
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
        let data = response.data.data.map(item => {
          item.category_id = item.category_id.toString()
          return item
        })
        this.data = this.data.concat(data)
        this.loadingItems = false
        this.moreLink = response.data.links.next
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

    remove(data) {
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup/' + data.id),
        headers: headers,
        params: {
          name: data.name
        }
      }).then(response => {
        this.data = []
        this.getData()
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingItems = false
      }).catch(error => {
        this.loadingItems = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    dataChanges(data) {
      this.tmp.data.push(data)
    },

    handleEditItem(item) {
      this.getSingleData(item.id)
      this.isEditing = true
    },

    update(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      // if (data.disabled) {
      //   this.$delete(data, 'disabled')
      // }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup/' + data.id),
        headers: headers,
        data
      }).then(() => {
        this.getData()
        this.isEditing = false
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  }
}
</script>
