<template>
  <div
    class="content-wrapper">
    <section
      class="content">
      <el-row :gutter="10">
        <el-col :md="16">
          <el-card v-loading="loading" class="box-card">
            <div slot="header" class="table-handler-flex">
              <h4 style="flex-grow: 1;">{{ data.name }}</h4>
              <div>
                <template v-if="!isEditing">
                  <el-button type="success" plain @click="backToList">{{ lang.back }}</el-button>
                  <button-action-authenticated
                    :permission="['catalog/productcombo', 'edit']"
                    icon="el-icon-edit"
                    type="primary"
                    @click="edit">
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
                <template v-else>
                  <el-button
                    type="text"
                    @click="cancelEdit">
                    {{ lang.cancel }}
                  </el-button>
                  <el-button
                    :disabled="disabledButton"
                    icon="el-icon-check"
                    type="success"
                    @click="saveEdit">
                    {{ lang.save }}
                  </el-button>
                </template>
              </div>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <div class="package-img">
                    <template v-if="changePhoto">
                      <el-upload
                        style="width: 100%; max-width: 100%;"
                        drag
                        :file-list="fileList"
                        :action="uploadPhotoUrl"
                        :data="{id: data.id}"
                        :headers="headers"
                        :on-error="handleUploadFailed"
                        :on-success="handleUploadSuccess"
                        :before-upload="beforeUpload">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
                      </el-upload>
                      <el-button
                        @click="changePhoto = false"
                        icon="el-icon-close"
                        type="text"
                        class="btn-block">
                        {{ lang.cancel }}
                      </el-button>
                    </template>
                    <template v-else>
                    <img style="margin-bottom: 12px;" :src="data.photo_md" :alt="data.name" />
                    <button-action-authenticated
                      :permission="['catalog/productcombo', 'edit']"
                      @click="changePhoto = true"
                      icon="el-icon-picture"
                      type="info"
                      class="btn-block">
                      {{ lang.change_photo }}
                    </button-action-authenticated>
                    </template>
                  </div>
                </div>

                <div class="col-sm-9">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="detail-section">
                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ lang.product_combo_name }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-input size="mini" type="text" v-model="tmpE.name" />
                            </template>
                            <template v-else>
                              {{data.name}}
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ lang.sku }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-input size="mini" type="text" v-model="tmpE.sku" />
                            </template>
                            <template v-else>
                              <template v-if="data.sku">
                                {{data.sku}}
                              </template>
                              <template v-else>
                                -
                              </template>
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ lang.description }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-input size="mini" type="textarea" autosize v-model="tmpE.description"/>
                            </template>
                            <template v-else>
                              <template v-if="data.description">
                                {{data.description}}
                              </template>
                              <template v-else>
                                -
                              </template>
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <el-row :gutter="5">
                            <el-col v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS'" :md="12">
                              <div class="box-price">
                                <div class="box-price--label">
                                  {{ lang.buy_price }}
                                </div>
                                <div class="box-price--value">
                                  <template v-if="isEditing">
                                    <div class="el-input el-input--mini">
                                      <!-- <money v-model="tmpE.buy_price" class="el-input__inner" @input="handleCurrency('buyPrice', tmpE.buy_price)"></money> -->
                                      <input-money v-model="tmpE.buy_price" @currency="handleCurrency('buyPrice', tmpE.buy_price)" />
                                    </div>
                                  </template>
                                  <template v-else>
                                    {{data.fbuy_price}}
                                  </template>
                                </div>
                              </div>
                            </el-col>

                            <el-col :md="12">
                              <div class="box-price">
                                <div class="box-price--label">
                                  {{ lang.market_price }}
                                </div>
                                <div class="box-price--value">
                                  <template v-if="isEditing">
                                    <div class="el-input el-input--mini">
                                      <input-money v-model="tmpE.market_price" @currency="handleCurrency('marketPrice', tmpE.market_price)" />
                                    </div>
                                  </template>
                                  <template v-else>
                                    {{data.market_price}}
                                  </template>
                                </div>
                              </div>
                            </el-col>

                            <el-col :md="12">
                              <div class="box-price">
                                <div class="box-price--label">
                                  {{ lang.online_selling_price }}
                                </div>
                                <div class="box-price--value">
                                  <template v-if="isEditing">
                                    <div class="el-input el-input--mini">
                                      <input-money v-model="tmpE.sell_price" @currency="handleCurrency('sellPriceOnline', tmpE.sell_price)" />
                                    </div>
                                  </template>
                                  <template v-else>
                                    {{data.fsell_price}}
                                  </template>
                                </div>
                              </div>
                            </el-col>

                            <el-col :md="12">
                              <div class="box-price">
                                <div class="box-price--label">
                                  {{ lang.selling_price_in_store }}
                                </div>
                                <div class="box-price--value">
                                  <template v-if="isEditing">
                                    <div class="el-input el-input--mini">
                                      <input-money v-model="tmpE.sell_price_pos" @currency="handleCurrency('sellPriceStore', tmpE.sell_price_pos)" />
                                    </div>
                                  </template>
                                  <template v-else>
                                    {{data.fsell_price_pos}}
                                  </template>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ lang.pos_sell_price_dynamic }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-switch
                                :active-value="1"
                                :inactive-value="0"
                                v-model="tmpE.pos_sell_price_dynamic"
                              />
                            </template>
                            <template v-else>
                              <template v-if="data.pos_sell_price_dynamic">
                                {{ lang.yes }}
                              </template>
                              <template v-else>
                                {{ lang.no }}
                              </template>
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ !isEditing ? '' : lang.published }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-switch
                                :active-value="1"
                                :inactive-value="0"
                                v-model="tmpE.published"
                              />
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ isEditing ? this.$lang[langId].published_date : lang.published }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-date-picker
                                v-model="tmpE.published_date"
                                type="date"
                                :placeholder="this.$lang[langId].pick_a_day">
                              </el-date-picker>
                            </template>
                            <template v-else>
                              <template v-if="data.published">
                                {{data.fpublished_date}}
                              </template>
                              <template v-else>
                                {{ lang.not_published_yet }}
                              </template>
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ this.$lang[langId].comission }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <div class="el-input el-input--mini">
                                <input-money v-model="tmpE.comission" @currency="handleCurrency('comission', tmpE.comission)" />
                              </div>
                            </template>
                            <template v-else>
                              {{data.comission}}
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <el-row :gutter="5">
                            <el-col :md="24">
                              <div class="detail-label">
                                <small>{{ this.$lang[langId].minimum_order }}</small>
                              </div>
                              <div class="detail-value">
                                <template v-if="isEditing">
                                  <!-- <el-input size="mini" v-model="tmpE.min_order" :min="0"></el-input> -->
                                  <el-input-number v-model="tmpE.min_order" :min="0"></el-input-number>
                                </template>
                                <template v-else>
                                  {{data.min_order}}
                                </template>
                              </div>
                            </el-col>

                            <el-col :md="24">
                              <div class="detail-label">
                                <small>{{ this.$lang[langId].maximum_order }}</small>
                              </div>
                              <div class="detail-value">
                                <template v-if="isEditing">
                                  <!-- <el-input size="mini" v-model="tmpE.max_order" :min="0"></el-input> -->
                                  <el-input-number v-model="tmpE.max_order" :min="0"></el-input-number>
                                </template>
                                <template v-else>
                                  {{data.max_order}}
                                </template>
                              </div>
                            </el-col>
                          </el-row>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ lang.require_shipping }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-switch
                                :active-value="1"
                                :inactive-value="0"
                                v-model="tmpE.require_shipping"
                              />
                              <div v-if="tmpE.require_shipping === 1" style="margin-top: 6px">
                                <div class="detail-label">
                                  <small>{{ lang.product_weight }}</small>
                                </div>
                                <el-input v-model="tmpE.weight" type="number">
                                  <template slot="append">kg</template>
                                </el-input>
                              </div>
                            </template>
                            <template v-else>
                              <template v-if="data.require_shipping">
                                {{ lang.yes }}
                                <div style="margin-top: 6px">
                                  <div class="detail-label">
                                    <small>{{ lang.product_weight }}</small>
                                  </div>
                                  {{ data.weight }}
                                </div>
                              </template>
                              <template v-else>
                                {{ lang.no }}
                              </template>
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ lang.non_taxable }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-switch
                                :active-value="1"
                                :inactive-value="0"
                                v-model="tmpE.non_taxable"
                              />
                              <div v-if="tmpE.non_taxable">
                                {{ lang.yes }}
                                <div style="margin-top: 6px">
                                  <div class="detail-label">
                                    <small>{{ lang.product_weight }}</small>
                                  </div>
                                  {{ data.weight }}
                                </div>
                              </div>
                              <div v-else>
                                {{ lang.no }}
                              </div>
                            </template>
                            <template v-else>
                              <template v-if="data.non_taxable">
                                {{ lang.yes }}
                                <div style="margin-top: 6px">
                                  <div class="detail-label">
                                    <small>{{ lang.product_weight }}</small>
                                  </div>
                                  {{ data.weight }}
                                </div>
                              </template>
                              <template v-else>
                                {{ lang.no }}
                              </template>
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-label">
                            <small>{{ lang.available_in_pos }}</small>
                          </div>
                          <div class="detail-value">
                            <template v-if="isEditing">
                              <el-switch
                                v-model="tmpE.pos_hidden"
                                :active-value="0"
                                :inactive-value="1">
                              </el-switch>
                            </template>
                            <template v-else>
                              <template v-if="!data.pos_hidden">
                                {{ lang.yes }}
                              </template>
                              <template v-else>
                                {{ lang.no }}
                              </template>
                            </template>
                          </div>
                        </div>

                        <div class="detail-item">
                          <div class="detail-value">
                            <button-action-authenticated
                              :permission="['catalog/productcombo', 'destroy']"
                              :disabled="disabledButton"
                              type="bordered-danger"
                              @click="dialog.deleteProduct = true"
                              icon="el-icon-delete">
                              {{ $lang[langId].delete }}
                            </button-action-authenticated>
                          </div>
                        </div>
                      </div><!-- .detail-section -->
                    </div><!-- .col-md-6 -->

                    <div class="col-md-6">
                      <div class="subtitle-detail">
                        <h5><strong>{{ $lang[langId].info_additional }}</strong></h5>
                      </div>

                      <div class="detail-item">
                        <div class="detail-label">
                          <small>{{ lang.out_of_stock }}</small>
                        </div>
                        <div class="detail-value">
                          <template v-if="isEditing">
                            <el-switch v-model="tmpE.is_out_stock" :active-value="1" :inactive-value="0" />
                          </template>
                          <template v-else>
                            <template v-if="data.is_out_stock">
                              {{ lang.yes }}
                            </template>
                            <template v-else>
                              {{ lang.no }}
                            </template>
                          </template>
                        </div>
                      </div>

                      <div class="detail-item">
                        <div class="detail-label">
                          <small>{{ lang.loyalty_point }}</small>
                        </div>
                        <div class="detail-value">
                          <template v-if="isEditing">
                            <!-- <el-input type="number" v-model="tmpE.loyalty_points" /> -->
                            <el-input v-model="tmpE.loyalty_points" :placeholder="$lang[langId].input_number" type="number" @input="handleCurrency('loyaltiPoint', tmpE.loyalty_points)"></el-input>
                          </template>
                          <template v-else>
                            {{data.loyalty_points}}
                          </template>
                        </div>
                      </div>

                      <div class="detail-item">
                        <div class="detail-label">
                          <small>{{ lang.seo }} - {{ lang.meta_keywords }}</small>
                        </div>
                        <div class="detail-value">
                          <template v-if="isEditing">
                            <el-input
                              placeholder="Please input"
                              v-model="tmpE.meta_keywords"
                              clearable>
                            </el-input>
                          </template>
                          <template v-else>
                            <template v-if="data.meta_keywords">
                              {{data.meta_keywords}}
                            </template>
                            <template v-else>
                              -
                            </template>
                          </template>
                        </div>
                      </div>

                      <div class="detail-item">
                        <div class="detail-label">
                          <small>{{ lang.seo }} - {{ lang.meta_description }}</small>
                        </div>
                        <div class="detail-value">
                          <template v-if="isEditing">
                            <el-input
                              type="textarea"
                              autosize
                              clearable
                              placeholder="Please input"
                              v-model="tmpE.meta_description">
                            </el-input>
                          </template>
                          <template v-else>
                            <template v-if="data.meta_description">
                              {{data.meta_description}}
                            </template>
                            <template v-else>
                              -
                            </template>
                          </template>
                        </div>
                      </div>
                    </div><!-- .col-md-6 -->
                  </div><!-- .row -->
                </div><!-- .col-md-9 -->
              </div><!-- .row -->
            </div><!-- .card-body -->
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card v-loading="loading" class="box-card">
            <div slot="header" class="table-handler-flex">
              <h4 style="flex-grow: 1;">{{ $lang[langId].product_in_combo }}</h4>
              <div>
                <template v-if="showSaveSorts">
                  <el-button
                    icon="el-icon-check"
                    type="success"
                    :disabled="disabledSaveSorts"
                    @click="handleSaveSorts">
                    {{ lang.save }}
                  </el-button>
                </template>
                <template v-else>
                  <button-action-authenticated
                    :permission="['catalog/productcombo', 'edit']"
                    icon="el-icon-edit"
                    type="primary"
                    @click="handleManageItems">
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
              </div>
            </div>

            <div class="card-body">
              <button-action-authenticated
                :permission="['catalog/productcombo', 'store']"
                style="margin-bottom: 12px;"
                type="default"
                class="btn-block btn-grey"
                icon="el-icon-plus"
                @click="dialogAddItemFormVisible = true">
                {{ lang.add_product }}
              </button-action-authenticated>
              <draggable
                v-model="items"
                :options="{group:{ name:'packages'}}"
                handle=".hand"
                class="dd-list dragArea"
                @change="handleSaveSorts">
                <div class="dd-item" v-for="(item) in items" :key="item.id">
                  <list :item="item"></list>
                  <draggable
                    :options="{group:{ name:'packages'}}"
                    :list="item.children.data"
                    handle=".hand"
                    class="dd-list children dragArea">
                    <div 
                      v-for="(child) in item.children.data"
                      :key="child.id">
                      <list :item="child" />
                    </div>
                  </draggable>
                </div>
              </draggable>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <el-dialog
      v-if="data"
      :title="lang.manage"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose">
      <template v-if="items.length > 0">
        <edit-list
          ref="editlist"
          @remove="handleRemoveItem"
          @data-changes="saveManageItems"
          :item-removed="state.itemRemoved"
          :item="tempItems"
          :loading="loadingManageItems"
        />
      </template>
      <template v-else>
        <el-tag type="warning">{{ this.$lang[langId].no_product_in_combo }}</el-tag>
      </template>
    </el-dialog>

    <el-dialog :visible.sync="dialogAddItemFormVisible"
      :title="lang.add" v-loading="loading">
      <add-item ref="additem" @save="handleAddItem" @close="dialogAddHide"></add-item>
    </el-dialog>

    <el-dialog
      v-if="data"
      :visible.sync="dialog.deleteProduct"
      title="Confirm"
      width="340px">
      <span>{{ $lang[langId].are_you_want_remove }} <strong>{{ data.name }}</strong>?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.deleteProduct = false">{{ lang.cancel }}</el-button>
        <el-button type="primary" @click="remove">{{ lang.yes }}, {{ $lang[langId].delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const moment = require('moment')
import { baseApi } from 'src/http-common'
import axios from 'axios'
import draggable from 'vuedraggable'
import EditList from './_editList'
import List from './List'
import AddItem from './AddItem'
import InputMoney from '@/components/InputMoneyV2'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: {
    draggable,
    EditList,
    List,
    AddItem,
    InputMoney
  },

  mixins: [checkCustomPermission],

  data() {
    return {
      loading: false,
      disabledSave: true,
      data: {},
      dialog: {
        deleteProduct: false
      },
      items: [],
      enabledSaveSort: false,
      savingSorts: false,
      disabledSaveSorts: false,
      showSaveSorts: false,
      itemAdded: false,
      disabledButton: false,
      isEditing: false,
      dialogFormVisible: false,
      dialogAddItemFormVisible: false,
      dataGoingToSave: [],
      changePhoto: false,
      tmpE: {
      },
      state: {
        itemRemoved: false
      },
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      },
      tempItems: [],
      loadingManageItems: false
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
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'productcombo/upload')
    },
    tmp() {
      return {
        items: [...this.items]
      }
    },
    fileList() {
      if (this.data.photo_md) {
        let fileList = []
        fileList.push({
          url: this.data.photo_md,
          name: this.data.photo
        })
        return fileList
      }
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

  beforeMount() {
    this.handleCustomPermissionSinglePage('catalog/productcombo', 'show')
  },

  mounted() {
    this.loadData()
  },

  methods: {
    loadData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/' + this.$route.params.id),
        headers
      }).then(response => {
        this.data = response.data.data
        this.items = this.data.items.data
        this.loading = false
      }).catch(() => {
        this.data = null
        this.items = []
        this.loading = false
      })
    },
    handleUploadFailed(err) {
      this.$notify({
        type: 'warning',
        title: 'Failed',
        message: err
      })
    },
    handleUploadSuccess(response) {
      this.data = response.data
      this.changePhoto = false
    },
    sortsChanged() {
      this.disabledSaveSorts = false
      this.showSaveSorts = true
    },
    handleAddItem(data) {
      //
      this.itemAdded = false
      this.disabledSaveSorts = true

      this.$set(data, 'id', this.data.id)
      data.items = data.items.join(',')
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/additem'),
        headers,
        data
      }).then(response => {
        this.$message({
          type: 'success',
          title: 'Success',
          message: 'Success'
        })
        this.data = response.data.data
        this.items = this.data.items.data
        this.itemAdded = true
        this.disabledSaveSorts = false
        this.dialogAddItemFormVisible = false
        this.$refs.additem.refreshData()
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.itemAdded = false
        this.disabledSaveSorts = true
      })
    },
    handleSaveSorts(value) {
      this.disabledSaveSorts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      // let sortedIds = this.data.slice(0)
      let sortedIds = this.items
      sortedIds = sortedIds.map(item => {
        let data = {
          id: item.id,
          name: item.product_name,
          children: []
        }
        if (item.children.data && item.children.data.length > 0) {
          item.children.data.map(child => {
            data.children.push({id: child.id, name: child.product_name})
          })
        }
        return data
      })
      let data = {
        id: this.data.id,
        sorted_ids: sortedIds
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/sortingitems'),
        headers: headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.items = data.items.data
        this.showSaveSorts = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.disabledSaveSorts = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    remove() {
      this.loading = true
      //
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'delete',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/' + this.data.id),
        headers
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$router.push({ path: '/catalog/package' })
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },
    edit() {
      this.isEditing = true
      this.tmpE = Object.assign({}, this.data)
      this.tmpE.buy_price = Number.parseInt(this.tmpE.buy_price, 0)
      this.tmpE.sell_price = Number.parseInt(this.tmpE.sell_price, 0)
      this.tmpE.market_price = Number.parseInt(this.tmpE.market_price, 0)
      this.tmpE.sell_price_pos = Number.parseInt(this.tmpE.sell_price_pos, 0)
      this.tmpE.comission = Number.parseInt(this.tmpE.comission, 0)
      console.log(this.tmpE)
    },
    cancelEdit() {
      //
      this.isEditing = false
    },
    saveEdit() {
      //
      this.loading = true
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = { ...this.tmpE}
      data.published_date = moment(data.published_date).format('YYYY-MM-DD')
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/' + this.data.id),
        headers,
        data
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.data = response.data.data
        this.loading = false
        this.isEditing = false
        this.disabledButton = false
      }).catch((error) => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
        this.isEditing = false
        this.disabledButton = false
      })
    },
    handleManageItems() {
      let tmp = []
      if (this.data.items.data.length > 0) {
        this.data.items.data.map(i => {
          tmp.push({
            id: i.id,
            photo_md: i.photo_md,
            product_name: i.product_name,
            product_variant_id: i.product_variant_id,
            qty: i.qty,
            variant: i.variant,
            children: i.children
          })
        })
      }
      this.tempItems = { ...tmp}
      this.dialogFormVisible = true
    },
    handleRemoveItem(id) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/removeitem'),
        headers,
        data: {
          id: this.data.id,
          pk: id
        }
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.data = response.data.data
        this.items = this.data.items.data
        this.state.itemRemoved = true
        let tmp = []
        if (this.data.items.data.length > 0) {
          this.data.items.data.map(i => {
            tmp.push({
              id: i.id,
              photo_md: i.photo_md,
              product_name: i.product_name,
              product_variant_id: i.product_variant_id,
              qty: i.qty,
              variant: i.variant,
              children: i.children
            })
          })
        }
        this.tempItems = { ...tmp}
        this.$refs.editlist.clearDisableButton()
      }).catch((error) => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.state.itemRemoved = false
      })
    },
    handleDataChanges(data) {
      this.dataGoingToSave = data
    },
    backToList() {
      this.$router.push({path: '/catalog/package'})
    },
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      if (!isLt2M) {
        this.$message.error(this.$lang[this.langId].error_upload_size)
      }
      return (isJpg || isPng) && isLt2M
    },
    async saveManageItems(item) {
      this.loadingManageItems = true
      let data = []
      await item.map(i => {
        data.push(i)
        if (i.children.data.length > 0) {
          i.children.data.map(j => {
            data.push(j)
          })
        }
      })
      this.disabledSaveSorts = true
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      const promise = new Promise((resolve, reject) => {
        data.forEach((item, idx, arr) => {
          axios({
            method: 'POST',
            url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/updateitem'),
            headers: headers,
            params: {
              id: this.data.id,
              pk: item.id,
              qty: item.qty,
              product_variant_id: item.product_variant_id
            }
          }).then(() => {
            if (idx === arr.length - 1) {
              resolve()
            }
          }).catch(error => {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          })
        })
      })

      promise.then(() => {
        this.disabledButton = false
        this.dialogFormVisible = false
        this.loadingManageItems = false
        this.loadData()
        this.$message({
          type: 'success',
          message: 'Update success'
        })
      }).catch(error => {
        this.disabledButton = false
        this.dialogFormVisible = true
        this.loadingManageItems = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    handleCurrency(block, value) {
      if (block === 'sellPriceStore') {
        if (value < 0) {
          this.tmpE.sell_price_pos = 0
        }
      } else if (block === 'sellPriceOnline') {
        if (value < 0) {
          this.tmpE.sell_price = 0
        }
      } else if (block === 'buyPrice') {
        if (value < 0) {
          this.tmpE.buy_price = 0
        }
      } else if (block === 'marketPrice') {
        if (value < 0) {
          this.tmpE.market_price = 0
        }
      } else if (block === 'comission') {
        if (value < 0) {
          this.tmpE.comission = 0
        }
      } else if (block === 'loyaltiPoint') {
        if (value < 0) {
          this.tmpE.loyalty_points = null
        }
      }
    },
    dialogAddHide() {
      this.dialogAddItemFormVisible = false
    }
  }
}
</script>
