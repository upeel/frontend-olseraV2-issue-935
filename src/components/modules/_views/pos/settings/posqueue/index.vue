<template>
  <div>
    <el-card class="box-card el-card-null mt-24">
      <div class="flex-container p-20" v-loading="loadingDisplay">
        <!-- <div class="container-icon">
          <svg-icon icon-class="ico-payon-thespot" class="font-20" />
        </div> -->
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ $lang[langId].enable_queue_number_pos }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataDisplay.status_active ? $lang[langId].active : $lang[langId].inactive }}</span>
        </div>
        <div class="pointer">
          <el-switch
            v-if="checkCustomPermission('settings/posqueue', 'edit')"
            v-model="dataDisplay.status_active"
            :active-value="1"
            :inactive-value="0"
            @change="updateDisplay">
          </el-switch>
        </div>
      </div>
    </el-card>

    <el-card class="card_close_date box-card">
      <div class="header">
        <span class="title">{{ lang.pos_devices }}</span>
        <div style="float: right">
          <button-action-authenticated
            :permission="['settings/posqueue', 'store']"
            @click="dialogAddDevices = true">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>
      <div style="text-align: center;">
        <div v-if="!dataDevices.length">
          <img src="/static/img/no-data.svg" class="image" style="margin-top: 32px">
          <div class="no_close" >{{ rootLang.no_pos_devices }}</div>
          <span style="font-size: 14px">{{ rootLang.no_pos_devices_info }}</span>
        </div>
        <div v-else class="mt-10">
          <el-table
            v-loading="loadingQueue"
            stripe
            style="width: 100%"
            :data="dataDevices"
            @row-click="getDetailDevices">
            <el-table-column :label="rootLang.serial_devices" prop="serial" min-width="180px" >
              <template slot-scope="scope">
                <div class="flex-container">
                  <div style="margin-right: 5px" class="font-bold">{{ scope.row.serial }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Prefix" prop="prefix" align="center" >
              <template slot-scope="scope">
                {{ scope.row.prefix }}
              </template>
            </el-table-column>
            <el-table-column min-width="40" align="right">
              <template slot-scope="scope">
                <button-action-authenticated :permission="['settings/posqueue', 'edit']" type="text" @click="getDetailDevices(scope.row)" size="mini">
                  <div class="container-icon">
                    <svg-icon icon-class="edit-2" class="font-20" />
                  </div>
                </button-action-authenticated>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-pagination
      v-if="params.total > 15"
      :total="params.total"
      :page-size="15"
      :current-page.sync="params.currentPage"
      background
      layout="prev, pager, next"
      @current-change="changeCurrentPage"
    />

    <el-dialog 
      :visible.sync="dialogAddDevices"
      :show-close="false"
      :before-close="cancelAddDevices"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Device
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="cancelAddDevices">{{ lang.cancel }}</el-button>
            <el-button
              v-if="(form.id && checkCustomPermission('settings/posqueue', 'edit')) || (!form.id && checkCustomPermission('settings/posqueue', 'store'))"
              :loading="loadingAdd"
              type="success"
              @click="saveDevices" >{{ lang.save }}
            </el-button>
          </div>
        </div>
        <div>
          <div class="mt-16">
            <div class="font-12">{{ rootLang.serial_devices }}</div>
            <el-input v-model="form.serial"></el-input>
            <div class="font-12 mt-8">Prefix</div>
            <el-input v-model="form.prefix"></el-input>
          </div>
        </div>
        <div v-if="form.id" class="mt-24">
          <delete-button custom-permission="settings/posqueue" :loading="loadingDelete" :block="true" @confirm="deleteDevices"></delete-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { dataQueueDevices as getDataQueue,
  dataQueueDisplay as getDataDisplay,
  updateQueueDisplay,
  addQueueDevices as addDevices,
  updateQueueDevices as updateDevices,
  deleteQueueDevices as deleteDevices } from '@/api/possetting'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import DeleteButton from '@/components/modules/DeleteButton'

export default {
  name: 'PosQueue',
  mixins: [basicComputedMixin],

  components: {
    DeleteButton
  },
  
  data: function() {
    return {
      loadingQueue: false,
      loadingDisplay: false,
      loadingAdd: false,
      loadingDelete: false,
      dataDisplay: {},
      dataDevices: [],
      params: {
        search_text: '',
        per_page: 15,
        sort_column: 'id',
        sort_type: 'desc'
      },
      form: {},
      dialogAddDevices: false
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
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData() {
      this.loadingQueue = true
      
      getDataQueue(this.params).then(response => {
          this.dataDevices = response.data.data
          this.params.total = response.data.meta.total
          this.params.currentPage = response.data.meta.current_page
          this.loadingQueue = false
        })
        .catch((error) => {
          this.dataDevices = []
          this.loadingQueue = false
          this.params.total = 0
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        })
    },

    getDataDisplay() {
      this.loadingDisplay = true

      getDataDisplay().then(response => {
          this.dataDisplay = response.data.data
          if (this.dataDisplay.status === 'A') {
            this.$set(this.dataDisplay, 'status_active', 1)
          } else {
            this.$set(this.dataDisplay, 'status_active', 0)
          }
          this.loadingDisplay = false
        })
        .catch((error) => {
          this.dataDisplay = []
          this.loadingDisplay = false
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        })
    },

    updateDisplay() {
      this.loadingDisplay = true

      let data = {
        activated: this.dataDisplay.status_active
      }
      updateQueueDisplay(data).then(response => {
          this.dataDisplay = response.data.data
          if (this.dataDisplay.status === 'A') {
            this.$set(this.dataDisplay, 'status_active', 1)
          } else {
            this.$set(this.dataDisplay, 'status_active', 0)
          }
          this.loadingDisplay = false
        })
        .catch((error) => {
          this.dataDisplay = []
          this.loadingDisplay = false
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        })
    },

    saveDevices() {
      this.loadingAdd = true

      let data = {
        serial: this.form.serial,
        prefix: this.form.prefix,
        id: this.form.id ? this.form.id : ''
      }

      if (!this.form.id) {
        addDevices(data).then(response => {
          this.loadingAdd = false
          this.dialogAddDevices = false
          this.getData()
        })
        .catch((error) => {
          this.loadingAdd = false
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        })
      } else {
        updateDevices(data).then(response => {
          this.loadingAdd = false
          this.dialogAddDevices = false
          this.getData()
        })
        .catch((error) => {
          this.loadingAdd = false
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        })
      }
    },

    deleteDevices () {
      deleteDevices(this.form).then(response => {
        this.loadingDelete = false
        this.dialogAddDevices = false
        this.form = {}
        this.getData()
      })
      .catch((error) => {
        this.loadingDelete = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    getDetailDevices (data) {
      if (this.checkCustomPermission('settings/posqueue', 'edit')) {
        this.form = data
        this.dialogAddDevices = true
      }
    },

    cancelAddDevices () {
      this.form = {}
      this.dialogAddDevices = false
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    showDeleteDialog(row) {
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.responseDelete = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.loading = false
          this.deleteDialog = false
          this.getData()
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          this.loading = false
          this.deleteDialog = false
          console.log(error)
        })
    }
  },

  mounted() {
    this.getData()
    this.getDataDisplay()
  }
}
</script>
