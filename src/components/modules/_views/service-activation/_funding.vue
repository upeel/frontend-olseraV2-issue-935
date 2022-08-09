<template>
  <!-- <div> -->
  <div>
    <div class="flex-container radius-2 mb-12">
      <div class="font-24 font-semi-bold">
        {{ rootLang.funding }}
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="10" :md="9" :lg="9" :xl="9">
        <el-card shadow="never" style="border: 1px solid #DCDFE6;">
          <div>
            <el-form
              :model="formData"
              label-position="top"
              ref="data"
              @submit.native.prevent="handleNext">
              <el-form-item prop="amount">
                <div>
                  <label for="amountFunding">Nominal Pinjaman</label>
                    <money v-model="formData.amount"
                     :prefix="this.langId === 'id' && this.$store.getters.selectedStore.currency_id === 'IDR' ? 'Rp ' : this.$store.getters.selectedStore.currency_id + ' '"
                      v-bind="money"
                      class="form-input input-lg input-money"
                      style="height: 36px;"
                      ></money>
                      <span class="color-danger font-11" v-if="validateMoney">{{validateMoney}}</span>
                  <el-divider class="mb-6"></el-divider>
                  <el-slider
                    v-model="formData.amount"
                    :min="minAmount"
                    :max="2000000000"
                    :step="1000000"
                  />
                  <el-row :gutter="20">
                    <el-col :span="12" align="left">
                      <span class="font-12">Min Rp. 1 Juta</span>
                    </el-col>
                    <el-col :span="12" align="right">
                      <span class="font-12">Max Rp. 2 Milyar</span>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
              <el-form-item prop="tenor">
                <label for="plafondFunding">Tenor Pinjaman</label>
                <el-input id="plafondFunding" v-model="formData.tenor" size="small" style="width: 100%" 
                  type="number" onkeydown="return ( event.ctrlKey || event.altKey 
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9) 
                            || (event.keyCode>34 && event.keyCode<40) 
                            || (event.keyCode==46) )">
                  <template slot="append">{{rootLang.months}}</template>
                </el-input>

              </el-form-item>
              <el-button @click="calculateFunding" :disabled="loadingInstallment" class="w-fit"
                type="primary" :loading="loadingInstallment">
                Hitung Angsuran
              </el-button>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="14" :md="15" :lg="15" :xl="15">
        <el-tabs v-model="activeTab" stretch type="border-card" class="box-shadow-1" style="height: 340px;">
          <el-tab-pane label="Pengajuan Pinjaman" name="submmisionFunding">
            <listVendors :items="installment" :data="items" :amountTenor="formData"/>
          </el-tab-pane>
          <!-- <el-tab-pane label="Pengajuan Terakhir" name="historyFunding">
             <listHistory :data="items" :amountTenor="formData"/>
          </el-tab-pane> -->
        </el-tabs>
      </el-col>
    </el-row>
    <!-- <div class="like-table-wrapper">
      <template v-for="item in items">
        <div
          v-loading="loading"
          :key="item.id"
          class="like-table-wrapper--item pointer"
          @click="handleClick(item)">
          <el-avatar
            :src="item.photo"
            class="mr-4"
          />
          <div
            class="font-14 font-semi-bold"
            style="flex-grow: 1;">
            {{ item.alias_name }}
          </div>
          <div
            v-if="item.alias_name === 'KoinWorks'"
            :loading="loading"
            class="pointer">
            <div v-if="Object.prototype.toString.call(item.koinwork) === '[object Object]'">
              <el-tag
                v-if="item.koinwork.submission && item.koinwork.submission.hasOwnProperty('id')"
                :type="methodGetStatusTag(item)"
                size="medium">
                {{statusText(item)}}
              </el-tag>
            </div>
            <i v-else class="el-icon-arrow-right"></i>
          </div>
          <div
            v-if="item.alias_name === 'BFI Finance'"
            :loading="loading"
            class="pointer">
            <div v-if="Object.prototype.toString.call(item.bfi) === '[object Object]'">
              <el-tag
                v-if="item.bfi.submission && item.bfi.submission.hasOwnProperty('id')"
                :type="methodGetStatusTag(item)"
                size="medium">
                {{statusText(item)}}
              </el-tag>
            </div>
            <i v-else class="el-icon-arrow-right"></i>
          </div>
          <div
            v-if="item.alias_name === 'CommBank'"
            :loading="loading"
            class="pointer">
            <el-tag
              v-if="item.main_store && item.main_store.length !== 0"
              :type="methodGetStatusTag(item)"
              size="medium">
              {{statusText(item)}}
            </el-tag>
            <i v-if="methodGetStatusTag(item) === 'default'" class="el-icon-arrow-right"></i>
          </div>
        </div>
      </template>
    </div> -->
    <dialog-detail :items="itemFunding" :show="showDetail" @closeDetail="handleCloseDetail"/>
  </div>
</template>

<script>
import dialogDetail from './funding/commbank/_historyFunding'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { storeSubmision } from '@/api/thirdParty/koinworks'
import { bfiStore } from '@/api/thirdParty/bfi'
import { installmentList } from '@/api/thirdParty/group'
import listVendors from './funding/listFunding'
export default {
  components:{
    dialogDetail,
    listVendors
  },
  mixins: [basicComputedMixin],
  props:{
    items:{
      type: Array,
      default: null,
    }
  },
  
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        if(data.amount < 1000000){
          this.validateMoney = this.rootLang.min_funding + ' ' + this.formatPrice(1000000)
        }else if(data.amount > 2000000000){
          this.validateMoney = this.rootLang.max_funding + ' ' + this.formatPrice(1000000)
        }else{
          this.validateMoney = ''
        }
      }
    },
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
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        precision: 0,
        masked: false
      },
      loading: false,
      loadingInstallment: false,
      itemFunding: {},
      installment:[],
      showDetail: false,
      minAmount: 0,
      activeTab: 'submmisionFunding',
      formData: {
        amount: 10000000,
        tenor: 6,
      },
      validateMoney: ''
    }
  },
  mounted(){
    this.calculateFunding()
  },
  methods: {
    calculateFunding(){
      if(this.formData.amount > 1000000){
        this.loadingInstallment = true
        installmentList(this.formData).then(response => {
          this.installment = response.data
          this.loadingInstallment = false
        }).catch(error => {
          this.groups = []
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingInstallment = false
        })
      }else{
        this.$message({
          type: 'error',
          message: this.rootLang.min_funding + ' ' + this.formatPrice(1000000)
        })
      }

    },
    handleClick(item) {
      var satuHari = 24*60*60*1000;
      var tgl1 = new Date(this.userStore.store_created);
      var tgl2 = new Date();
      var selisihTgl = Math.round(Math.round((tgl2.getTime() - tgl1.getTime()) / (satuHari)));
      if(item.alias_name === 'CommBank'){
        if(selisihTgl > 182){
          const status = item.main_store && item.main_store.length ? item.main_store[0].activation_status : null
          if (!status || (status !== 'P' && status !== 'A' && status !== 'X' && status !== 'R')) {
            this.$router.push({
              path: '/service-activation-v2/commbank-bizloan'
            })
          }
        }else{
          this.$notify({
            tipe: 'warning',
            message: this.rootLang.store_6_month
          })
        }
      }else if(item.alias_name === 'KoinWorks'){
        if(selisihTgl > 182){
          let itemKoin = item
          storeSubmision().then(async response => {
            if(response.data.data.submission_req.length !== 0){
              this.$router.push({
                path: '/service-activation-v2/koinworks-history',
                query: {data: itemKoin}
              })
            }else{
              this.$router.push({
                path: '/service-activation-v2/koinworks'
              })
            }
          }).catch(error => {
            this.$router.push({
              path: '/service-activation-v2/koinworks'
            })
          })
        }else{
          this.$notify({
            tipe: 'warning',
            message: this.rootLang.store_6_month
          })
        }
      }else if(item.alias_name === 'BFI Finance'){
        if(selisihTgl > 182){
          let itemBFI = item
          bfiStore().then(async response => {
            if(response.data.data.submission_req.length !== 0){
              this.$router.push({
                path: '/service-activation-v2/bfi-finance-history',
                query: {data: itemBFI}
              })
            }else{
              this.$router.push({
                path: '/service-activation-v2/bfi-finance'
              })
            }
          }).catch(error => {
            this.$router.push({
              path: '/service-activation-v2/bfi-finance'
            })
          })
        }else{
          this.$notify({
            tipe: 'warning',
            message: this.rootLang.store_6_month
          })
        }
      }
    },
    handleCloseDetail(){
      this.showDetail = false
    },
    methodGetStatusTag(item) {
      let type = 'default'
      switch(item.alias_name) {
        case 'KoinWork':
          if(item.koinwork.submission.submission_status === 'On Process'){
            type = 'warning'
          }else if(item.koinwork.submission.submission_status === 'Approved'){
            type = 'success'
          }else if(item.koinwork.submission.submission_status === 'Rejected'){
            type = 'danger'
          }
          break;
        case 'BFI Finance':
          if(item.bfi.submission.submission_status === 'On Process'){
            type = 'warning'
          }else if(item.bfi.submission.submission_status === 'Approved'){
            type = 'success'
          }else if(item.bfi.submission.submission_status === 'Rejected'){
            type = 'danger'
          }
          break;
        default:
          if (item.main_store && item.main_store.length) {
            const status = item.main_store[0].activation_status
            if (status === 'P') {
              type = 'warning'
            } else if (status === 'A') {
              type = 'success'
            } else if (status === 'R') {
              type = 'danger'
            } else if (status === 'X') {
              type = 'danger'
            }
          }
      }
      return type
    },
    statusText(item){
      let textStatus = ''
      switch(item.alias_name) {
        case 'KoinWorks':
          if(item.koinwork.submission){
            textStatus = item.koinwork.submission.submission_status
          }
          break;
        case 'BFI Finance':
          if(item.bfi.submission){
            textStatus = item.bfi.submission.submission_status
          }
          break;
        default:
          textStatus = item.main_store[0].status
      }
      return textStatus
    },
    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  }
}
</script>
