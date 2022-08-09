<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="banner-deposit radius-10">
        <div class="banner-icon">
          <div class="color-white">
            <span class="title font-32 font-bold">Deposit</span>
            <div class="font-20">Mudahkan pembayaran pelanggan Anda dengan Deposit</div>
          </div>
        </div>
      </div>

      <div class="flex-container mt-24">
        <div class="full-width font-20 font-bold">
          Deposit
        </div>
        <div>
          <el-button type="success" @click="showAddDialog"><i class="el-icon-plus" /> {{ lang.add }}</el-button>
        </div>
      </div>

      <div class="flex-container mt-24">
        <div class="full-width">
          <!-- <el-select
            v-model="params.per_page"
            :placeholder="lang.please_select"
            filterable
            size="small"
            @change="handleChangeSizePage"
            style="width: 120px">
            <el-option
              v-for="item in pages"
              :key="item"
              :value="item"
              :label="item + ' ' + lang.rows"
            />
          </el-select> -->
          <el-button @click="showFilterDialog"><i class="el-icon-sort" /> Filter</el-button>
        </div>
        <div class="table-handler-flex text-right" style="width: 40%">
          <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" size="small"></el-input>
        </div>
      </div>

      <div class="mt-24 mb-24">
        <el-table
          v-loading="loadingDeposit"
          class="with-empty-data"
          style="width: 100%"
          :data="dataDeposit"
          @row-click="getDetailDeposit">
          <div slot="append" v-if="dataDeposit.length === 0" class="card_close_date box-card">
            <div class="no-data-wrapper no-data-settle">
              <img src="/static/img/deposit/no-data-deposit.svg" class="no-data-image">
              <div style="max-width: 360px; width: 100%">
                <span>Belum ada deposit</span>
              </div>
            </div>
          </div>
          <el-table-column min-width="200px" :label="lang.name" label-class-name="word-break" prop="fcreated_time" >
            <template slot-scope="scope">
              <div class="flex-container">
                <div class="font-24">
                  <svg-icon icon-class="icon-wallet-deposit" />
                </div>
                <div class="ml-8">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="nominal" prop="fearned_amount" ></el-table-column>
          <el-table-column :label="lang.sell_price" label-class-name="word-break" prop="fpayable_amount" ></el-table-column>
          <el-table-column :label="rootLang.validity_period" prop="up_to_days" label-class-name="word-break" >
            <template slot-scope="scope">
              <template v-if="scope.row.no_expiry === 0">
                <div v-if="scope.row.up_to_days === null">
                  -
                </div>
                <div v-else>{{ scope.row.up_to_days }} {{ rootLang.day }}</div>
              </template>
              <template v-else>
                {{ rootLang.unlimited }}
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.show_in_pos" prop="show_in_pos" label-class-name="word-break" >
            <template slot-scope="scope">
              <div v-if="scope.row.show_in_pos === 1">{{ lang.yes }}</div>
              <div v-if="scope.row.show_in_pos === 0">{{ lang.no }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.active" prop="is_active" min-width="100px" label-class-name="word-break">
            <template slot-scope="scope">
              <div v-if="scope.row.is_active === 1">
                <el-button type="primary" plain>{{ rootLang.active }}</el-button>
              </div>
              <div v-if="scope.row.is_active === 0">
                <el-button type="primary" plain>{{ rootLang.no }} {{ rootLang.active }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="params.total> params.page_size" class="mt-12 border border--grey-border table-handler-bottom text-center">
          <el-pagination
            :total="params.total"
            :page-sizes="[15, 50, 100]"
            :page-size="params.page_size"
            :current-page.sync="params.currentPage"
            style="margin-bottom: 20px"
            background
            layout="sizes, prev, pager, next"
            @current-change="handleChangePage"
            @size-change="handleChangeSizePage"
          />
        </div>
      </div>

      <el-dialog
        :visible.sync="dialogAddDeposit"
        :show-close="false"
        :close-on-press-escape="false"
        width="536px"
        append-to-body
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ temp.id? lang.edit : lang.add }} Deposit
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCloseAdd">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSave" type="success" @click="handleSaveDeposit" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="full-width">
            <div class="font-14 text-center">Nominal deposit</div>
            <div class=" color-blue-dark--bg radius-5 p-10 color-white">
              <div class="flex-container justify-center font-20 font-bold">
                <div class="container-icon font-32" style="position: absolute; left: 25px;">
                  <svg-icon icon-class="icon-wallet-deposit" />
                </div>
                <div class="full-width text-center">
                  <input-money v-model="temp.earned_amount" class="input-deposit" style="border: none !important;" />
                </div>
              </div>
            </div>
            <div class="mb-16 mt-24 color-info--bg p-8 flex-container">
              <div class="container-icon color-grey--icon">
                <svg-icon icon-class="information-circle" />
              </div>
              <div class="full-width word-break">
                <p style="margin-bottom: 0px !important">• Harga jual deposit tidak bisa lebih kecil dari nominal deposit </p>
                <p style="margin-bottom: 0px !important">• Penjualan deposit tidak dapat digabungkan dengan penjualan produk lain</p>
              </div>
            </div>
            <div class="mb-16">
              <div class="font-12 text-left mt-16">{{ rootLang.deposit_name }}</div>
              <el-input v-model="temp.name"></el-input>

              <div class="font-12 text-left mt-16">{{ lang.sell_price }}</div>
              <input-money v-model="temp.payable_amount" />

              <div class="flex-container mt-16 border border--grey-border px-15" style="height: 36px">
                <div class="full-width font-bold">{{ rootLang.active }}</div>
                <div class="flex-container flex-container--content-end" style="width: 20%">
                  <div v-if="temp.is_active === 1" class="font-12 color-grey--placeholder mr-4">{{ lang.yes }}</div>
                  <div v-else class="font-12 color-grey--placeholder mr-4">{{ lang.no }}</div>
                  <el-switch
                    v-model="temp.is_active"
                    :active-value="1"
                    :inactive-value="0">
                  </el-switch>
                </div>
              </div>

              <div class="flex-container mt-16 border border--grey-border px-15" style="height: 36px">
                <div class="full-width font-bold">Berlaku selamanya</div>
                <div class="flex-container flex-container--content-end" style="width: 20%">
                  <div v-if="temp.no_expiry === 1" class="font-12 color-grey--placeholder mr-4">{{ lang.yes }}</div>
                  <div v-else class="font-12 color-grey--placeholder mr-4">{{ lang.no }}</div>
                  <el-switch
                    v-model="temp.no_expiry"
                    :active-value="1"
                    :inactive-value="0">
                  </el-switch>
                </div>
              </div>

              <template v-if="temp.no_expiry === 0">
                <div class="font-12 text-left mt-16">{{ rootLang.validity_period }}</div>
                <el-input v-model="temp.up_to_days" type="number" min="0" class="suffix-input-label">
                  <div slot="suffix">{{ rootLang.day }}</div>
                </el-input>
              </template>

              <div class="flex-container mt-16 border border--grey-border px-15" style="height: 36px">
                <div class="full-width font-bold">Tampilkan di POS</div>
                <div class="flex-container flex-container--content-end" style="width: 20%">
                  <div v-if="temp.show_in_pos === 1" class="font-12 color-grey--placeholder mr-4">{{ lang.yes }}</div>
                  <div v-else class="font-12 color-grey--placeholder mr-4">{{ lang.no }}</div>
                  <el-switch
                    v-model="temp.show_in_pos"
                    :active-value="1"
                    :inactive-value="0">
                  </el-switch>
                </div>
              </div>
            </div>
            <el-button v-if="temp.id" :loading="loadingSave" @click="dialogDelete = true" class="btn-block color-danger" >
              <svg-icon icon-class="trash-2" /> {{ rootLang.delete }}
            </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogDelete"
        :show-close="false"
        append-to-body
        custom-class="dialog-card"
        width="536px">
        <div class="text-center">
          <span>{{ rootLang.are_you_want_remove }} </span>
          <el-button class="btn-block btn-danger mt-24" :loading="loadingDelete" @click="handleDeleteDeposit">{{ rootLang.delete }}</el-button>
          <el-button class="btn-block btn-info mt-8" @click="dialogDelete = false">{{ lang.cancel }}</el-button>
        </div>
      </el-dialog>

      <transition name="el-zoom-in-center">
        <div
          v-if="dialogFilter"
          class="offscreen-right-sidebar px-null">
          <div class="offscreen-right-sidebar--wrapper">
            <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
              Filter
              <close-esc :hideEsc="true" @close="handleClose" />
            </div>
            
            <div class="px-24">
              <span class="font-16 font-bold">Masa berlaku</span>
              <div class="flex-container border--with-shadow px-15 mb-16" style="height: 36px">
                <div class="full-width font-bold">Berlaku selamanya</div>
                <div class="flex-container flex-container--content-end" style="width: 20%">
                  <el-checkbox v-model="filter.no_expiry" />
                </div>
              </div>

              <div v-if="!filter.no_expiry" class="flex-container mt-24 mb-24" style="height: 36px">
                <div class="full-width mr-4">
                  <div class="full-width font-bold text-lowercase">min. {{ rootLang.validity_period }}</div>
                  <el-input v-model="filter.min" type="number" min="0" @change="handleMax"></el-input>
                </div>
                <div class="full-width ml-4">
                  <div class="full-width font-bold text-lowercase">max. {{ rootLang.validity_period }}</div>
                  <el-input v-model="filter.max" type="number" :min="minFilter"></el-input>
                </div>
              </div>

              <span class="font-16 font-bold">Tampilkan di POS</span>
              <div class="mt-16 mb-24 border--with-shadow ">
                <div class="flex-container mt-16 like-table-wrapper--item px-15" style="height: 40px">
                  <div class="full-width font-bold">{{ lang.yes }}</div>
                  <div class="flex-container flex-container--content-end" style="width: 20%">
                    <el-checkbox v-model="filter.show_in_pos" />
                  </div>
                </div>
                <div class="flex-container like-table-wrapper--item px-15" style="height: 40px">
                  <div class="full-width font-bold">{{ lang.no }}</div>
                  <div class="flex-container flex-container--content-end" style="width: 20%">
                    <el-checkbox v-model="filter.hide_in_pos" />
                  </div>
                </div>
              </div>

              <span class="font-16 font-bold">{{ lang.status }}</span>
              <div class="mt-16 mb-24 border--with-shadow ">
                <div class="flex-container mt-16 like-table-wrapper--item px-15" style="height: 40px">
                  <div class="full-width font-bold">{{ rootLang.active }}</div>
                  <div class="flex-container flex-container--content-end" style="width: 20%">
                    <el-checkbox v-model="filter.active" />
                  </div>
                </div>
                <div class="flex-container like-table-wrapper--item px-15" style="height: 40px">
                  <div class="full-width font-bold">{{ rootLang.not_active }}</div>
                  <div class="flex-container flex-container--content-end" style="width: 20%">
                    <el-checkbox v-model="filter.non_active" />
                  </div>
                </div>
              </div>

              <span class="font-16 font-bold">{{ lang.sell_price }}</span>
              <div class="flex-container mt-16 mb-24" style="height: 36px">
                <div class="full-width mr-4">
                  <div class="full-width font-bold text-lowercase">min. nominal</div>
                  <input-money v-model="filter.min_price" ></input-money>
                </div>
                <div class="full-width ml-4">
                  <div class="full-width font-bold text-lowercase">max. nominal</div>
                  <input-money v-model="filter.max_price"></input-money>
                </div>
              </div>
            </div>

            <div class="offscreen-right-sidebar--footer">
              <div class="flex-container">
                <div class="full-width">
                  <el-button class="btn-block" @click="handleResetFilter">Reset</el-button>
                </div>
                <div class="full-width">
                  <el-button type="primary" class="btn-block" @click="handleApplyFilter">{{ rootLang.apply }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'

import InputMoney from '@/components/InputMoneyV2'

import { fetchMasterDeposit, createMasterDeposit, deleteMasterDeposit, updateMasterDeposit } from '@/api/catalog/deposit'
export default {
  name: 'Deposit',
  mixins: [basicComputedMixin],

  components: {
    InputMoney,
    CloseEsc
  },

  mounted () {
    this.getMasterDeposit()
  },

  computed: {
    minFilter () {
      let value = parseInt(this.filter.min) + 1
      return value
    }
  },

  data () {
    return {
      dataDeposit: [],
      loadingDeposit: false,
      loadingSave: false,
      dialogAddDeposit: false,
      dialogFilter: false,
      meta: {
        total: 0,
        page_size: 15,
        currentPage: 1
      },
      temp: {
        name: '',
        payable_amount: 0,
        is_active: 0,
        show_in_pos: 0,
        earned_amount: 0,
        up_to_days: 0,
        no_expiry: 1
      },
      params: {
        search: '',
        per_page: 15,
        page_size: 15,
        search_text: [],
        search_column: [],
        search_operator: [],
        total: 0,
        currentPage: 0,
        page: 1
      },
      filter: {
        expiry: false,
        min: 0,
        max: 30,
        show_in_pos: false,
        hide_in_pos: false,
        active: false,
        non_active: false,
        min_price: 0,
        max_price: 0
      },
      pages: [5, 10, 20, 50, 100],
      dialogDelete: false,
      loadingDelete: false
    }
  },

  methods: {
    getMasterDeposit(date) {
      this.loadingDeposit = true

      this.dataDeposit = []

      fetchMasterDeposit(this.params).then(response => {
        this.loadingDeposit = false
        this.dataDeposit = response.data.data
        this.params.total = response.data.meta.total
        this.params.currentPage = response.data.meta.current_page
      }).catch(error => {
        this.loadingDeposit = false
        // this.params.total = 0
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    handleSaveDeposit() {
      this.loadingSave = true

      if (this.temp.id) {
        updateMasterDeposit(this.temp).then(response => {
          this.loadingSave = false
          this.getMasterDeposit()
          this.dialogAddDeposit = false
          this.handleCloseAdd()
        }).catch(error => {
          this.loadingSave = false
          // this.params.total = 0
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        })
      } else {
        createMasterDeposit(this.temp).then(response => {
          this.loadingSave = false
          this.getMasterDeposit()
          this.dialogAddDeposit = false
          this.handleCloseAdd()
        }).catch(error => {
          this.loadingSave = false
          // this.params.total = 0
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        })
      }
    },

    showAddDialog () {
      this.dialogAddDeposit = true
    },

    showFilterDialog () {
      this.dialogFilter = true
    },

    handleClose () {
      this.dialogFilter = false
    },

    handleMax () {
      if (parseInt(this.filter.max) <= parseInt(this.filter.min)) {
        this.filter.max = parseInt(this.filter.min) + 1
      }
    },

    getDetailDeposit (data) {
      this.temp = { ...data}
      this.dialogAddDeposit = true
    },

    handleCloseAdd () {
      this.dialogAddDeposit = false
      this.temp = {
        name: '',
        payable_amount: 0,
        is_active: 0,
        show_in_pos: 0,
        earned_amount: 0,
        up_to_days: 0,
        no_expiry: 1
      }
    },

    handleDeleteDeposit () {
      this.loadingDelete = true

      deleteMasterDeposit(this.temp).then(response => {
        this.loadingDelete = false
        this.getMasterDeposit()
        this.dialogDelete = false
        this.handleCloseAdd()
      }).catch(error => {
        this.loadingDelete = false
        // this.params.total = 0
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    handleApplyFilter () {
      this.params.search_text = []
      this.params.search_operator = []
      this.params.search_column = []

      this.params.per_page = 15
      this.params.page = 1
      // this.params.search = ''

      if (!this.filter.no_expiry) {
        for (let i = 0; i <= 2; i++) {
          i === 0? this.params.search_text.push(this.filter.min) : i === 1 ? this.params.search_text.push(this.filter.max) : this.params.search_text.push(0)
          i === 0? this.params.search_operator.push('>=') : i === 1? this.params.search_operator.push('<=') : this.params.search_operator.push('=')
          i === 2? this.params.search_column.push('no_expiry') : this.params.search_column.push('up_to_days')
        }
      } else {
        this.params.search_text.push(1)
        this.params.search_column.push('no_expiry')
        this.params.search_operator.push('=')
      }

      if (this.filter.max_price > 0) {
        for (let i = 0; i < 2; i++) {
          i === 0? this.params.search_text.push(this.filter.min_price) : this.params.search_text.push(this.filter.max_price)
          i === 0? this.params.search_operator.push('>=') : this.params.search_operator.push('<=')
          this.params.search_column.push('payable_amount')
        }
      }

      if (this.filter.show_in_pos && !this.filter.hide_in_pos) {
        this.params.search_text.push(1)
        this.params.search_column.push('show_in_pos')
        this.params.search_operator.push('=')
      } else if (!this.filter.show_in_pos && this.filter.hide_in_pos) {
        this.params.search_text.push(0)
        this.params.search_column.push('show_in_pos')
        this.params.search_operator.push('=')
      }

      if (this.filter.active && !this.filter.non_active) {
        this.params.search_text.push(1)
        this.params.search_column.push('is_active')
        this.params.search_operator.push('=')
      } else if (!this.filter.active && this.filter.non_active) {
        this.params.search_text.push(0)
        this.params.search_column.push('is_active')
        this.params.search_operator.push('=')
      }
      this.dialogFilter = false
      this.getMasterDeposit()
    },

    handleChangePage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getMasterDeposit()
    },

    handleChangeSizePage(val) {
      console.log(val)
      this.params.per_page = val
      this.getMasterDeposit()
    },

    handleSearch (val) {
      this.params.search = val
      this.getMasterDeposit()
    },

    handleResetFilter () {
      this.params.search_text = []
      this.params.search_operator = []
      this.params.search_column = []

      this.params.per_page = 15
      this.params.page = 1

      this.filter = {
        expiry: false,
        min: 0,
        max: 30,
        show_in_pos: false,
        hide_in_pos: false,
        active: false,
        non_active: false,
        min_price: 0,
        max_price: 0
      }

      this.dialogFilter = false
      this.getMasterDeposit()
    }
  }
}
</script>