<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-center color-white--bg" style="z-index: 10">
          Add-on Produk
          <close-esc :hideEsc="true" @close="$emit('cancel')" />
        </div>

        <div v-if="!formEdit.addon_group.length || showEmptyAddon" v-loading="loadingAddon"
          class="no-data-wrapper p-32 align-center" style="display: flex; flex-direction: column;">
          <img src="/static/img/no_data_addon_product.svg" class="no-data-image">
          <div class="text-center word-break" style="width: 360px" >Duh, Add-On untuk produk ini belum ada. Pilih dari daftar Add-On sesuai kebutuhan produk</div>
          <!-- <el-button
            :loading="loadingGetAddon"
            type="primary"
            class="btn-block mt-24"
            @click="getAddonGroup">
            {{ lang.add }} Add-On
          </el-button> -->
        </div>

        <div v-else v-loading="loadingAddon" class="p-24">
          <template v-for="(item, index) in formEdit.addon_group">
            <div v-if="item.available_for_menu === 1" :key="item.id">
              <div v-if="item.needed_items > 0" class="color-warning--soft--bg flex-container radius-10 mb-24 p-8">
                <div class="container-icon">
                  <svg-icon icon-class="information-circle" class="color-warning"></svg-icon>
                </div>
                <div class="p-8 font-14">
                  Jumlah add-on untuk <span class="font-bold">{{ item.name }} saat ini kurang {{ item.needed_items }}</span> nih!
                </div>
              </div>
              <div style="flex-grow: 1;">
                <div class="flex-container mb-8 p-8">
                  <div class="font-bold font-24 full-width">
                    {{ item.name }}
                  </div>
                  <div v-if="item.is_must_selected === 0" class="font-12 full-width text-right">Opsional • Maks {{ item.selected_item_max }}</div>
                  <div v-if="item.is_must_selected === 1" class="font-12 full-width text-right">Harus pilih • Min {{ item.selected_item_min }} • Maks. {{ item.selected_item_max }}</div>
                  <popover-confirmation 
                    :data="item"
                    :visible="visibleAddonGrup" 
                    @cancel="cancelSwitch('grup', item, index)"
                    @confirm="confirmSwitch('grup', item, index)"
                    class="mr-8"/>

                    <!-- set display none, jika show/diremove popover tidak jalan -->
                    <el-switch
                      v-model="item.is_available"
                      :active-value="1"
                      :inactive-value="0"
                      class="mr-8"
                      style="display: none"
                      @change="beforeUpdateCategory('category', item, item.is_available, index)">
                    </el-switch>
                    <!-- set display none, jika show/diremove popover tidak jalan -->

                  <!-- <el-switch
                    v-model="item.is_available"
                    :active-value="1"
                    :inactive-value="0"
                    class="mr-8"
                    @change="beforeUpdateCategory('category', item, item.is_available, index)">
                  </el-switch> -->
                </div>
                <div class="like-table-wrapper mb-24">
                  <template v-for="(menu, idx) in item.addon_items">
                    <div v-if="menu.available_for_menu === 1" :key="menu.id"
                    :class="menu.is_available === 1 ? 'flex-container like-table-wrapper--item' : 'flex-container like-table-wrapper--item color-grey--bg img-grey'">
                      <div class="full-width flex-container">
                        <div style="flex-grow: 1;">
                          <div class="font-bold font-14">
                            {{ menu.name }}
                          </div>
                          <div class="color-info font-12">
                            <span v-if="menu.origin_price">
                              {{ menu.forigin_price }}
                            </span>
                            <span v-if="menu.origin_qty">
                              {{ menu.origin_qty }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="full-width text-right">
                        <el-tag v-if="menu.is_available === 0" type="danger" effect="plain" size="mini" style="background-color: transparent">Tidak tersedia</el-tag>
                        
                        <popover-confirmation 
                          :data="menu"
                          :visible="visibleAddon" 
                          @cancel="cancelSwitch('menu', menu, index, idx)"
                          @confirm="confirmSwitch('menu', menu, index, idx)"/>

                        <!-- set display none, jika show/diremove popover tidak jalan -->
                        <el-switch
                          v-model="menu.is_available"
                          :active-value="1"
                          :inactive-value="0"
                          style="display: none"
                          @change="beforeUpdateCategory('menu', menu, menu.is_available, index, idx)">
                        </el-switch>
                        <!-- set display none, jika show/diremove popover tidak jalan -->
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
        

        <div class="offscreen-right-sidebar--footer">
          
          <el-button
            type="primary"
            class="btn-block mt-24"
            @click="getAddonGroup">
            {{ rootLang.select }} Add-On
          </el-button>
        </div>
      </div>

      <el-dialog
        :visible.sync="showAddonList"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleCancel"
        append-to-body
        custom-class="dialog-grbfd">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ lang.add }} Add-On
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancel">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSaveItem" type="success" @click="handleSaveItem" >{{ lang.save }}</el-button>
          </div>
        </div>
        
        <div>
          <template v-for="(item, idx) in dataAddonGroup">
            <div :key="item.id">
              <div v-if="item.needed_items > 0" class="color-warning--soft--bg flex-container radius-10 mb-16 p-8">
                <div class="container-icon">
                  <svg-icon icon-class="information-circle" class="color-warning"></svg-icon>
                </div>
                <div class="p-8 font-14">
                  Jumlah add-on untuk <span class="font-bold">{{ item.name }} saat ini kurang {{ item.needed_items }}</span> nih!
                </div>
              </div>
              <el-button
                v-if="item.needed_items > 0"
                type="primary"
                class="btn-block mb-24"
                @click="showMasterAddon">
                {{ lang.add }} Add-On
              </el-button>
              <div class="flex-container" style="height: 40px;">
                <div class="p-8">
                  <el-checkbox v-model="checkAll[idx]" @change="handleCheckAllChange(item, idx)" :disabled="disableIfEmpty(item)"></el-checkbox>
                </div>
                <div class="ml-8 font-18 font-bold full-width">{{ item.name }}</div>
                <div v-if="item.is_must_selected === 0" class="font-12 full-width text-right">Opsional • Min {{ item.selected_item_min }} • Maks {{ item.selected_item_max }}</div>
                <div v-if="item.is_must_selected === 1" class="font-12 full-width text-right">Harus pilih • Min {{ item.selected_item_min }} • Maks. {{ item.selected_item_max }}</div>
              </div>
              <el-checkbox-group v-model="checkedAddon" @change="handleCheckedAddon(item, idx)" class="like-table-wrapper mb-24">
                <el-checkbox v-for="addon in item.addon_items" :label="addon.id" :key="addon.id" class="checkbox-add-addon">
                  <div class="like-table-wrapper--itemaddon pointer" @click="handleEditAddon(addon, item)">
                  <div class="flex-container">
                    <div class="full-width" style="flex-grow: 1;">
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
                    <!-- <el-button type="text">
                      <svg-icon icon-class="edit-2"></svg-icon>
                    </el-button> -->
                  </div>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </div>
      </el-dialog>

      <dialog-list-addon
        :show="visibleDialogListAddon"
        :form-data="formData"
        :grabfoodData="grabfoodData"
        @close="visibleDialogListAddon = false" />

    </div>
  </transition>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import InputMoney from '@/components/modules/InputMoney'
import DialogListAddon from './dialogListAddon.vue'

import { fecthAddonGroup, 
  updateMenuBatch,
  saveAddonItem,
  saveAddonGroup } from '@/api/thirdParty/grabfood'
import PopoverConfirmation from '../../../../PopoverConfirmation.vue'

export default {
  components: {
    CloseEsc,
    InputMoney,
    DialogListAddon,
    PopoverConfirmation
  },
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    formEdit: {
      type: Object,
      default: null
    },
    grabfoodData: {
      type: Object,
      default: null
    },
    setupItem: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        product_data: {},
        addon_group: []
      },
      showAddonList: false,
      dataAddonGroup: [],
      isIndeterminate: [],
      checkAll: [],
      checkedAddon: [],
      loadingSaveItem: false,
      loadingAddon: false,
      loadingGetAddon: false,
      visibleDialogListAddon: false,
      visibleAddon: false,
      visibleAddonGrup: false
    }
  },

  watch: {
    formEdit(formEdit) {
      console.log('tracert', formEdit)
      if (formEdit) {
        this.formData = { ...formEdit }
        console.log(this.formData)
      }
    }
  },

  computed: {
    dataAddon () {
      let data = []
      if (this.formEdit.addon_group.length) {
        this.formEdit.addon_group.map(group => {
          if (group.addon_items.length) {
            group.addon_items.map(addon => {
              data.push(addon)
            })
          }
        })
      }
      return data
    },

    showEmptyAddon () {
      let hide = []
      if (this.formEdit.addon_group.length) {
        this.formEdit.addon_group.map(i => {
          if (i.available_for_menu === 0) {
            hide.push(i.id)
          }
        })
        if (hide.length === this.formEdit.addon_group.length) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    handleDeleteItemFromEdit () {
      this.$emit('delete', this.formEdit.id)
    },

    getAddonGroup () {
      this.loadingGetAddon = true
      this.checkAll = []
      fecthAddonGroup().then(async response => {
        this.dataAddonGroup = [ ...response.data.data]
        this.dataAddonGroup.map(i => {
        //   i.available = false
        //   if (i.is_available === 1) {
        //     i.available = true
        //   }
        //   if (i.addon_items && i.addon_items.length) {
        //     i.addon_items.map(j => {
        //       j.available = false
        //       if (j.is_available === 1) {
        //         j.available = true
        //       }
        //     })
        //   }
        if (i.addon_items.length) {
          i.addon_items.map(j => {
            j.disable = false
          })
        }
        this.checkAll.push(false)
        this.isIndeterminate.push(true)
        })
        if (this.formEdit.addon_group.length) {
          this.getCheckedAddon()
        }
        this.showAddonList = !this.showAddonList
        this.loadingGetAddon = false
      }).catch(error => {
        console.log('tracerrror', error)
        this.loadingGetAddon = false
        // this.visibleDialogListAddon = true
        // this.$message({
        //   type: 'error',
        //   message: error.string
        // })
        let message = 'Anda akan dialihkan ke halaman tambah Add-On, silahkan tambahkan Grup & Add-On terlebih dahulu lalu kembali kehalaman ini untuk menambahkan di produk'
        this.$confirm(message, 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'Warning'
        }).then(() => {
          this.visibleDialogListAddon = true
        }).catch(() => {
          // console.log('troce')
        })
      })
    },

    handleCheckAllChange(val, idx) {
      // console.log('trace', this.checkAll[idx])
      if (!this.checkAll[idx]) {
        val.addon_items.map(i => {
          let index = this.checkedAddon.indexOf(i.id)
          console.log('trace', index)
          if (index >= 0) {
            this.checkedAddon.splice(index, 1)
          }
        })
      } else {
        const exist = []
        val.addon_items.map(i => {
          // const ex = this.checkedAddon.filter( addon => {
          //   return i.id === addon
          // })
          // if (ex.length) {
          //   exist.push(ex)
          // }
          let index = this.checkedAddon.indexOf(i.id)
          // console.log('trace', index)
          if (index >= 0) {
            this.checkedAddon.splice(index, 1)
          }
          this.checkedAddon.push(i.id)
        })
      }
    },

    handleCheckedAddon (val, idx) {
      // console.log('trace', val)
      // console.log('trace', this.checkedAddon)
      const exist = []
      val.addon_items.map(i => {
        const ex = this.checkedAddon.filter( addon => {
          return i.id === addon
        })
        if (ex.length) {
          exist.push(ex)
        }
      })
      if (exist.length === val.addon_items.length) {
        this.checkAll[idx] = true
      } else if (exist.length < val.addon_items.length) {
        console.log('trace', exist.length)
        this.checkAll[idx] = false
      } else {
        this.checkAll[idx] = false
      }
      this.$forceUpdate()
      // this.isIndeterminate[idx] = exist.length > 0 && exist.length < val.addon_items.length;
    },

    handleSaveItem() {
      // this.loadingSaveItem = true
      if (this.setupItem) {
        let data = []
        let addonItems = []
        this.dataAddonGroup.map(group => {
          if (group.addon_items.length) {
            group.addon_items.map(item => {
              this.checkedAddon.map(i => {
                if (i === item.id) {
                    let index = data.findIndex(j => j.id === group.id)

                    if (index === -1) {
                      data.push({
                        id: group.id,
                        is_available: 1,
                        is_must_selected: group.is_must_selected,
                        name: group.name,
                        selected_item_max: group.selected_item_max,
                        view_sort: group.view_sort,
                        available_for_menu: 1,
                        addon_items: []
                      })
                    }

                  addonItems.push({
                    id: i,
                    group_id: group.id,
                    is_available: 1,
                    is_hide: 1,
                    available_for_menu: 1,
                    name: item.name
                  })
                }
              })
            })
          }
        })

        data.map(group => {
          addonItems.map(item => {
            if (group.id === item.group_id) {
              group.addon_items.push(item)
            }
          })
        })
        // console.log('trace', data)
        this.showAddonList = false
        this.checkedAddon = []
        this.checkAll = []
        this.$emit('save', data)
      } else {
        let addon = []
        this.checkedAddon.map(i => {
          addon.push({
            id: i,
            is_available: 1,
            is_hide: 1
          })
        })

        let data = addon

        if (this.dataAddon.length) {
          // addon.map(item => {
          //   let dd = this.dataAddon.filter(i => { return item.id === i.id })
          //   if (!dd.length) {
          //     data.push(item)
          //   }
          // })
          // addon = [ ...data]
          // data = addon
          this.dataAddon.map(i => {
            let index = addon.findIndex(j => j.id === i.id)

            if (index === -1) {
              data.push({
                id: i.id,
                is_available: i.is_available,
                is_hide: 0
              })
            }
          })
        }

        //
        // let aa = [{id: 1, name: 'a'},{id: 2, name: 'b'}]
        // let bb = [{id: 3, name: 'c'},{id: 2, name: 'b'}]
        // let d = bb

        // aa.map(i => {
        //   let index = bb.findIndex(x => x.id === i.id)
          
        //   if (index === -1) {
        //     d.push({
        //       id: i.id,
        //       name: i.name
        //     })
        //   }
        // })
        // console.log('index', d)
        //
        
        console.log('trace', data)

        this.formData = { ...this.formEdit }
        this.formData.addon_item = data
        
        this.showAddonList = false
        this.$delete(this.formData, 'addon_group')
        // this.$emit('save', this.formData)
        
        this.updateMenu(this.formData)
      }
    },

    updateMenu (item) {
      this.loadingAddon = true
      if (item.product_type === 'Product') {
        item.product_type = 'P'
      } else if (item.product_type === 'Variant') {
        item.product_type = 'V'
      } else if (item.product_type === 'Product Combo') {
        item.product_type = 'C'
      }

      item.category.is_alias = 1

      let data = {
        store_grabfood_id: this.grabfoodData.id,
        menu: [item]
      }
      updateMenuBatch(data).then(response => {
        this.checkedAddon = []
        this.checkAll = []
        this.$emit('save', response.data.data.group_menu)
        this.loadingAddon = false
      }).catch(error => {
        // console.log('tr', error)
        this.loadingAddon = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    updateItemAddon (item, index, idx) {
      this.loadingAddon = true

      if (!this.setupItem) {
        item.store_grabfood_id = this.grabfoodData.id
        saveAddonItem(item).then(response => {
          this.$emit('save', response.data.data.group_menu)
          this.loadingAddon = false
        }).catch(error => {
          // console.log('tr', error)
          this.loadingAddon = false
          this.$message({
            type: 'error',
            message: error.string
          })
          this.cancelSwitch('menu', item, index, idx)
        })
      } else {
        this.loadingAddon = false
        this.$emit('update', 'addon', item, index, idx)
      }
    },

    updateAddonGroup (item, index) {
      this.loadingAddon = true
      // console.log(item)

      if (!this.setupItem) {
        let data = { ...item}
        data.store_grabfood_id = this.grabfoodData.id
        data.must_be_selected = item.is_must_selected
        saveAddonGroup(data).then(response => {
          this.$emit('save', response.data.data.group_menu)
          this.loadingAddon = false
        }).catch(error => {
          // console.log('tr', error)
          this.loadingAddon = false
          this.$message({
            type: 'error',
            message: error.string
          })
          this.cancelSwitch('grup', item, index)
        })
      } else {
        item.addon_items.map(i => {
          i.is_available = item.is_available
        })
        this.loadingAddon = false
        this.$emit('update', 'category', item)
      }
    },

    beforeUpdateCategory (block, item, available, index, idx) {
      let message = ''
      if (available === 0) {
        message = block === 'category' ? 'Semua Add-On di ' + item.name + ' akan "Tidak tersedia" di menu GrabFood' : 'Add-On ' + item.name + ' akan "Tidak tersedia" di menu GrabFood'
      } else {
        message = block === 'category' ? 'Semua Add-On di ' + item.name + ' akan "Tersedia" di menu GrabFood' : 'Add-On ' + item.name + ' akan "Tersedia" di menu GrabFood'
      }
      
      this.$confirm(message, available === 0 ? 'Warning' : 'info', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: available === 0 ? 'Warning' : 'info'
      }).then(() => {
        if (block === 'category') {
          let addon = []
          console.log('trace', item.available_for_menu)
          // if (item.available_for_menu === 0) {
            item.addon_items.map(itemaddon => {
              addon.push({
                id: itemaddon.id,
                is_available: item.is_available,
                is_hide: item.available_for_menu
              })
            })
          // }
          this.formData = { ...this.formEdit }
          this.formData.addon_item = addon
          this.$delete(this.formData, 'addon_group')
          // console.log('item', addon)
          // this.updateMenu(this.formData)
          this.updateAddonGroup(item)
        } else if (block === 'menu') {
          let addon = {
            id: item.id,
            is_available: item.is_available,
            // is_hide: item.available_for_menu,
            alias_price: item.alias_price
          }
          this.formData = { ...this.formEdit }
          this.formData.addon_item = addon
          this.$delete(this.formData, 'addon_group')
          // this.updateMenu(this.formData)
          this.updateItemAddon(item, index, idx)
        }
        
      }).catch(() => {
        // console.log('troce')
        block === 'category' ?
        this.formEdit.addon_group[index].is_available = item.is_available === 1 ? 0 : 1 :
        this.formEdit.addon_group[index].addon_items[idx].is_available = item.is_available === 1 ? 0 : 1
        // this.selectedSection.categories[index].is_available = item.is_available === 1 ? 0 : 1
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled'
        // })
      })
    },

    getCheckedAddon () {
      let item = []
      this.formEdit.addon_group.map(group => {
        if (group.addon_items.length) {
          group.addon_items.map(addon => {
            if (addon.available_for_menu === 1) {
              item.push(addon.id)
            }
          })
        }
      })
      this.checkedAddon = [...new Set(item)]

      this.dataAddonGroup.map((groupaddon, idx) => {
        this.formEdit.addon_group.map(group => {
          if (groupaddon.id === group.id) {
            if (groupaddon.addon_items.length === group.addon_items.length && group.available_for_menu === 1) {
              this.checkAll[idx] = true
            }
          }
        })
      })
    },

    handleCancel () {
      this.showAddonList = false
      this.checkAll = []
      this.checkedAddon = []
    },

    showMasterAddon () {
      if (this.setupItem) {
        this.visibleDialogListAddon = true
      }
      this.$emit('showmaster')
      this.showAddonList = false
    },

    cancelSwitch (block, item, index, idx) {
      block === 'grup' ?
        this.formEdit.addon_group[index].is_available = item.is_available === 1 ? 0 : 1 :
        this.formEdit.addon_group[index].addon_items[idx].is_available = item.is_available === 1 ? 0 : 1
    },

    confirmSwitch (block, item, index, idx) {
      if (block === 'grup') {
          let addon = []
          console.log('trace', item.available_for_menu)
          // if (item.available_for_menu === 0) {
            item.addon_items.map(itemaddon => {
              addon.push({
                id: itemaddon.id,
                is_available: item.is_available,
                is_hide: item.available_for_menu
              })
            })
          // }
          this.formData = { ...this.formEdit }
          this.formData.addon_item = addon
          this.$delete(this.formData, 'addon_group')
          // console.log('item', addon)
          // this.updateMenu(this.formData)
          this.updateAddonGroup(item, index)
        } else if (block === 'menu') {
          let addon = {
            id: item.id,
            is_available: item.is_available,
            // is_hide: item.available_for_menu,
            alias_price: item.alias_price
          }
          this.formData = { ...this.formEdit }
          this.formData.addon_item = addon
          this.$delete(this.formData, 'addon_group')
          // this.updateMenu(this.formData)
          this.updateItemAddon(item, index, idx)
        }
    },

    disableIfEmpty (item) {
      if (item.addon_items.length) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
