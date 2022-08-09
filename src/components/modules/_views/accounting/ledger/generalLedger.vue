<template>
  <div class="px-20">
    <div v-if="isSetup === 'false'">
      <el-card class="box-card">
        <div class="div-nodata-accounting">
          <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
          <div class="no_close" >{{$lang[langId].setup_message}}</div>
          <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
        </div>
      </el-card>
    </div>

    <div v-else-if="isSetup === 'true'">
      <el-card class="box-card">
        <div class="row">
          <div class="visible-lg visible-md col-lg-4 col-md-4 text-left">
            <el-button v-if="typePeriod === 'custom'"
              size= "small"
              class="date-filter-dashboard"
              @click="toggleFilter"
              style="width: 300px;">
              <i class="fa fa-filter" />
              <span>{{ labelDate }}</span>
            </el-button>
            <single-month-picker
              v-if="typePeriod === 'month'" v-model="params.period" :clearable="false" @input="handleSelectMonth"
              style="margin: 0px"
            />
            <single-year-picker
              v-if="typePeriod === 'year'" v-model="params.period" :clearable="false" @input="handleSelectYear"
              style="margin: 0px"
            />
            <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
              <el-radio-button label="custom" style="width: 40%">
                {{$lang[langId].custom}}
              </el-radio-button>
              <el-radio-button label="month" style="width: 30%;">
                {{ lang.month }}
              </el-radio-button>
              <el-radio-button label="year" style="width: 30%;">
                {{ lang.year }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="visible-lg visible-md text-right col-lg-8 col-md-8">
            <el-button
              type="info"
              size="small"
              @click="dialogImport = true"
              class="button-filter">
              {{ lang.import }}
            </el-button>

            <el-dropdown class="ml-8">
              <el-button type="success" size="small">
                {{lang.add + '  Jurnal'}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="padding: 0px">
                  <el-button type="text" class="accounting-dropBtn" @click="toSingleJurnal">
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
            <el-dropdown @command="handleExport">
              <el-button type="primary" :disabled="loadingExport" size="small">
                <span v-if="loadingExport">
                    <loading :active="true" color= '#1bb4e6' loader="dots" :width="100" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                </span>
                <span v-else>Export Excel<i class="el-icon-arrow-down el-icon--right"></i></span>
              </el-button>
              <el-dropdown-menu slot="dropdown" style="overflow-y: scroll; height: 300px">
                <el-dropdown-item v-for="item in labelRow" :key="item.key" :command ="item">{{ lang.rows }} {{ item.value }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown><br>
            <el-input class="inline-form input-search mt-8" clearable :placeholder="lang.search +' '+ lang.transaction_no"
              prefix-icon="el-icon-search" v-model="params.search"
              @change="handleSearch" size="small" style="width: 52% !important;">
            </el-input>
          </div>
          
          <div class="visible-sm visible-xs col-xs-12 col-sm-12" style="pading: 0">
            <el-row :gutter="3">
              <el-col :span="6">
                <el-button
                  type="info"
                  @click="dialogFilter = true"
                  class="button-filter"
                  size="mini">
                  <i class="fa fa-filter"></i>
                </el-button>
              </el-col>
              <el-col :span="9">
                <el-dropdown @command="handleExport" style="width: 100%;">
                  <el-button type="primary" style="width: 100%;" :disabled="loadingExport" size="mini">
                    <span v-if="loadingExport">
                      <loading :active="true" color= '#1bb4e6' loader="dots" :width="30" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                    </span>
                    <span v-else>Excel<i class="el-icon-arrow-down el-icon--right"></i></span>
                  </el-button>
                  <el-dropdown-menu slot="dropdown" style="overflow-y: scroll; height: 300px">
                    <el-dropdown-item v-for="item in labelRow" :key="item.key" :command ="item">{{ lang.rows }} {{ item.value }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="9">
                <el-dropdown trigger="click" style="width: 100%;">
                  <el-button type="success" style="width: 100%;" size="mini">
                    Jurnal<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" class="accounting-dropBtn" @click="toSingleJurnal">
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
              </el-col>
            </el-row>
          </div>
        </div>
				<div style="margin-top: 24px">
					<div v-if="isLoading === false">
						<table class="acounting-nested-table" style="width: 100%; margin-bottom: 40px;">
							<thead>
								<tr class="nested-table-name-row">
									<th style="width: 50%">
											<el-button @click="collapseAll()" size="mini" type="text" class="fl-left color-grey" :icon="showAll ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" circle>
											</el-button>
										{{lang.account}}
									</th>
									<th style="width: 17%">{{$lang[langId].debit}}</th>
									<th style="width: 17%">{{$lang[langId].credit}}</th>
									<th style="width: 16%">{{$lang[langId].action}}</th>
								</tr>
							</thead>
							<tbody>
								<template v-for="(item, idx) in dataGeneral">
									<tr class="nested-table-summary-list" :key="idx" style="border-top: 1px solid black">
										<td class="pl-null" :colspan="item.isCollapse ? 1 : 3">
											<el-button v-if="item.isCollapse" @click="handleCollapse(false, idx)" size="mini" type="text" icon="el-icon-caret-bottom" circle>
											</el-button>
											<el-button v-else @click="handleCollapse(true, idx)" size="mini" type="text" icon="el-icon-caret-top" circle>
											</el-button>

											{{capitalize(item.transaction_name) + ' | ' + item.transaction_no + ' (' + item.ftransaction_date + ')'}}
										</td>
										<td v-show="item.isCollapse">
											{{item.ftotal_debit}}
										</td>
										<td v-show="item.isCollapse">
											{{item.ftotal_credit}}
										</td>
										<td align="center">
											<el-button size="mini" v-if="!item.isCollapse && item.edit_able === 1" @click="editJurnal(item)" type="primary" icon="el-icon-edit" circle></el-button>
											<el-button size="mini" v-if="item.isCollapse && multipleDelete.indexOf(item.id) === -1" @click="hapusJurnal(item)" type="danger" icon="el-icon-delete" circle></el-button>
											<el-button size="mini" v-if="multipleDelete.indexOf(item.id) !== -1" @click="batalHapusJurnal(item)" type="warning" icon="el-icon-error" circle></el-button>
										</td>
									</tr>
										<template v-for="(detail, idxDetail) in item.detail">
											<tr class="nested-table-data-list" :key="parseInt(item.id+''+idxDetail)" v-if="!item.isCollapse">
												<td style="border-top: none;">
													<span>{{detail.account_no + ' - ' + capitalize(detail.account_name)}} 
														
													</span> 
													<div v-if="detail.transaction_description" class="font-12 lh-2" style="margin-top: -16px;">
														{{capitalize(detail.transaction_description)}} 
														<span v-if="detail.external_no"> | {{detail.external_no}}</span>
														<b v-show="detail.is_payment === 1"> | {{detail.reference_no}}</b>
													</div>
												</td>
												<td style="border-top: none;">{{detail.fdebit}}</td>
												<td style="border-top: none;">{{detail.fcredit}}</td>
												<td style="border-top: none;" align="center">
													<el-button v-if="detail.delete_able === 1" size="mini" type="danger" @click="showDeleteDialog(detail, idx)" icon="el-icon-delete" circle></el-button>
												</td>
											</tr>
										</template>
									<tr class="nested-table-summary-list" :key="idx+'3'" v-show="!item.isCollapse">
										<td class="font-semi-bold">SubTotal {{capitalize(item.transaction_name)}}</td>
										<td class="font-semi-bold" style="border-top: none;">{{item.ftotal_debit}}</td>
										<td class="font-semi-bold" style="border-top: none;">{{item.ftotal_credit}}</td>
										<td class="font-semi-bold" style="border-top: none;" align="center"></td>
									</tr>
								</template>

							</tbody>
						</table>

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
					<el-divider></el-divider>
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
			<div class="save-bottom-full2" v-if="multipleDelete.length !== 0">
				<div class="box-bodys">
					<el-row>
						<el-col :span="12">
							<div class="lh-2">
								<el-checkbox v-model="deleteAll" @change="hapusSemuaJurnal">
									<span class="font-semi-bold">{{$lang[langId].delete_all_journal}}</span>
								</el-checkbox>
							</div>
						</el-col>
						<el-col :span="12" align="end">
							<el-button type="info" @click="resetDelete" size="small">{{lang.cancel}}</el-button>
							<el-button type="danger" @click="removeMultiple" :disabled="loadingRemoveMultipe" :loading="loadingRemoveMultipe" size="small">{{lang.remove_data +' ('+multipleDelete.length+')' }}</el-button>
						</el-col>
					</el-row>
				</div>
			</div>
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
      :visible.sync="dialogEditJurnal"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="13">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">Jurnal</h4>
          </el-col>
          <el-col :span="11" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="cancelJurnal">{{ lang.cancel }}</el-button>
              <el-button type="success" :disabled="loadingEditJurnal" @click="handleUpdateJurnal">{{ lang.update }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; padding: 0 5% 0 5%;">
        <el-form @submit.native.prevent >
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
            <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
              v-model="formEditJurnal.amount"
            />
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
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.transactions }} Jurnal</p>
        <p style="font-weight: bold;">{{ capitalize(deleteData.transaction_name) }} - {{ deleteData.transaction_no }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="20" style="padding: 0 12px 0 12px;">
          <el-col :xs="0" :sm="8" :md="8" :lg="8" :xl="8" style="line-height: 2; text-align: left;">
            <label v-if="deleteData.purchase_sales_form !== 0" class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" style="text-align: right;">
            <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
            <el-button type="danger" :disabled="loadingDeleteJurnal" @click="handleRemoveJurnal">{{ lang.remove }}</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogFilter"
      class="text-left"
      width="30%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item class="visible-xs visible-sm" :label="$lang[langId].pick_a_month">
          <el-button v-if="typePeriod === 'custom'"
              size= "small"
              class="date-filter-dashboard"
              @click="toggleFilter"
              style="width: 300px;">
              <i class="fa fa-filter" />
              <span>{{ labelDate }}</span>
          </el-button>
          <single-month-picker
            v-if="typePeriod === 'month'" v-model="params.period" :clearable="false" @input="handleSelectMonth"
            style="margin: 0px"
          />
          <single-year-picker
            v-if="typePeriod === 'year'" v-model="params.period" :clearable="false" @input="handleSelectYear"
            style="margin: 0px"
          />
          <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
            <el-radio-button label="custom" style="width: 40%">
              {{$lang[langId].custom}}
            </el-radio-button>
            <el-radio-button label="month" style="width: 30%">
              {{ lang.month }}
            </el-radio-button>
            <el-radio-button label="year" style="width: 30%">
              {{ lang.year }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transaction_no"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            >
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="lang.import + ' ' + $lang[langId].general_journal"
      :visible.sync="dialogImport"
      :width="tableImport ? '1200px' : '400px'"
      @close="cancelImport">
      <div class="mb-8">
        <el-button :disabled="loadingTemplate" @click="downloadTemplate">
          <span v-if="loadingTemplate">
              <loading :active="true" color= '#1bb4e6' loader="dots" :width="130" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
          </span>
          <span v-else>{{ lang.download_template }}</span>
        </el-button>
      </div>

      <div>
        <div v-if="dropdownFormImport">
          <el-upload
            v-loading="loadingUploadImport"
            class="upload-demo"
            drag
            :action="computedUploadImportUrl"
            :headers="computedUploadImportHeaders"
            :on-success="handleUploadImportSuccess"
            :on-error="handleUploadImportError"
            :on-progress="handleUploadImportProgress"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">
              {{ lang.import_from_csv_info }}
            </div>
          </el-upload>
        </div>

        <div v-if="tableImport">
          <div v-if="errorImport != 0" class="mb-8">
            <el-tag type="danger" class="font-14">
              {{ $lang[langId].theres_error }}. {{ $lang[langId].fix_upload_error }}
            </el-tag>
          </div>

          <el-table
            ref="multipleTable"
            v-loading="loadingUploadImport"
            border
            :data="tableImportJurnal"
            :default-sort="{prop: 'id', order: 'ascending'}"
            :row-class-name="tableRowClassName">
            <el-table-column :label="$lang[langId].number" type="index" :index="indexMethod">
            </el-table-column>

            <el-table-column :label="lang.date" prop="name" sortable min-width="100">
              <template slot-scope="props">
                {{ dateFormat(props.row.date) }}
              </template>
            </el-table-column>

            <el-table-column :label="lang.account" prop="account_no" sortable min-width="150">
              <template slot-scope="props">
                  <strong>{{ props.row.account_no + ' ' + capitalize(props.row.jurnal_name)}}</strong>
              </template>
            </el-table-column>

            <el-table-column :label="lang.description" prop="description" sortable min-width="180">
            </el-table-column>

            <el-table-column :label="$lang[langId].document_number" prop="external_no" sortable min-width="120">
            </el-table-column>

            <el-table-column
              prop="amount"
              :label="$lang[langId].debit"
              align="right"
              sortable>
              <template slot-scope="scope">
                <div v-if="scope.row.type === 'db'">{{ formatPrice(scope.row.amount) }}</div>
                <div v-else>0</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              :label="$lang[langId].credit"
              align="right" 
              sortable>
              <template slot-scope="scope">
                <div v-if="scope.row.type === 'cr'">{{ formatPrice(scope.row.amount) }}</div>
                <div v-else>0</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="queueing_import"
              :label="$lang[langId].validation"
              min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.queueing_import === false">{{ capitalize(scope.row.error) }}</div>
                <div v-else>-</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport" type="info">{{ lang.cancel }}</el-button>
        <el-button @click="saveImportData" type="success" v-bind:disabled="btnProsesImport">
          {{ lang.processing }}
        </el-button>
      </span>
    </el-dialog>

    <dialog-jurnal-pair
      :id="paramsPair.transaction_id"
      :no="paramsPair.transaction_no"
      :name="paramsPair.transaction_name"
      :show="dialogPair"
      @close="dialogPair = false"
    />

    <dialog-add-jurnal ref="addSingleJurnal"
      :show="dialogAddJurnal"
      @close="handleCloseJurnal"
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
    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />
  </div>
</template>


<script>
import { baseApi } from 'src/http-common';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import CustomDateFilter from 'modules/CustomDateFilter';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import DialogJurnalPair from 'components/modules/_views/accounting/DialogJurnalPair';
import DialogAddJurnal from 'components/modules/_views/accounting/DialogAddSinggleJurnal';
import DialogMultiJurnalPair from 'components/modules/_views/accounting/DialogMultiJurnalPair';
import DialogEditMultiJurnal from 'components/modules/_views/accounting/DialogBalanceEdit';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import SvgIcon from '../../../SvgIcon.vue';
import moment from 'moment';

export default {
  name: 'GeneralJournal',
  components: {
    CustomDateFilter,
    DialogJurnalPair,
    SingleMonthPicker,
    SingleYearPicker,
    Loading,
    DialogAddJurnal,
    DialogMultiJurnalPair,
    DialogEditMultiJurnal,
		dialogSetup,
    SvgIcon,
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
    },
    computedUploadImportUrl() {
      const url = baseApi(this.selectedStore.url_id, this.langId, 'account/transaction/importcsv')
      return url
    },
    computedUploadImportHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    },
  },
  // watch: {
  //   '$store.getters.selectedStore': function () {
  //     this.getTest()
  //   }
  // },

  mounted() {
    this.accountSetup()
    this.getLastParams()

    var a = 0
    var b = []
    var start = 0
    var end = 0
    for (let i = 1; i <= 200; i++) {
      start = i * 1000 - 999
      end = i * 1000
      b.push(
        { 
          value: start + ' - ' + end,
          key: i-1,
          string: start + '_' + end
        }
      )
    }
    this.labelRow = b
  },

  data() {
    return {
      showFilter: false,
      labelDate: '',
      formLabelWidth: '108px',
      showAll: true,
			deleteAll: false,
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
      selectedMonth: moment().format('yyyy-MM'),
      isCollapse: true,
      disabledButton: false,
      isDisabledJurnalName: false,
      isLoading: false,
      loadingEditJurnal: false,
      loadingDeleteJurnal: false,
      loadingUploadImport: false,
      loadingExport: false,
      loadingTemplate: false,
			loadingRemoveMultipe: false,
      dialogFilter: false,
      dialogAddJurnal: false,
      dialogEditJurnal: false,
      dialogDelete: false,
      dialogAdd: false,
      dialogPair: false,
      dialogMultiPair: false,
      dialogMultiJurnalEdit: false,
      dialogImport: false,
      tableImport: false,
      btnProsesImport: true,
      dropdownFormImport: true,
      fileImportConfirm: '',
      multijurnal_id: '',
      labelRow: [],
      dataGeneral: [],
      dataJurnalName: [],
      dataAccount: [],
      tableImportJurnal: [],
			multipleDelete: [],
      deleteData: {},
      deleteNote: '',
      perPage: '25 item',
      typePeriod: 'month',
      params: {
        search: '',
        period: moment().format('yyyy-MM'),
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD'),
        search_column: [],
        search_text: [],
        currentPage: 1,
        per_page: 15,
        sort_column: '',
        sort_type: '',
        page: 1,
        total: null
      },
      paramsPair: {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      },
      formEditJurnal: {
        id: '',
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: ''
      },
      moveEdit:{
        debit_account: '',
        credit_account: ''
      },
    }
  },

  methods: {
    toSingleJurnal(){
      this.$refs.addSingleJurnal.getAccount()
      this.$refs.addSingleJurnal.getJurnalName()
      this.$refs.addSingleJurnal.getCurrency()
      this.$refs.addSingleJurnal.getExpenses()
      this.$refs.addSingleJurnal.getDebit()
      this.dialogAddJurnal = true
    },

    toAddMultiJurnal(){
      this.$router.push({name: 'Add Multi Jurnal',
        params: {fromPage: 'General Ledger', lastParams: this.params, lastFilter: this.filter, typePeriod: this.typePeriod, monthLabel: this.selectedMonth}
      })
    },

    handleSearch(){
      this.params.page = 1

      this.getGeneralJournal()
    },

    handleCollapse(val, index){
      this.dataGeneral[index].isCollapse = val
    },

    collapseAll(){
      this.showAll = this.showAll ? false : true
      this.dataGeneral.map(a=>a.isCollapse = this.showAll ? false : true);
      
    },

    getLastParams() {
      if(Object.keys(this.$route.params).includes('lastParams') === true){
        this.params = {
          search: this.$route.params.lastParams.search,
          period: this.$route.params.lastParams.period,
          per_page: this.$route.params.lastParams.per_page,
          page: this.$route.params.lastParams.page,
          sort_column: this.$route.params.lastParams.sort_column,
          sort_type: this.$route.params.lastParams.sort_type
        }
      }

      this.typePeriod = Object.keys(this.$route.params).includes('typePeriod') === true ? this.$route.params.typePeriod : 'month'
      this.labelDate = this.$lang[this.langId].today + '\n' +
                  moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                  moment(this.params.end_date).format('DD MMM YYYY')
      this.selectedMonth = Object.keys(this.$route.params).includes('monthLabel') === true ? this.$route.params.monthLabel : moment().format('yyyy-MM')
      this.getGeneralJournal()
    },

    setLabelFilter (filter) {
      if (filter.labelForDate === 'today') {
        this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'yesterday') {
        this.labelDate = this.$lang[this.langId].yesterday + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'weekago') {
        this.labelDate = this.$lang[this.langId].a_week_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'monthago') {
        this.labelDate = this.$lang[this.langId].a_month_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'thismonth') {
        this.labelDate = this.$lang[this.langId].this_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'lastmonth') {
        this.labelDate = this.$lang[this.langId].last_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'custom') {
        this.labelDate = this.$lang[this.langId].custom + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      }
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    dateFilterClose() {
      this.showFilter = false
    },

    dateFilterReset(data) {
      this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment().format('DD MMM YYYY') + ' - ' +
                        moment().format('DD MMM YYYY'),
      this.params.start_date = moment().format('YYYY-MM-DD')
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.dateFilterClose()
      this.getGeneralJournal()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getGeneralJournal()
    },

    handleChangePeriod (value){
      if(value === 'month'){
        this.params.period = moment().format('yyyy-MM')
      }else{
        this.params.period = moment().format('YYYY')
      }
      this.typePeriod = value
      this.getGeneralJournal()
    },

    handleSelectMonth (value) {
      this.params.period = moment(value).format('YYYY-MM')

      this.selectedMonth = moment(value).format('YYYY-MM')
      this.params.page = 1
      this.getGeneralJournal()
    },

    handleSelectYear (value) {
      this.params.period = moment(value).format('YYYY')

      this.selectedMonth = moment(value).format('YYYY')
      this.params.page = 1
      this.getGeneralJournal()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getGeneralJournal()
    },
    
    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getGeneralJournal()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getGeneralJournal()
    },

    handleFilter(label) {
      this.dialogFilter = false

      this.getGeneralJournal()
    },
    
    getGeneralJournal() {
			this.deleteAll = false
			this.multipleDelete = []
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search: this.params.search,
        search_column: this.params.search_column,
        search_text: this.params.search_text,
        currentPage: this.params.currentPage,
        per_page: this.params.per_page,
        sort_column: this.params.sort_column,
        sort_type: this.params.sort_type,
        page: this.params.page,
        total: this.params.total
      }

      if(this.typePeriod === 'custom'){
        params["start_date"] = this.params.start_date
        params["end_date"] = this.params.end_date
      }else{
        params["period"] = this.params.period
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/transaction'),
        headers: headers,
        params: params
      })
      .then(response => {
          this.dataGeneral = response.data.data.map(v => ({...v, isCollapse: false}))
          this.params.per_page = response.data.meta.per_page
          this.params.currentPage = response.data.meta.current_page
          this.params.total = response.data.meta.total

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
          this.selectedMonth = moment().format('yyyy-MM')
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
    
    getAccount() {
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

    handleExport(data) {
      this.loadingExport = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('csv', data)
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {
          type: 'csv',
          sort_column: this.params.sort_column,
          sort_type: this.params.sort_type,
          p: data.key
        }

        if(this.typePeriod === 'custom'){
          params["start_date"] = this.params.start_date
          params["end_date"] = this.params.end_date
        }else{
          params["period"] = this.params.period
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/transaction/excel'),
          responseType: 'blob',
          headers,
          params
        }).then(response => {
            const fileName = this.$lang[this.langId].general_journal + '-' + this.params.period + '.csv'
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.loadingExport = false
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
          this.loadingExport = false
        })
      }
    },

    getFileMobile(type, data) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        type: type,
        sort_column: this.params.sort_column,
        sort_type: this.params.sort_type,
        p: data.key
      }

        if(this.typePeriod === 'custom'){
          params["start_date"] = this.params.start_date
          params["end_date"] = this.params.end_date
        }else{
          params["year"] = this.params.year
          params["month"] = this.params.month
        }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/transaction/excel'),
        method: 'GET',
        responseType: 'blob',
        headers,
        params
      }).then((response) => {
        this.loadingExport = false
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].general_journal + '-' + this.params.month + '__' + this.params.year + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?month=' + this.params.month + '&year=' + this.params.year + '&type=' + type + '&sort_column=' + this.params.sort_column + '&sort_type=' + this.params.sort_type
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + 'account/transaction/excel'  
        window.location = apiURL + apiParams + ',' + fileName
      }).then(error => {
        this.loadingExport = false
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
    
    cancelJurnalName () {
      this.createJurnalName = false
      this.isDisabledJurnalName = false
      this.newJurnalName = ''
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
        this.toSingleJurnal()
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
    
    handleCloseJurnal () {
      this.dialogAddJurnal = false
      this.getGeneralJournal()
    },

    editJurnal(row) {
      if(row.jurnal_form === 2){
        this.multijurnal_id = row.multijurnal_id
        this.$router.push({name: 'Edit Multi Jurnal', params: {
          multijurnal_id: this.multijurnal_id,
          fromPage: 'General Ledger',
          lastParams: this.params,
          lastFilter: this.filter,
          typePeriod: this.typePeriod,
          monthLabel: this.selectedMonth
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
          this.formEditJurnal = response.data.data
          this.moveEdit = {
            debit_account: this.formEditJurnal.debit_account,
            credit_account: this.formEditJurnal.credit_account
          }
          this.getAccount()
          this.getJurnalName()
          this.dialogEditJurnal = true
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
      this.loadingEditJurnal = true
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
        external_no: this.formEditJurnal.external_no
      }
      let allJurnal = this.newJurnal
      let removeIndex = []

      let id = this.formEditJurnal.transaction_id
      let no = this.formEditJurnal.transaction_no 

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/'+ id + '/' + no),
        headers: headers,
        data
      }).then(response => {
        if (response.data.status === 200){
          this.dialogEditJurnal = false
          this.loadingEditJurnal = false
          let update = response.data.data

          this.getGeneralJournal()
          this.getAccount()
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
        this.loadingEditJurnal = false
      })
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
      this.multijurnal_id = ''
      this.dialogEditJurnal = false
      this.dialogMultiJurnalEdit = false
      this.getGeneralJournal()
    },

    showDeleteDialog(row, idx){
      this.dialogDelete = true
      this.deleteData = row
      this.deleteData.idxDelete = idx
    },

    handleRemoveJurnal () {
      this.loadingDeleteJurnal = true

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
        if (response.data.status === 200){
          let removeIndex = this.deleteData.idxDelete;
          let deletedIndex = []

          this.dataGeneral[removeIndex].detail.map((el, index) => {
            if (el.account_pair_id === id){
              deletedIndex.push(index);
            }
          })

          for (var i = deletedIndex.length -1; i >= 0; i--) 
            this.dataGeneral[removeIndex].detail.splice(deletedIndex[i], 1);

          if(this.dataGeneral[removeIndex].detail.length === 0){
						this.dataGeneral.splice(removeIndex, 1);
					}
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
        this.dialogDelete = false
        this.loadingDeleteJurnal = false
        this.deleteData = {}
        this.deleteNote = ''
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
        this.loadingDeleteJurnal = false
      })
    },
    
    cancelDeleteDialog() {
      this.dialogDelete = false
      this.deleteData = {}
      this.deleteNote = ''
    },

    handleDeleteGeneral(){
      this.dialogDelete = false

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/'),
        headers: headers
      }).then(response => {
        this.$message({
          message: 'Success',
          type: 'success'
        })
        
        this.deleteData = {}
        this.getGeneralJournal()
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

    downloadTemplate () {
      // window.open(baseApi(this.selectedStore.url_id, this.langId,  'account/transaction/template.csv'))
      this.loadingTemplate = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId,  'account/transaction/template'),
        headers: headers,
        responseType: 'blob',
      }).then(response => {
        const fileName = 'templateImportJurnal.csv'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingTemplate = false
        }).catch((error, xhr) => {
          this.loadingTemplate = false

        })
    },

    handleUploadImportProgress() {
      this.loadingUploadImport = true
    },

    handleUploadImportSuccess(response) {
      this.loadingUploadImport = false
      if (response.error === 0) {
        if (response.unready_import !== 0) {
          this.btnProsesImport = true
        } else {
          this.btnProsesImport = false
        }
        this.dropdownFormImport = false
        this.tableImportJurnal = response.data
        // this.totalRow = response.row
        this.errorImport = response.unready_import
        this.tableImport = true
        this.fileImportConfirm = response.file_confirmed
      }
    },

    handleUploadImportError(error, file) {
      const errorJson = JSON.parse(error.message)
      this.loadingUploadImport = false
      this.$notify({
        type: 'error',
        title: errorJson.error.message,
        message: errorJson.error.error
      })
    },

    cancelImport() {
      this.tableImportJurnal = []
      this.fileImportConfirm = ''
      this.dropdownFormImport = true
      this.tableImport = false
      this.dialogImport = false
    },

    saveImportData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/transaction/confirmcsv?file_confirmed=' + this.fileImportConfirm),
        headers: headers
      })
        .then(response => {
          // this.customerData = response.data.data
          this.loading = false
          // console.log(response)
          // this.$router.push({path: '/catalog/product'})
          this.cancelImport()
          this.dialogImport = false
          this.getGeneralJournal()
          this.$message({
            title: 'Success',
            message: response.data.message + ' ' + lang.transactions + '.'
          })
          
          this.refreshView(this.selectedStore, true)
        })
        .catch((error, xhr) => {
          this.loading = false
          // console.log(error)
          // console.log(xhr)
        })
    },

    tableRowClassName({row, rowIndex, props}) {
      if (row.error !== null) {
        return 'warning-row'
      }
      return ''
    },

    indexMethod(index) {
      return index + 1
    },

		hapusJurnal(data){
			this.multipleDelete.push(data.id)
		},

		hapusSemuaJurnal(val){
			this.multipleDelete = []
			if(val){
				this.dataGeneral.forEach(item => {
					this.multipleDelete.push(item.id)
				})
			}
		},

		batalHapusJurnal(data){
			this.multipleDelete.splice(this.multipleDelete.indexOf(data.id), 1)
		},

		removeMultiple(){
			this.loadingRemoveMultipe = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var itemsProcessed = 0;
      this.multipleDelete.forEach(item => {
				axios({
					method: 'DELETE',
					url: baseApi(this.selectedStore.url_id, this.langId, 'account/trans/'+item),
					headers: headers
				}).then(response => {
					let keyDelete = this.dataGeneral.findIndex(x => x.id === item);
					this.dataGeneral.splice(keyDelete, 1)
					itemsProcessed++;
					if(itemsProcessed === this.multipleDelete.length) {
						this.deleteAll = false
						this.$message({
							type: 'success',
							message: this.$lang[this.langId].success_delete
						})
            this.getGeneralJournal()
						// this.loadingRemoveMultipe = false
						// this.multipleDelete = []
					}
				}).catch((error) => {
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
					this.loadingRemoveMultipe = false
				})
      });
		},

		resetDelete(){
			this.deleteAll = false
			this.multipleDelete = []
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
    
    onClose (e) {
            // prevent close and wait
            e.wait = true
            // close after 3 seconds
            setTimeout(() => {
                // assign true to close, do nothing or assign false to cancel close.
                e.close = true
            }, 3000)
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

.mobile-margin-xs { 
  margin-top: 7px;
}

.perpage {
  .el-input__inner {
    border: 0px solid #FFFFFF !important;
  }
}

.movementPanel {
  background-color: #FFFFFF;
  z-index: 1;
  position: absolute;
  right: 10px;
  bottom: 53px;
  top: 90px;
  width: 330px;
  box-shadow: -4px 0 0.1em #0000001F !important;
}
</style>
