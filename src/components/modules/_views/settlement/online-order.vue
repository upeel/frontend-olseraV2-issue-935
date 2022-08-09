<template>
  <div v-loading="loading">
    <section class="sales-list no-subpage">

      <div class="table-handler-flex flex-container--content-space-between flex-container--wrap mb-16">
        <div class="flex-container">
          <!-- <el-dropdown @command="handleFilter">
            <el-button class="mb-4">
              {{ filterText.value }} <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in labelFilter" :key="item.id" :command ="item">{{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-dropdown @command="handleFilterBySettlDate">
            <el-button class="mb-4">
              {{ filterTextSett.value }} <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in labelFilterSett" :key="item.id" :command ="item">{{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleFilterPayment">
            <el-button class="mb-4">
              {{ filterTextPayment.value }} <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in labelFilterPayment" :key="item.id" :command ="item">{{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="mb-4 flex-container">
            <!-- <single-date-picker v-model="date" :clearable="true" @input="datePicked" /> -->
            <date-range-picker
              @picked="datePicked"
            />
            <div class="mb-4">
              <el-dropdown
                  trigger="click"
                  @command="handleDropdownSection">
                  <span class="el-dropdown-link font-20 color-info">
                    <svg-icon icon-class="more-vertical"></svg-icon>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="download">
                      Download excel
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              <!-- <el-button @click="downloadList" :loading="loadingDownloadList">Download excel</el-button> -->
            </div>
        </div>
      </div>

      <div
        v-if="dataSettlement.length === 0 && !loading"
        class="card_close_date box-card">
        <div class="no-data-wrapper no-data-settle">
          <img src="/static/img/no-data-settlement.svg" class="no-data-image">
          <div style="max-width: 360px; width: 100%">
            <div class="no_close" >Daftar settlement akan muncul di sini</div>
            <span>Settlement akan berhasil jika akun bank Anda tersedia dan valid. Settlement yang belum dibayarkan akan ditambah pada periode yang akan datang</span>
          </div>
        </div>
      </div>

      <div
        v-if="dataSettlement.length || loading"
        class="like-table-wrapper table-header">
        <el-table
          v-loading="loading"
          :data="dataSettlement">
          <el-table-column :label="lang.order_no" prop="order_no" min-width="144px" >
            <template slot-scope="scope" >
              <router-link :to="{ path: '/sales/openorder/' + scope.row.sales_order_id }">
                <div class="flex-container pointer">
                  <div style="margin-right: 5px; color: #0085CD" class="font-bold">{{ scope.row.self_order_no }}</div>
                </div>
                <div v-if="scope.row.order_no !== null" 
                  class="overflow-ellipsis font-12 radius-20 color-white color-primary--bg px-8 pointer" style="max-width: 170px">
                  {{ scope.row.order_no }}
                </div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="lang.sales_date" prop="fstart_date" min-width="120px" >
            <template slot-scope="scope">
              <div >{{ scope.row.forder_date }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.settlement_date" prop="start_date" min-width="120px" >
            <template slot-scope="scope">
              {{ scope.row.fsettlement_date ? scope.row.fsettlement_date : '-' }}
            </template>
          </el-table-column>
          <el-table-column :label="lang.payment_mode" prop="fnett_amount" min-width="100px" >
            <template slot-scope="scope">
              {{ scope.row.payment_mode_name }}
            </template>
          </el-table-column>
          <el-table-column label="Gross Amount" prop="fnett_amount" min-width="100px" >
            <template slot-scope="scope">
              {{ scope.row.ftotal_amount }}
            </template>
          </el-table-column>
          <el-table-column label="MDR (-)" prop="fmdr_amount" min-width="100px" >
            <template slot-scope="scope">
              {{ scope.row.fmdr_amount }}
            </template>
          </el-table-column>
          <el-table-column label="Convenience fee" prop="ftrans_fee" min-width="100px" >
            <template slot-scope="scope">
              {{ scope.row.ftrans_fee }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="Nett" prop="fnett_amount" min-width="100px" >
            <template slot-scope="scope">
              {{ scope.row.fnett_amount }}
            </template>
          </el-table-column> -->
          <el-table-column label="Settlement" prop="fsettlement_amount" min-width="100px" >
            <template slot-scope="scope">
              {{ scope.row.fsettlement_amount }}
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.status" prop="is_paid" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_settled === 1" effect="plain" type="success">{{ rootLang.settled }}</el-tag>
              <el-tag v-else effect="plain" type="info">{{ rootLang.pending_settled }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-if="params.total > 15"
        :total="params.total"
        :page-size="15"
        :current-page.sync="params.currentPage"
        background
        layout="prev, pager, next"
        @current-change="handleChangePageSettlemen"
      />

      <div
        v-if="show"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header">
            {{ rootLang.detail }} {{ lang.payment }}
            <close-esc @close="show = false" />
          </div>
          <div class="flex-container px-8">
            <div class="full-width font-24 font-bold">{{ tempOrder.description }}</div>
            <div class="full-width font-14 text-right font-bold">{{ tempOrder.fsettlement_amount }}</div>
          </div>
          <div v-loading="loadingOrder" class="offscreen-right-sidebar--scrollcontent">
            <el-table
              v-if="tempOrder.data.length > 0"
              :data="tempOrder.data">
              <el-table-column :label="lang.description" prop="order_no" >
                <template slot="header">
                  <div>{{ rootLang.list_purchase }}</div>
                  <span class="font-12" style="font-weight: unset; color: #767676">{{ tempSettlement.fstart_date }} - {{ tempSettlement.fend_date }}</span>
                </template>
                <template slot-scope="scope">
                  <div class="font-bold color-primary">{{ scope.row.order_no }}</div>
                  <span class="font-12">{{ scope.row.ftotal_amount }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="lang.description" prop="ftotal_amount" align="right" >
                <template slot="header">
                  <span class="font-12" style="font-weight: unset; color: #767676">{{ tempOrder.total }} {{ lang.sales }}</span>
                </template>
                <template slot-scope="scope">
                  <div v-if="scope.row.is_settled">
                    <span class="mr-8">{{ scope.row.fsettlement_date }}</span>
                    <el-tag  type="success">Settled</el-tag>
                  </div>
                  <el-tag v-else type="info">Pending</el-tag>
                </template>
              </el-table-column>
            </el-table>

            <div v-if="tempOrder.data.length === 0 && !loadingOrder" class="card_close_date box-card">
              <div class="no-data-wrapper no-data-settle">
                <img src="/static/img/no-data-sales.svg" class="no-data-image">
                <div style="max-width: 360px; width: 100%">
                  <span>Tidak ada penjualan yang menggunakan metode pembayaran ini</span>
                </div>
              </div>
            </div>

            <div v-if="tempOrder.total > 15" class="table-handler-bottom">
              <el-pagination
                :total="tempOrder.total"
                :page-size="15"
                :current-page.sync="tempOrder.currentPage"
                background
                layout="prev, pager, next"
                @current-change="handleChangePage"
                @size-change="handleChangeSizePage"
              />
            </div>
          </div>
        </div>
      </div>

      <el-dialog
        :visible.sync="dialogEdit"
        :show-close="false"
        :close-on-press-escape="false"
        append-to-body
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ dataAccount.bank_account_no ? lang.edit + ' ' + lang.bank_account : rootLang.add_bank_account }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogEdit = false, temp = {}">{{ lang.cancel }}</el-button>
            <el-button type="success" @click="dialogCekPassword = true" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="full-width">
            <div class="mb-16">Pastikan Nama dan Nomor akun sesuai dengan buku tabungan Anda</div>
            <div class="mb-16">
              <div class="font-12 text-left">Nama Bank</div>
              <el-select
                v-model="temp.bank_swift_id"
                placeholder="Pilih tipe bisnis Anda"
                filterable
                style="width:100%">
                <el-option
                  v-for="item in listBank"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
              <div class="font-12 text-left mt-16">Cabang</div>
              <el-input v-model="temp.bank_account_branch"></el-input>

              <div class="font-12 text-left mt-16">Nama Akun</div>
              <el-input v-model="temp.bank_account_name" ></el-input>

              <div class="font-12 text-left mt-16">Nomor Akun</div>
              <el-input v-model="temp.bank_account_no" type="number"></el-input>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogCekPassword"
        :show-close="false"
        :close-on-press-escape="false"
        append-to-body
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ dataAccount.bank_account_no ? lang.edit + ' ' + lang.bank_account : rootLang.add_bank_account }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancel">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingCek" type="success" @click="confirmPassword" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="mb-16">Masukkan password Anda untuk verifikasi</div>

          <div class="font-12 text-left mt-16">Password</div>
          <el-input
            v-model="temp.password"
            :type="passwordType"
            size="default"
            placeholder="Password"
            class="input-password">
            <template slot="append">
              <div class="pointer" @click="showPwd">
                <template v-if="passwordType === ''">
                  <svg-icon icon-class="eye"/>
                </template>
                <template v-else>
                  <svg-icon icon-class="eyeoff" />
                </template>
              </div>
            </template>
          </el-input>
        </div>
      </el-dialog>

      <el-dialog 
        :visible.sync="dialogDetail"
        :show-close="false"
        :close-on-press-escape="false"
        width="80%"
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ rootLang.detail }} {{ rootLang.settlement }}
          </h4>
          <close-esc @close="dialogDetail = false" />
        </div>
        <div v-if="!tempSettlement.is_paid" class="flex-container color-warning--soft--bg py-8 pl-10">
          <div class="full-width">
            <div class="font-18 font-bold">{{ tempSettlement.fstart_date }}</div>
            <span class="font-12">{{ tempSettlement.fstart_date }} - {{ tempSettlement.fend_date }}</span>
          </div>
          <div class="full-width text-right pr-8">
            <el-tag effect="plain" type="warning">{{ lang.unpaid }}</el-tag>
          </div>
        </div>
        <div v-else class="flex-container color-green--soft--bg py-8 pl-10">
          <div class="full-width">
            <div class="font-18 font-bold">{{ tempSettlement.fstart_date }}</div>
            <span class="font-12">{{ tempSettlement.fstart_date }} - {{ tempSettlement.fend_date }}</span>
          </div>
          <div class="full-width text-right pr-8">
            <el-tag effect="plain" type="success">{{ lang.paid }}</el-tag>
          </div>
        </div>
        <div class="mt-16">
          <!-- <el-dropdown @command="downloadPdf" class="mb-8"> -->
            <el-button class="mb-4" :loading="loadingDownload" @click="downloadPdf">
              Export<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in labelRow" :key="item.id" :command ="item">{{ item.value.toUpperCase() }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-table
            v-loading="loading"
            align="right"
            :data="tempSettlement.details"
            @row-click="handleDetailOrder">
            <el-table-column :label="lang.description" prop="description" min-width="100px" >
              <template slot-scope="scope">
                <div style="color: #0085CD">{{ scope.row.description }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Gross Amount" prop="fgross_amount" >
              <template slot-scope="scope">
                <div class="text-right">{{ scope.row.fgross_amount }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Transaction Fee" prop="ftrans_fee" >
              <template slot-scope="scope">
                <div class="text-right">{{ scope.row.ftrans_fee }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Nett Amount" prop="fnett_amount" >
              <template slot-scope="scope">
                <div class="text-right">{{ scope.row.fnett_amount }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Settlement Amount" prop="fsettlement_amount" >
              <template slot-scope="scope" >
                <div v-if="parseInt(scope.row.settlement_amount) < 0" class="text-right" style="color: #F44336">{{ scope.row.fsettlement_amount }}</div>
                <div v-else class="text-right">{{ scope.row.fsettlement_amount }}</div>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="loading"
            :show-header="false"
            :data="tempSettlement.total">
            <el-table-column prop="fsettlement_amount" min-width="100px" >
              {{ lang.total }}
            </el-table-column>
            <el-table-column prop="fsettlement_amount" align="right" min-width="100px" />
          </el-table>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import CloseEsc from '@/components/modules/CloseEsc'
const apiEndPoint = 'loyaltypoint'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import dateRangePicker from '@/components/modules/DateRangePicker'
import { settlementOnlineOrder as getDataSettlement, 
  dataBank as getDataBank,
  settlementAccount,
  updateAccount,
  cekPassword,
  detailSettlement as getDetailSettlement,
  detailOrder as getDetailOrder,
  downloadSettlement,
  downloadSettlementOnlineOrder } from '@/api/settlement'

var moment = require('moment')
const startDate = moment().add(-6, 'days').format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

export default {
  name: 'SettlementOnline',
  components: {
    InputMoney,
    CloseEsc,
    dateRangePicker
  },
  mixins: [basicComputedMixin],

  data() {
    return {
      loading: true,
      dialogEdit: false,
      show: false,
      loadingSave: false,
      temp: {},
      params: {
        sort_column: 'date',
        searchQuery: '',
        page: 1,
        search_column: ['start_date', 'end_date'],
        search_text: [endDate, endDate],
        search_operator: ['>=', '<='],
        per_page: 15
      },
      dataSettlement: [],
      listBank: [],
      dataAccount: {},
      dialogCekPassword: false,
      passwordType: 'password',
      loadingCek: false,
      loadingOrder: false,
      tempSettlement: {},
      tempOrder: {
        data: [],
        total: 0,
        page: 1,
        per_page: 15,
        currentPage: 1
      },
      dialogDetail: false,
      labelFilter: [
        {
          id: 0,
          value: this.$lang[this.$store.state.userStores.langId].all
        },
        {
          id: 1,
          value: this.$lang[this.$store.state.userStores.langId].paid
        },
        {
          id: 2,
          value: this.$lang[this.$store.state.userStores.langId].unpaid
        }
      ],
      labelFilterPayment: [
        {
          id: 0,
          value: this.$lang[this.$store.state.userStores.langId].all + ' ' + this.$lang[this.$store.state.userStores.langId].payment
        },
        {
          id: 1,
          value: 'Cash'
        },
        {
          id: 2,
          value: 'Online'
        }
      ],
      filterText: {
        id: 0,
        value: this.$lang[this.$store.state.userStores.langId].all
      },
      filterTextPayment: {
        id: 0,
        value: this.$lang[this.$store.state.userStores.langId].all + ' ' + this.$lang[this.$store.state.userStores.langId].payment
      },
      filterTextSett: {
        id: 0,
        value: this.$lang[this.$store.state.userStores.langId].order_date
      },
      labelFilterSett: [
        {
          id: 0,
          value: this.$lang[this.$store.state.userStores.langId].order_date
        },
        {
          id: 1,
          value: this.$lang[this.$store.state.userStores.langId].settlement_date
        }
      ],
      date: {
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
      },
      loadingDownload: false,
      loadingDownloadList: false
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getSettlementAccount()
      this.getDataBank()
      this.getDataSettlement()
    }
  },

  mounted() {
    // this.getSettlementAccount()
    // this.getDataBank()
    this.getDataSettlement()
  },

  methods: {
    getDataBank() {
      this.loading = true
      let param = {
        per_page: 1000
      }
      getDataBank(param).then(response => {
        this.loading = false
        this.listBank = response.data.data
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    getSettlementAccount() {
      this.loading = true
      settlementAccount().then(response => {
        this.loading = false
        this.dataAccount = response.data.data
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    getDataSettlement(date) {
      this.loading = true

      // let param = {}
      // if (filter) {
      //   this.params.search_text.push(this.filterText.id === 1 ? 1 : 0),
      //     this.params.search_column.push('is_paid')
      // }
      if (date) {
        if (this.filterTextSett.id !== 0) {
          this.params.search_text = [this.date.start_date, this.date.end_date]
          this.params.search_column = ['settlement_date', 'settlement_date']
        } else if (this.filterTextSett.id === 0) {
          this.params.search_text = [this.date.start_date, this.date.end_date]
          this.params.search_column = ['start_date', 'end_date']
        } 
        // else if (this.filterText.id === 0 && this.filterTextSett.id !== 0) {
        //   this.params.search_text = [this.date.start_date, this.date.end_date, this.filterTextSett.id === 1? 1 : 0]
        //   this.params.search_column = ['start_date', 'end_date', 'is_settled']
        // } else {
        //   this.params.search_text = [this.date.start_date, this.date.end_date]
        //   this.params.search_column = ['start_date', 'end_date']
        // }
      }

      this.dataSettlement = []

      getDataSettlement(this.params).then(response => {
        this.loading = false
        this.dataSettlement = response.data.data
        this.params.total = response.data.meta.total
        this.params.currentPage = response.data.meta.current_page
      }).catch(error => {
        this.loading = false
        this.params.total = 0
        // this.$message({
        //   type: 'error',
        //   message: error.response.data.error.error
        // })
      })
    },

    getDetailSettlement(data) {
      this.loading = true

      getDetailSettlement(data.id).then(response => {
        this.loading = false
        this.tempSettlement = response.data.data
        this.tempSettlement.total = []
        this.tempSettlement.total.push(response.data.data)
        this.dialogDetail = true
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    getDetailOrder() {
      this.loadingOrder = true

      getDetailOrder(this.tempOrder).then(response => {
        this.loadingOrder = false
        this.tempOrder.data = response.data.data
        this.tempOrder.total = response.data.meta.total
        this.tempOrder.currentPage = response.data.meta.current_page
      }).catch(error => {
        this.loadingOrder = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    confirmPassword() {
      this.loadingCek = true
      let data = {
        password: this.temp.password
      }
      cekPassword(data).then(response => {
        this.loadingCek = false
        this.dialogCekPassword = false
        this.handleSave()
      }).catch(error => {
        this.loadingCek = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    async handleSave() {
      this.loadingSave = true
      const data = await { ...this.temp }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      updateAccount(data).then(response => {
        this.getSettlementAccount()
        this.loadingSave = false
        this.dialogEdit = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
      }).catch(error => {
        this.loadingSave = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleEdit () {
      this.temp = { ...this.dataAccount }
      this.dialogEdit = true
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },

    handleDetailOrder (data) {
      this.tempOrder = {
        id: data.id,
        description: data.description,
        fsettlement_amount: data.fsettlement_amount,
        data: [],
        total: 0,
        page: 1,
        per_page: 15,
        currentPage: 1
      },
      this.show = true
      this.getDetailOrder()
    },

    handleChangeSizePage(val) {
      this.tempOrder.per_page = val
      this.getDetailOrder()
    },
    handleChangePage(val) {
      this.tempOrder.currentPage = val
      this.tempOrder.page = val
      this.getDetailOrder()
    },

    handleChangePageSettlemen(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getDataSettlement(false)
    },

    handleFilter (data) {
      this.filterText = data
      // if (data.id !== 0) {
      //   this.params.search_text = [this.date.start_date, this.date.end_date, this.filterText.id === 1 ? 1 : 0]
      //   this.params.search_column = ['start_date', 'end_date', 'is_paid']
      //   this.getDataSettlement()
      // } else {
      //   this.params.search_text = [this.date.start_date, this.date.end_date]
      //   this.params.search_column = ['start_date', 'end_date']
      //   this.getDataSettlement()
      // }
      if (data.id !== 0 && this.filterTextSett !== 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date, this.filterText.id === 1 ? 1 : 0, this.filterTextSett.id === 1? 1 : 0]
        this.params.search_column = ['start_date', 'end_date', 'is_paid', 'is_settled']
      } else if (data.id !== 0 && this.filterTextSett.id === 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date, this.filterText.id === 1 ? 1 : 0]
        this.params.search_column = ['start_date', 'end_date', 'is_paid']
      } else if (data.id === 0 && this.filterTextSett.id !== 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date, this.filterTextSett.id === 1? 1 : 0]
        this.params.search_column = ['start_date', 'end_date', 'is_settled']
      } else {
        this.params.search_text = [this.date.start_date, this.date.end_date]
        this.params.search_column = ['start_date', 'end_date']
      }
      this.getDataSettlement()
    },

    handleFilterBySettlDate (data) {
      this.filterTextSett = data
      if (this.filterTextSett.id !== 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date]
        this.params.search_column = ['settlement_date', 'settlement_date']
      } else if (this.filterTextSett.id === 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date]
        this.params.search_column = ['start_date', 'end_date']
      }
      this.getDataSettlement()
    },

    handleFilterPayment (data) {
      this.filterTextPayment = data
      if (data.id !== 0 && this.filterTextSett.id !== 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date, 'cash']
        this.params.search_column = ['settlement_date', 'settlement_date', 'payment_mode_name']
        this.params.search_operator = ['>=', '<=', this.filterTextPayment.id === 1 ? '=' : '<>']
        this.getDataSettlement()
      } else if (data.id !== 0 && this.filterTextSett.id === 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date, 'cash']
        this.params.search_column = ['start_date', 'start_date', 'payment_mode_name']
        this.params.search_operator = ['>=', '<=', this.filterTextPayment.id === 1 ? '=' : '<>']
        this.getDataSettlement()
      } else if (data.id === 0 && this.filterTextSett.id !== 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date]
        this.params.search_column = ['settlement_date', 'settlement_date']
        this.params.search_operator = ['>=', '<=']
        this.getDataSettlement()
      } else if (data.id === 0 && this.filterTextSett.id === 0) {
        this.params.search_text = [this.date.start_date, this.date.end_date]
        this.params.search_column = ['start_date', 'end_date']
        this.params.search_operator = ['>=', '<=']
        this.getDataSettlement()
      }
    },

    datePicked(value) {
      this.params.page = 1
      if (value) {
        this.date = value
        this.getDataSettlement(true)
      } else {
        this.getDataSettlement()
      }
    },

    downloadPdf() {
      this.loadingDownload = true

      downloadSettlement(this.tempSettlement.id).then((response) => {
        const fileName = 'Settlement__' + this.tempSettlement.fstart_date + '-' + this.tempSettlement.fend_date + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingDownload = false
      }).catch(error => {
        this.loadingDownload = false
        this.$message({
          type: 'warning',
          message: 'failed'
        })
      })
    },

    handleCancel () {
      this.dialogEdit = false
      this.dialogCekPassword = false
      this.temp = {}
    },

    handleDropdownSection (command) {
      if (command === 'download') {
        this.downloadList()
      }
    },

    downloadList() {
      this.loading = true
      let param = this.params
      param.type = 'xlsx'
      downloadSettlementOnlineOrder(param).then((response) => {
        const fileName = this.rootLang.online_sales + '__' + this.params.search_text[0] + '-' + this.params.search_text[1] + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
        this.$message({
          type: 'warning',
          message: 'failed'
        })
      })
    },
  }
}
</script>
