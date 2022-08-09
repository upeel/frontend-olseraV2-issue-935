<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ lang.orders }} BliBli
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <close-esc @close="handleClose" />
      </div>
    </div>

    <div
      v-if="!loadingData"
      class="flex-container p-8">
      <el-button
        :class="selectedStatusFilter === null ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'"
        type="info-addon"
        @click="showData(null)">
        Semua
      </el-button>
      <el-button
        :class="selectedStatusFilter === 'not_saved' ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'"
        type="info-addon" 
        @click="showData('not_saved')" >
        Belum Tersimpan ({{ totalUnsaved }})
      </el-button>
      <el-button
        :class="selectedStatusFilter === 'saved' ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'"
        type="info-addon" 
        @click="showData('saved')">
        Tersimpan ({{ totalSaved }})
      </el-button>

      <div class="flex-grow-1"></div>

      <div>
        <el-input
          v-model="search"
          :placeholder="lang.search"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          class="inline-form input-search"
          @change="handleSearch"
        />
      </div>

      <el-dropdown
        trigger="click"
        @command="handleDropdownSection">
        <span class="el-dropdown-link font-20 color-info">
          <svg-icon icon-class="more-vertical"></svg-icon>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="sync">
            {{ rootLang.sync_product }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <fixed-table
      :loading="loadingData"
      :data="dataOrderFiltered"
      :headers="['Pesanan Blibli', 'Status', 'Pesanan Olsera', 'Status', '']"
      :cols="['invoice_num', 'status_desc', 'invoice_olsera', 'status_olsera', 'control']"
      :current-page="meta.current_page"
      :per-page="meta.per_page"
      :total-data="meta.total"
      @changepage="handleChangePage"
      @change-size="handleChangeSizePage">
      <template #invoice_olsera="scope">
        <router-link
          v-if="scope.row.status_save === 1"
          :to="'/sales/openorderV2/' + scope.row.order_id_olsera"
          class="font-bold">
          {{ scope.row.invoice_olsera }}
        </router-link>
      </template>
      <template #control="scope">
        <el-button
          :plain="scope.row.status_save === 0"
          type="primary"
          round
          style="min-width: 120px;"
          @click="handlePair(scope.row)">
          <span v-if="scope.row.status_save === 0">Simpan</span>
          <span v-else>Tersimpan</span>
        </el-button>
      </template>
    </fixed-table>

    <offscreen-order-blibli
      :show="visibleSyncOrder"
      :form-edit="tempDataSync"
      @cancel="visibleSyncOrder = false"
      @refresh="fetchSalesOrders"
    />
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import offscreenOrderBlibli from './offscreenOrderBlibli'
import InlineUpdateStatus from '@/components/InlineUpdateStatus'
import CloseEsc from '@/components/modules/CloseEsc'
import FixedTable from '@/components/FixedTable'
import { fetchSalesOrders } from '@/api/thirdParty/blibli'

export default {
  name: 'DialogOrderBlibli',

  components: {
    offscreenOrderBlibli,
    CloseEsc,
    InlineUpdateStatus,
    FixedTable
  },

  mixins: [basicComputedMixin],

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      visibleSyncOrder: false,
      tempDataSync: {},
      search: '',
      loadingUpdateStatus: false,
      dataOrder: [],
      loadingData: false,
      totalUnsaved: 0,
      totalSaved: 0,
      meta: {
        current_page: 1,
        per_page: 15
      },
      dataOrderFiltered: [],
      selectedStatusFilter: null
    }
  },

  watch: {
    show: {
      immediate: true,
      handler(payload) {
        if (payload === true) {
          this.fetchSalesOrders()
        }
      }
    }
  },

  methods: {
    fetchSalesOrders() {
      this.loadingData = true
      this.visibleSyncOrder = false
      fetchSalesOrders({
        page: this.meta.current_page,
        per_page: this.meta.per_page
      }).then((response) => {
        this.dataOrder = response.data.data
        this.dataOrderFiltered = response.data.data
        this.totalUnsaved = response.data.total_unsaved
        this.totalSaved = response.data.total_saved
        this.loadingData = false
        this.meta = {
          per_page: parseInt(response.data.meta.per_page),
          current_page: parseInt(response.data.meta.current_page),
          total: parseInt(response.data.meta.total)
        }
      }).catch(error => {
        this.loadingData = false
      })
    },
    handlePair (item) {
      this.tempDataSync = { ...item}
      this.visibleSyncOrder = true
    },
    handleSaveSales (data) {
      //
      console.log(data)
    },
    handleClose () {
      this.tempDataSync = {}
      this.dataOrder = []
      this.$emit('close')
    },
    handleChangePage (page) {
      this.meta.current_page = parseInt(page)
      this.fetchSalesOrders()
    },
    handleChangeSizePage (page) {
      this.meta.per_page = parseInt(page)
      this.meta.current_page = 1
      this.fetchSalesOrders()
    },
    showData (arg) {
      this.selectedStatusFilter = arg
      this.dataOrderFiltered = this.dataOrder.filter(item => {
        if (arg === 'saved') {
          return item.status_save === 1
        } else if (arg === 'not_saved') {
          return item.status_save === 0
        } else {
          return item
        }
      })
    },
    handleSearch () {
      //
      this.meta.current_page = 1
      this.fetchSalesOrders()
    },
    handleUpdateStatus(item, index) {
      //
    },
    handleUpdateData (data) {
      this.tempDataSync = { ...data}
    },
    handleDropdownSection(command) {
      if (command === 'sync') {
        this.syncDataProduct()
      }
    },
    syncDataProduct() {
      //
    }
  }
}
</script>
