<template>
  <div v-loading="loading">
    <section class="sales-list no-subpage">
      <!-- <div class="font-24 font-semi-bold">Olsera Jogja</div> -->
      <el-card class="box-card">
        <div class="card-body">
          <div class="flex-container">
            <div class="full-width">
              <div class="font-bold">{{ selectedStore.name }}</div>
              <div class="font-14 font-bold">{{ dataAccount.bank_name ? dataAccount.bank_name : rootLang.add_bank_account }}</div>
              <div class="font-12">{{ dataAccount.bank_account_no ? dataAccount.bank_account_name + ' (' +dataAccount.bank_account_no + ')' : 'Sediakan untuk menerima dana settlement' }}</div>
            </div>
            <div v-if="userRole.role_id === 'OW'" class="text-right flex-container">
              <el-button v-if="dataAccount.bank_name" class="mr-12" type="text" @click="handleEdit">
                <svg-icon icon-class="edit-2" class="font-20"/>
              </el-button>
              <el-button v-else class="mr-12 btn-block" type="success" @click="handleEdit">
                {{ lang.add }}
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <div class="table-handler-flex flex-container--content-space-between flex-container--wrap mb-16">
        <div class="flex-container">
          <el-dropdown @command="handleFilter">
            <el-button class="mb-4">
              {{ filterText.value }} <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in labelFilter" :key="item.id" :command ="item">{{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="mb-4">
            <!-- <single-date-picker v-model="date" :clearable="true" @input="datePicked" /> -->
            <date-range-picker
              @picked="datePicked"
            />
        </div>
        <div v-if="defaultAccessByStore.includes(selectedStore.url_id)" class="mb-4">
          <el-button @click="downloadList" :loading="loadingDownloadList">Download excel</el-button>
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
        class="like-table-wrapper">
        <el-table
          v-loading="loading"
          :data="dataSettlement"
          @row-click="getDetailSettlement">
          <el-table-column :label="rootLang.date" prop="fstart_date" min-width="100px" >
            <template slot-scope="scope">
              <div class="flex-container">
                <div style="margin-right: 5px; color: #0085CD" class="font-bold">{{ scope.row.fstart_date }}</div>
                <div>
                  <el-tag v-if="scope.row.date_outstanding_settlement" size="mini" effect="plain">{{ scope.row.date_outstanding_settlement }}</el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.settlement_period" prop="start_date" min-width="180px" >
            <template slot-scope="scope">
              {{ scope.row.fstart_date }} - {{ scope.row.fend_date }}
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.total + ' ' + rootLang.settlement" prop="fnett_amount" min-width="120px" >
            <template slot-scope="scope">
              <span v-if="parseInt(scope.row.nett_amount) < 0" style="color: #F44336">{{ scope.row.fnett_amount }}</span>
              <span v-else>{{ scope.row.fnett_amount }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.status" prop="is_paid" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.settled_status === 2" effect="plain" type="success" class="text-capitalize">{{ scope.row.settled_status_desc }}</el-tag>
              <el-tag v-if="scope.row.settled_status === 1" effect="plain" type="info" class="text-capitalize">{{ scope.row.settled_status_desc }}</el-tag>
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
            <el-table-column label="Convenience fee" prop="ftrans_fee" >
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
import { dataSettlement as getDataSettlement, 
  dataBank as getDataBank,
  settlementAccount,
  updateAccount,
  cekPassword,
  detailSettlement as getDetailSettlement,
  detailOrder as getDetailOrder,
  downloadSettlement,
  downloadSettlementList } from '@/api/settlement'

var moment = require('moment')
const startDate = moment().add(-6, 'days').format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

export default {
  name: 'Settlement',
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
        search_column: ['start_date'],
        search_text: [endDate + ',' + endDate],
        search_operator: ['range'],
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
      filterText: {
        id: 0,
        value: this.$lang[this.$store.state.userStores.langId].all
      },
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
    this.getSettlementAccount()
    this.getDataBank()
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
        // this.$message({
        //   type: 'error',
        //   message: error.response.data.error.error
        // })
      })
    },

    getSettlementAccount() {
      this.loading = true
      settlementAccount().then(response => {
        this.loading = false
        this.dataAccount = response.data.data
      }).catch(error => {
        this.loading = false
        // this.$message({
        //   type: 'error',
        //   message: error.response.data.error.error
        // })
      })
    },

    getDataSettlement(date) {
      this.loading = true

      // let param = {}
      // if (filter) {
      //   this.params.search_text.push(this.filterText.id === 1 ? 1 : 0),
      //     this.params.search_column.push('is_paid')
      // }

      this.$delete(this.params, 'type')

      if (date) {
        let dd = [this.date.start_date, this.date.end_date]
        if (this.filterText.id !== 0) {
          this.params.search_text = [ dd.join(','), this.filterText.id === 1 ? 1 : 0]
          this.params.search_column = ['start_date', 'is_paid']
        } else {
          this.params.search_text = [dd.join(',')]
          this.params.search_column = ['start_date']
        }
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
      this.filterTextPayment = {
        id: 0,
        value: this.$lang[this.$store.state.userStores.langId].all + ' ' + this.$lang[this.$store.state.userStores.langId].payment
      }
      let dd = [this.date.start_date, this.date.end_date]
      if (data.id !== 0) {
        this.params.search_text = [dd.join(','), this.filterText.id === 1 ? 1 : 0]
        this.params.search_column = ['start_date', 'is_paid']
        this.params.search_operator = ['range', '=']
        this.getDataSettlement()
      } else {
        this.params.search_text = [dd.join(',')]
        this.params.search_column = ['start_date']
        this.params.search_operator = ['range']
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

    downloadList() {
      this.loadingDownloadList = true
      this.params.type = 'xlsx'
      downloadSettlementList(this.params).then((response) => {
        const fileName = 'Settlement List__' + this.params.search_text[0] + '-' + this.params.search_text[1] + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingDownloadList = false
      }).catch(error => {
        this.loadingDownloadList = false
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
    }
  }
}
</script>
