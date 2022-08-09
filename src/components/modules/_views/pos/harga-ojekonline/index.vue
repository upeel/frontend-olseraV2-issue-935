<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="banner-ojekonline">
        <div class="banner-icon">
          <div >
            <span class="title font-32 font-bold">Food Delivery</span>
            <div class="font-20">Atur harga jual produk untuk Food Delivery di POS</div>
          </div>
        </div>
      </div>

      <div class="like-table-wrapper mt-24">
        <div v-for="(ojek, idx) in dataMaster" :key="ojek.ojek_online_food_id" v-loading="loadingManage[idx]" class="like-table-wrapper--item pointer" @click="showManage(ojek, idx)">
          <div class="full-width flex-container">
            <el-image
              :src="ojek.photo"
              class="container-icon"
              :style="ojek.is_active_marking_item ? '' : 'filter: grayscale(100%)'"
            />
            <div class="ml-8">
              <div class="font-14">{{ ojek.ojek_online_food_name }}</div>
              <div class="font-12 color-grey--placeholder">{{ ojek.total_item }} {{ lang.product }}</div>
            </div>
          </div>
          <div class="full-width text-right">
            <el-tag v-if="ojek.is_active_marking_item === 0" type="info" >{{ rootLang.not_active }}</el-tag>
            <el-tag v-else type="primary">{{ rootLang.active }}</el-tag>
          </div>
          <div class="container-icon ml-8">
            <i class="el-icon-arrow-right" />
          </div>
        </div>
      </div>

      <manage-price
        :show="showGofood"
        :data-master="tempMaster"
        :data-product="dataProduct"
        :loading-data="loading"
        :meta="meta"
        @update="updateMarking"
        @refresh="refreshData"
        @search="searchProduct"
        @changepage="handleChangePage"
        @changepagesize="handleChangeSizePage"
        @close="handleCloseManage"
      />
    </section>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import managePrice from './_managePrice.vue'
import { fetchMasterOjekonline, fetchDataProduct, updateMasterMarking, fetchDetailMasterOjekonline } from '@/api/ojekonline'
export default {
  name: 'HargaOjekOnline',
  components: {
    managePrice
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      showGofood: false,
      loading: false,
      dataMaster: [],
      dataProduct: [],
      tempMaster: {},
      meta: {
        totalProduct: 0,
        currentPage: 0,
        page_size: 15
      },
      params: {
        page: 1,
        per_page: 15
      },
      loadingManage: [false, false, false]
    }
  },
  computed: {
    // masterPartner () {
    //   let data = {}
    //   if (this.dataProfile.master_partner) {
    //     data = this.dataProfile.master_partner
    //     data.url_partner = 'https://www.olsera.com/id/pos/' + data.code.toLowerCase()
    //   }
    //   return data
    // }
  },
  mounted() {
    this.fetchMaster()
    // this.getDataBank()
    // this.getDataPartner()
  },
  methods: {
    async showManage(data, idx) {
      this.loadingManage[idx] = true
      await this.getDetailMasterOjekonline(data)
      await this.fetchProduct(data)
      if (this.tempMaster.ojek_online_food_id) {
        this.showGofood = true
        this.loadingManage[idx] = false
      }
    },
    async fetchMaster() {
      this.loading = true
      await fetchMasterOjekonline().then(response => {
        this.dataMaster = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.dataMaster = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    async getDetailMasterOjekonline(data) {
      this.loading = true
      this.tempMaster = []
      await fetchDetailMasterOjekonline(data.ojek_online_food_id).then(response => {
        this.tempMaster = { ...response.data.data}
        if (this.tempMaster.preset_marking_amount_type === 1) {
          this.tempMaster.preset_value = parseInt(this.tempMaster.preset_marking_price)
        } else {
          this.tempMaster.preset_value = parseInt(this.tempMaster.preset_marking_percentage)
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.tempMaster = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    async fetchProduct(data) {
      this.loading = true
      this.params.ojek_online_food_id = data.ojek_online_food_id
      await fetchDataProduct(this.params).then(response => {
        this.dataProduct = response.data.data
        this.meta.totalProduct = response.data.meta.total
        this.meta.currentPage = response.data.meta.current_page
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.dataProduct = []
        // this.$notify({
        //   type: 'warning',
        //   title: error.response.data.error.message,
        //   message: error.response.data.error.error
        // })
      })
    },
    updateMarking(data) {
      console.log('data', data)
      this.loading = true
      updateMasterMarking(data).then(response => {
        this.dataMaster.map(i => {
          if (i.ojek_online_food_id === response.data.data.ojek_online_food_id && i.is_active_marking_item !== response.data.data.is_active_marking_item) {
            let active = response.data.data.is_active_marking_item === 1? 'mengaktifkan ' : 'menonaktifkan'
            let message = 'Berhasil ' + active + ' Pengaturan harga untuk ' + response.data.data.ojek_online_food_name
            this.$notify({
              type: 'warning',
              // title: error.response.data.error.message,
              message: message
            })
          }
        })
        this.refreshData(response.data.data)
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
    refreshData(data) {
      this.fetchProduct(data)
      this.fetchMaster()
      this.getDetailMasterOjekonline(data)
    },
    handleChangePage (page) {
      console.log(page)
      this.meta.currentPage = page
      this.params.page = page
      // this.$set(this.params, 'page', page)
      this.fetchProduct(this.tempMaster)
    },
    handleChangeSizePage (page) {
      console.log('page')
      this.meta.currentPage = 1
      this.params.per_page = page
      this.params.page = 1
      this.fetchProduct(this.tempMaster)
    },
    async handleCloseManage () {
      await this.fetchMaster()
      this.showGofood = false
      this.tempMaster = {}
      this.meta = {
        totalProduct: 0,
        currentPage: 0,
        page_size: 15
      }
      this.params = {
        page: 1,
        per_page: 15
      }
    },
    searchProduct (arg) {
      this.params.search = arg
      this.fetchProduct(this.tempMaster)
    }
  }
}
</script>