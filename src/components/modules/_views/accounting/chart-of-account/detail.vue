<template>
    <div class="content-wrapper">
      <section class="content-accounting">
          <div class="box sticky-top-has-submenu" style="top: 60px;">
            <div class="box-header with-border">
              <h4 v-if="!data.account_name && !data.account_no">-</h4>
              <h4 v-else>{{data.account_no}} - {{ capitalize(data.account_name) }}</h4>
              <el-button class="visible-lg visible-md visible-sm" style="position: absolute; right: 55px" icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
              <el-button class="visible-xs" style="position: absolute; right: 33px" icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
            </div>

            <div class="box-body">
              <div class="row">
                <div class="visible-lg visible-md visible-sm col-xs-12 col-sm-9 col-md-9 col-lg-9 text-left text-left inline">
                  <div class="table-handler-flex my-null">
                    <div v-if="pageType">
                      <el-button type="text" @click="changePageType">
                        <svg-icon type="x" class="font-24" color="#F44336"></svg-icon>
                      </el-button>
                      <el-input class="inline-form input-search" 
                        v-model="params.page" @change="changePage" 
                        @keyup.enter.native="changePage"
                        onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )"
                        :placeholder="$lang[langId].page_number"
                        ></el-input>
                    </div>
                    <div v-else>
                      <el-button type="text" v-show="!disablePrev" @click="previousLoad">
                        <svg-icon type="arrow-previous" class="font-24"></svg-icon>
                      </el-button>
                      <el-button type="text" @click="changePageType" class="color-black font-20" :loading="isLoading">{{$lang[langId].page + ' ' + params.page}}</el-button>
                      <el-button type="text" v-show="!disableNext" @click="nextLoad">
                        <svg-icon type="arrow-next" class="font-24"></svg-icon>
                      </el-button>
                    </div>
                    <div style="margin: 0px 18px; height: 3rem; border-right: solid #e3e2e2 thin;"></div>
                    <div class="flex-grow-1">
                      <el-select :placeholder="$lang[langId].select + ' ' + $lang[langId].filter" v-model="params.search_column" @change="selectFilter">
                        <el-option
                          v-for="item in filter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-date-picker
                        v-if="params.search_column === 'transaction_date'"
                        v-model="params.search_text"
                        type="date"
                        format="dd MMM yyyy"
                        @change="handleSearch"
                        :placeholder="$lang[langId].pick_a_day">
                      </el-date-picker>
                      <el-input
                        v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || 
                          params.search_column === 'transaction_description' || params.search_column === 'external_no' ||
                          params.search_column === 'currency_id'
                        "
                        class="inline-form input-search"
                        clearable
                        :placeholder="lang.search"
                        prefix-icon="el-icon-search"
                        v-model="params.search_text"
                        @change="handleSearch">
                      </el-input>
                    </div>
                  </div>

                </div>

                <div class="col-xs-12 visible-xs text-center" style="margin-top: 10px">
                  <el-date-picker
                    v-if="params.search_column === 'transaction_date'"
                    v-model="params.search_text"
                    type="date"
                    format="dd MMM yyyy"
                    @change="handleSearch"
                    :placeholder="$lang[langId].pick_a_day"
                    style="width: 100%;">
                  </el-date-picker>
                  <el-input
                    v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || params.search_column === 'transaction_description' || params.search_column === 'external_no'"
                    style="width: 100%;"
                    clearable
                    :placeholder="lang.search"
                    prefix-icon="el-icon-search"
                    v-model="params.search_text"
                    @change="handleSearch" size="small">
                  </el-input>
                </div>

                <div class="visible-lg visible-sm visible-md col-sm-3 col-md-3 col-lg-3 text-right">
                  <el-button :disabled="loadingPDF" class="button-filter"  @click="getPDF">
                    <span v-if="loadingPDF">
                      <loading :active="true" color= '#1bb4e6' loader="dots" backgroundColor='#ffffff'  :width="32" :height="10" style="text-align: center;"></loading>
                    </span>
                    <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
                  </el-button>
                  <el-button :disabled="loadingExcel" class="button-filter" @click="getExcel">
                    <span v-if="loadingExcel">
                      <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                    </span>
                    <span v-else><svg-icon type="excel"></svg-icon> Excel</span>
                  </el-button>
                </div>

                <div class="visible-xs col-xs-12" style=" margin-top: 10px;">
                  <el-button :disabled="loadingPDF" class="button-filter" @click="getPDF">
                    <span v-if="loadingPDF">
                      <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                    </span>
                    <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
                  </el-button>
                  <el-button :disabled="loadingExcel" class="button-filter" @click="getExcel">
                    <span v-if="loadingExcel">
                      <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                    </span>
                    <span v-else><svg-icon type="excel"></svg-icon> Excel</span>
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <el-card class="box-card">
            <div v-if="isLoading === false">
              <el-table
                ref="multipleTable"
                :data="dataDetail"
                class="product-table-max-height mobile-fix-height-unset"
                @sort-change="changeSortTable"
                stripe>
                <el-table-column
                  prop="transaction_date"
                  :label="lang.date"
                  sortable
                  width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.ftransaction_date}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="transaction_no"
                  :label="lang.transaction_no"
                  width="160"
                  sortable>
                  <template slot-scope="scope">
                    <!-- <span v-if="scope.row.id === ''">{{capitalize(scope.row.transaction_name)}}</span>
                    <span v-else>{{scope.row.transaction_no}}</span> -->
                    <div v-if="scope.row.purchase_sales_form === 4">
                      <router-link :to="{ path: '/inventory/stocksopname/' + scope.row.transaction_id }">
                        {{ scope.row.transaction_no }}
                      </router-link>
                      <!-- <router-link :to="{ name:'Accounting Stock Opname', 
                        params: {row: {inPage: 'Chart Of Account - Detail', data: scope.row, lastParamsDetail: params,
                          year: $route.params.row.year, month: $route.params.row.month,
                          account_no: $route.params.row.account_no,
                          account_name: $route.params.row.account_name,
                          lastParamsList: $route.params.lastParams,
                          monthLabel: $route.params.monthLabel,
                          lastFilter: $route.params.lastFilter}}}">
                        {{ scope.row.transaction_no }}
                      </router-link> -->
                    </div>
                    <div v-else>{{scope.row.transaction_no}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="transaction_description"
                  :label="lang.description"
                  sortable
                  width="350">
                  <template slot-scope="scope">
                    <div>{{capitalize(scope.row.transaction_description)}}</div>
                    <p v-show="scope.row.reference_no || scope.row.external_no" class="font-11">
                      <span v-show="scope.row.reference_no">{{ scope.row.reference_no }}</span>
                      <span v-show="scope.row.reference_no && scope.row.external_no"> | </span>
                      <span v-show="scope.row.external_no">{{ scope.row.external_no }}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="int_debit"
                  :label="$lang[langId].debit"
                  align="right"
                  sortable>
                  <template slot-scope="scope">
                    <div v-if="scope.row.fdebit !== null">{{ scope.row.fdebit }}</div>
                    <div v-else>0</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="int_credit"
                  :label="$lang[langId].credit"
                  align="right" 
                  sortable>
                  <template slot-scope="scope">
                    <div v-if="scope.row.fcredit !== null">{{ scope.row.fcredit }}</div>
                    <div v-else>0</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount"
                  :label="lang.amount"
                  align="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.famount_akumulatif !== null">{{ scope.row.famount_akumulatif }}</div>
                    <div v-else>0</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$lang[langId].action" align="center" width="70">
                  <template slot-scope="scope">
                    <el-dropdown
                      v-if="scope.row.id !== ''"
                      trigger="click"
                      style="padding: inherit">
                      <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                      <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                        <el-dropdown-item style="padding: 0px">
                          <el-button type="text" class="accounting-dropBtn" @click="showPairDialog(scope.row)">
                            <svg-icon icon-class="arrow-couple"></svg-icon>
                            {{ $lang[langId].jurnal_pair }}
                          </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item style="padding: 0px" v-if="scope.row.edit_able === 1">
                          <el-button type="text" class="accounting-dropBtn" style="color: #000000;" @click="editJurnal(scope.row, idx)">
                            <svg-icon icon-class="edit"></svg-icon>
                            {{ lang.edit }}
                          </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item style="padding: 0px" v-if="scope.row.delete_able === 1">
                          <el-button type="text" class="accounting-dropBtn" style="color: #FF0000;" @click="showDeleteDialog(scope.row, idx)">
                            <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                            {{ $lang[langId].delete }}
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else  style="margin-top: 60px;">
              <loading
                align="center"
                :active="true"
                color= '#1bb4e6'
                loader="spinner"
                :width="32"
                :height="32"
                backgroundColor='#ffffff'>
              </loading>
            </div>
          </el-card>
      </section>

      <el-dialog
        :visible.sync="dialogEditJurnal"
        :show-close="false"
        width="40%"
        custom-class="dialog-card">
        <div slot="title" class="flex-container" style="text-align: center">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{formEditJurnal.debit_account === 0 || formEditJurnal.credit_account === 0 ? lang.add + ' ' + lang.account : lang.edit + ' Jurnal'}}</h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_accounting_dialog" v-if="formEditJurnal.debit_account === 0 || formEditJurnal.credit_account === 0">
                <el-button type="info" @click="closeAddAccount">{{ lang.cancel }}</el-button>
                <el-button :disabled="loadingAddAccount" type="success" @click="saveAccount">{{ lang.save }} {{lang.account}}</el-button>
              </div>
              <div class="btn_accounting_dialog" v-else>
                <el-button type="info" @click="cancelJurnal">{{ lang.cancel }}</el-button>
                <el-button :disabled="loadingUpdate" type="success" @click="handleUpdateJurnal">{{ lang.update }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="width: 100%; padding: 0 5% 0 5%;">
          <el-form v-if="formEditJurnal.debit_account === 0 || formEditJurnal.credit_account === 0" @submit.native.prevent>
            <div>
              <label style="font-size: 12px">{{ lang.category }}</label>
            </div>
            <el-form-item>
              <el-select v-model="tempAccount.category" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category" @change="handleChangeCategory($event)">
                <el-option
                  v-for="item in dataGroup"
                  :key="item.id"
                  :label="capitalize(item.account_group)"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.name }} {{ lang.account }}</label>
            </div>
            <el-form-item>
              <el-input id="account_name" v-model="tempAccount.account_name" type="text"></el-input>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].account_number }}</label>
            </div>
            <el-form-item>
              <el-input id="account_number" type="number" v-model="tempAccount.account_number"></el-input>
            </el-form-item>
            <div v-if="accumulationDepreciation">
              <div>
                <label style="font-size: 12px">{{ $lang[langId].accumulation_from_account }}</label>
              </div>
              <el-form-item>
                <el-select v-model="tempAccount.accumulated_depreciation" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + lang.account">
                  <el-option
                    v-for="item in assetAccount"
                    :key="item.account_no"
                    :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                    :value="item.account_no">
                  </el-option>
                </el-select>
                </el-form-item>
            </div>
          </el-form>
          <el-form v-else @submit.native.prevent >
            <div>
                <label style="font-size: 12px">{{ lang.name }} Jurnal</label>
            </div>
            <el-form-item>
              <el-select id="jurnalName" v-model="formEditJurnal.jurnal_name" style="width: 100%" 
                :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
                filterable :disabled="isDisabledJurnalName">
                <el-option
                  v-for="jurnal in dataJurnalName"
                  :key="jurnal.jurnal_name"
                  :label="capitalize(jurnal.jurnal_name)"
                  :value="jurnal.jurnal_name">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-left">
                  {{capitalize(jurnal.jurnal_name)}}
                  </div> 
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-right">
                    <el-button size="mini" type="danger" class="btn-plain" v-if="jurnal.remove_able === 1"
                      :disabled="disabledButton"
                      @click="removeJurnalName(jurnal.id)" icon="el-icon-delete">
                    </el-button>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.date }}</label>
            </div>
            <el-form-item>
              <el-date-picker 
                v-model="formEditJurnal.date"
                type="date" 
                :placeholder="$lang[langId].pick_a_day" 
                format="dd MMMM yyyy" 
                value-format="yyyy-MM-dd"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].debit_account }}</label>
            </div>
            <el-form-item>
              <el-select v-model="formEditJurnal.debit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account" style="width: 100%">
                <el-option :key="0"
                  :value="0"
                  :label="lang.add + ' ' + lang.account">
                  <svg-icon icon-class="plus"/> {{lang.add}} {{lang.account}}
                </el-option>
                <el-option
                  v-for="item in dataAccount"
                  :key="item.account_no"
                  :label="item.account_no + ' ' + capitalize(item.account_name)"
                  :value="item.account_no">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].credit_account }}</label>
            </div>
            <el-form-item>
              <el-select v-model="formEditJurnal.credit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account" style="width: 100%">
                <el-option :key="0"
                  :value="0"
                  :label="lang.add + ' ' + lang.account">
                  <svg-icon icon-class="plus"/> {{lang.add}} {{lang.account}}
                </el-option>
                <el-option
                  v-for="item in dataAccount"
                  :key="item.account_no"
                  :label="item.account_no + ' '+ capitalize(item.account_name)"
                  :value="item.account_no">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.notes }}</label>
            </div>
            <el-form-item>
              <el-input v-model="formEditJurnal.jurnal_description" type="textarea" :rows="2" style="width: 100%"></el-input>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.amount }}</label>
            </div>
            <el-form-item>
              <vue-numeric 
                :currency="selectedStore.currency_id" separator="," decimal-separator="."
                v-bind:precision="2" v-model="formEditJurnal.amount"
                v-bind:minus="false" :allow-clear="true"
                class="form-input input-md input-money">
              </vue-numeric>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
            </div>
            <el-form-item>
              <el-input v-model="formEditJurnal.external_no" type="text" style="width: 100%"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog 
        :title="deleteData.purchase_sales_form !== 0 ? $lang[langId].delete + ' ' + deleteData.transaction_no : lang.notif_warn" 
        :visible.sync="dialogDelete" 
        width="50%" center 
        :close-on-click-modal="false" 
        :show-close="false"> 
        <div v-if="deleteData.purchase_sales_form !== 0">
          <div>
            <label style="font-size: 12px">{{ $lang[langId].note_of_deletion }} <span style="color: #F44336">*</span></label>
          </div>
          <el-input v-model="deleteNote" type="textarea" :rows="3"></el-input>
        </div>
        <div class="text-center" v-else>
          <p>{{ $lang[langId].are_you_want_remove }} {{ lang.transaction }} </p>
          <p style="font-weight: bold;">{{ deleteData.transaction_no }} - {{ capitalize(deleteData.transaction_name) }}
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-row :gutter="20" style="padding: 0 12px 0 12px;">
            <el-col :xs="0" :sm="8" :md="8" :lg="8" :xl="8" style="line-height: 2; text-align: left;">
              <label v-if="deleteData.purchase_sales_form !== 0" class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
            </el-col>
            <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" style="text-align: right;">
              <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
              <el-button :disabled="loadingDelete" type="danger" @click="handleDelete">{{ lang.remove }}</el-button>
            </el-col>
          </el-row>
        </span>
      </el-dialog>

      <dialog-jurnal-pair
        :id="paramsPair.transaction_id"
        :no="paramsPair.transaction_no"
        :name="paramsPair.transaction_name"
        :show="dialogPair"
        @close="closePair"
      />

      <dialog-multi-jurnal-pair
        :pairId="paramsPair.pair_id"
        :show="dialogMultiPair"
        @close="closePair"
      />

      <dialog-edit-multi-jurnal
        :jurnalId="multijurnal_id"
        :show="dialogMultiJurnalEdit"
        @close="cancelJurnal"
      />

    </div>
</template>

<script>
import axios from 'axios';
import {baseApi} from 'src/http-common';
import Loading from 'vue-loading-overlay';
import DialogJurnalPair from 'components/modules/_views/accounting/DialogJurnalPair';
import DialogMultiJurnalPair from 'components/modules/_views/accounting/DialogMultiJurnalPair';
import DialogEditMultiJurnal from 'components/modules/_views/accounting/DialogBalanceEdit';
import mixinAccounting from '@/mixins/mixinAccounting';
const moment = require('moment')

export default {
  name: 'DetailChartOfAccount',
  components: {
    DialogEditMultiJurnal,
    DialogJurnalPair,
    DialogMultiJurnalPair,
    Loading
  },

  mixins: [mixinAccounting],

  data() {
    return {
      isLoading: false,
      loadingDelete: false,
      loadingUpdate: false,
      loadingAddAccount: false,
      loadingPDF: false,
      loadingExcel: false,
      filter: [
        {
          value: null,
          label: this.$store.state.userStores.lang.all
        },{
          value: 'transaction_no',
          label: this.$store.state.userStores.lang.transaction_no
        },{
          value: 'transaction_date',
          label: this.$store.state.userStores.lang.transaction_date
        },{
          value: 'transaction_name',
          label: this.$store.state.userStores.lang.transaction_type_name
        },{
          value: 'external_no',
          label: this.$lang[this.$store.state.userStores.langId].document_number
        },{
          value: 'transaction_description',
          label: this.$store.state.userStores.lang.description
        },{
          value: 'currency_id',
          label: this.$lang[this.$store.state.userStores.langId].currency
        }
      ],
      id: '',
      data: '',
      assetAccount: [],
      dataDetail: [],
      dataJurnalName: [],
      dataBalance: [],
      dataCustomer: [],
      dataSupplier: [],
      dataGroup: [],
      dataAccount: [],
      deleteData: {},
      indexDetail: '',
      deleteNote: '',
      dialogDelete: false,
      dialogPair: false,
      dialogMultiPair: false,
      dialogEditJurnal: false,
      dialogMultiJurnalEdit: false,
      accumulationDepreciation: false,
      isDisabledJurnalName: false,
      disabledButton: false,
      pageType: false,
      disablePrev: true,
      disableNext: true,
      params: {
        year: this.$route.params.row.year,
        month: this.$route.params.row.month,
        account_no: this.$route.params.row.account_no,
        account_name: this.$route.params.row.account_name,
        sort_column: '',
        sort_type: '',
        page: 1,
        per_page: 25,
        total_page: 1
      },
      paramsPair: {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      },
      multijurnal_id: '',
      formEditJurnal: {
        id: '',
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: '0',
        external_no: ''
      },
      moveEdit:{
        debit_account: '',
        credit_account: ''
      },
      tempAccount: {
        category: '',
        account_name: '',
        account_number: '',
        accumulated_depreciation: ''
      }
    }
  },

  watch: {
    filter: {
      handler: function(val){
        this.disablePrev = true
        let tpe = parseInt(val.page)
        if(tpe < 1){
          this.disablePrev = false
        }
      },
      deep: true
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
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },
  methods: {
    selectFilter(val) {
      if(val){
        this.params.search_column = val
      } else {
        this.params = {
          year: this.$route.params.row.year,
          account_no: this.$route.params.row.account_no,
          account_name: this.$route.params.row.account_name,
          sort_column: '',
          sort_type: '',
          page: 1,
          per_page: 25
        }
        this.loadData()
      }
    },

    handleSearch(val) {
      this.params.page = 1
        if(this.params.search_column === 'transaction_date'){
          if(val !== null){
            this.params.search_text = moment(val).format('YYYY-MM-DD')
          } else {
            this.params.search_column = ''
            this.params.search_text = ''
          }
        } else {
          this.params.search_text = val
        }

        if(this.params.search_column === null || this.params.search_text === null){
          this.params = {
            year: this.$route.params.row.year,
            month: this.$route.params.row.month,
            account_no: this.$route.params.row.account_no,
            account_name: this.$route.params.row.account_name,
            sort_column: '',
            sort_type: '',
            page: 1,
            per_page: 25
          }
        }
        this.loadData()
    },

    changeSortTable(val) {
      this.param.page = 1
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.loadData()
    },

    previousLoad(){
      this.params.page = parseInt(this.params.page - 1)
      this.loadData()
    },

    nextLoad(){
      this.params.page = parseInt(this.params.page + 1)
      this.loadData()
    },

    changePageType(){
      let show = this.pageType
      if (show){
        this.pageType = false
        this.params.page = parseInt(this.params.page)
      }else{
        this.pageType = true
      }
    },

    changePage(){
      if(this.params.page <= this.params.total_page){
        this.pageType = false
        this.loadData()
      } else {
        this.params.page = this.params.total_page
      }
    },

    loadData(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      if(Object.keys(this.$route.params).includes('lastParamsDetail') === true ){
        this.params = {
          sort_column: this.$route.params.lastParamsDetail.sort_column,
          sort_type: this.$route.params.lastParamsDetail.sort_type, 
          search_column: this.$route.params.lastParamsDetail.search_column,
          search_text: this.$route.params.lastParamsDetail.search_text,
          page: this.params.page,
          per_page: this.params.per_page
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/detail2'),
        headers: headers,
        params: {
            year: this.$route.params.row.year,
            month: this.$route.params.row.month,
            account_no: this.$route.params.row.account_no,
            sort_column: this.params.sort_column,
            sort_type: this.params.sort_type, 
            search_column: this.params.search_column,
            search_text: this.params.search_text,
            page: this.params.page,
            per_page: this.params.per_page
        }
      }).then(response => {
        this.data = Object.keys(this.$route.params).includes('row') === true ? this.$route.params.row : this.data 
        this.dataDetail = response.data.detail
        this.params.id = this.$route.params.id
        this.params.page = parseInt(response.data.current_page)
        this.params.total_page = parseInt(response.data.total_page.total_page)
        this.disablePrev = this.params.page > 1 ? false : true
        this.disableNext = this.params.page === this.params.total_page ? true : false
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.disablePrev = true
        this.params.page = 1
        this.data = Object.keys(this.$route.params).includes('row') === true ? this.$route.params.row : this.data 
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        year: this.$route.params.row.year,
        month: this.$route.params.row.month,
        account_no: this.$route.params.row.account_no,
        sort_column: this.params.sort_column,
        sort_type: this.params.sort_type, 
        search_column: this.params.search_column,
        search_text: this.params.search_text,
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/receivable/' + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.data.account_name + '-' + this.data.year + '' + this.data.month + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?' + params
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/account/receivable/' + type
        window.location = apiURL + apiParams + ',' + fileName
        this.loadingPDF = false
        this.loadingExcel = false
      }).then(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingPDF = false
        this.loadingExcel = false
      })
    },

    getPDF(data) {
      this.loadingPDF = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        year: this.$route.params.row.year,
        month: this.$route.params.row.month,
        account_no: this.$route.params.row.account_no,
        page: 1,
        per_page: 1000
      }

      if('account_no' in data){
        params = data
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/detail/new/pdf'),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params 
      }).then((response) => {
        if(response.headers['content-type'] === 'application/json'){
          let dataParamsNext = {
            year: this.$route.params.row.year,
            month: this.$route.params.row.month,
            account_no: this.$route.params.row.account_no,
            page: params.page+1,
            per_page: 1000
          }
          this.getPDF(dataParamsNext)
        } else {
          const fileName = this.data.account_name + '-' + this.data.year + '' + this.data.month + '.pdf'
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingPDF = false
        }
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingPDF = false
      })
    },

    getExcel(data) {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {
          year: this.$route.params.row.year,
          month: this.$route.params.row.month,
          account_no: this.$route.params.row.account_no,
          page: 1,
          per_page: 1000
        }

        if('account_no' in data){
          params = data
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/detail/new/excel'),
          responseType: 'blob',
          headers,
          params
        }).then(response => {
          if(response.headers['content-type'] === 'application/json'){
            let dataParamsNext = {
              year: this.$route.params.row.year,
              month: this.$route.params.row.month,
              account_no: this.$route.params.row.account_no,
              page: params.page+1,
              per_page: 1000
            }
            this.getExcel(dataParamsNext)
          } else {
            const fileName = this.data.account_name + '-' + this.data.year + '' + this.data.month + '.xlsx'
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.loadingExcel = false
          }
        }).catch(error => {
          if(typeof error.response.data.error.error === 'object'){
            let errorKey = Object.keys(error.response.data.error.error)[0];
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error[errorKey][0]
            })
          } else {
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loadingExcel = false
        })
    },

    getGroupName () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method : 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/group'),
        headers: headers
      }).then(response => {
        this.dataGroup = response.data.data
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    
    handleChangeCategory (event) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/group/'+ event),
        headers: headers
      })
      .then(response => {
        let res = response.data.data
        this.tempAccount.account_number = res.account_suggestion

        if(res.akumulation_depreciation === 'true'){
          this.getAssetAccount();
        }else{
          this.accumulationDepreciation = false
        }

        document.getElementById('account_number').value = res.account_suggestion;
        document.getElementById('account_name').focus(); 
      })
      .catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getAssetAccount(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/asset'),
        headers: headers
      })
      .then(response => {
        this.assetAccount = response.data.data
        this.accumulationDepreciation = true
      })
      .catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    
    getJurnalName () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnalname'),
        headers: headers
      }).then(response => {
        this.dataJurnalName = response.data.data
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getAccount () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name'),
        headers: headers
      }).then(response => {
        this.dataAccount = response.data.data
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    showDeleteDialog(row, idx) {
      this.deleteData = row
      this.deleteNote = ''
      this.indexDetail = idx
      this.dialogDelete = true
    },

    cancelDeleteDialog() {
      this.dialogDelete = false
      this.deleteNote = ''
      this.indexDetail = ''
      this.deleteData = {}
    },

    handleDelete(){
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.deleteData.account_pair_id
      let params = {
        purchase_sales_form: this.deleteData.purchase_sales_form,
        reason: this.deleteNote
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/' + id),
        headers: headers,
        params: params
      }).then(response => {
        this.deleteData = {}
        this.dialogDelete = false
        this.loadingDelete = false
        this.deleteNote = ''
        let removeIndex = [];

        this.dataDetail[this.indexDetail].children.map((el, index) => {
          if (el.account_pair_id === id){
            removeIndex.push(index);
          }
        })

        for (var i = removeIndex.length -1; i >= 0; i--) 
          this.dataDetail[this.indexDetail].children.splice(removeIndex[i], 1);
        
        this.indexDetail = ''

        this.$message({
          message: response.data.data.message,
          type: 'success'
        })
      }).catch(error => {
        this.loadingDelete = false
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    showPairDialog(row){
      if(row.purchase_sales_form === 0){
        this.paramsPair = {
          pair_id: row.account_pair_id
        }
        this.dialogMultiPair = true
      }else{
        this.paramsPair = {
          transaction_id: row.transaction_id,
          transaction_no: row.transaction_no,
          transaction_name: row.transaction_name,
        }
        this.dialogPair = true
      }
    },

    closePair(){
      this.paramsPair = {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      }
      this.dialogPair = false
      this.dialogMultiPair = false
    },

    removeJurnalName (id) {
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnalname/' + id),
        headers: headers
      }).then(response => {
        document.getElementById('jurnalName').value = '';
        this.disabledButton = false
        this.getJurnalName()
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.dialogAddJurnal = true
      }).catch(error => {
        this.disabledButton = false
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    
    saveAccount () {
      this.loadingAddAccount = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        account_name: this.tempAccount.account_name,
        account_no: this.tempAccount.account_number,
        account_group_id: this.tempAccount.category,
        depreciation_of_account: this.tempAccount.accumulated_depreciation
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name'),
        headers: headers,
        data
      }).then(response => {
        this.loadingAddAccount = false
        this.accumulationDepreciation = false
        this.tempAccount.account_name = ''
        this.tempAccount.account_number = ''
        this.tempAccount.category = ''
        this.tempAccount.accumulated_depreciation = ''
        this.formEditJurnal.debit_account = this.moveEdit.debit_account
        this.formEditJurnal.credit_account = this.moveEdit.credit_account
        this.$message({
            message: 'Success',
            type: 'success'
          })
        this.getAccount()
      }).catch(error => {
         if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingAddAccount = false
      })
    },

    closeAddAccount () {
      this.accumulationDepreciation = false
      this.tempAccount.account_name = ''
      this.tempAccount.account_number = ''
      this.tempAccount.category = ''
      this.tempAccount.accumulated_depreciation = ''
      this.formEditJurnal.debit_account = this.moveEdit.debit_account
      this.formEditJurnal.credit_account = this.moveEdit.credit_account
    },

    editJurnal(row, idx) {
      if(row.jurnal_form === 2){
        this.multijurnal_id = row.multijurnal_id
        this.$router.push({name: 'Edit Multi Jurnal', params: {
          multijurnal_id: this.multijurnal_id,
          fromPage: 'Chart Of Account - Detail',
          lastParamsList: this.$route.params.lastParams,
          lastParamsDetail: this.params,
          row: this.$route.params.row,
          monthLabel: this.$route.params.monthLabel,
          lastFilter: this.$route.params.lastFilter
        }})
        // this.dialogMultiJurnalEdit = true
      }else{
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/' + row.transaction_id + '/' + row.transaction_no),
          headers: headers,
        }).then(response => {
    			this.getJurnalName()
          if(response.data.error === 0){
            this.formEditJurnal = response.data.data
            this.moveEdit = {
              debit_account: this.formEditJurnal.debit_account,
              credit_account: this.formEditJurnal.credit_account
            }
            this.indexDetail = idx
            this.dialogEditJurnal = true
           }else{
            this.$notify({
              tipe: 'warning',
              title: response.data.error.message,
              message: response.data.error.error
            })
          }
        }).catch(error => {
          this.dialogEditJurnal = false
          if(typeof error.response.data.error.error === 'object'){
            let errorKey = Object.keys(error.response.data.error.error)[0];
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error[errorKey][0]
            })
          } else {
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
      }
    },

    handleUpdateJurnal () {
      this.loadingUpdate = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        date: this.formEditJurnal.date,
        debit_account: this.formEditJurnal.debit_account,
        credit_account: this.formEditJurnal.credit_account,
        jurnal_name: this.formEditJurnal.jurnal_name,
        jurnal_description: this.formEditJurnal.jurnal_description,
        currency_id: this.selectedStore.currency_id,
        amount: this.formEditJurnal.amount,
        external_no: this.formEditJurnal.external_no,
        reference_no: this.formEditJurnal.reference_no
      }

      let id = this.formEditJurnal.transaction_id
      let no = this.formEditJurnal.transaction_no 

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/'+ id + '/' + no),
        headers: headers,
        data
      }).then(response => {
        if (response.data.status === 200){
          let update = response.data.data
          this.dialogEditJurnal = false
          this.loadingUpdate = false

          this.dataDetail[this.indexDetail].children.map((i, idx) => {
            if (i.transaction_id === id) {
              i.ftransaction_date = update[0].fdate
              i.transaction_no = update[0].transaction_no
              i.external_no = update[0].external_no
              i.transaction_description = update[0].description
              i.fdebit =  i.int_debit !== 0 ? i.currency_id + ' ' + update[0].famount : i.currency_id + ' 0'
              i.fcredit = i.int_credit !== 0 ? i.currency_id + ' ' + update[0].famount : i.currency_id + ' 0'
              i.famount_akumulatif  = i.currency_id + ' ' + update[0].famount
            }
          })
          this.indexDetail = ''
          this.$message({
            message: 'Success',
            type: 'success'
          })
        } else {
           this.$message({
            message: '',
            type: 'success'
          })
        }
      }).catch(error => {
         if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingUpdate = false
      })
    },

    getSummaries(param, idx) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 2) {
          sums[index] = '';
          return;
        }

        if (index === 1) {
          sums[index] = this.$lang[this.langId].ending_balance;
          return;
        }

        if (index === 3) {
          sums[index] = this.dataDetail[idx].debitAkhir;
          return;
        }

        if (index === 4) {
          sums[index] = this.dataDetail[idx].creditAkhir;
          return;
        }

        if (index === 5) {
          sums[index] = this.dataDetail[idx].saldoAkhir;
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          // sums[index] =  this.formatPrice(values.reduce((prev, curr) => {
          //   const value = Number(curr);
          //   if (!isNaN(value)) {
          //     return prev + curr;
          //   } else {
          //     return prev;
          //   }
          // }), 0);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    cancelJurnal() {
      this.formEditJurnal = {
        transaction_id: '',
        transaction_no: '',
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: ''
      },
      this.indexDetail = ''
      this.multijurnal_id = ''
      this.dialogEditJurnal = false
      this.dialogMultiJurnalEdit = false
      this.loadData()
    },

    backHandle() {
      
      let lastParams = Object.keys(this.$route.params).includes('lastParamsList') === true ? this.$route.params.lastParamsList : this.$route.params.lastParams
      let monthLabel = this.$route.params.monthLabel
      let lastFilter = this.$route.params.lastFilter
      this.$router.push({name: 'List Of Accounts', params: {lastParams: lastParams, lastFilter: lastFilter, monthLabel: monthLabel}})
    },
  },
  mounted() {
    this.loadData()
    this.getAccount()
    this.getGroupName()
  }
}
</script>

<style lang="scss" scoped>
  .cart-items {
    float: none;
    padding: 0;
    // li {
    //   padding: 8px 0 8px 0;
    // }
    h5 {
      font-weight: 600;
      margin-top: 2px;
      margin-bottom: 0;
    }
  }
</style>
