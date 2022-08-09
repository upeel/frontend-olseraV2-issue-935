<template>
  <el-dialog
  :visible.sync="show"
  :before-close="handleClose"
  :show-close="false"
  append-to-body
  custom-class="without-padding mw-1020">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width font-bold">
        {{ lang.orders }} Lazada
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <close-esc @close="handleClose" />
      </div>
    </div>

    <template>
      <div class="flex-container p-8">
        <el-button @click="showData('all')" 
          type="info-addon" 
          :class="visibleItem[0] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
            {{rootLang.all}}
        </el-button>
        <el-button @click="showData('not_saved')" 
          type="info-addon" 
          :class="visibleItem[1] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
           {{rootLang.unsaved}} ({{ totalUnsave }})
        </el-button>
        <el-button @click="showData('saved')" 
          type="info-addon" 
          :class="visibleItem[2] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
            {{rootLang.saved}} ({{ totalSave }})
        </el-button>
        <div class="table-handler-flex full-width text-right p-8" style="display: unset">
          <el-input class="inline-form input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" size="small"></el-input>
        </div>
        <div>
          <el-dropdown
            trigger="click"
            @command="handleDropdownSection">
            <span class="el-dropdown-link font-20 color-info">
              <svg-icon icon-class="more-vertical"></svg-icon>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="syncProduct" class="p-10">
                <el-row :gutter="10">
                  <el-col :span="4" align="center" class="font-20">
                    <svg-icon class="mt-4" icon-class="refresh-icon" />
                  </el-col>
                  <el-col :span="20">
                    <div class="font-18">{{ rootLang.sync_product }}</div>
                    <!-- <span class="color-info font-12">Diupdate 5 Hari lalu</span> -->
                  </el-col>
                </el-row>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div class="like-table-wrapper mt-16 border border--table-border">
        <div class="like-table-wrapper--item">
          <div class="mr-8 full-width flex-container" >
            <div class="font-bold font-14">
              {{ lang.orders }} Lazada
            </div>
          </div>
          <div class="font-bold font-14" style="width: 50%">
            {{ lang.status }}
          </div>
          <div class="font-bold font-14 full-width" >
            {{ lang.orders }} Olsera
          </div>
          <div class="font-bold font-14" style="width: 50%">
            {{ lang.status }}
          </div>
          <div class="font-bold font-14" style="width: 30%">
            <!-- {{ lang.status }} -->
          </div>
        </div>
      </div>
      <perfect-scrollbar class="scrollBulkPair">
      <div v-loading="loadingSync" class="like-table-wrapper border border--table-border" >
        <div v-for="(item, idx) in dataOrder" 
          :key="item.id" class="like-table-wrapper--item">
          <div class="flex-container full-width">
            <div class="mr-8 full-width" >
              <div class="font-bold font-14 ml-8 word-break color-lazada--blue">
                {{ item.invoice_num }}
              </div>
            </div>
            <div class="font-14 px-12" style="width: 50%">
              {{ item.status }}
            </div>
            <div class="font-14 px-12 full-width" >
              <router-link v-if="item.invoice_olsera" :to="{ path: '/sales/openorder/' + item.order_id_olsera }">
                <div class="px-8">
                  <span class="color-lazada--blue font-bold pointer"> {{ item.invoice_olsera }} </span>
                </div>
              </router-link>
              <span v-else>Belum ada</span>
            </div>
            <div class="font-14 px-12" style="width: 50%">
              <div v-if="!item.status_code_olsera">
                <p>-</p>
              </div>
              <inline-update-status
                :loading="loadingUpdateStatus"
                :status="item.status_code_olsera"
                :item-id="item.order_id_olsera"
                :additional-data="item"
                type="product-buy-price"
                @update="handleUpdateStatus($event, idx)"
              />
            </div>
            <div v-if="item.status_save === 0" style="width: 30%">
              <el-button round type="pair-lazada" style="width: 110px" plain @click="handlePair(item)">{{ lang.save }}</el-button>
            </div>
            <div v-else style="width: 30%">
              <el-button round type="lazada" style="width: 110px" plain @click="handlePair(item)">{{ rootLang.saved }}</el-button>
            </div>
          </div>
        </div>
      </div>
      </perfect-scrollbar>
      <div v-if="meta.totalProduct > 0" class="border border--grey-border table-handler-bottom text-center">
        <el-pagination
          :total="meta.totalProduct"
          :page-sizes="[1, 15, 50, 100]"
          :page-size="meta.page_size"
          :current-page.sync="meta.currentPage"
          style="margin-bottom: 20px"
          background
          layout="sizes, prev, pager, next"
          @current-change="handleChangePage"
          @size-change="handleChangeSizePage"
        />
      </div>
    </template>

    <offscreen-order-lazada
      :show="visibleSynOrder"
      :form-edit="tempDataSync"
      :loading-save="loadingSavePair"
      @saveproduct="handleSaveSales"
      @updatedata="handleUpdateData"
      @cancel="visibleSynOrder = false"
    />

  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import InlineUpdateStatus from '@/components/InlineUpdateStatus';
import offscreenOrderLazada from './offscreenOrderLazada'
import CloseEsc from '@/components/modules/CloseEsc';

export default {
  name: 'dialogLazadaOrder',
  mixins: [basicComputedMixin],

  components: {
    CloseEsc,
    InlineUpdateStatus,
    offscreenOrderLazada
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataOrder: {
      type: Array,
      default: []
    },
    totalUnsave: {
      type: Number,
      default: null
    },
    totalSave: {
      type: Number,
      default: null
    },
    meta: {
      type: Object,
      default: {}
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
  },

  data(){
    return{
      dataChecked: [],
      tempDataSync: {},
      visibleSynOrder: false,
      tempDataSync: {},
      loadingSavePair: false,
      dataProduct: [],
      visibleItem: [false, false, false, false],
      search: '',
      loadingUpdateStatus: false,
      loadingSync: false
    }
  },

  methods: {
    showData (arg) {
      this.$emit('filter', arg)
    },

    handleSearch () {
      this.$emit('search', this.search)
    },

    handleDropdownSection(command) {
      if (command === 'syncProduct') {
        this.syncDataProduct()
      }
    },

    syncDataProduct() {
      this.loadingSync = true
      // syncProductTokopedia().then(response => {
        this.$emit('syncproduct')
        this.loadingSync = false
      // }).catch(error => {
      //   this.$message({
      //     type: 'error',
      //     message: error.string
      //   })
      //   this.loadingSync = false
      // })
    },

    handleUpdateStatus(item, index) {
      // this.loadingUpdateStatus = true
      // let data = {
      //   order_id_olsera: item.order_id,
      //   status_code_olsera: item.status
      // }
      // updateStatusOrder(data).then(response => {
      //   this.dataOrder[index].status_code_olsera = response.data.data.status
      //   this.$message({
      //     message: 'Success',
      //     type: 'success'
      //   })
      //   this.loadingUpdateStatus = false
      //   this.$emit('refresh')
      // }).catch(error => {
      //   this.$notify({
      //     type: 'warning',
      //     title: error.response.data.error.message,
      //     message: error.response.data.error.error
      //   })
      //   this.loadingUpdateStatus = false
      // })
    },

    handleChangePage (page) {
      // console.log(page)
      this.$emit('changepage', page)
    },

    handleChangeSizePage (page) {
      this.meta.page_size = page
      this.$emit('changepagesize', page)
    },

    handleSaveSales(){
      // this.visibleSynOrder = false
      this.$emit('refresh')
    },

    handleUpdateData(){

    },

    handlePair (item) {
      this.tempDataSync = { ...item}
      this.visibleSynOrder = true
    },

    handleClose () {
      this.dataChecked = []
      this.tempDataSync = {}
      this.$emit('close')
    },
  }
}
</script>