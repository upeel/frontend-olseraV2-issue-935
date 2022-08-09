<template>
  <div>
    <div class="content-wrapper">
      <section class="content-accounting">
        <div v-if="isSetup === 'false'">
          <el-card class="box-card" shadow="never">
            <div class="div-nodata-accounting">
              <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
              <div class="no_close" >{{$lang[langId].setup_message}}</div>
              <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
            </div>
          </el-card>
        </div>

        <div v-else-if="isSetup === 'true'">
          <el-card class="box-card" shadow="never">
            <div class="table-handler-flex">
              <!-- <div class="visible-lg visible-md visible-sm"> -->
                <div class="col-sm-6 col-lg-8 col-md-8 text-left" >
                  <el-select v-model="search_column" @change="selectFilter">
                    <el-option
                      v-for="item in filter"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-date-picker
                    v-if="search_column === 'transaction_date'"
                    v-model="search_text"
                    type="date"
                    format="dd MMM yyyy"
                    @change="handleSearch"
                    :placeholder="$lang[langId].pick_a_day">
                  </el-date-picker>
                  <el-select v-if="search_column === 'asset_status'" v-model="search_text" @change="handleSearch">
                    <el-option
                      v-for="item in status"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input
                    v-if="search_column === 'description'"
                    class="inline-form input-search"
                    clearable
                    :placeholder="lang.search+' '+lang.incoming_stock_no"
                    prefix-icon="el-icon-search"
                    v-model="search_text"
                    @change="handleSearch">
                  </el-input>
                </div>
                <div class="visible-lg visible-md visible-sm col-sm-6 col-lg-4 col-md-4 text-right" >
                  <el-button
                    :disabled="chosenAsset.length === 0"
                    :type="chosenAsset.length === 0 ? 'info' : 'primary'"
                    @click="showDialogDepreciaton">
                    <svg-icon type="decrease"></svg-icon>
                    {{ $lang[langId].depreciation }}
                  </el-button>
                  <el-button
                    type="info"
                    @click="openImport"
                    class="button-filter">
                    {{ lang.import }}
                  </el-button>
                  <el-button
                    type="success"
                    icon="el-icon-plus"
                    @click="showDialogAdd">
                    {{ lang.add }}
                  </el-button>
                  <!-- <el-button
                    type="info"
                    icon="el-icon-plus"
                    @click="downloadTemplate">
                    Import
                  </el-button> -->
                </div>
            </div>
            <div style="margin-top: 24px">
              <div v-if="isLoading === false">
                <el-table
                  ref="multipleTable"
                  v-loading="isLoading"
                  class="product-table-max-height mobile-fix-height-unset"
                  @selection-change="handleSelectionChange"
                  :data="dataAsset"
                  stripe>
                  <el-table-column type="selection" width="30" class-name="text-center">
                  </el-table-column>
                  <el-table-column
                    prop="transaction_date"
                    :label="lang.order_date"
                    sortable
                    width="125">
                    <template slot-scope="scope">
                      <span>{{scope.row.ftransaction_date}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="transaction_no"
                    :label="$lang[langId].asset"
                    sortable
                    width="90">
                    <template slot-scope="scope">
                      <el-button type="text" @click="showDetail(scope.row)">
                        {{scope.row.transaction_no}}
                      </el-button>
                      <el-tag size="mini"
                        v-if="scope.row.asset_status === 'Aktif' || scope.row.asset_status === 'Active'"
                        type="success" align="center">
                        {{scope.row.asset_status}}
                      </el-tag>
                      <el-tag size="mini"
                        v-else-if="scope.row.asset_status === 'Selesai' || scope.row.asset_status === 'Finish'"
                        type="default" align="center">
                        {{scope.row.asset_status}}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    :label="lang.description"
                    sortable>
                    <template slot-scope="scope">
                      <span>{{ capitalize(scope.row.description) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="int_first_value"
                    :label="$lang[langId].beginning_amount"
                    sortable>
                    <template slot-scope="scope">
                      <div v-if="scope.row.ffirst_amount !==null">{{ scope.row.ffirst_value }}</div>
                      <div v-else>IDR 0</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="int_residual_value"
                    :label="$lang[langId].residual_value"
                    sortable>
                    <template slot-scope="scope">
                      <div v-if="scope.row.fresidual_value !==null">{{ scope.row.fresidual_value }}</div>
                      <div v-else>IDR 0</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="int_balance"
                    :label="lang.balance"
                    sortable>
                    <template slot-scope="scope">
                      <div v-if="scope.row.fbalance !==null">{{ scope.row.fbalance }}</div>
                      <div v-else>IDR 0</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$lang[langId].last_residual">
                    <template slot-scope="props">
                      <div v-if="props.row.last_depreciation_month_name !== null && props.row.last_depreciation_year !== null">
                        {{props.row.last_depreciation_month_name + ' ' + props.row.last_depreciation_year}}
                      </div>
                      <div v-else>
                        <span style="font-size: 12px">-</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$lang[langId].action" align="center" width="70">
                    <template slot-scope="scope">
                      <el-dropdown trigger="click" style="padding: inherit">
                        <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                        <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                          <el-dropdown-item style="padding: 0px">
                            <el-button type="text" class="accounting-dropBtn" @click="detailAsset(scope.row)">
                              <svg-icon icon-class="eye"></svg-icon>
                              {{ $lang[langId].depreciation_detail }}
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item  style="padding: 0px" v-if="scope.row.asset_status === 'Aktif' || scope.row.asset_status === 'Active'">
                            <el-button type="text" class="accounting-dropBtn" @click="showFinishDialog(scope.row)">
                              <svg-icon icon-class="check"></svg-icon>
                              {{ $lang[langId].complete }}
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item style="padding: 0px">
                            <el-button type="text" class="accounting-dropBtn" @click="showPairDialog(scope.row)">
                              <svg-icon icon-class="arrow-couple"></svg-icon>
                              {{ $lang[langId].jurnal_pair }}
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item style="padding: 0px" v-if="scope.row.asset_status === 'Aktif' || scope.row.asset_status === 'Active'">
                            <el-button type="text" class="accounting-dropBtn" @click="maintainceAsset(scope.row)">
                              <svg-icon icon-class="repairing"></svg-icon>
                              Perawatan Aset
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item style="padding: 0px">
                            <el-button type="text" class="accounting-dropBtn" style="color: #FF0000;" @click="showDeleteAsset(scope.row)">
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
              <div style="margin-top: 20px; margin-bottom: -55px">
                <el-select v-model="params.per_page"  @change="handleSizeChange" placeholder="Select" class="perpage" style="width: 120px">
                  <el-option
                    v-for="item in itemPage"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="text-align: center">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="params.currentPage"
                  :page-size="parseInt(params.per_page)"
                  layout="total, prev, pager, next, jumper"
                  :total="params.total"
                  class="paginate">
                </el-pagination>
              </div>
            </div>
          </el-card>
        </div>

        <div v-else>
          <el-card class="box-card" shadow="never">
            <loading 
              align="center"
              :active="true"
              color= '#1bb4e6'
              loader="bars"
              :width="64"
              :height="64"
              backgroundColor='#ffffff'>
            </loading>
          </el-card>
        </div>

      </section>
    </div>

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogDepreciation" 
      width="51%" center 
      :close-on-click-modal="false" 
      :show-close="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{$lang[langId].apply}} {{$lang[langId].asset}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="cancelDepreciation">{{ lang.cancel }}</el-button>
              <el-button :disabled="loadingDepreciation" :loading="loadingDepreciation" type="success" @click="handleDepreciation">{{ $lang[langId].apply }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; padding: 0 5% 0 5%; margin-top: -10px;">
        <el-form @submit.native.prevent >
          <div>
              <label style="font-size: 12px">{{ $lang[langId].pick_a_day }}</label>
          </div>
          <el-form-item>
            <el-date-picker 
              v-model="depreciationDate"
              type="date" 
              :placeholder="$lang[langId].pick_a_day" 
              format="dd MMMM yyyy" 
              value-format="yyyy-MM-dd"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          v-loading="isLoading"
          :data="chosenAsset"
          :default-sort="{prop: 'transaction_date', order: 'descending'}"
          class="product-table-max-height mobile-fix-height-unset"
          stripe>
          <el-table-column
            prop="transaction_date"
            :label="lang.date"
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.ftransaction_date}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            :label="lang.description"
            width="140">
            <template slot-scope="scope">
              <span>{{capitalize(scope.row.description)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="depreciation"
            :label="'Amount (' + selectedStore.currency_id + ')'"
            align="left"
            width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.ffirst_value !== null">{{ scope.row.ffirst_value }}</div>
              <div v-else>{{selectedStore.currency_id}} 0</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$lang[langId].last_residual"
             width="160">
            <template slot-scope="props">
              <div v-if="props.row.last_depreciation_month_name !== null && props.row.last_depreciation_year !== null">
                {{props.row.last_depreciation_month_name + ' ' + props.row.last_depreciation_year}}
              </div>
              <div v-else>
                <span style="font-size: 12px">-</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogAdd"
      :show-close="false"
      fullscreen
      width="80%"
      custom-class="dialog-card">
        <div slot="title" class="flex-container" style="text-align: center;">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="visible-md visible-lg visible-sm" align="left">
              <label class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="center">
              <h4 class="dialog-title">{{depreciation == true ? $lang[langId].depreciation_form :'Jurnal'}}</h4>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="right">
              <div v-if="depreciation" class="btn_accounting_dialog">
                <el-button type="info" @click="handleCloseJurnal">{{ $lang[langId].skip_it }}</el-button>
                <el-button type="success" @click="handleSaveAsset">{{ lang.save }}</el-button>
              </div>

              <div v-else class="btn_accounting_dialog">
                <el-button type="info" @click="handleCloseJurnal">{{ lang.cancel }}</el-button>
                <el-button type="success" @click="handleSaveJurnal" :loading="isDisabledJurnalName" :disabled="isDisabledJurnalName">{{ lang.save }}</el-button>
              </div>
            </el-col>
          </el-row>
          
        </div>
        <div v-if="depreciation" class="form-add-jurnal">
          <div style="padding: 30px 15px 15px 15px;">
            <el-tag size="large"
              type="info" style="color: #606266; width: 100%;">
              <svg-icon type="information-circle" stroke="#606266" style="font-size: medium"></svg-icon>
              {{$lang[langId].depreciation_message}}
            </el-tag>
          </div>
          <div class="col-lg-12" style="padding: 0">
            <div class="col-lg-6" style="margin: auto">
              <div>
                <el-form @submit.native.prevent>
                  <div>
                    <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-date-picker 
                      v-model="formDepreciation.date"
                      type="date" 
                      :placeholder="this.$lang[langId].pick_a_day" 
                      format="dd MMMM yyyy" 
                      value-format="yyyy-MM-dd"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.transaction_no }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-input v-model="formDepreciation.reference_jurnal_no" type="text"></el-input>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="formDepreciation.depreciation_debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                      <el-option
                        v-for="item in dataExpenses"
                        :key="item.account_no"
                        :label="item.account_no + ' '+ capitalize(item.account_name)"
                        :value="item.account_no">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="formDepreciation.depreciation_credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account">
                      <el-option
                        v-for="item in accountDepreciation"
                        :key="item.account_no"
                        :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                        :value="item.account_no">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="col-lg-6" style="margin: auto">
                <el-form @submit.native.prevent>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].beginning_amount }}</label>
                  </div>
                  <el-form-item>
                    <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                      v-model="formDepreciation.first_value"
                    />
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].residual_value }}</label>
                  </div>
                  <el-form-item>
                    <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                      v-model="formDepreciation.residual_value"
                    />
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].economic_life }}</label>
                  </div>
                  <el-form-item>
                    <el-input
                      v-model="formDepreciation.economic_life"
                      onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )"
                      class="input-with-select">
                      <el-select v-model="formDepreciation.life_as_year" slot="append" placeholder="Select" width="100">
                        <el-option :label="lang.month" value="0">{{lang.month}}</el-option>
                        <el-option :label="lang.year" value="1">{{lang.year}}</el-option>
                      </el-select>
                    </el-input>

                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.notes }}</label>
                  </div>
                  <el-form-item>
                    <el-input v-model="formDepreciation.description" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                </el-form>
            </div>
            <el-input v-model="formDepreciation.currency_id" type="hidden">{{selectedStore.currency_id}}</el-input>
          </div>
        </div>
        <div v-else class="form-add-jurnal">
          <div class="col-lg-12" style="padding: 30px 0">
            <div class="col-lg-6" style="float: none; margin: auto">
              <el-form @submit.native.prevent>
                <div>
                  <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                    <el-select id="jurnalName" v-model="formAdd[0].jurnal_name" style="width: 100%" 
                      :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
                      filterable :disabled="isDisabledJurnalName">
                      <el-option
                        v-for="item in dataJurnalName"
                        :key="item.jurnal_name"
                        :label="capitalize(item.jurnal_name)"
                        :value="item.jurnal_name">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-left">
                          {{capitalize(item.jurnal_name)}}
                        </div> 
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-right">
                          <el-button size="mini" type="danger" class="btn-plain" v-if="item.remove_able === 1"
                            :disabled="disabledButton"
                            @click="removeJurnalName(item.id)" icon="el-icon-delete">
                          </el-button>
                        </div>
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-right" style="padding-right: 0px">
                    <div class="visible-lg visible-md visible-sm">
                      <el-button class="add-button" type="primary" @click="addJurnalName" :disabled="isDisabledJurnalName" icon="el-icon-plus">
                        {{ lang.add }} {{lang.name}}
                      </el-button>
                    </div>
                    <div class="visible-xs">
                      <el-button class="add-button" type="primary" @click="addJurnalName" :disabled="isDisabledJurnalName" icon="el-icon-plus"></el-button>
                    </div>
                  </div>
                </el-form-item>
                <div v-if="createJurnalName" style="width: 100%;">
                  <div>
                    <label style="font-size: 12px">{{ lang.name }} Jurnal {{ lang.new }}</label>
                  </div>
                  <el-form-item>
                    <div class="col-lg-7 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                      <el-input v-model="newJurnalName" placeholder="Jurnal"></el-input>
                    </div>
                    <div class="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-right" style="padding-right: 0px">
                      <div class="visible-lg visible-md visible-sm">
                        <el-button @click="cancelJurnalName" class="info">{{ lang.cancel }}</el-button>
                        <el-button :disabled="loadingAddJurnalName" @click="handleSaveJurnalName" type="success">{{ lang.save }}</el-button> 
                      </div>
                      <div class="visible-xs">
                        <el-dropdown trigger="click">
                          <el-button type="info" icon="el-icon-more" class="add-button"></el-button>
                          <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                            <el-dropdown-item style="padding: 0px">
                              <el-button type="text" class="accounting-dropBtn" style="color: #FF0000" @click="cancelJurnalName">
                                <svg-icon type="x" stroke="#FF0000"></svg-icon>
                                {{ lang.cancel }}
                              </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item style="padding: 0px">
                              <el-button type="text" :disabled="loadingAddJurnalName" class="accounting-dropBtn" style="color: #67C23A" @click="handleSaveJurnalName">
                                <svg-icon icon-class="save" stroke="#67C23A"></svg-icon>
                                {{ lang.save }}
                              </el-button>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                  </el-form-item>
                </div>

                <div>
                  <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-date-picker 
                    v-model="formAdd[0].date"
                    type="date" 
                    :placeholder="this.$lang[langId].pick_a_day" 
                    format="dd MMMM yyyy" 
                    value-format="yyyy-MM-dd"
                    style="width: 100%">
                  </el-date-picker>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select v-model="formAdd[0].debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                    <el-option
                      v-for="item in dataDebit"
                      :key="item.account_no"
                      :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                      :value="item.account_no">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select v-model="formAdd[0].credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account">
                    <el-option
                      v-for="item in dataCredit"
                      :key="item.account_no"
                      :label="item.account_no + ' '+ capitalize(item.account_name)"
                      :value="item.account_no">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.notes }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-input v-model="formAdd[0].jurnal_description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                    v-model="formAdd[0].amount"
                  />
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
                </div>
                <el-form-item>
                  <el-input v-model="formAdd[0].external_no" type="text" style="width: 100%;"></el-input>
                </el-form-item>
              </el-form>
              <el-input v-model="formAdd.currency_id" type="hidden">{{selectedStore.currency_id}}</el-input>
            </div>
          </div>
        </div>
      <label class="visible-xs" style="margin-top: 20px;">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
    </el-dialog>

    <dialog-import-asset ref="importAsset" :show="dialogImport" @close="closeImport"/>

    <el-dialog
      :title="lang.notif_warn" 
      :visible.sync="dialogFinish" 
      width="50%" center 
      :close-on-click-modal="false" 
      :show-close="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{capitalize(asset.asset_name)}} ({{asset.balance}})</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="closeFinishDialog">{{ lang.cancel }}</el-button>
              <el-button :disabled="loadingFinish" :loading="loadingFinish" type="success" @click="handleFinishAsset">{{ $lang[langId].finish }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div style="width: 100%; padding: 0 5% 0 5%;">
        <el-form @submit.native.prevent>
          <div>
            <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
          </div>
          <el-form-item>
            <el-date-picker 
              v-model="formFinish.date"
              type="date" 
              :placeholder="this.$lang[langId].pick_a_day" 
              format="dd MMMM yyyy" 
              value-format="yyyy-MM-dd"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.notes }} <span style="color: #F44336">*</span></label>
          </div>
          <el-form-item>
            <el-input v-model="formFinish.description" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].document_number }} </label>
          </div>
          <el-form-item>
            <el-input v-model="formFinish.external_no"></el-input>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].assets_condition }}</label>
          </div>
          <el-radio-group v-model="formFinish.sell" style="	border: groove; border-color: #409eff54; border-width: thin;">
            <el-radio-button label="false">
              {{ this.$lang[langId].lost_or_damaged }}
            </el-radio-button> 
            <el-radio-button label="true">
              {{ this.$lang[langId].asset }} {{ this.$lang[langId].sell }}
            </el-radio-button>
          </el-radio-group>
          <div v-if="formFinish.sell === 'true'">
            <div>
              <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <el-select v-model="formFinish.debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                <el-option
                  v-for="item in dataCredit"
                  :key="item.account_no"
                  :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                  :value="item.account_no">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <el-select v-model="formFinish.credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                <el-option
                  v-for="item in dataRevenue"
                  :key="item.account_no"
                  :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                  :value="item.account_no">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                v-model="formFinish.amount"
              />
            </el-form-item>
          </div>
        </el-form>
        <label style="text-align: right; width: 100%">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
      </div>
    </el-dialog>
    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogDeleteAsset" 
      width="50%" center 
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }}  {{ $lang[langId].transaction }} {{ $lang[langId].asset }}</p>
        <p style="font-weight: bold;">{{ deleteData.description }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button :disabled="loadingDelete" :loading="loadingDelete" type="danger" @click="handleRemmoveAsset">{{ lang.remove }}</el-button>
      </span>
    </el-dialog>

    <dialog-jurnal-pair
      :id="paramsPair.transaction_id"
      :no="paramsPair.transaction_no"
      :name="paramsPair.transaction_name"
      :show="dialogPair"
      @close="dialogPair = false"
    />
  </div>
</template>

<script>
import {baseApi} from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import DialogJurnalPair from 'components/modules/_views/accounting/DialogJurnalPair';
import dialogImportAsset from './dialogImportAsset';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
var moment = require('moment')

export default {
  name: 'Asset',
  components: {
    DialogJurnalPair,
    Loading,
		dialogSetup,
    dialogImportAsset,
    InputMoneySelectCurrency
  },
  
  mixins: [mixinAccounting],

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
  },
  data(){
    return{
      isLoading: false,
      loadingAddAccount: false,
      loadingAddJurnalName: false,
      loadingDepreciation: false,
      loadingFinish: false,
      loadingDelete: false,
      filter: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },{
          value: 'transaction_date',
          label: this.$store.state.userStores.lang.transaction_date
        },{
          value: 'description',
          label: this.$store.state.userStores.lang.description
        },{
          value: 'asset_status',
          label: this.$store.state.userStores.lang.status
        }
      ],
      itemPage: [
        {
          value: '15',
          label: '15 item'
        },{
          value: '25',
          label: '25 item'
        },{
          value: '50',
          label: '50 item'
        },{
          value: '100',
          label: '100 item'
        }
      ],
      status: [
        {
          value: this.$lang[this.$store.state.userStores.langId].active
        },{
          value: this.$lang[this.$store.state.userStores.langId].finish
        }
      ],
      dataAsset:[],

      dataJurnalName: [],
      dataDebit: [],
      dataExpenses: [],
      dataCredit: [],
      accountDepreciation: [],
      dataRevenue: [],
      search_column: '',
      search_text: '',
      params:{
        sort_column: 'transaction_date',
        sort_type: 'desc',
        // cash_date: moment().format('YYYY-MM-DD'),
        per_page: 15,
        currentPage: 1,
        page: 1,
        total: null,
      },
      paramsPair: {
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      },
      dialogAdd: false,
      dialogDelete: false,
      dialogDeleteAsset: false,
      dialogDepreciation: false,
      dialogPair: false,
      dialogFinish: false,
      dialogImport: false,
      createJurnalName: false,
      isDisabledJurnalName: false,
      disabledButton: false,
      depreciation: false,
      accumulationDepreciation: false,
      newJurnalName: '',
      formAdd: [
        {
          date: moment().format('YYYY-MM-DD'),
          debit_account: '',
          credit_account: '',
          jurnal_name: '',
          jurnal_description: '',
          currency_id: this.$store.getters.selectedStore.currency_id,
          amount: 0,
          external_no: ''
        }
      ],
      tempAccount: {
        category: '',
        account_name: '',
        account_number: '',
        accumulated_depreciation: ''
      },
      formDepreciation: {
        date: '',
        depreciation_debit_account: '',
        depreciation_credit_account: '',
        description: '',
        currency_id: this.$store.getters.selectedStore.currency_id,
        first_value: 0,
        residual_value: 0,
        economic_life: 1,
        reference_jurnal_no: '',
        reference_transaction_id: '',
        life_as_year: '0'
      },
      formFinish: {
        id: '',
        description: '',
        date: moment().format('YYYY-MM-DD'),
        sell: 'false',
        debit_account: '',
        credit_account: '',
        currency_id: this.$store.getters.selectedStore.currency_id,
        external_no: '',
        amount: ''
      },
      asset: {
        asset_name: '',
        balance: ''
      },
      chosenAsset: [],
      depreciationDate: moment().format('YYYY-MM-DD'),
      deleteData: {},

    }
  },
  mounted(){
    this.accountSetup()
    this.getLastParams()
    this.getJurnalName()
    this.getRevenue()
  },
  methods:{
    selectFilter(val) {
      if(val){
        this.params = {
          search_column: val,
          search_text: [],
          currentPage: 1,
          per_page: 15,
          page: 1,
          total: null
        }
      } else {
        this.params = {
          currentPage: 1,
          per_page: 15,
          page: 1,
          total: null
        }
        this.getDataAsset()
      }
    },

    handleSearch(val) {
        if(this.search_column === 'transaction_date'){
          if(val !== null){
            this.$set(this.params, 'search_column', this.search_column)
            // this.params.search_column = this.search_column
            this.$set(this.params, 'search_text', moment(val).format('YYYY-MM-DD'))
          } else {
            this.$delete(this.params, 'search_column')
            this.$delete(this.params, 'search_text')
            this.search_column = ''
            this.search_text = ''
          }
        } else {
          this.$set(this.params, 'search_column', this.search_column)
          this.$set(this.params, 'search_text', val)
        }
        this.params.page = 1
        if(this.search_column === '' || this.search_text === ''){
          this.params = {
            currentPage: 1,
            per_page: 15,
            page: 1,
            total: null
          }
        }
        this.getDataAsset()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getDataAsset()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getDataAsset()
    },

    getLastParams(){
      if(Object.keys(this.$route.query).includes('lastParams') === true){
        this.params = {
          sort_column: this.$route.query.lastParams.sort_column,
          sort_type: this.$route.query.lastParams.sort_type,
          cash_date: this.$route.query.lastParams.cash_date,
          per_page: this.$route.query.lastParams.per_page,
          currentPage: this.$route.query.lastParams.currentPage,
          page: this.$route.query.lastParams.page,
          total: null
        }
    }
      
      this.getDataAsset()
    },

    getDataAsset(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset'),
        headers: headers,
        params: this.params
      })
      .then(response => {
        this.dataAsset = response.data.data
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
        this.isLoading = false 
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
        this.isLoading = false
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

    showDialogAdd(){
      this.getDebit()
      this.getExpenses()
      this.getCredit()
      this.getAccountDepreciation()

      this.dialogAdd = true
    },

    getDebit(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/assetonly'),
        headers: headers
      }).then(response => {
        this.dataDebit = response.data.data
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

    getExpenses(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/expenses'),
        headers: headers
      }).then(response => {
        this.dataExpenses = response.data.data
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

    getCredit(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/cashcapital'),
        headers: headers
      }).then(response => {
        this.dataCredit = response.data.data
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

    getAccountDepreciation(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/depreciation'),
        headers: headers
      }).then(response => {
        this.accountDepreciation = response.data.data
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

    getRevenue(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/revenue'),
        headers:  headers
      }).then(response => {
        this.dataRevenue = response.data.data
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
    
    handleSelectionChange: function(val) {
      if (val.length > 0) {
        this.chosenAsset = val
      }else{
        this.chosenAsset = []
      }
    },

    showDialogDepreciaton(){
      this.dialogDepreciation = true
    },

    cancelDepreciation(){
      this.dialogDepreciation = false
      this.getDataAsset()
    },

    handleDepreciation() {
      this.loadingDepreciation = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = []

      this.chosenAsset.forEach((item, index) => {
        data.push({
          date: moment(this.depreciationDate).format('YYYY-MM-DD'),
          id: item.id
        });
      })

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/depreciation'),
        headers:headers,
        data
      }).then(response => {
        this.dialogDepreciation = false
        this.loadingDepreciation = false
        this.chosenAsset.map((item, no) => {
          this.dataAsset.map((i, idx) => {
            if (i.id === item.id) {
              this.dataAsset[idx].last_depreciation_month_name = moment(this.depreciationDate).format('MMMM')
              this.dataAsset[idx].last_depreciation_year = moment(this.depreciationDate).format('YYYY')
            }
          })
        })
        this.chosenAsset= []
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].depreciation + ' ' + this.$lang[this.langId].success_add 
        })
        this.getDataAsset()
      }).catch(error => {
        this.dialogDepreciation = false
        this.getDataAsset()
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
        this.loadingDepreciation = fa
      })
    },

    detailAsset (row) {
      let lastParams = this.params
      this.$router.push({ name:'Asset Depreciation Detail', query: {id: row.id, data: row, lastParams: lastParams}})
    },

    addJurnalName () {
      this.createJurnalName = true
      this.isDisabledJurnalName = true
      this.newJurnalName = ''
    },

    cancelJurnalName () {
      this.createJurnalName = false
      this.isDisabledJurnalName = false
      this.newJurnalName = ''
    },

    handleSaveJurnalName () {
      this.loadingAddJurnalName = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        jurnal_name: this.newJurnalName,
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnalname'),
        headers: headers,
        data
      }).then(response => {
        this.createJurnalName = false
        this.isDisabledJurnalName = false
        this.loadingAddJurnalName = false
        this.newJurnalName = ''
        this.getJurnalName()
        this.$message({
          type: 'success',
          message: response.data.data.jurnal_name + ' ' + this.$lang[this.langId].success_add  
        })
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
        this.loadingAddJurnalName = false
      })
    },

    showDetail(row){
      this.$router.push({ path:'/accounting/asset-detail', query: {id: row.id}})
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
        this.dialogAdd = true
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

    handleSaveJurnal() {
      this.isDisabledJurnalName = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = this.formAdd
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/jurnal'),
        headers: headers,
        data
      }).then(response => {
        let result = response.data.data
        this.isDisabledJurnalName = false
        this.formDepreciation = {
          date: result.date,
          depreciation_debit_account: result.debit_account_no,
          depreciation_credit_account: result.credit_account_no,
          description: result.description,
          currency_id: result.currency_id,
          first_value: result.first_value.replace('.00', ''),
          residual_value: 0,
          economic_life: 1,
          life_as_year: '0',
          reference_jurnal_no: result.reference_jurnal_no,
          reference_transaction_id: result.reference_transaction_id
        }

        this.formAdd = [
          {
            date: '',
            debit_account: '',
            credit_account: '',
            jurnal_name: '',
            jurnal_description: '',
            currency_id: this.$store.getters.selectedStore.currency_id,
            amount: 0,
            external_no: ''
          }
        ]
        this.depreciation = true
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
        this.isDisabledJurnalName = false
      })
    },

    handleSaveAsset(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = this.formDepreciation

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset'),
        headers: headers,
        params: params
      }).then(response => {
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_add  
        })
        this.formDepreciation = {
          date: '',
          depreciation_debit_account: '',
          depreciation_credit_account: '',
          description: '',
          currency_id: this.$store.getters.selectedStore.currency_id,
          first_value: 0,
          residual_value: 0,
          economic_life: 1,
          reference_jurnal_no: '',
          reference_transaction_id: '',
          life_as_year: '0'
        }
        this.depreciation = false
        this.dialogAdd = false
        this.getDataAsset()
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
    
    handleCloseJurnal () {
      this.cancelJurnalName()
      this.formAdd = [
        {
          date: '',
          debit_account: '',
          credit_account: '',
          jurnal_name: '',
          jurnal_description: '',
          currency_id: this.$store.getters.selectedStore.currency_id,
          amount: 0,
          external_no: ''
        }
      ]
      this.formDepreciation = {
        date: '',
        depreciation_debit_account: '',
        depreciation_credit_account: '',
        description: '',
        currency_id: this.$store.getters.selectedStore.currency_id,
        first_value: 0,
        residual_value: 0,
        economic_life: 1,
        life_as_year: '0',
        reference_jurnal_no: '',
        reference_transaction_id: ''
      }
      this.depreciation = false
      this.dialogAdd = false
    },

    showFinishDialog(row){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token 
      }

      let id = row.id

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/finish/' + id),
        headers: headers
      }).then(response => {
        let result = response.data.data
        this.dialogFinish = true
        this.formFinish.id = result.id
        this.asset.asset_name = result.description
        this.asset.balance = result.fbalance
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

    handleFinishAsset(){
      this.loadingFinish = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = this.formFinish

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/depreciation/finish'),
        headers: headers,
        data
      }).then(response => {
        this.dialogFinish = false
        this.loadingFinish = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.formFinish = {
          id: '',
          description: '',
          date: '',
          sell: 'false',
          debit_account: '',
          credit_account: '',
          currency_id: this.$store.getters.selectedStore.currency_id,
          external_no: '',
          amount: ''
        }
        this.asset = {
          asset_name: '',
          balance: ''
        }
        this.getDataAsset()
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
        this.loadingFinish = false
      })
    },

    closeFinishDialog(){
      this.dialogFinish = false
      this.formFinish = {
        id: '',
        description: '',
        date: '',
        sell: 'false',
        debit_account: '',
        credit_account: '',
        currency_id: this.$store.getters.selectedStore.currency_id,
        external_no: '',
        amount: ''
      }
      this.asset = {
        asset_name: '',
        balance: ''
      }
    },

    showPairDialog(row){
      this.paramsPair = {
        transaction_id: row.ref_transaction_id,
        transaction_no: row.ref_transaction_no,
        transaction_name: row.transaction_no,
      }
      this.dialogPair = true
    },

    showDeleteAsset(row) {
      this.deleteData = row
      this.dialogDeleteAsset = true
    },

    handleRemmoveAsset() {
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.deleteData.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/' + id),
        headers: headers,
      }).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.dataAsset.map((i, idx) => {
          if (i.id === id) {
            this.dataAsset.splice(idx, 1)
          }
        })
        this.dialogDeleteAsset = false
        this.loadingDelete = false
        this.deleteData = {}
        // this.getDataAsset()
      }).catch(error => {
        this.deleteData = {}
        this.dialogDeleteAsset = false
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


    cancelDeleteDialog() {
      this.dialogDeleteAsset = false
      this.deleteData = {}
    },

    openImport(){
      this.$refs.importAsset.getAccount()
      this.dialogImport = true
    },

    closeImport() {
      this.dialogImport = false
      this.getDataAsset()
    },

    maintainceAsset(row){
      this.$router.push({ path:'/accounting/asset-maintance/'+row.id, query: {id: row.id, data: row}})
    }
  }
}
</script>

<style lang="scss">
  .paginate {
    .el-pager li {
      background: #FFFFFF !important;
    }
    .el-pager li.active {
      color: #FFFFFF;
      background:#0085CD !important;
      border-radius: 60px !important;
    }

    .el-pagination .btn-prev {
      background-color: #FFFFFF !important;
      background: #FFFFFF !important;
    }
  }

  .perpage {
    .el-input__inner {
      border: 0px solid #FFFFFF !important;
    }
  }

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
