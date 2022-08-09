<template>
  <div v-loading="loading">
    <div class="flex-container font-bold mb-16">
      <div class="flex-grow-1">
        {{ rootLang.active_pos_devices }}
      </div>
      <el-button type="info" @click="visibleFloatingDeviceRegistered = !visibleFloatingDeviceRegistered">
        {{ rootLang.registered_device }} ({{ dataRegistered.length }})
      </el-button>
    </div>
    
    <template v-if="data.length || loading">
      <el-table
        v-loading="loading"
        :data="data"
        stripe
        border>
        <el-table-column :label="lang.name" prop="remark">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column :label="lang.serial" prop="serial" />
        <el-table-column
          v-if="checkCustomPermission('settings/posdevices', 'destroy')">
          <template slot-scope="scope">
            <delete-button
              :loading="loadingRelease"
              :text="rootLang.release_pos_device"
              :block="true"
              custom-permission="settings/posdevices"
              @confirm="release(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </template>

    <div
      v-if="data.length || loading"
      class="block mt-12">
      <el-pagination
        :current-page.sync="params.page"
        :page-size="params.per_page"
        :total="params.total"
        layout="total, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <data-empty v-if="!data.length && !loading" desc="Perangkat POS yang sedang digunakan akan otomatis terdaftar di sini" />

    <floating-device-registered
      :show="visibleFloatingDeviceRegistered"
      :devices="dataRegistered"
      @close="visibleFloatingDeviceRegistered = false"
      @created="handleCreatedDevice"
      @destroyed="handleDestroyedDevice"
    />
  </div>
</template>

<script>
import { posdevicesactive, posdevices as posdevicesregistered, release } from '@/api/pos/settings'
import FloatingDeviceRegistered from './_floatingDeviceRegistered.vue'
import DataEmpty from '@/components/modules/DataEmpty'
import DeleteButton from '@/components/modules/DeleteButton'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  components: {
    FloatingDeviceRegistered,
    DataEmpty,
    DeleteButton
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: true,
      visibleFloatingDeviceRegistered: false,
      data: [],
      dataRegistered: [],
      loadingRelease: false,
      params: {
        page: 1,
        per_page: 20,
        total: 0
      }
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
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
      this.refreshView()
    }
  },

  mounted() {
    this.refreshView()
  },

  methods: {
    refreshView() {
      this.getDataActivated()
      this.getDataRegistered()
    },
    getDataActivated() {
      this.loading = true
      posdevicesactive({...this.params}).then(response => {
        this.data = response.data.data
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.data = []
        this.params.total = 0
      })
    },
    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getDataActivated()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getDataActivated()
    },
    getDataRegistered() {
      this.loading = true
      posdevicesregistered({}).then(response => {
        this.dataRegistered = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    handleCreatedDevice(data) {
      this.dataRegistered.push({...data})
    },
    handleDestroyedDevice(device) {
      this.dataRegistered = this.dataRegistered.filter(registeredDevice => {
        return registeredDevice.id !== device.id
      })
    },
    release(deviceId) {
      this.loadingRelease = true
      release(deviceId).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingRelease = false
        this.getDataActivated()
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingRelease = false
      })
    }
  }
}
</script>
