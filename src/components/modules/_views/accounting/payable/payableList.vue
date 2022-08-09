<template>
  <div class="px-20">
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
        <div class="card-body">
          <div class="row visible-lg visible-md table-handler-flex">
            <div class="col-xs-7 col-sm-6 col-md-9 col-lg-9 text-left">
              <el-button
                type="info"
                @click="showDialogFilter"
                size="mini"
                class="button-filter">
                <i class="fa fa-filter"></i> {{ $lang[langId].filter }}
              </el-button>
              <el-input
                v-model="params.search"
                :placeholder="lang.transactions+'/'+lang.supplier+'/'+lang.description"
                clearable
                prefix-icon="el-icon-search"
                size="small"
                @change="handleSearch"
                class="input-search"
                style="margin-left: 10px; width: 240px">
              </el-input>
              <el-checkbox v-model="status.unpaid" :label="lang.unpaid" border size="small" @change="handleCheckbox" style="margin-left: 10px; margin-right: 5px;"></el-checkbox>
              <el-checkbox v-model="status.partial" :label="lang.partial" border size="small" @change="handleCheckbox" style="margin-right: 0px;"></el-checkbox>
              <el-checkbox v-model="status.paid" :label="$lang[langId].paid_off" border size="small" @change="handleCheckbox" style="margin-right: 0px;"></el-checkbox>
            </div>
            <div class="col-md-3 col-lg-3">
              <div class="visible-lg visible-md text-right">
                <el-dropdown style="margin-top: 2px">
                  <el-button type="success" size="mini">
                    {{lang.add + '  Jurnal'}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" class="accounting-dropBtn" @click="showAddJurnal">
                        <svg-icon icon-class="playlist"></svg-icon>
                        {{$lang[langId].jurnal_single_form}}
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" class="accounting-dropBtn" @click="toAddMultiJurnal">
                        <svg-icon icon-class="insert"></svg-icon>
                        {{$lang[langId].jurnal_multi_form}}
                      </el-button></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button style="margin-top: 2px;" class="button-filter" size="mini" @click="showExport">
                  <svg-icon type="export-files"></svg-icon> Export
                </el-button>
              </div>
            </div>
          </div>

          <div class="row visible-sm">
            <div class="col-sm-4 text-left">
              <el-button type="info" @click="showDialogFilter" size="mini"
                class="button-filter">
                <i class="fa fa-filter"></i> {{ $lang[langId].filter }}
              </el-button>
            </div>
            <div class="col-sm-8 text-right">
              <el-dropdown>
                <el-button type="success" size="mini">
                  {{lang.add + '  Jurnal'}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item style="padding: 0px">
                    <el-button type="text" class="accounting-dropBtn" @click="showAddJurnal">
                      <svg-icon icon-class="playlist"></svg-icon>
                      {{$lang[langId].jurnal_single_form}}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item style="padding: 0px">
                    <el-button type="text" class="accounting-dropBtn" @click="toAddMultiJurnal">
                      <svg-icon icon-class="insert"></svg-icon>
                      {{$lang[langId].jurnal_multi_form}}
                    </el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button style="margin-top: 2px;" class="button-filter" size="mini" @click="showExport">
                <svg-icon type="export-files"></svg-icon> Export
              </el-button>
            </div>
          </div>

          <div class="row visible-xs col-xs-12" style="margin-bottom: 24px;">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-button type="info" @click="showDialogFilter" size="mini"
                  class="button-filter">
                  <i class="fa fa-filter"></i> {{ $lang[langId].filter }}
                </el-button>
              </el-col>
              <el-col :span="8">
                <el-dropdown>
                  <el-button type="success" size="mini">
                    Jurnal<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" class="accounting-dropBtn" @click="showAddJurnal">
                        <svg-icon icon-class="playlist"></svg-icon>
                        {{$lang[langId].jurnal_single_form}}
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" class="accounting-dropBtn" @click="toAddMultiJurnal">
                        <svg-icon icon-class="insert"></svg-icon>
                        {{$lang[langId].jurnal_multi_form}}
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="8">
                <el-button style="margin-top: 2px;" class="button-filter" size="mini" @click="showExport">
                  <svg-icon type="export-files"></svg-icon> Export
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div v-if="isLoading === false">
            <el-table
              ref="multipleTable"
              v-loading="isLoading"
              class="product-table-max-height mobile-fix-height-unset"
              :data="tableData"
              stripe >
              <el-table-column
                prop="transaction_date"
                :label="lang.date"
                width="110">
                <template slot-scope="scope">
                  <span>{{scope.row.ftransaction_date}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="transaction_no"
                :label="lang.transactions"
                width="175">
                <template slot-scope="scope">
                  <span>{{scope.row.transaction_no}}</span><br>
                  <el-tag size="mini"
                    v-if="scope.row.payment == 'Unpaid' || scope.row.payment == 'Belum dibayar'"
                    type="warning" align="center">
                    {{scope.row.payment}}
                  </el-tag>
                  <el-tag size="mini"
                    v-else-if="scope.row.payment == 'Paid' || scope.row.payment == 'Lunas'"
                    type="info" align="center">
                    {{scope.row.payment}}
                  </el-tag>
                  <el-tag size="mini"
                    v-else-if="scope.row.payment == 'Partial' || scope.row.payment == 'Parsial'"
                    type="primary" align="center">
                    {{scope.row.payment}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="supplierCustomer_name"
                :label="lang.supplier">
                <template slot-scope="scope">
                  <div>{{capitalize(scope.row.supplierCustomer_name)}}</div>
									<span class="font-11">{{capitalize(scope.row.transaction_description)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="int_amount"
                :label="lang.amount"
                width="175">
                <template slot-scope="scope">
                  <div>
										{{ scope.row.famount !== null ? scope.row.famount : selectedStore.currency_id + ' 0'}}
									</div>
									<span v-if="scope.row.int_balance !== scope.row.int_amount && scope.row.fbalance !== 'IDR 0'" class="font-11" style="color:#409eff">Sisa : {{ scope.row.fbalance }}</span>
									<span v-else class="font-11">Sisa : {{ scope.row.fbalance }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="due_date"
                :label="lang.due_date"
                width="110">
                <template slot-scope="scope">
                  <div v-if="scope.row.payment == 'Paid' || scope.row.payment == 'Lunas'">
                    <span>{{scope.row.fdue_dates}}</span>
                  </div>
                  <div v-else>
                    <span v-if="checkDate(scope.row.due_dates)" style="color: #ed143d">{{scope.row.fdue_dates}}</span>
                    <span v-else>{{scope.row.fdue_dates}}</span>
                  </div>
									<span class="font-11" v-show="scope.row.due_day > 0">{{$lang[langId].tenggat +' '+ scope.row.due_day + ' ' + $lang[langId].day}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$lang[langId].action" align="center" width="70">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" style="padding: inherit">
                    <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                    <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                      <el-dropdown-item style="padding: 0px">
                        <el-button type="text" class="accounting-dropBtn" @click="detailPayable(scope.row)">
                          <svg-icon icon-class="eye"></svg-icon>
                          {{ $lang[langId].detail }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item style="padding: 0px" v-if="scope.row.payment !== 'Paid' || scope.row.payment !== 'Lunas'">
                        <el-button type="text" class="accounting-dropBtn" @click="accept(scope.row)">
                          <svg-icon icon-class="check-circle"></svg-icon>
                          {{ $lang[langId].accept }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item style="padding: 0px">
                        <el-button type="text" class="accounting-dropBtn" @click="showPairDialog(scope.row)">
                          <svg-icon icon-class="arrow-couple"></svg-icon>
                          {{ $lang[langId].jurnal_pair }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item style="padding: 0px">
                        <el-button type="text" class="accounting-dropBtn" style="color: #FF0000" @click="showDeleteDialog(scope.row)">
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
          <el-table :data="tableTotal" :show-header="false" >
            <el-table-column
              prop="no_account" width="110"
              align="left">
              <template slot-scope="scope">
                <span style="font-weight: bold">{{ scope.row.no_account }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="transaction_no"
                width="175">
                <template slot-scope="scope">

                </template>
              </el-table-column>
              <el-table-column
                prop="supplierCustomer_name" width="175">
                <template slot-scope="scope">
                </template>
              </el-table-column>
							<el-table-column
								prop="total"
								align="center" width="150">
								<template slot-scope="scope">
									<div style="font-weight: bold" v-for="(itemTotal, keyTotal) in scope.row.total" :key="keyTotal">
										{{ itemTotal }}
									</div>
								</template>
							</el-table-column>
              <el-table-column
                prop="due_date"
                :label="lang.due_date"
                width="110">
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column :label="$lang[langId].action" align="center" width="70">
                <template slot-scope="scope">
                </template>
              </el-table-column>
          </el-table>
          <div style="margin-top: 20px; margin-bottom: -55px">
            <el-select v-model="params.per_page"  @change="handleChangeSize" placeholder="Select" class="perpage" style="width: 120px">
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
              layout="total, prev, pager, next, jumper"
              @size-change="handleChangeSize"
              @current-change="handleCurrentChange"
              :total="params.total"
              :current-page.sync="params.currentPage"
              :page-size="parseInt(params.per_page)"
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

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    <el-dialog
      :visible.sync="dialogFilter"
      class="text-left"
      width="32%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item class="visible-sm visible-xs" :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transactions+'/'+lang.supplier+'/'+lang.description"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 90%;">
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.date" :label-width="formLabelWidth">
          <el-row style="width: 90%;">
            <el-col :span="9">
              <el-select v-model="typeDate" @change="changeTypeDate">
                <el-option :label="$lang[langId].single_date" value="single">{{$lang[langId].single_date}}</el-option>
                <el-option :label="$lang[langId].until_date" value="until">{{$lang[langId].until_date}}</el-option>
              </el-select>
            </el-col>
            <el-col :span="15">
              <el-date-picker v-if="typeDate === 'single'"
                v-model="filter.date"
                type="date" style="width: 100%;"
                format="dd MMM yyyy"
                :placeholder="$lang[langId].pick_a_day">
              </el-date-picker>
              <el-date-picker  v-else
                v-model="filter.until_date"
                type="date" style="width: 100%;"
                format="dd MMM yyyy"
                :placeholder="$lang[langId].pick_a_day">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="lang.amount" :label-width="formLabelWidth">
          <money v-model="filter.amount"
            v-bind="money"
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm input-money"
            style="height: 36px; width: 90%">
          </money>
        </el-form-item>
        <el-form-item :label="$lang[langId].payable" :label-width="formLabelWidth">
          <el-radio-group v-model="filter.due_dates" style="	border: groove; border-color: #409eff54; border-width: thin;">
            <el-radio-button label="true">
              {{ this.$lang[langId].due_date2 }}
            </el-radio-button>
            <el-radio-button label="false">
              {{ this.$lang[langId].all_payable }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="lang.sorting" :label-width="formLabelWidth">
				<el-row style="width: 90%;">
					<el-col :span="15">
						<el-select :placeholder="$lang[langId].data_column" style="width: 100%;"
							v-model="params.sort_column">
							<el-option
								v-for="item in optionSort"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="9">
						<el-select v-model="params.sort_type" placeholder="Asc / Desc">
							<el-option label="Ascending" value="asc"><svg-icon icon-class="sort-ascending"></svg-icon> Ascending</el-option>
							<el-option label="Descending" value="desc"><svg-icon icon-class="sort-descending"></svg-icon> Descending</el-option>
						</el-select>
					</el-col>
				</el-row>
        </el-form-item>
        <el-form-item v-if="filter.due_dates === 'true'" :label="$lang[langId].due_date_at" :label-width="formLabelWidth" style="word-break: normal;">
           <el-date-picker
              v-model="params.due_dates_at"
              type="date"
              format="dd MMM yyyy"
              value-format="yyyy-MM-dd"
              :placeholder="$lang[langId].pick_a_day"
              style="width: 90%;">
            </el-date-picker>
        </el-form-item>
        <el-form-item class="visible-sm visible-xs" :label="lang.status" :label-width="formLabelWidth">
          <el-checkbox v-model="status.unpaid" :label="lang.unpaid" border size="small" style="margin-right: 5px;"></el-checkbox>
          <el-checkbox v-model="status.partial" :label="lang.partial" border size="small" style="margin-right: 0px;"></el-checkbox>
          <el-checkbox v-model="status.paid" :label="$lang[langId].paid_off" border size="small" style="margin-right: 0px;"></el-checkbox>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogAdd"
      :show-close="false"
      fullscreen
      width="80%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="visible-md visible-lg visible-sm" align="left">
            <label class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="center">
            <h4 class="dialog-title">Jurnal</h4>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="right">
            <div class="btn_accounting_dialog">
              <el-button v-if="formAdd.length === 0" type="info" @click="handleCloseJurnal">{{ lang.close }}</el-button>
              <el-button v-else type="info" @click="handleCancelJurnal">{{ lang.cancel }}</el-button>
              <!-- <el-button type="info" @click="handleCloseJurnal">{{ lang.cancel }}</el-button> -->
              <el-button type="success" @click="handleSaveJurnal" :disabled="isDisabledJurnalName">{{ lang.save }}</el-button>
            </div>
          </el-col>
        </el-row>

      </div>
      <div class="form-add-jurnal">
        <div class="col-lg-12" style="padding: 0">
          <div class="col-lg-6" style="float: none; margin: auto">
            <div v-if="formAdd.length !== 0">
              <div v-for="(item,idx) in formAdd" :key="idx" class="box collapsed-box" style="width: 100%; background: #F5F5F5">
                <div class="box-header with-border">
                  <div class="visible-lg visible-md visible-sm">
                    <span>{{ item.debit_account }} - {{ item.credit_account }} ( {{ item.date }} )</span><br>
                    <h3 class="box-title">{{selectedStore.currency_id}} {{ formatPrice(item.amount) }}</h3>
                  </div>
                  <div class="visible-xs">
                    <span>{{ item.debit_account }} - {{ item.credit_account }} <br> ( {{ item.date }} )</span><br>
                    <h3 class="box-title">{{selectedStore.currency_id}} {{ formatPrice(item.amount) }}</h3>
                  </div>
                  <div class="box-tools" style="position: absolute; right: 25px;">
                    <button type="button" class="btn btn-box-tool" @click="removeFormAdd(idx, item)" style="font-size: large">
                      <svg-icon icon-class="trash-2" style="color: #F44336"/>
                    </button>
                    <button type="button" class="btn btn-box-tool" @click="addCollapse(idx)" data-widget="collapse" style="font-size: large">
                      <i v-if="idxCollapse.includes(idx) === true" class="fa fa-chevron-up"></i>
                      <i v-else class="fa fa-chevron-down"></i>
                    </button>
                  </div>
                </div>
                <div class="box-body create-product" v-if="idxCollapse.includes(idx) === true" style="background: #FFFFFF;">
                  <el-form @submit.native.prevent >
                  <div>
                      <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select id="jurnalName" v-model="item.jurnal_name" style="width: 100%"
                      :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
                      filterable :disabled="isDisabledJurnalName">
                      <el-option
                        v-for="jurnal in dataJurnalName"
                        :key="jurnal.jurnal_name"
                        :label="capitalize(jurnal.jurnal_name)"
                        :value="jurnal.jurnal_name">
                          {{capitalize(jurnal.jurnal_name)}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-date-picker
                      v-model="item.date"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day"
                      format="dd MMMM yyyy"
                      value-format="yyyy-MM-dd"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.supplier }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select 
                      style="width: 100%"  
                      filterable 
                      :placeholder="$lang[langId].select + ' ' + lang.supplier"
                      v-model="item.supplier_id"
                      :value="item.supplier_id">
                      <el-option
                        v-for="item in dataSupplier"
                        :key="item.id"
                        :label="capitalize(item.name)"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="item.debit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account" style="width: 100%">
                      <el-option
                        v-for="item in dataDebit"
                        :key="item.account_no"
                        :label="item.account_no + ' ' + capitalize(item.account_name)"
                        :value="item.account_no">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="item.credit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account" style="width: 100%">
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
                    <el-input v-model="item.jurnal_description" type="textarea" :rows="2" style="width: 100%"></el-input>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                      v-model="item.amount"
                    />
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.due_date }}</label>
                  </div>
                  <el-form-item>
                    <el-date-picker
                      v-model="item.due_dates"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day"
                      format="dd MMMM yyyy"
                      value-format="yyyy-MM-dd"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
                  </div>
                  <el-form-item>
                    <el-input v-model="item.external_no" type="text" style="width: 100%"></el-input>
                  </el-form-item>
                </el-form>
                </div>
              </div>
            </div>
            <div>
              <el-form @submit.native.prevent>
                <div>
                  <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                    <el-select id="jurnalName" v-model="temp.jurnal_name" style="width: 100%"
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
                                <svg-icon icon-class="x" stroke="#FF0000"></svg-icon>
                                {{ lang.cancel }}
                              </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item style="padding: 0px">
                              <el-button type="text" class="accounting-dropBtn" style="color: #67C23A" :disabled="loadingAddJurnalName" @click="handleSaveJurnalName">
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
                    v-model="temp.date"
                    type="date"
                    :placeholder="$lang[langId].pick_a_day"
                    format="dd MMMM yyyy"
                    value-format="yyyy-MM-dd"
                    style="width: 100%">
                  </el-date-picker>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.supplier }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select 
                    style="width: 100%"  
                    filterable 
                    :placeholder="$lang[langId].select + ' ' + lang.supplier"
                    v-model="temp.supplier_id"
                    :disabled="true"
                    :value="temp.supplier_id"
                    @input="(value) => selectSupplier(value)">
                    <el-option
                      v-for="item in dataSupplier"
                      :key="item.id"
                      :label="capitalize(item.name)"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select v-model="temp.debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
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
                  <el-select v-model="temp.credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account">
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
                  <el-input v-model="temp.jurnal_description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                    v-model="temp.amount"
                  />
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].document_number}}</label>
                </div>
                <el-form-item>
                  <el-input v-model="temp.external_no" type="text" style="width: 100%"></el-input>
                </el-form-item>
                <el-input v-model="temp.currency_id" type="hidden">{{selectedStore.currency_id}}</el-input>
                <el-input v-model="temp.reference_no" type="hidden"></el-input>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <label class="visible-xs" style="margin-top: 20px;">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
    </el-dialog>
    <el-dialog
      :title="deleteData.purchase_sales_form !== 0 ? $lang[langId].delete + ' ' + deleteData.transaction_no : lang.notif_warn"
      :visible.sync="dialogDeleteJurnal"
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
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.transactions }} Jurnal</p>
        <p style="font-weight: bold;">{{ deleteData.transaction_no }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="20" style="padding: 0 12px 0 12px;">
          <el-col :xs="0" :sm="8" :md="8" :lg="8" :xl="8" style="line-height: 2; text-align: left;">
            <label v-if="deleteData.purchase_sales_form !== 0" class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" style="text-align: right;">
            <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
            <el-button type="danger" @click="handleRemoveJurnal(deleteData)" :disabled="loadingDelete">{{ lang.remove }}</el-button>  
          </el-col>
        </el-row>
      </span>
    </el-dialog>

    <dialog-export 
      :show="dialogExport"
      :filter="filter"
      :status="status"
      :typeDate="typeDate"
      :dueDate="params.due_dates_at"
      :search="params.search"
      @close="closeExport"
    />

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

  </div>
</template>

<script>

import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import DialogExport from './dialogExport';
import DialogJurnalPair from 'components/modules/_views/accounting/DialogJurnalPair';
import DialogMultiJurnalPair from 'components/modules/_views/accounting/DialogMultiJurnalPair';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';

var moment = require('moment')

export default {
  name: 'Payable',
  components: {
    DialogJurnalPair,
    DialogMultiJurnalPair,
    Loading,
		dialogSetup,
    DialogExport,
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
    bannerOrder() {
      var val = false
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 0) {
        val = false
      }
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 1) {
        val = true
      }
      return val
    }
  },

  data (){
    return{
      money: {
        decimal: ',',
        thousands: '.',
        prefix: this.$store.getters.selectedStore.currency_id + ' ',
        precision: 0,
        masked: false
      },
      formLabelWidth: '100px',
      status: {
        unpaid: true,
        partial: true,
        paid: false
      },
      filter: {
        due_dates: 'false',
        date: '',
        until_date: '',
        amount: 0
      },
			optionSort: [
				{
          value: 'transaction_date',
          label: this.$store.state.userStores.lang.transaction_date
        },{
          value: 'transaction_no',
          label: this.$store.state.userStores.lang.transaction_no
        },{
          value: 'supplier_name',
          label: this.$store.state.userStores.lang.supplier_name
        },{
          value: 'int_amount',
          label: this.$lang[this.$store.state.userStores.langId].debt_amount
        },{
          value: 'due_dates',
          label: this.$lang[this.$store.state.userStores.langId].due_date
        },{
          value: 'due_day',
          label: this.$lang[this.$store.state.userStores.langId].deadline
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
      due_dates: '',
      isLoading: false,
      loadingAddJurnalName: false,
      loadingDelete: false,
      dialogFilter: false,
      dialogAdd: false,
      dialogDeleteJurnal: false,
      dialogPair: false,
      dialogMultiPair: false,
      dialogExport: false,
      tableData: [],
      tableTotal: [
        {
          no_account: '',
          total: '0',
          name_account: '',
        }
      ],
      idxCollapse: [],
      dataJurnalName: [],
      dataDebit: [],
      dataCredit: [],
      dataSupplier: [],
      typeDate: 'single',
      params: {
        search: '',
        search_column: [],
        search_text: [],
        sort_column: '',
        sort_type: '',
        is_paid:['0','2'],
        currentPage: 1,
        per_page: 15,
        due_dates_at: '',
        page: 1,
        total: null
      },
      paramsPair: {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      },
      createJurnalName: false,
      newJurnalName: '',
      isDisabledJurnalName: false,
      disabledButton: false,
      formAdd: [],
      deleteData: {},
      deleteNote: '',
      temp: {
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: '',
        reference_no: '',
        supplier_id: '',
        due_dates: '',
      },
      autoAccount: {
        debit_account: '',
        credit_account: ''
      }
    }
  },

  watch:{
    filter: {
      handler: function(val){
        if(val.date){
          this.filter.until_date = ''
          this.params.until_date = ''
          if(this.params.search_column.includes('transaction_date') === false){
            this.params.search_column.push('transaction_date')
            this.params.search_text.push(moment(val.date).format('YYYY-MM-DD'))
          }
        } else {
          this.params.search_column.map((i, idx) => {
            if (i === 'transaction_date') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }

        if(val.until_date){
          this.filter.date = ''
          this.params.search_column.map((i, idx) => {
            if (i === 'transaction_date') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
          this.params.until_date = moment(val.until_date).format('YYYY-MM-DD')
        } else {
          this.params.until_date = ''
        }

        if(val.due_dates === 'true'){
          this.params.due_dates = 'true'
          this.params.due_dates_at =''
        } else if (val.due_dates === 'false'){
          this.$delete(this.params, 'due_dates')
          this.params.due_dates_at = ''
        }
        this.params.page = 1
      },
      deep: true
    },


    status: {
      handler: function(val){
        this.params.page = 1
        this.params.is_paid = []
        if(val.unpaid && this.params.is_paid.includes('0') === false){
          this.params.is_paid.push('0')
        }

        if(val.paid && this.params.is_paid.includes('1') === false){
          this.params.is_paid.push('1')
        }

        if(val.partial && this.params.is_paid.includes('2') === false){
          this.params.is_paid.push('2')
        }
      },
      deep: true
    }

  },

  mounted(){
    this.accountSetup()
    this.getLastParams()
  },

  methods: {
    handleCheckbox() {
      let status = this.status
      this.params.is_paid = []

      if(status.unpaid && this.params.is_paid.includes('0') === false){
        this.params.is_paid.push('0')
      }

      if(status.paid && this.params.is_paid.includes('1') === false){
        this.params.is_paid.push('1')
      }

      if(status.partial && this.params.is_paid.includes('2') === false){
        this.params.is_paid.push('2')
      }

      this.getPayble()
    },

    showDialogFilter(){
      this.dialogFilter = true
    },

    handleFilter(label) {
      this.dialogFilter = false
      this.params.page = 1
      if(this.filter.amount !== 0){
        if(this.params.search_column.includes('int_amount') === false){
          this.params.search_column.push('int_amount')
          this.params.search_text.push(this.filter.amount)
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'int_amount') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
      } else {
        this.params.search_column.map((i, idx) => {
          if (i === 'int_amount') {
            this.params.search_column.splice(idx, 1)
            this.params.search_text.splice(idx, 1)
          }
        })
      }
      this.getPayble()
    },

    changeTypeDate(){
      this.filter.date = ''
      this.filter.until_date = ''
    },

    handleSearch(){
      this.params.page = 1
      this.getPayble()
    },

    closeDialogAdd() {
      this.dialogAdd = false
    },

    handleChangeSize(val){
      this.params.page = 1
      this.params.per_page = val
      this.getPayble()
    },

    handleCurrentChange(val){
      this.params.currentPage = val
      this.params.page = val
      this.getPayble()
    },

    toAddMultiJurnal () {
      this.$router.push({name: 'Add Multi Jurnal',
        params: {fromPage: 'Payable List', lastParams: this.params, lastStatus: this.status, lastFilter: this.filter}
      })
    },

    getLastParams(){
      if(Object.keys(this.$route.params).includes('lastParams') === true){
        this.params = {
          search: this.$route.params.lastParams.search,
          search_column: this.$route.params.lastParams.search_column,
          search_text: this.$route.params.lastParams.search_text,
          // sort_column: this.$route.params.lastParams.sort_column,
          // sort_type: this.$route.params.lastParams.sort_type,
          is_paid: this.$route.params.lastParams.is_paid,
          currentPage: this.$route.params.lastParams.currentPage,
          per_page: this.$route.params.lastParams.per_page,
          page: this.$route.params.lastParams.page,
          total: null
        }
      }

      if(Object.keys(this.$route.params).includes('lastStatus') === true){
        this.status = {
          unpaid: this.$route.params.lastStatus.unpaid,
          partial: this.$route.params.lastStatus.partial,
          paid: this.$route.params.lastStatus.paid
        }
      }

      if(Object.keys(this.$route.params).includes('lastFilter') === true){
        this.filter = {
          due_dates: this.$route.params.lastFilter.due_dates,
          date: this.$route.params.lastFilter.date,
          amount: this.$route.params.lastFilter.amount
        }
        if(this.filter.due_dates === 'true'){
          this.params.due_dates = 'true'
          this.params.due_dates_at = this.$route.params.lastParams.due_dates_at
        }
      }

      this.getPayble()
    },

    getPayble(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/payble'),
        headers: headers,
        params: this.params
      })
      .then(response => {
        this.tableData = response.data.data
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
        this.tableTotal[0].total = response.data.ftotal
        this.tableTotal[0].no_account = 'Total'
        this.isLoading = false
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
        this.isLoading = false
      })
    },

    selectSupplier (val){
      let selected = {}
      this.dataSupplier.forEach((item, index) => {
        if (item.id === val){
          selected = item
        }
      })

      this.temp.supplier_id = selected.id
      this.temp.due_dates = selected.due_date
    },

    getSupplier () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/supplier'),
        headers: headers
      }).then(response => {
        this.dataSupplier = response.data.data
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

    getDebit(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/withoutreceivable'),
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

    getCredit(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/withoutpayble'),
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

    detailPayable (row) {
      let lastParams = this.params
      let lastStatus = this.status
      let lastFilter = this.filter
      this.$router.push({ name:'Payable Detail', params: {id: row.id, data: row, lastParams: lastParams, lastStatus: lastStatus, lastFilter: lastFilter}})
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

    showAddJurnal () {
      this.$router.push({ path: '/accounting/payable/add-payable'})
    },

    addCollapse (idx) {
      if(this.idxCollapse.includes(idx) === false){
        this.idxCollapse.push(idx)
      }else{
        this.idxCollapse.map((i, no) => {
          if (i === idx) {
            this.idxCollapse.splice(no, 1)
          }
        })
      }
    },

    removeFormAdd (idx, row) {
      this.formAdd.splice(idx, 1);
      this.$message({
        message: 'Jurnal ' + capitalize(row.jurnal_name) + ' ' + this.lang.cancelled,
        type: 'success'
      })
    },

    handleSaveJurnal() {
      this.isDisabledJurnalName = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      if( this.temp.date !== '' && this.temp.debit_account !== '' && this.temp.credit_account !== '' && this.temp.jurnal_name !== '' && this.temp.jurnal_description !== '' && this.temp.amount !== ''){
        this.temp.currency_id = this.selectedStore.currency_id
        this.formAdd.push(this.temp)
        this.temp = {
          date: '',
          debit_account: '',
          credit_account: '',
          jurnal_name: '',
          jurnal_description: '',
          currency_id: '',
          amount: 0,
          external_no: '',
          reference_no: '',
          due_dates: ''
        }
      }

      let data = this.formAdd
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal'),
        headers: headers,
        data
      })
      .then(response => {
        this.isDisabledJurnalName = false
        this.getPayble()

        this.formAdd = []

        this.dialogAdd = false
        this.$message({
          message: 'Success',
          type: 'success'
        })
      })
      .catch(error => {
        this.formAdd = []
        this.temp = {
          date: '',
          debit_account: '',
          credit_account: '',
          jurnal_name: '',
          jurnal_description: '',
          currency_id: this.selectedStore.currency_id,
          amount: 0,
          external_no: '',
          reference_no: '',
          due_dates: ''
        }

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

    accept(row) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let pairId = row.account_pair_id
      let id = row.id

      let form = row.purchase_sales_form

      if(form === 1){
        this.$router.push({ path: '/purchase/openpurchase/' + row.transaction_id })
      } else if (form === 2){
        this.$router.push({ path: '/sales/openorder/' + row.transaction_id })
      } else {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/payble/' + pairId + '/' + id),
          headers: headers
        }).then(response => {
          this.temp = {
            id: response.data.data.id,
            date: response.data.data.date,
            debit_account: response.data.data.debit_account,
            credit_account: response.data.data.credit_account,
            jurnal_name: response.data.data.jurnal_name,
            jurnal_description: response.data.data.jurnal_description,
            currency_id: response.data.data.currency_id,
            supplier_id: response.data.data.supplier_id,
            amount: response.data.data.amount,
            external_no: response.data.data.external_no,
            reference_no: response.data.data.reference_no
          }

          this.getJurnalName()
          this.getDebit()
          this.getCredit()
          this.getSupplier()

          this.dialogAdd = true
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
      }
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

    showDeleteDialog(row) {
      this.deleteData = row
      this.deleteNote = ''
      this.dialogDeleteJurnal = true
    },

    handleRemoveJurnal (data) {
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = data.account_pair_id
      let params = {
        purchase_sales_form: data.purchase_sales_form,
        reason: this.deleteNote
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/' + id),
        headers: headers,
        params: params
      }).then(response => {
        this.dialogDeleteJurnal = false
        this.loadingDelete = false
        this.deleteData = {}
        this.deleteNote = ''
        this.tableData.map((i, idx) => {
          if (i.account_pair_id === id) {
            this.tableData.splice(idx, 1)
          }
        })

        this.$message({
          message: 'Success',
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

    cancelDeleteDialog() {
      this.dialogDeleteJurnal = false
      this.deleteNote = ''
      this.deleteData = {}
    },

    handleCancelJurnal () {
      this.cancelJurnalName()
      this.formAdd = []
      this.temp = {
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: '',
        reference_no: '' 
      }
    },

    handleCloseJurnal () {
      this.handleCancelJurnal()
      this.dialogAdd = false
      this.getDebit()
      this.getCredit()
    },

    showExport(){
      this.dialogExport = true
    },

    closeExport(){
      this.dialogExport = false
    },

    checkDate(date) {
      let dateA = moment(date);
      let dateB = moment();

      if (dateA.diff(dateB) > 0) {
        return false;
      } else {
        return true;
      }
    },

    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    handleCurrency(value) {
      if (value < 0) {
        this.formAdd.total = 0
      }
    }
  },
}
</script>
