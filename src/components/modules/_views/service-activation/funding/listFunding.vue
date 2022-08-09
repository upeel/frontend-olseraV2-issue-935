<template>
  <div>
    <el-tag class="w-fit" type="info" size="small">
      Penghitungan ini hanyalah sebuah simulasi
    </el-tag>
    <el-divider class="my-12"></el-divider>

    <div class="summarry-scroll-div" style="height: 205px;">
      <div class="box-shadow-2 mb-8" v-for="(installment, key) in items" :key="key">
        <div v-if="String(Object.keys(installment)) === 'Koinworks'">
          <div slot="header" class="table-handler-flex px-10">
            <div style="flex-grow: 1;">
              <img
                src="/static/img/service-activation/logo-koinworks.png"
                style="max-width: 200px;"
              />
            </div>
            <el-button type="primary" size="small" :disabled="loadingKoinwork"
              @click="handleClick('Koinworks')" :loading="loadingKoinwork">
              Ajukan
            </el-button>
          </div>
          <div class="p-18">
            <div class="font-14 table-handler-flex mb-8">
              <span style="flex-grow: 1;">
                Bunga Perkiraan
              </span>
              <span class="font-semi-bold">{{installment.Koinworks.rate }}%</span>
            </div>
            <div class="font-14 table-handler-flex">
              <span style="flex-grow: 1;">
                Angsuran Bulanan
              </span>
              <span class="font-semi-bold">Rp. {{formatPrice(installment.Koinworks.installment)}}</span>
            </div>
          </div>
        </div>
        <div v-if="String(Object.keys(installment)) === 'BFI'">
          <div slot="header" class="table-handler-flex px-10">
            <div style="flex-grow: 1;">
              <img
                src="/static/img/service-activation/logo-bfi.png"
                style="max-width: 200px;"
              />
            </div>
            <el-button type="primary" size="small" :disabled="loadingBFI"
              @click="handleClick('BFI')" :loading="loadingBFI">
              Ajukan
            </el-button>
          </div>
          <div class="p-18">
            <div class="font-14 table-handler-flex mb-8">
              <span style="flex-grow: 1;">
                Bunga Perkiraan
              </span>
              <span class="font-semi-bold">{{installment.BFI.rate }}%</span>
            </div>
            <div class="font-14 table-handler-flex">
              <span style="flex-grow: 1;">
                Angsuran Bulanan
              </span>
              <span class="font-semi-bold">Rp. {{formatPrice(installment.BFI.installment)}}</span>
            </div>
          </div>
        </div>
        <div v-if="String(Object.keys(installment)) === 'Commonwealth'">
          <div slot="header" class="table-handler-flex px-10">
            <div style="flex-grow: 1;">
              <img
                src="/static/img/service-activation/logo-commonwealt.png"
                style="max-width: 200px;"
              />
            </div>
            <el-button type="primary" size="small" :disabled="loadingCommonBank"
              @click="handleClick('Commonwealt')" :loading="loadingCommonBank">
              Ajukan
            </el-button>
          </div>
          <div class="p-18">
            <div class="font-14 table-handler-flex mb-8">
              <span style="flex-grow: 1;">
                Bunga Perkiraan
              </span>
              <span class="font-semi-bold">{{installment.Commonwealth.rate }}%</span>
            </div>
            <div class="font-14 table-handler-flex">
              <span style="flex-grow: 1;">
                Angsuran Bulanan
              </span>
              <span class="font-semi-bold">Rp. {{formatPrice(installment.Commonwealth.installment)}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
var moment = require('moment')
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { storeSubmision } from '@/api/thirdParty/koinworks'
import { bfiStore } from '@/api/thirdParty/bfi'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],
  name: 'ListFunding',
  props:{
    items:{
      type: Array,
      default: null,
    },
    data:{
      type: Array,
      default: null,
    },
    amountTenor: {
      type: Object,
      default: null
    }
  },
  computed: {
    userStore() {
      const selectedStore = this.$store.getters.selectedStore
      
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile,
        store_created: selectedStore.created_time
      }
    },
  },
  data() {
    return {
      loadingCommonBank: false,
      loadingBFI: false,
      loadingKoinwork: false
    }
  },
  mounted() {
  },
  methods: {
    handleClick(fund){
      var satuHari = 24*60*60*1000;
      var tgl1 = new Date(this.userStore.store_created);
      var tgl2 = new Date();
      var selisihTgl = Math.round(Math.round((tgl2.getTime() - tgl1.getTime()) / (satuHari)));
      if(selisihTgl > 182){
        if(fund === 'Commonwealt'){
          this.loadingCommonBank = true
          let commonwealt = this.data[2].main_store
          const status = commonwealt && commonwealt.length ? commonwealt[0].activation_status : null
          // if (!status || (status !== 'P' && status !== 'A' && status !== 'X' && status !== 'R')) {
            this.$router.push({
              path: '/service-activation-v2/commbank-bizloan',
              query: {amountTenor: this.amountTenor}
            })
          // }else{
          //   this.$message({
          //     type: 'error',
          //     message: this.rootLang.loan_on_progress
          //   })
          // }
          this.loadingCommonBank = false
        }else if(fund === 'Koinworks'){
          this.loadingKoinwork = true
          storeSubmision().then(async response => {
            this.loadingKoinwork = false
            let lastSubmission = response.data.data
            if(lastSubmission.submission_req.length !== 0){
              if(lastSubmission.submission_req[0].submission_status === 'Approved' || lastSubmission.submission_req[0].submission_status === 'Rejected'){
                this.$router.push({
                  path: '/service-activation-v2/koinworks',
                  query: {koinwork_id: lastSubmission.id, amountTenor: this.amountTenor}
                })
              }else{
                this.$message({
                  type: 'error',
                  message: this.rootLang.loan_on_progress
                })
              }
            }else{
              this.$router.push({
                path: '/service-activation-v2/koinworks',
                query: {amountTenor: this.amountTenor}
              })
            }
          }).catch(error => {
            this.loadingKoinwork = false
            this.$router.push({
              path: '/service-activation-v2/koinworks',
              query: {amountTenor: this.amountTenor}
            })
          })
        }else if(fund === 'BFI'){
          this.loadingBFI = true
          bfiStore().then(async response => {
            this.loadingBFI = false
            let lastSubmission = response.data.data
            if(lastSubmission.submission_req.length !== 0){
              if(lastSubmission.submission_req[0].submission_status === 'Approved' || lastSubmission.submission_req[0].submission_status === 'Rejected'){
                this.$router.push({
                  path: '/service-activation-v2/bfi-finance',
                  query: {bfi_id: lastSubmission.id, amountTenor: this.amountTenor}
                })
              }else{
                this.$message({
                  type: 'error',
                  message: this.rootLang.loan_on_progress
                })
              }
            }else{
              this.$router.push({
                path: '/service-activation-v2/bfi-finance',
                query: {amountTenor: this.amountTenor}
              })
            }
          }).catch(error => {
            this.loadingBFI = false
            this.$router.push({
              path: '/service-activation-v2/bfi-finance',
              query: {amountTenor: this.amountTenor}
            })
          })
        }
      }else{
        this.$notify({
          tipe: 'warning',
          message: this.rootLang.store_6_month
        })
      }
    },
    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  }
}
</script>