<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    fullscreen
    custom-class="fixed-dialog">
    <div slot="title" class="fixed-dialog--header">
      <div class="fixed-dialog--header--title">
        Ubah Daftar Menu
        <!-- <close-esc @close="$emit('cancel')" /> -->
      </div>
      <div class="fixed-dialog--header--buttons">
        <close-esc :hideEsc="true" @close="handleClose" />
        <!-- <el-button
          type="info"
          @click="handleCancel">
          {{ lang.cancel }}
        </el-button>
        <el-button type="success">
          {{ lang.save }}
        </el-button> -->
      </div>
    </div>
    <div class="mw-980">
      <el-row :gutter="10">
        <el-col :md="12">
          <div class="border border--info box-shadow-2 mb-24">
            <div class="flex-container flex-container--content-space-between p-16">
              <div class="font-18 font-semi-bold">
                Sections
              </div>
              <el-button
                type="text"
                class="font-18 color-info"
                @click="visibleDialogAddSection = true">
                <i class="el-icon-plus" />
              </el-button>
            </div>
            <div class="like-table-wrapper fix-height-320">
              <div
                v-for="(item, key) in data"
                :key="key"
                :class="formData && formData.id === item.id ? 'active' : ''"
                class="like-table-wrapper--item pointer"
                @click="handleEditMenuItem(item)">
                <div class="font-semi-bold" style="flex-grow: 1;">
                  {{ item.name }}
                </div>
                <div
                  v-if="item.menus"
                  class="font-12 color-info">
                  {{ item.menus.length }} items
                </div>
              </div>
            </div>
          </div>

          <div class="border border--info box-shadow-2">
            <div class="flex-container flex-container--content-space-between p-16">
              <div class="font-18 font-semi-bold">
                {{ rootLang.valid_periode }}
              </div>
              <el-button
                type="text"
                class="font-18 color-info"
                @click="handleOpenPeriod">
                <!-- <i :class="visibleDropdownJamOperasional ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" /> -->
                <svg-icon icon-class="edit-2" class="color-primary"/>
              </el-button>
            </div>
            <el-collapse-transition>
              <div v-show="visibleDropdownJamOperasional">
                <!-- <template v-if="stageLevel === 'prod' || stageLevel === 'dash'">
                  <div
                    class="like-table-wrapper--item"
                    style="height: 56px"
                    v-for="item in 7"
                    :key="item">
                    <div class="p-16">{{ rootLang['label_day_' + (item)] }}</div>
                    <div class="full-width text-right">
                      <el-button
                        type="text"
                        class="edit"
                        @click.native.stop="handleEditItem(item)">
                        <span v-if="getLabelDayTime(item) !== 0" class="color-black">{{ getLabelDayTime(item) }}</span>
                        <el-tag v-else type="info" effect="plain" size="mini" style="background-color: transparent">Tidak aktif</el-tag>
                        <svg-icon icon-class="edit-2" />
                      </el-button>
                    </div>
                  </div>
                </template> -->
                <template>
                  <div
                    class="like-table-wrapper--item"
                    style="height: 56px"
                    v-for="item in dataPer"
                    :key="item.day"
                    :label="item">
                    <div class="p-8">{{ item.fday }}</div>
                    <div class="full-width flex-container" style="justify-content: flex-end">
                      <span v-if="getLabelDayTimeNew(item) !== 0" class="color-black" v-html="getLabelDayTimeNew(item)"></span>
                      <span v-if="getLabelDayTimeNew(item) === 0" class="color-black" >Tidak ada period</span>
                    </div>
                    <!-- <div class="mt-8 full-width text-right flex-container" style="justify-content: flex-end">
                      <div v-for="period in item.times" :key="period.time_id" type="text" class="flex-container pointer" >
                        <div :class="period.checked ? 'color-primary--soft--bg radius-5 mr-4 p-2' : 'mr-4 radius-5 p-2'">
                          <span class="color-black">{{ period.fstart_time }} - {{ period.fend_time}}</span>
                          <el-checkbox v-model="period.checked" @change="handleCheckedPeriod(period)" />
                        </div>
                      </div>
                    </div> -->
                  </div>
                </template>
              </div>
            </el-collapse-transition>
          </div>
        </el-col>

        <el-col :md="12">
          <div class="border border--info box-shadow-2">
            <div class="flex-container p-16">
              <div class="mr-8">
                <el-dropdown
                  trigger="click"
                  @command="handleDropdownSection">
                  <span class="el-dropdown-link font-18 color-info">
                    <svg-icon icon-class="more-vertical"></svg-icon>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit">
                      {{ lang.edit }} Section
                    </el-dropdown-item>
                    <el-dropdown-item command="addon">
                      {{ rootLang.show_master_addon }}
                    </el-dropdown-item>
                    <el-dropdown-item command="sorting">
                      Ubah urutan
                    </el-dropdown-item>
                    <el-dropdown-item v-if="visibleItem" command="showgrup">
                      Lihat Grup Saja
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!visibleItem" command="showgrup">
                      Lihat Semua Menu
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" class="color-danger">
                      {{ rootLang.delete }} Section
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="font-18 font-semi-bold mr-8" style="flex-grow: 1;">
                {{ formData.name }}
              </div>
              <!-- <el-button type="success">
                <i class="el-icon-plus"></i> {{ lang.add }}
              </el-button> -->
              <el-dropdown
                trigger="click"
                @command="handleDropdownAdd">
                <el-button type="success">
                  <i class="el-icon-plus"></i> {{ lang.add }}
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="category">
                    Kategory
                  </el-dropdown-item>
                  <el-dropdown-item command="item" :disabled="disableAdd.item">
                    Item
                  </el-dropdown-item>
                  <el-dropdown-item command="addon">
                    Addon
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <template v-if="!visibleSorting">
              <div v-loading="loadingCategory"
                v-if="formData && formData.categories && formData.categories.length"
                class="">
                <div
                  v-for="(item, key) in formData.categories"
                  :key="key">
                  <div class="flex-container mb-8 p-16">
                    <div class="font-bold font-24 flex-container" style="width: 95%">
                      <div class="wrap-text wrap-text--width80">{{ item.name }} ({{ item.menus.length }})</div>
                      <div> </div>
                    </div>
                    <div class="text-right">
                      <el-dropdown
                        trigger="click"
                        @command="handleDropdownCategory">
                        <span class="el-dropdown-link font-18 color-info">
                          <svg-icon icon-class="more-vertical"></svg-icon>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="{action: 'item', data: item }" :disabled="disableAdd.item">
                            Item
                          </el-dropdown-item>
                          <el-dropdown-item :command="{action: 'delete', data: item}" class="color-danger">
                            Hapus Category
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                  <div v-show="visibleItem" class="like-table-wrapper">
                    <div v-for="menu in item.menus" 
                    :key="menu.id" 
                    :class="item.is_available === 1 && menu.is_available === 1 ? 'like-table-wrapper--item pointer' : 'flex-container like-table-wrapper--item pointer color-grey--bg img-grey'"
                    @click="handleEditMenuItemProduct(menu, item)">
                      <div class="mr-8">
                      <div>
                        <el-avatar
                          :src="menu.detail.default_photo"
                          :size="40"
                          shape="square"
                        />
                      </div>
                      </div>
                      <div class="mr-8" style="flex-grow: 1;">
                        <div class="font-bold font-14">
                          {{ menu.alias_name ? menu.alias_name : menu.detail.name }}
                        </div>
                        <div class="color-info font-12">
                          <span v-if="menu.alias_price">
                            {{ menu.falias_price }}
                          </span>
                          <span v-else>
                            {{ menu.detail.sell_price_pos }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right mr-8" style="width: 50%">
                        <el-tag 
                          v-if="menu.is_available === 0" 
                          type="danger" effect="plain" size="mini" 
                          style="background-color: transparent">{{ rootLang.not_available }}</el-tag>
                      </div>
                      <div v-if="availableAddon(menu)" class="mr-12" @click="handleEditMenuItemProduct(menu, item, true)">
                        <div :class="computedInfoAddon(menu)">
                          <svg-icon icon-class="icon-addon"></svg-icon>
                          <span class="font-12 ml-4">Add-On</span>
                          <!-- <svg-icon v-if="menu.is_needed_items === 1" icon-class="information-circle"></svg-icon> -->
                        </div>
                      </div>
                      <el-button type="text">
                        <svg-icon icon-class="edit-2"></svg-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <draggable
                v-model="formData.categories"
                :list="formData.categories"
                :options="{group:{ name:'brand'}}"
                handle=".hand"
                class="dd-list dragArea"
                style="margin-bottom: 100px"
                @change="showSaveSort = true">
                <div class="dd-item" v-for="(item) in formData.categories" :key="item.id">
                  <list-category :item="item" :visible-item="visibleItem" @changeitem="sortItem" />
                </div>
              </draggable>
            </template>
          </div>
        </el-col>
      </el-row>
    </div>

    <offscreen-edit-section-periode
      :show="visibleOffscreenEditSectionPeriode"
      :form-edit="formEditSectionPeriode"
      @cancel="visibleOffscreenEditSectionPeriode = false"
      @save="handleSavePeriod"
    />

    <offscreen-edit-section-menu
      :show="visibleOffscreenEditSectionMenu"
      :form-edit="formEditSectionMenu"
      @showaddon="visibleOffscreenEditAddon = true"
      @cancel="visibleOffscreenEditSectionMenu = false"
      @delete="deleteOneMenu"
      @save="updateMenu"
    />

    <offscreen-edit-addon
      :show="visibleOffscreenEditAddon"
      :form-edit="formEditSectionMenu"
      :grabfoodData="grabfoodData"
      @cancel="visibleOffscreenEditAddon = false"
      @delete="deleteOneMenu"
      @save="updateAddon"
      @showmaster="handleDropdownAdd('addon')"
    />

    <dialog-add-section
      :show="visibleDialogAddSection"
      :form-data="formData"
      :data-periods="dataPeriods"
      @save="saveSection"
      @close="cancelAddSection" />

      <dialog-list-addon
      :show="visibleDialogListAddon"
      :form-data="formData"
      :grabfoodData="grabfoodData"
      @save="saveSection"
      @close="handleCloseAddon" />

    <el-dialog
        :visible.sync="visibleDialogAddItem"
        :show-close="false"
        :close-on-press-escape="false"
        :before-close="handleCancel"
        append-to-body
        custom-class="dialog-grbfd">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ lang.add }} {{ formItem.command === 'item' ? lang.item : lang.category }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancel">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSaveItem" type="success" @click="handleSaveItem" >{{ lang.save }}</el-button>
          </div>
        </div>
        
          <el-form>
            <div v-if="formItem.command === 'item'">
              <el-form-item
                :label="lang.category">
                <select-product-category
                  v-model="formItem.category"
                  :allow-create="false"
                  :is-edit="true"
                  :item-category="formData.categories"
                  class="full-width"
                />
              </el-form-item>

              <el-form-item
                prop="name"
                label="Item">
                <select-product-grabfood
                  :additional-params="additonalParamsSearchProduct"
                  :section="formData"
                  style="width: 100%;"
                  @select="handleSelectProduct"
                />
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item
                :label="lang.category">
                <select-product-category
                  v-model="formItem.category"
                  :allow-create="true"
                  :is-edit="false"
                  class="full-width"
                />
              </el-form-item>
            </div>
          </el-form>

        <div v-if="formItem.command === 'item' && this.formItem.products.length" class="like-table-wrapper">
          <div v-for="(menu, idx) in formItem.products" 
          :key="menu.id" 
          class="like-table-wrapper--item pointer"
          @click="handleEditMenuItemProduct(menu)">
            <div class="mr-8">
              <div>
                <el-avatar
                  :src="menu.photo_md"
                  :size="40"
                  shape="square"
                />
              </div>
            </div>
            <div class="mr-8" style="flex-grow: 1;">
              <div class="font-bold font-14">
                {{ menu.name }}
              </div>
              <div class="color-info font-12">
                <span v-if="menu.alias_price">
                  {{ menu.falias_price }}
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

      <el-dialog
        :visible.sync="visibleDialogEditName"
        :show-close="false"
        :close-on-press-escape="false"
        append-to-body
        custom-class="dialog-grbfd">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ lang.edit }} Section Name
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="visibleDialogEditName = false">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSaveName" type="success" @click="handleSaveNameSection" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <span>{{ lang.name }}</span>
          <el-input v-model="tempSection.name"></el-input>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="showDialogDay"
        :show-close="false"
        :close-on-press-escape="false"
        :before-close="handleCancelDay"
        width="50%"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold">
            {{ rootLang.valid_periode }}
          </h4>
          <div class="btn_save_dialog text-right full-width">
            <el-button type="info" @click="handleCancelDay">{{ lang.cancel }}</el-button>
            <el-button type="success" @click="handleSavePeriodEdit" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <template>
            <!-- <div v-loading="loading" class="flex-container mb-16">
              <div class="full-width">{{ rootLang.all_period_open }}</div>
              <div><el-switch v-model="formData.is_all_periods" :active-value="1" :inactive-value="0" @change="handleCheckAllperiod" /></div>
            </div> -->
            <div v-loading="loading" v-for="item in dataPer" :key="item.day" class="like-table-wrapper--item">
              <div class="full-width">
                <span>{{ item.fday }}</span>
                <div class="flex-container">
                  <div class="mr-8 flex-container" v-for="period in item.times" :key="period.time_id">
                    <div :class="period.checked ? 'color-primary--soft--bg radius-5 mr-4 p-2' : 'mr-4 radius-5 p-2'">
                      {{ period.fstart_time }} - {{ period.fend_time }}
                      <el-checkbox v-model="period.checked" @change="handleCheckedPeriod(period)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </el-dialog>
      <div class="full-width flex-container justify-center">
        <div v-if="showSaveSort" class="floating_div mw-980">
          <floating-div :loading="loadingSort" @confirm="handleSaveSort"></floating-div>
        </div>
      </div>
  </el-dialog>
</template>

<script>
import { fetchSingle, fetchVariantSingle } from '@/api/product'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import OffscreenEditSectionPeriode from './offscreenEditSectionPeriode'
import OffscreenEditSectionMenu from './offscreenEditSectionMenu'
import OffscreenEditAddon from './offscreenEditAddon'
import SelectProductCategory from 'components/SelectProductCategory'
import SelectProductGrabfood from '@/components/SelectProductGrabfood'
import DialogAddSection from './dialogAddSection.vue'
import DialogListAddon from './dialogListAddon.vue'

import { destroyMenu as deleteOneMenu, 
  fetchMenuGrab,
  saveMenuItem, 
  saveMenuCategory, 
  updateTimeSection, 
  updateMenuBatch,
  createSection,
  destroyCategory,
  updateMenuGroup,
  sortCategory,
  sortMenu } from '@/api/thirdParty/grabfood'
import CloseEsc from '@/components/modules/CloseEsc'

import draggable from 'vuedraggable'
import List from './List'
import ListCategory from './sortable/ListCategory.vue'
import FloatingDiv from '../../../FloatingDiv.vue'
import moment from 'moment'

export default {
  mixins: [basicComputedMixin],
  components: {
    OffscreenEditSectionPeriode,
    OffscreenEditSectionMenu,
    OffscreenEditAddon,
    draggable,
    List,
    SelectProductCategory,
    SelectProductGrabfood,
    DialogAddSection,
    OffscreenEditAddon,
    DialogListAddon,
    CloseEsc,
    ListCategory,
    FloatingDiv
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    selectedSection: {
      type: Object,
      default: null
    },
    grabfoodData: {
      type: Object,
      default: null
    },
    dataPeriods: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      formData: {},
      visibleDropdownJamOperasional: true,
      selectedDays: [],
      visibleOffscreenEditSectionPeriode: false,
      formEditSectionPeriode: {},
      visibleOffscreenEditSectionMenu: false,
      formEditSectionMenu: {
        product_data: {}
      },
      visibleDialogAddItem: false,
      formItem: {
        category: '',
        products: [],
        command: ''
      },
      loadingSaveItem: false,
      visibleDialogAddSection: false,
      formSection: {
        selected_days: [],
        name: ''
      },
      visibleOffscreenEditAddon: false,
      visibleDialogListAddon: false,
      tempCategory: {},
      loadingCategory: false,
      additonalParamsSearchProduct: [],
      visibleDialogEditName: false,
      loadingSaveName: false,
      tempSection: {},
      visibleSorting: false,
      visibleItem: true,
      showSaveSort: false,
      loadingSort: false,
      tempSortItem: [],
      tempData: [],
      showDialogDay: false,
      loading: false
    }
  },

  watch: {
    selectedSection(selectedSection) {
      if (selectedSection) {
        if (!this.formData) {
          this.handleEditMenuItem(selectedSection)
        } else {
          this.data.map(i => {
            if (i.id === this.formData.id) {
              this.handleEditMenuItem(i)
            }
          })
        }
      }
    },

    data(item) {
      console.log('data', item)
      if (item) {
        if (!this.formData) {
          this.handleEditMenuItem(item)
        } else {
          item.map(i => {
            if (i.id === this.formData.id) {
              this.handleEditMenuItem(i)
            }
          })
        }
      }
    },

    show(show) {
      if (show) {
        this.formData = { ...this.selectedSection}

        this.getCheckedPeriod()
      }
    }
  },

  computed: {
    disableAdd () {
      let item = true
      // let addon = true
      if (this.formData.categories && this.formData.categories.length) {
        item = false
      }
      return ({
        item: item
      })
    },

    dataPer () {
      console.log('dat', data)
      let data = []
      this.dataPeriods.map(i => {
        if (i.period_type === 1) {
          data.push(i)
        }
      })
      
      data.map(i => {
        if (i.times !== null && i.times.length) {
          i.active = false
          i.times.map(j => {
            j.checked = false
            if (this.tempData.length) {
              this.tempData.map(k => {
                if (j.time_id === k.time_id) {
                  j.checked = true
                  i.active = true
                }
                console.log('temp', j.time_id)
                console.log('temp', j.checked)
              })
            }
          })
        }
      })
      console.log('datttt', data)
      return data
    },
  },

  methods: {
    // handleCancel() {
    //   this.$emit('cancel')
    // },

    handleEditMenuItem(item) {
      
      this.selectedDays = []
      this.formData = { ...item }
      if (this.formData.days_available && this.formData.days_available.length) {
        this.formData.days_available.map(day => {
          this.selectedDays.push(day.day_id)
        })
      }

      this.visibleOffscreenEditSectionPeriode = false
      this.visibleOffscreenEditSectionMenu = false
      this.visibleOffscreenEditAddon = false

      this.getCheckedPeriod()
    },

    handleDropdownSection(command) {
      if (command === 'delete') {
        this.$emit('destroy-section', this.formData.id)
      } else if (command === 'edit') {
        if (this.formData.id) {
          this.tempSection = { ...this.formData}
          this.visibleDialogEditName = true
        } else {
          this.$message({
            type: 'error',
            message: this.rootLang.please_select_section
          })
        }
      } else if (command === 'addon') {
        this.visibleDialogListAddon = true
      } else if (command === 'sorting') {
        this.visibleSorting = !this.visibleSorting
      } else if (command === 'showgrup') {
        this.visibleItem = !this.visibleItem
      }
    },

    handleDropdownCategory(command) {
      console.log('trace', command)
      if (command.action === 'item') {
        this.formItem.command = command.action
        this.formItem.category = command.data
        this.visibleDialogAddItem = true
      } else if (command.action === 'delete') {
        this.loadingCategory = true
        this.$confirm('This will permanently delete the data. Continue?', '', {
          confirmButtonText: this.rootLang.delete + ' & ' + this.lang.update,
          cancelButtonText: this.lang.cancel,
          showClose: false,
          type: ''
        }).then(() => {
          let data = {
            id: command.data.id,
            store_grabfood_id: this.grabfoodData.id
          }
          destroyCategory(data).then(async response => {
            // this.formEditSectionMenu = await { ...item, product_data: response.data.data }
            // this.visibleOffscreenEditSectionMenu = true
            this.loadingCategory = false
            this.$emit('refresh')
          }).catch(error => {
            console.log('error', error)
            this.loadingCategory = false
            this.$message({
              type: 'error',
              message: error.string
            })
          })
        }).catch(() => {
          this.loadingCategory = false
        })
      }
    },

    async handleEditItem(index) {
      let day = []
      if (this.formData.days_available && this.formData.days_available.length) {
        day = await this.formData.days_available.filter(day => {
          return day.day_id === index
        })
      }
      if (day.length) {
        this.formEditSectionPeriode = await { ...day[0] }
      } else {
        this.formEditSectionPeriode = {
          day_id: index,
          id: null
        }
      }
      this.visibleOffscreenEditSectionPeriode = true
    },

    getLabelDayTime(itemKey) {
      if (this.formData && this.formData.days_available && this.formData.days_available.length) {
        const day = this.formData.days_available.filter(day => {
          return day.day_id === itemKey
        })
        if (day.length >= 1) {
          if (day[0].times.length > 1) {
            return day[0].times[0].fstart_time + ' ... ' + day[0].times[day[0].times.length - 1].fend_time
          } else if (day[0].times.length === 1) {
            return day[0].times[0].fstart_time + ' - ' + day[0].times[0].fend_time
          } else if (day[0].times.length === 0) {
            return 0
          }
          // else {
          //   return day[0].periodStatus
          // }
        } 
        // else {
        //   return false
        // }
      }
    },

    async handleEditMenuItemProduct(item, category, info) {

      // console.log('ashdgahjsdgajhsdgajhsg');
      console.log('eaeaea', item, category, info);

      this.tempCategory = category
      if (item.product_type === 'Variant') {
        console.log('1111111');
        if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
          this.getSingleGrabMenu(item.id, item, info)
        } else {
          this.getVariantProduct(item.detail.id, item, info)
        }
      } else if (item.product_type === 'Product') {
        console.log('22222');
        if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
          this.getSingleGrabMenu(item.id, item, info)
        } else {
          this.getSingleProduct(item.detail.id, item, info)
        }
      }
    },

    getSingleGrabMenu(itemId, item, info) {
      fetchMenuGrab(itemId).then(async response => {
        console.log(response.data.data);
        this.formEditSectionMenu = await { ...response.data.data }
        // console.log(this.formEditSectionMenu);
        if (!info) {
          this.visibleOffscreenEditSectionMenu = true
        } else {
          this.visibleOffscreenEditAddon = true
        }
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    getSingleProduct(itemId, item, info) {
      fetchSingle(itemId).then(async response => {
        this.formEditSectionMenu = await { ...item, product_data: response.data.data }
        if (!info) {
          this.visibleOffscreenEditSectionMenu = true
        } else {
          this.visibleOffscreenEditAddon = true
        }
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    getVariantProduct(itemId, item, info) {
      fetchVariantSingle(itemId).then(async response => {
        this.formEditSectionMenu = await { ...item, product_data: response.data.data }
        if (!info) {
          this.visibleOffscreenEditSectionMenu = true
        } else {
          this.visibleOffscreenEditAddon = true
        }
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    deleteOneMenu(sectionId) {
      this.$confirm('This will permanently delete the data. Continue?', '', {
        confirmButtonText: this.rootLang.delete + ' & ' + this.lang.update,
        cancelButtonText: this.lang.cancel,
        showClose: false,
        type: ''
      }).then(() => {
        let data = {
          id: sectionId,
          store_grabfood_id: this.grabfoodData.id
        }
        deleteOneMenu(data).then(response => {
          this.$message({
            type: 'success',
            message: response.data.data.message
          })
          this.visibleOffscreenEditSectionMenu = false
          this.$emit('refresh')
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
        })
      }).catch(() => {
      })
    },

    handleDropdownAdd (command) {
      if (command !== 'addon') {
        this.formItem.command = command
        this.visibleDialogAddItem = true
      } else {
        // this.visibleOffscreenEditAddon = true
        this.visibleDialogListAddon = true
      }
    },

    handleSelectProduct (product) {
      // const exist = null
      if (this.formItem.products && this.formItem.products.length) {
        const exist = this.formItem.products.filter(item => {
          return product.id === item.id
        })
        if (!exist.length) {
          this.formItem.products.push(product)
        }
      } else {
        this.formItem.products.push(product)
      }
    },

    handleSaveItem () {

      this.loadingSaveItem = true
      let product = []
      let data = {}
      if (this.formItem.command === 'item') {
        this.formItem.products.map(i => {
          product.push({
            product_type: i.type === 'Product' ? 'P' : i.type === 'Variant' ? 'V' : i.type === 'P' ? 'P' : i.type === 'V' ? 'V' : 'C',
            product_id: i.id,
            is_available: 1,
            alias_name: i.name,
            alias_price: i.alias_price ? i.alias_price : i.sell_price_pos,
            description: i.description,
            is_percentage: 0
          })
        })

        data = {
          store_grabfood_id: this.grabfoodData.id,
          group_id: this.formData.id,
          category: {
            is_alias: 1,
            id: this.formItem.category.id,
            name: this.formItem.category.name
          },
          menu: product
        }

        // if (data.category.is_alias === 0) {
        //   data.category.name = this.formItem.category.name
        // } else if (data.category.is_alias === 1) {
        //   data.category.id = this.formItem.category.id
        // }
      } else {
        let cat = {}
        if (this.formItem.category.id) {
          cat = {
            is_alias: this.formItem.category.is_alias,
            id: this.formItem.category.id,
          }
          if (this.formItem.category.is_alias === '1') {
            cat.name = this.formItem.category.name
          }
        } else {
          cat = {
            is_alias: 1,
            name: this.formItem.category
          }
        }
        data = {
          store_grabfood_id: this.grabfoodData.id,
          group_id: this.formData.id,
          category: cat
        }
      }
      this.formItem.command === 'item' ? this.saveMenuItem(data) : this.saveMenuCategory(data)
    },

    saveMenuItem (data) {
      // console.log('trace', data)
      console.log('asdasdasdasdas', data);
      saveMenuItem(data).then(async response => {
        this.loadingSaveItem = false
        this.visibleDialogAddItem = false
        this.formItem = {
          category: '',
          products: [],
          command: ''
        }
        this.$emit('refresh')
      }).catch(error => {
        this.loadingSaveItem = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    saveMenuCategory (data) {
      // console.log('trace', data)
      saveMenuCategory(data).then(async response => {
        this.loadingSaveItem = false
        this.visibleDialogAddItem = false
        this.formItem = {
          category: '',
          products: [],
          command: ''
        }
        this.$emit('refresh', this.formData)
      }).catch(error => {
        this.loadingSaveItem = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    removeItem (index) {
      this.formItem.products.splice(index, 1)
    },

    handleCancel () {
      this.visibleDialogAddItem = false
      this.formItem = {
        category: '',
        products: [],
        command: ''
      }
    },

    async handleSavePeriod (dataPeriod) {
      // dataPeriod.times.map((i, idx) => {
      //   if (idx > 0) {
      //     i.id = dataPeriod.times[0].id
      //   }
      // })
      // let period = []
      // this.tempData.map(i => { period.push(i.time_id) })
      let data = {}
      // if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        data = { 
          store_grabfood_id: this.grabfoodData.id,
          group_id: this.formData.id,
          periods: dataPeriod
        }
      // } else {
      //   data = {
      //     store_grabfood_id: this.grabfoodData.id,
      //     group_id: this.formData.id,
      //     days: [{
      //       day_number: dataPeriod.day_id,
      //       times: dataPeriod.times
      //     }]
      //   }
      // }
      await updateTimeSection(data).then(async response => {
        // this.loadingSaveItem = false
        this.visibleOffscreenEditSectionPeriode = false
        this.showDialogDay = false
        // this.$message({
        //   type: 'success',
        //   message: 'Berhasil update jam operasional'
        // })
        this.$emit('refresh')
      }).catch(error => {
        // this.loadingSaveItem = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    updateMenu (item) {

      console.log(item);

      this.loadingSection = true
      if (item.product_type === 'Product') {
        item.product_type = 'P'
      } else if (item.product_type === 'Variant') {
        item.product_type = 'V'
      } else if (item.product_type === 'Product Combo') {
        item.product_type = 'C'
      }
      
      if (!item.group_id) {
        // item.product_type = 'P'
        // console.log();
        item.group_id = item.group_menu.id
      }

      if (this.stageLevel === 'dev') {
        item.is_percentage = item.is_percentage
        if (item.is_percentage === 0) {
          item.amount = item.commission_amount
          this.$delete('percentage', item)
        } else if (item.is_percentage === 1) {
          item.percentage = item.commission_amount
          this.$delete('amount', item)
        }
      }

      item.category.is_alias = 1

      let data = {
        store_grabfood_id: this.grabfoodData.id,
        menu: [item]
      }
      updateMenuBatch(data).then(response => {
        this.visibleOffscreenEditSectionMenu = false
        this.visibleOffscreenEditAddon = false
        this.$emit('refresh')
        this.tempCategory = {}
      }).catch(error => {
        // console.log('tr', error)
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    saveSection (data) {
      console.log('asdasdadasd', data)
      data.store_grabfood_id = this.grabfoodData.id
      createSection(data).then(async response => {
        this.loadingSaveItem = false
        this.visibleDialogAddSection = false
        this.formItem = {
          category: '',
          products: [],
          command: ''
        }
        this.$emit('refresh')
      }).catch(error => {
        this.loadingSaveItem = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    cancelAddSection () {
      this.visibleDialogAddSection = false
    },

    updateAddon (item) {
      this.$emit('refresh')
      item.map(i => {
        if (i.id === this.formData.id) {
          this.formData = { ...i}
        }
      })
      this.formData.categories.map(i => {
        if (i.id === this.tempCategory.id) {
          i.menus.map(j => {
            if (j.id === this.formEditSectionMenu.id) {
              this.formEditSectionMenu.addon_group = [ ...j.addon_group]
            }
          })
        }
      })
    },

    availableAddon (item) {
      let hide = []
      if (item.addon_group.length) {
        item.addon_group.map(i => {
          if (i.available_for_menu === 1) {
            hide.push(i.id)
          }
        })
      }
      return hide.length > 0 ? true : false
    },

    handleCloseAddon () {
      this.visibleDialogListAddon = false
      this.$emit('refresh')
      if (this.visibleOffscreenEditSectionMenu) {
        this.visibleOffscreenEditSectionMenu = false
        this.visibleOffscreenEditAddon = false
      }
    },

    computedInfoAddon (menu) {
      let info = ''
      if (menu.is_needed_items === 0) {
        info = menu.is_available === 1 ? 'addon-flag' : 'addon-flag addon-flag--disable' 
      } else {
        info = menu.is_available === 1 ? 'addon-flag addon-flag--info' : 'addon-flag addon-flag--info addon-flag--disable' 
      }
      // info = menu.is_needed_items === 0 ? 'addon-flag' : 'addon-flag addon-flag--info'
      return info
    },
    
    handleSaveNameSection () {
      this.loadingSaveName = true
      let data = {
        store_grabfood_id: this.grabfoodData.id,
        id: this.tempSection.id,
        name: this.tempSection.name
      }
      updateMenuGroup(data).then(async response => {
        this.loadingSaveName = false
        this.visibleDialogEditName = false
        this.tempSection = {}
        this.$emit('refresh')
      }).catch(error => {
        this.loadingSaveName = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    sortItem (data) {
      this.tempSortItem = [ ...data]
      this.showSaveSort = true
    },

    handleSaveSort () {
      if (this.visibleItem) {
        this.saveSortsMenu()
      } else {
        this.saveSortsCategory()
      }
    },

    saveSortsCategory() {
      this.loadingSort = true
      let sortedIds = this.formData.categories.slice(0)
      sortedIds = sortedIds.map((item) => {
        return {id: item.id}
      })
      let data = {
        sorted_ids: sortedIds
      }
      sortCategory(data).then(response => {
        // this.formData = response.data.data
        console.log('sort', response.data.data)
        this.showSaveSort = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loadingSort = false
        this.$emit('refresh')
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

    saveSortsMenu() {
      this.loadingSort = true
      let sortedIds = this.tempSortItem.slice(0)
      sortedIds = sortedIds.map((item) => {
        return {id: item.id}
      })
      let data = {
        sorted_ids: sortedIds
      }
      sortMenu(data).then(response => {
        // this.dataAddonGroup = response.data.data
        this.showSaveSort = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loadingSort = false
        this.$emit('refresh')
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

    handleClose () {
      this.visibleSorting = false
      this.visibleItem = true
      this.$emit('cancel')
    },

    getCheckedPeriod () {
      let data = []
      this.tempData = []
      let tgl = moment().format('YYYY-MM-DD')
      if (this.formData.id && this.formData.days_available !== null && this.formData.days_available.length) {
        this.formData.days_available.map(i => {
          if (i.times !== null && i.times.length) {
            // dataDay.push({
            //   checked: true,
            //   day_id: i.day,
            //   value: i.fday
            // })
            i.times.map(j => {
              data.push({
                checked: true,
                start_time: moment(tgl + ' ' + j.start_time).format('HH:mm'),
                end_time: moment(tgl + ' ' + j.end_time).format('HH:mm'),
                time_id: j.id
              })
            })
          }
        })
      }
      if (data.length) {
        this.tempData = data.filter((v,i,a)=>a.findIndex(t=>(t.time_id === v.time_id))===i)
      }
    },

    handleCheckedPeriod (data) {
      const exist = this.tempData.some(({time_id}) => time_id === data.time_id)
      if (exist) {
        this.tempData.map((i, idx) => {
          if (i.time_id === data.time_id) {
            this.tempData.splice(idx, 1)
          }
        })
        // this.handleSavePeriod()
      } else {
        this.tempData.push(data)
        // this.handleSavePeriod()
      }

      // let period = []
      // this.tempData.map(i => { period.push(i.time_id) })
      // this.handleSavePeriod(period)
      
      // this.$forceUpdate()
    },

    handleOpenPeriod () {
      // this.visibleDropdownJamOperasional = !this.visibleDropdownJamOperasional
      // this.$forceUpdate()
      this.getCheckedPeriod()
      // this.tempPeriod = [ ...this.tempData]
      this.showDialogDay = true
    },

    handleCancelDay () {
      // this.tempData = [ ...this.tempPeriod]
      this.getCheckedPeriod()
      this.showDialogDay = false
    },

    handleSavePeriodEdit () {
      let period = []
      this.tempData.map(i => { period.push(i.time_id) })
      this.handleSavePeriod(period)
    },

    getLabelDayTimeNew(itemKey) {
      if (itemKey.active && itemKey.times !== null && itemKey.times.length >= 1) {
        console.log('kl', itemKey.fday)
        if (itemKey.times.length > 1) {
          let datimes = itemKey.times.filter(i => { if(i.checked) { return i }})
          if (datimes.length > 1) {
            return datimes[0].fstart_time + '<span class="color-primary"> ••• </span>' + datimes[datimes.length - 1].fend_time
          } else if (datimes.length === 1) {
            return datimes[0].fstart_time + ' - ' + datimes[0].fend_time
          }
        } else if (itemKey.times.length === 1) {
          return itemKey.times[0].fstart_time + ' - ' + itemKey.times[0].fend_time
        } else if (itemKey.times.length === 0) {
          return 0
        }
      } else {
        return 0
      }
    },
  }
}
</script>
