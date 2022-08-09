<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    fullscreen
    custom-class="fixed-dialog">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width font-bold">
        Daftar Add-on
      </h4>
      <!-- <close-esc :hideEsc="true" @close="$emit('close')" /> -->
      <el-button type="info" @click="$emit('close')">{{ rootLang.finish }}</el-button>
    </div>
    <div class="wizard-content flex-container justify-center">
      <div style="width: 100%; max-width: 1056px">
        <div class="flex-container mb-24">
          <el-button @click="visibleSorting = !visibleSorting" type="info-addon" :class="visibleSorting ? 'active' : ''">Ubah Urutan</el-button>
          <el-button @click="showGroup" type="info-addon" :class="visibleItem ? 'active' : ''"><svg-icon icon-class="icon-sort-grup" class="color-warning mr-4"></svg-icon>Lihat Grup saja</el-button>
          <div class="text-right full-width">
            <el-dropdown
              trigger="click"
              @command="handleDropdownAdd">
              <el-button type="success" id="wizard">
                <i class="el-icon-plus"></i> {{ lang.add }}
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="grup">
                  Grup Add-On
                </el-dropdown-item>
                <el-dropdown-item command="addon" :disabled="!dataAddonGroup.length">
                  Add-On
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div v-if="!dataAddonGroup || !dataAddonGroup.length" class="no-data-wrapper color-info--bg border border--grey p-32 align-center" style="display: flex; flex-direction: column;">
          <img src="/static/img/no-data-addon.svg" class="no-data-image">
          <div class="text-center word-break" style="width: 360px" >Eh, belum ada Add-On. Sediakan pilihan untuk memodifikasi item seperti Less Sugar atau Boba</div>
        </div>
        <div v-else>
          <template v-if="!visibleSorting">
            <div v-for="item in dataAddonGroup" :key="item.id">
              <div v-if="item.needed_items > 0" class="color-warning--soft--bg flex-container radius-10 mb-24 p-8">
                <div class="container-icon">
                  <svg-icon icon-class="information-circle" class="color-warning"></svg-icon>
                </div>
                <div class="p-8 font-14">
                  Jumlah add-on untuk <span class="font-bold">{{ item.name }} saat ini kurang {{ item.needed_items }}</span> nih!
                </div>
              </div>
              <div :class="item.available ? 'flex-container' : 'flex-container color-grey--bg'" style="height: 40px; padding: 11px 16px;">
                <!-- <div class="p-8">
                  <el-checkbox class="mt-5" v-model="item.available"></el-checkbox>
                </div> -->
                <div class="mr-8">
                  <el-dropdown
                    trigger="click"
                    @command="handleDropdownEditGrup(item)">
                    <span class="el-dropdown-link font-18 color-info">
                      <svg-icon icon-class="more-vertical"></svg-icon>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="grup">
                        Edit Grup Add-On
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="ml-8 font-18 font-bold full-width">{{ item.name }}</div>
                <div class="flex-container full-width text-right">
                  <div class="full-width">
                    <el-tag v-if="!item.available" type="danger" effect="plain" size="mini" class="mr-8" style="background-color: transparent">Tidak tersedia</el-tag>
                  </div>
                  <div v-if="item.is_must_selected === 0 && item.available" class="font-12 full-width text-right mr-8">Opsional • Maks {{ item.selected_item_max }}</div>
                  <div v-if="item.is_must_selected === 1 && item.available" class="font-12 full-width text-right mr-8">Harus pilih • Min {{ item.selected_item_min }} • Maks. {{ item.selected_item_max }}</div>
                </div>
                <div>
                  <el-button
                    type="text"
                    class="font-18 color-info"
                    @click="handleDropdownAdd('addon', item.id)">
                    <i class="el-icon-plus color-green" />
                  </el-button>
                </div>
              </div>
              <el-collapse-transition>
                <div v-show="visibleItem">
                  <div v-if="item.addon_items.length === 0" class="color-grey--bg mb-24" style="height: 72px"></div>
                  <div v-else class="like-table-wrapper mb-24">
                    <div v-for="addon in item.addon_items" 
                      :key="addon.id" 
                      :class="addon.available ? 'like-table-wrapper--item pointer' : 'like-table-wrapper--item color-grey--bg pointer'"
                      @click="handleEditAddon(addon, item)">
                        <!-- <div class="p-8">
                          <el-checkbox class="mt-5" v-model="addon.available"></el-checkbox>
                        </div> -->
                        <div class="mr-8 ml-8" style="flex-grow: 1;">
                          <div class="font-bold font-14">
                            {{ addon.name }}
                          </div>
                          <div class="color-info font-12">
                            <span v-if="addon.alias_price">
                              {{ addon.falias_price }}
                            </span>
                            <span v-else>
                              {{ addon.forigin_price }}
                            </span>
                          </div>
                        </div>
                        <el-tag v-if="!addon.available" type="danger" effect="plain" size="mini" class="mr-8" style="background-color: transparent">Tidak tersedia</el-tag>
                        <el-button type="text">
                          <svg-icon icon-class="edit-2"></svg-icon>
                        </el-button>
                    </div>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </template>
          <template v-else>
            <draggable
              v-model="dataAddonGroup"
              :list="dataAddonGroup"
              :options="{group:{ name:'brand'}}"
              handle=".hand"
              class="dd-list dragArea"
              style="margin-bottom: 100px"
              @change="showSaveSort = true">
              <div class="dd-item" v-for="(item) in dataAddonGroup" :key="item.id">
                <list :item="item" :visible-item="visibleItem" @changeitem="sortItem" />
              </div>
            </draggable>
          </template>
        </div>
      </div>
    </div>

    <el-dialog
        :visible.sync="visibleDialogAddItem"
        :show-close="false"
        :close-on-press-escape="false"
        :before-close="handleCancel"
        append-to-body
        custom-class="dialog-grbfd">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ !isEdit ? lang.add : lang.edit }} {{ formItem.command === 'grup' ? 'Grup Add-On' : 'Add-On' }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancel">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSaveItem" type="success" @click="handleSaveItem" >{{ lang.save }}</el-button>
          </div>
        </div>
        
          <el-form>
            <div v-if="formItem.command === 'grup'">
              <el-form-item
                :label="lang.name">
                <el-input
                  v-model="formItem.grup.name"
                />
              </el-form-item>

              <div class="card-buttons">
                <el-radio-group class="flex-container" v-model="formItem.grup.must_be_selected" @change="resetMin">
                  <el-radio-button :label="0">Opsional</el-radio-button>
                  <el-radio-button :label="1">Harus Pilih</el-radio-button>
                </el-radio-group>
                <div>
                  <span v-if="formItem.grup.must_be_selected === 0" class="font-11 color-old-grey">Opsional, pelanggan tidak harus memilih add-on</span>
                  <span v-else class="font-11 color-old-grey">Harus pilih, pelanggan harus memilih minimal 1 add-on</span>
                </div>
              </div>

              <div v-if="formItem.grup.must_be_selected === 0" class="mt-16">
                <div class="font-12">Maksimal add-on terpilih</div>
                <div class="custom-input-number">
                  <el-input-number v-model="formItem.grup.selected_item_max" :min="1"></el-input-number>
                </div>
              </div>
              <div v-else class="mt-16 flex-container">
                <div class="pr-4 full-width">
                  <div class="font-12">Minimal add-on terpilih</div>
                  <div class="custom-input-number">
                    <el-input-number v-model="formItem.grup.selected_item_min" :min="1" @change="setMaxAddon"></el-input-number>
                  </div>
                </div>
                <div class="pl-4 full-width">
                  <div class="font-12">Maksimal add-on terpilih</div>
                  <div class="custom-input-number">
                    <el-input-number v-model="formItem.grup.selected_item_max" :min="minAddon"></el-input-number>
                  </div>
                </div>
              </div>
              <div v-if="isEdit" class="mt-16 border border--grey px-10 py-9 flex-container">
                <div class="font-16 font-bold full-width">
                  Tersedia di menu GrabFood
                </div>
                <div class="flex-container">
                  <popover-confirmation 
                    :data="formItem.grup" 
                    :visible="visibleAddonGrup" 
                    @cancel="cancelSwitch('grup')"
                    @confirm="visibleAddonGrup = false"/>

                  <span v-if="formItem.grup.is_available === 1" class="font-12 color-old-grey">{{ lang.yes }}</span>
                  <span v-else class="font-12 color-old-grey">{{ lang.no }}</span>
                  <!-- <el-switch
                    v-model="formItem.grup.is_available"
                    :active-value="1"
                    :inactive-value="0"
                    class="mr-8 ml-8"
                    @change="visibleAddonGrup = true">
                  </el-switch> -->
                </div>
              </div>
              <div v-if="isEdit" class="mt-16">
                <el-button
                  :loading="loadingDeleteItem"
                  class="btn-block mb-8 color-danger"
                  icon="el-icon-delete"
                  @click="deleteAddonGroup">
                  {{ rootLang.delete }} Grup Add-On
                </el-button>
              </div>
            </div>
            <div v-else>
              <template v-if="!isEdit">
                <el-form-item
                  label="Grup Add-on">
                  <el-select class="inline-form full-width" v-model="formItem.addon.menu_addon_id" filterable size="small">
                    <el-option v-for="item in dataAddonGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="Add-on">
                  <el-autocomplete
                      v-model="searchQuery"
                      :fetch-suggestions="getAddonSearch"
                      placeholder="Select Add-On (Autocomplete)'"
                      @select="handleSelectAddon"
                      :debounce="300"
                      style="width: 100%"
                    />
                </el-form-item>
              </template>
              <template v-else>
                <div class="flex-container radius-10 mt-24 color-grey--soft--bg p-10 mb-12">
                  <div class="container-icon">
                    <svg-icon icon-class="icon-feather-link" stroke="#67C23A"></svg-icon>
                  </div>
                  <div class="full-width pl-5">
                    <div class="color-primary font-bold font-16">{{ formItem.addon.name }}</div>
                    <div class="font-12 color-old-grey">{{ formItem.addon.forigin_price }}</div>
                  </div>
                </div>
                <el-form-item
                  :label="lang.price + ' Grabfood'"
                  prop="price">
                  <input-money
                    :amount.sync="formItem.addon.alias_price"
                  />
                </el-form-item>
                <el-form-item
                  :label="lang.group + ' Add-On'"
                  prop="category_name">
                    <el-select class="inline-form full-width" v-model="formItem.addon.menu_addon_id" filterable size="small">
                      <el-option v-for="item in dataAddonGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <div class="mt-16 border border--grey px-10 py-9 flex-container">
                  <div class="font-16 font-bold full-width">
                    Tersedia di menu GrabFood
                  </div>
                  <div class="flex-container">
                    <popover-confirmation 
                      :data="formItem.addon" 
                      :visible="visibleAddon" 
                      @cancel="cancelSwitch('addon')"
                      @confirm="visibleAddon = false"/>

                    <span v-if="formItem.addon.is_available === 1" class="font-12 color-old-grey">{{ lang.yes }}</span>
                    <span v-else class="font-12 color-old-grey">{{ lang.no }}</span>
                    <!-- <el-switch
                      v-model="formItem.addon.is_available"
                      :active-value="1"
                      :inactive-value="0"
                      class="mr-8 ml-8"
                      @change="visibleAddon = true">
                    </el-switch> -->
                  </div>
                </div>

                <div class="mt-16">
                  <el-button
                    :loading="loadingDeleteItem"
                    class="btn-block mb-8 color-danger"
                    icon="el-icon-delete"
                    @click="deleteAddonItem">
                    {{ rootLang.delete }} Add-On
                  </el-button>
                </div>
              </template>
            </div>
          </el-form>

        <div v-if="formItem.command === 'addon' && formItem.addon.addon_item && formItem.addon.addon_item.length && !isEdit" class="like-table-wrapper">
          <div v-for="(menu, idx) in formItem.addon.addon_item" 
          :key="menu.id" 
          class="like-table-wrapper--item pointer">
            <div class="mr-8" style="flex-grow: 1;">
              <div class="font-bold font-14">
                {{ menu.name }}
              </div>
              <div class="color-info font-12">
                <span v-if="menu.alias_price">
                  {{ menu.fprice }}
                </span>
                <span v-else>
                  {{ menu.fsell_price_pos }}
                </span>
              </div>
            </div>
            <el-button type="text" @click="removeItem(idx)">
              <i class="el-icon-close" style="color: #F44336"></i>
            </el-button>
          </div>
        </div>
      </el-dialog>

      <div class="full-width flex-container justify-center">
        <div v-if="showSaveSort" class="floating_div mw-1056">
          <floating-div :loading="loadingSort" @confirm="handleSaveSort"></floating-div>
        </div>
      </div>
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import InputMoney from '@/components/modules/InputMoney'
import draggable from 'vuedraggable'
import List from './List'
import FloatingDiv from '../../../FloatingDiv'

import { createAddonGroup, 
  fecthAddonGroup, 
  fecthAddonItems, 
  createAddonItem, 
  saveAddonGroup,
  deleteAddonGroup,
  saveAddonItem,
  deleteAddonItem,
  sortAddonGroup,
  sortAddonItem } from '@/api/thirdParty/grabfood'
import PopoverConfirmation from '../../../../PopoverConfirmation.vue'
export default {
  name: 'dialogListAddon',
  mixins: [basicComputedMixin],

  components: {
    CloseEsc,
    draggable,
    List,
    InputMoney,
    FloatingDiv,
    PopoverConfirmation
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: null
    },
    grabfoodData: {
      type: Object,
      default: null
    }
  },

  watch: {
    show(show) {
      if (show) {
        this.refreshData()
      }
    },
  },

  data() {
    return {
      visibleDialogAddItem: false,
      formItem: {
        command: '',
        grup: {
          name: '',
          must_be_selected: 0,
          selected_item_max: 0,
          selected_item_min: 0,
          store_grabfood_id: null
        },
        addon: {
          store_grabfood_id: null,
          addon_item: []
        }
      },
      loadingSaveItem: false,
      loadingSaveAddon: false,
      dataAddonGroup: {},
      searchQuery: null,
      isEdit: false,
      loadingDeleteItem: false,
      visibleItem: true,
      visibleSorting: false,
      showSaveSort: false,
      loadingSort: false,
      tempSortItem: [],
      visibleAddon: false,
      visibleAddonGrup: false
    }
  },

  mounted() {
    this.getAddonGroup()
  },

  computed: {
    // disableSave () {
    //   if (this.formSection.selected_days.length && this.formSection.name) {
    //     return false
    //   } else {
    //     return true
    //   }
    // },

    minAddon () {
      // if (this.formItem.grup.must_be_selected === 1) {
      //   if (this.formItem.grup.selected_item_max === 0) {
      //     this.formItem.grup.selected_item_max = 1
      //   }
      //   return 1
      // } else {
      //   return 0
      // }
      let minAddon = 1
      if (this.formItem.grup.selected_item_min > 0) {
        minAddon = this.formItem.grup.selected_item_min
      }
      return minAddon
    }
  },

  methods: {
    // async handleEditItem(index) {
    //   let day = []
    //   if (this.formSection.days && this.formSection.days.length) {
    //     day = await this.formSection.days.filter(day => {
    //       return day.day_id === index
    //     })
    //   }
    //   if (day.length) {
    //     this.formEditSectionPeriode = await { ...day[0] }
    //   } else {
    //     this.formEditSectionPeriode = {
    //       day_id: index,
    //       id: null
    //     }
    //   }
    //   this.visibleOffscreenEditSectionPeriode = true
    // },

    // getLabelDayTime(itemKey) {
    //   // if (this.formData && this.formData.days && this.formData.days.length) {
    //   //   const day = this.formData.days.filter(day => {
    //   //     return day.day_id === itemKey
    //   //   })
    //   //   if (day.length >= 1) {
    //   //     if (day[0].times.length > 1) {
    //   //       return day[0].times[0].start_time + ' ... ' + day[0].times[day[0].times.length - 1].end_time
    //   //     } else {
    //   //       console.log('trace', day)
    //   //       return day[0].times[0].start_time + ' - ' + day[0].times[0].end_time
    //   //     }
    //   //   }
    //   // }
    //   const daysKey = this.formSection.days[itemKey]
    //   if (daysKey && daysKey.day_ids && daysKey.day_ids.length) {
    //     const dayIds = this.formSection.days[itemKey].day_ids
    //     if (dayIds.length > 1) {
    //       return dayIds[0].start_time + ' ... ' + dayIds[dayIds.length - 1].end_time
    //     } else {
    //       return dayIds[0].start_time + ' - ' + dayIds[0].end_time
    //     }
    //   }
    // },

    // handleSavePeriod (data) {
    //   console.log('trace', data)
    //   this.formSection.days = this.formSection.days.map(item => {
    //     if (item.day_id === data.day_id) {
    //       item = data
    //     }
    //     return item
    //   })
    //   this.visibleOffscreenEditSectionPeriode = false
    // },

    handleSaveItem () {
      this.loadingSaveItem = true
      if (this.formItem.command === 'grup') {
        this.saveAddonGrup()
      } else if (this.formItem.command === 'addon') {
        this.saveAddonItems()
      }
    },

    handleCancel () {
      this.refreshData()
      this.visibleDialogAddItem = false
      this.isEdit = false
    },

    getAddonGroup () {
      fecthAddonGroup().then(async response => {
        this.dataAddonGroup = [ ...response.data.data]
        this.dataAddonGroup.map(i => {
          i.available = false
          if (i.is_available === 1) {
            i.available = true
          }
          if (i.addon_items && i.addon_items.length) {
            i.addon_items.map(j => {
              j.available = false
              if (j.is_available === 1) {
                j.available = true
              }
            })
          }
        })
      }).catch(error => {
        console.log('tracerrror', error)
        this.dataAddonGroup = []
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    handleDropdownAdd (command, itemId) {
      this.formItem.command = command
      this.visibleDialogAddItem = true
      if (command === 'addon' && itemId) {
        this.formItem.addon.menu_addon_id = itemId
      }
    },

    saveAddonGrup () {
      // console.log('trace', data)
      let data = { ...this.formItem.grup}
      data.store_grabfood_id = this.grabfoodData.id
      if (!this.isEdit) {
        createAddonGroup(data).then(async response => {
          this.loadingSaveItem = false
          this.visibleDialogAddItem = false
          this.refreshData()
        }).catch(error => {
          this.loadingSaveItem = false
          this.$message({
            type: 'error',
            message: error.string
          })
        })
      } else {
        saveAddonGroup(data).then(async response => {
          this.loadingSaveItem = false
          this.visibleDialogAddItem = false
          this.refreshData()
        }).catch(error => {
          this.loadingSaveItem = false
          this.$message({
            type: 'error',
            message: error.string
          })
        })
      }
    },

    getAddonSearch(queryString, callback) {
      // this.loading = true
      if (queryString && queryString.length) {
        let params = {
          search_column: 'name',
          sort_type: 'asc',
          search_text: queryString
        }
        fecthAddonItems(params).then(async response => {
            let data = response.data.data
            for (let i of data) {
              i.value = i.name
            }
            callback(data)
          })
          .catch(error => {
            if (error.response.data.error.status_code !== 404) {
              this.$notify({
                type: 'warning',
                title: error.response.data.error.message,
                message: error.response.data.error.error
              })
            }
            let data = []
            callback([{
              value: this.rootLang.no_data,
              id: 0
            }])
          })
      } else {
        callback([])
      }
    },

    handleSelectAddon (product) {
      // const exist = null
      if (product.id !== 0) {
        if (this.formItem.addon.addon_item && this.formItem.addon.addon_item.length) {
          const exist = this.formItem.addon.addon_item.filter(item => {
            return product.id === item.id
          })
          if (!exist.length) {
            this.formItem.addon.addon_item.push({
              id: product.id,
              name: product.name,
              fprice: product.fprice,
              alias_price: product.price
            })
          }
        } else {
        this.formItem.addon.addon_item.push({
            id: product.id,
            name: product.name,
            fprice: product.fprice,
            alias_price: product.price
          })
        }
      }
      this.searchQuery = ''
    },

    removeItem (index) {
      this.formItem.addon.addon_item.splice(index, 1)
    },

    saveAddonItems () {
      // console.log('trace', data)
      let data = { ...this.formItem.addon}
      data.store_grabfood_id = this.grabfoodData.id
      if (!this.isEdit) {
        createAddonItem(data).then(async response => {
          this.loadingSaveItem = false
          this.visibleDialogAddItem = false
          this.refreshData()
        }).catch(error => {
          console.log('adddror', error)
          this.loadingSaveItem = false
          this.$message({
            type: 'error',
            message: error.string
          })
        })
      } else {
        saveAddonItem(data).then(async response => {
          this.loadingSaveItem = false
          this.visibleDialogAddItem = false
          this.refreshData()
        }).catch(error => {
          console.log('adddror', error)
          this.loadingSaveItem = false
          this.$message({
            type: 'error',
            message: error.string
          })
        })
      }
    },

    refreshData () {
      this.formItem = {
        grup: {
          name: '',
          must_be_selected: 0,
          selected_item_max: 0,
          selected_item_min: 1,
          store_grabfood_id: null
        },
        addon: {
          store_grabfood_id: null,
          addon_item: []
        },
        command: ''
      }
      this.isEdit = false
      this.getAddonGroup()
    },

    handleDropdownEditGrup (data) {
      this.isEdit = true
      this.formItem.grup = {
        id: data.id,
        name: data.name,
        must_be_selected: data.is_must_selected,
        selected_item_max: data.selected_item_max,
        selected_item_min: data.selected_item_min,
        is_available: data.is_available
      }
      this.formItem.command = 'grup'
      this.visibleDialogAddItem = true
    },

    handleEditAddon (data, item) {
      this.isEdit = true
      // this.formItem.addon = { ...data}
      this.formItem.addon = {
        id: data.id,
        alias_price: data.alias_price,
        falias_price: data.falias_price,
        name: data.name,
        origin_price: data.origin_price,
        forigin_price: data.forigin_price,
        is_available: data.is_available,
        origin_qty: data.origin_qty,
        menu_addon_id: item.id
      }
      this.formItem.command = 'addon'
      this.visibleDialogAddItem = true
    },

    deleteAddonGroup () {
      // console.log('trace', data)
      this.loadingDeleteItem = true
      let data = { ...this.formItem.grup}
      data.store_grabfood_id = this.grabfoodData.id
      data.is_update = 1
      deleteAddonGroup(data).then(async response => {
        this.loadingDeleteItem = false
        this.visibleDialogAddItem = false
        this.refreshData()
      }).catch(error => {
        this.loadingDeleteItem = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    deleteAddonItem () {
      // console.log('trace', data)
      this.loadingDeleteItem = true
      let data = { ...this.formItem.addon}
      data.store_grabfood_id = this.grabfoodData.id
      data.is_update = 1
      deleteAddonItem(data).then(async response => {
        this.loadingDeleteItem = false
        this.visibleDialogAddItem = false
        this.refreshData()
      }).catch(error => {
        this.loadingDeleteItem = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    setMaxAddon () {
      if (this.formItem.grup.selected_item_max < this.formItem.grup.selected_item_min) {
        this.formItem.grup.selected_item_max = this.formItem.grup.selected_item_min
      }
    },

    sortItem (data) {
      this.tempSortItem = [ ...data]
      this.showSaveSort = true
    },

    handleSaveSort () {
      if (this.visibleItem) {
        this.saveSortsItem()
      } else {
        this.saveSortsGroup()
      }
    },

    saveSortsGroup() {
      this.loadingSort = true
      let sortedIds = this.dataAddonGroup.slice(0)
      sortedIds = sortedIds.map((item) => {
        return {id: item.id}
      })
      let data = {
        sorted_ids: sortedIds
      }
      sortAddonGroup(data).then(response => {
        this.dataAddonGroup = response.data.data
        this.showSaveSorts = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loadingSort = false
      }).catch(error => {
        // this.disabledSaveSorts = false
        this.loadingSort = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    saveSortsItem() {
      this.loadingSort = true
      let sortedIds = this.tempSortItem.slice(0)
      sortedIds = sortedIds.map((item) => {
        return {id: item.id}
      })
      let data = {
        sorted_ids: sortedIds
      }
      sortAddonItem(data).then(response => {
        // this.dataAddonGroup = response.data.data
        this.showSaveSorts = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loadingSort = false
      }).catch(error => {
        // this.disabledSaveSorts = false
        this.loadingSort = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    cancelSwitch (command) {
      if (command === 'addon') {
        this.formItem.addon.is_available === 1 ? this.formItem.addon.is_available = 0 : this.formItem.addon.is_available = 1
        this.visibleAddon = false
      } else {
        this.formItem.grup.is_available === 1 ? this.formItem.grup.is_available = 0 : this.formItem.grup.is_available = 1
        this.visibleAddonGrup = false
      }
    },

    resetMin (data) {
      if (data === 0) {
        this.formItem.grup.selected_item_min = 0
      }
    },

    showGroup () {
      this.visibleItem = !this.visibleItem
      console.log('focus', document.getElementById('wizard').focus())
      document.getElementById('wizard').focus()
    }
  }
}
</script>
