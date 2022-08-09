<template>
  <div class="flex-container justify-center">
    <!-- <div class="innerpage-fullscreen--header">
      <el-button
        class="innerpage-fullscreen--back"
        type="text"
        @click="$router.push({
          path: '/service-activation-v2'
        })">
        <svg-icon icon-class="arrow-left" />
      </el-button>
      <h4 class="innerpage-fullscreen--title">Grabfood</h4>
    </div> -->

    <div
      v-loading="loading"
      class="innerpage-fullscreen--body text-left" style="margin-top: unset">
      <div class="flex-container flex-container--content-space-between mb-16">
        <div class="font-24 font-semi-bold">
          Daftar Menu
        </div>
        <el-button
          type="primary"
          @click="visibleDialogEditSection = true">
          Ubah Menu
        </el-button>
      </div>

      <div class="box-shadow-2 border border--grey radius-2 p-8 mb-8">
        <div class="flex-container flex-container--content-space-between">
          <div class="flex-container full-width">
            <div class="flex-container full-width">
              <div class="mr-8">
                <el-dropdown
                  trigger="click"
                  @command="handleDropdownSection">
                  <span class="el-dropdown-link font-20 color-info">
                    <svg-icon icon-class="more-vertical"></svg-icon>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit">
                      Edit Section
                    </el-dropdown-item>
                    <el-dropdown-item command="addon">
                      Lihat Daftar Addon
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" class="color-danger">
                      Hapus Section
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div>
                <div style="width: 220px;">
                  <el-select
                    v-model="selectedSection"
                    value-key="id"
                    filterable
                    class="border-null"
                    style="width: 100%;"
                    @change="handleSelectedSectionChange">
                    <el-option
                      v-for="item in optionSections"
                      :key="item.id"
                      :value="item"
                      :label="item.name">
                      {{ item.name }}
                    </el-option>
                  </el-select>
                </div>
                <div class="font-12 color-info">
                  Menu di Grab saat ini
                </div>
              </div>
            </div>
          </div>
          <div>
            <el-select
              v-model="selectedDay"
              class="el-selectday">
              <el-option
                v-for="day in selectedSection.days_available"
                :key="day.id"
                :value="day.day_id"
                :label="day.day_name"
              />
            </el-select>
          </div>
        </div>
      </div>

      <div class="flex-container flex-container--content-space-between mb-12">
        <div class="color-info font-12">
          <svg-icon icon-class="alert-circle" /> Menu sekarang ditampilkan berdasarkan <strong>{{ selectedSection.name }}</strong>
        </div>
        <div v-if="dataLogForView.length" class="color-info font-12 pointer" @click="visibleLogs = true">
          <svg-icon icon-class="clock" /> Terakhir update ke GrabFood pada <strong>{{ dataLogForView.faction_time }} oleh {{ dataLogForView.user_name }}</strong>
        </div>
      </div>

      <div class="mb-16">
        <div class="color-grey--soft--bg p-16 justify-center">
          <div v-if="getTimeSection(selectedDay).length" class="flex-container">
            <div v-for="time in getTimeSection(selectedDay)" :key="time.id" class="font-16 full-width text-center">
              {{ time.fstart_time }} - {{ time.fend_time }}
            </div>
          </div>
          <div v-else class="text-center font-16">
            <span>Tidak Aktif</span>
          </div>
        </div>
      </div>

      <div v-if="infoMiscAddon(data).data.length > 0" class="color-warning--soft--bg flex-container radius-10 mb-24 p-8">
        <div class="container-icon">
          <svg-icon icon-class="information-circle" class="color-warning"></svg-icon>
        </div>
        <div class="p-8 font-14">
          Add-on untuk <span class="font-bold">{{ infoMiscAddon(data).name }}</span> masih ada yang kurang nih. Coba cek add-on yang ditandai dengan tanda "!". Selama pesan ini muncul, update ke GrabFood tidak dapat dilakukan.
        </div>
      </div>

      <div v-if="selectedSection.categories && selectedSection.categories.length" v-loading="loadingSection">
        <div v-for="(item, index) in selectedSection.categories"
          :key="item.id">
          <div style="flex-grow: 1;">
            <div class="flex-container mb-8 p-8">
              <div class="font-bold font-24 full-width">
                {{ item.name }}
              </div>
              <el-switch
                v-model="item.is_available"
                :active-value="1"
                :inactive-value="0"
                class="mr-8"
                @change="beforeUpdateCategory('category', item, index)">
              </el-switch>
            </div>
            <div class="like-table-wrapper mb-24">
              <div v-for="(menu, idx) in item.menus"
              :key="menu.id"
              :class="item.is_available === 1 && menu.is_available === 1 ? 'flex-container like-table-wrapper--item' : 'flex-container like-table-wrapper--item color-grey--bg img-grey'">
                <div class="full-width flex-container">
                  <div class="mr-8">
                    <div>
                      <el-avatar
                        :src="menu.detail.default_photo"
                        :size="40"
                        shape="square"
                      />
                    </div>
                  </div>
                  <div style="flex-grow: 1;">
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
                </div>
                <div class="text-right mr-8" style="width: 30%">
                  <el-tag 
                    v-if="menu.is_available === 0" 
                    type="danger" effect="plain" size="mini" 
                    style="background-color: transparent">{{ rootLang.not_available }}</el-tag>
                </div>
                <div v-if="availableAddon(menu)" class="px-8">
                    <div v-if="menu.is_needed_items === 0" :class="item.is_available === 1 && menu.is_available ? 'addon-flag pointer' : 'addon-flag addon-flag--disable pointer'" @click="editAddon(menu)">
                      <svg-icon icon-class="icon-addon"></svg-icon>
                      <span class="font-12 ml-4">Add-On</span>
                    </div>
                    <div v-else :class="item.is_available === 1 && menu.is_available ? 'addon-flag addon-flag--info pointer' : 'addon-flag addon-flag--disable pointer'" @click="editAddon(menu)">
                      <svg-icon icon-class="icon-addon"></svg-icon>
                      <span class="font-12 ml-4 mr-4">Add-On</span>
                      <svg-icon icon-class="information-circle"></svg-icon>
                    </div>
                  </div>
                <div>
                  <el-switch
                    v-model="menu.is_available"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="item.is_available ? false : true"
                    @change="beforeUpdateCategory('menu', menu, index, idx)">
                  </el-switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center color-info">
        Belum ada menu yang ditambahkan
      </div>
    </div>

    <dialog-edit-section
      :show="visibleDialogEditSection"
      :data="editData"
      :selected-section="selectedSection"
      :grabfood-data="grabfoodData"
      :data-periods="dataPeriods"
      @cancel="handleCancel"
      @destroy-section="destroySection"
      @refresh="refreshData"
    />

    <offscreen-edit-addon
      :show="visibleOffscreenEditAddon"
      :form-edit="formEditSectionMenu"
      :grabfoodData="grabfoodData"
      @cancel="visibleOffscreenEditAddon = false"
      @save="updateAddon"
      @showmaster="visibleDialogListAddon = true"
    />

    <dialog-list-addon
      :show="visibleDialogListAddon"
      :form-data="formData"
      :grabfoodData="grabfoodData"
      @close="refreshData" />

    <transition name="el-zoom-in-center">
      <div
        v-if="visibleLogs"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            History Update GrabFood
            <close-esc @close="visibleLogs = false" />
          </div>

          <div style="height: 80%; max-height: calc(90vh - 48px); overflow: auto">
            <div v-loading="loadingLogs" v-for="(item, idx) in dataLogs" :key="idx" class="like-table-wrapper">
              <div v-for="data in dataLogs[idx]" :key="data.id" class="like-table-wrapper--item">
                <template>
                  <div class="font-bold full-width">{{ data.user_name }}</div>
                  <div class="full-width text-right">{{ data.faction_time }}</div>
                </template>
              </div>
              <div v-if="dataLogs.length > 1" class="text-center p-8">page {{ idx + 1 }}</div>
            </div>
            <div class="load-more mt-24" v-if="moreLink" v-loading="loadingLogs">
              <el-button
                :disabled="disabledButton"
                @click="loadMore"
                class="btn-block">
                {{ $lang[langId].load_more }}
              </el-button>
            </div>
          </div>
          
        </div>
      </div>
    </transition>

    <div class="floating_div text-left" style="width: 100%; max-width: 793px;">
      <floating-div :on-grab="true" :loading="loadingUpdate" @confirm="updateTograb"></floating-div>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { getDayInteger } from '@/utils/helpers'
import { 
  fetchAllGroupByStore, 
  destroyGroup as destroySection, 
  updateMenuCategory, 
  fetchByStore as fetchGrabfoodStore,
  updateMenuBatch,
  updateGrab,
  getUpdateLogs,
  getGrabPeriodStore as getDataPeriod } from '@/api/thirdParty/grabfood'
import DialogEditSection from './dialogEditSection'
import FloatingDiv from '../../../FloatingDiv'
import CloseEsc from '@/components/modules/CloseEsc'
import OffscreenEditAddon from './offscreenEditAddon'
import DialogListAddon from './dialogListAddon.vue'

export default {
  components: {
    DialogEditSection,
    FloatingDiv,
    CloseEsc,
    OffscreenEditAddon,
    DialogListAddon
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      data: [],
      editData: [],
      selectedSection: {},
      selectedDay: getDayInteger(),
      selectedTime: null,
      visibleDialogEditSection: false,
      loadingSection: false,
      grabfoodData: {},
      loadingUpdate: false,
      dataLogs: [],
      visibleLogs: false,
      loadingLogs: false,
      moreLink: false,
      dataLogForView: [],
      coba: true,
      visibleOffscreenEditAddon: false,
      formEditSectionMenu: {},
      visibleDialogListAddon: false,
      formData: {},
      dataPeriods: []
    }
  },

  computed: {
    optionSections() {
      return this.data
    },
    optionsTimeBySelectedDay() {
      let optionsTime = []
      if (this.selectedSection && this.selectedSection.days) {
        this.selectedSection.days.map(day => {
          if (day.day_id === this.selectedDay) {
            optionsTime.push(...day.times)
          }
        })
      }
      return optionsTime
    },
    listMenus() {
      let menus = []
      if (this.selectedSection.menus && this.selectedSection.menus.length) {
        menus = [...this.selectedSection.menus]
        // show menus by selected time
        if (this.selectedTime) {
          menus = menus.filter(item => {
            const exist = item.time_available.filter(time => {
              return (time.id === this.selectedTime)
            })
            return exist.length
          })
        }
      }
      return menus
    },

    // listCategory() {
    //   let category = this.selectedSection.categories
    //   category.map(i => {
    //     i.menus = []
    //     this.selectedSection.menus.map(j => {
    //       if (j.category.id === i.id) {
    //         i.menus.push(j)
    //       }
    //     })
    //   })
    //   return category
    // }
  },

  watch: {
    optionSections(optionSections) {
      if (optionSections.length) {
        if (!this.selectedSection.id) {
          this.selectedSection = { ...optionSections[0] }
        } else {
          optionSections.map(i => {
            if (i.id === this.selectedSection.id) {
              this.selectedSection = { ...i}
            }
          })
        }
      } else {
        this.selectedSection = {}
      }
    },

    selectedSection(selectedSection) {
      if (this.selectedSection.days && this.selectedSection.days.length) {
        this.selectedDay = this.selectedSection.days[0].day_id
      }
    }
  },

  mounted() {
    this.getData()
    this.handleGetGrabfoodStore()
    this.getUpdateLogs()
    this.getDataPeriod()
  },

  methods: {
    getData() {
      this.loading = true
      fetchAllGroupByStore({
        per_page: 50
      }).then(response => {
        // this.data = response.data.data
        // this.data.map(m => {
        //   m.categories.map(i => {
        //     i.menus.map(j => {
        //       j.category = {
        //         is_alias: i.is_alias,
        //         id: i.id,
        //         name: i.name
        //       }
        //       j.group_id = m.id
        //     })
        //   })
        // })
        // this.editData = response.data.data
        this.loading = false
      }).catch(error => {
        this.data = []
        this.editData = []
        this.$message({
          type: 'error',
          message: error.string
        })
        // console.log('trace', error)
        if (error.statusCode === 404) {
          this.$router.push({
            path: '/service-activation-v2/'
          })
        }
        this.loading = false
      })
    },

    getUpdateLogs() {
      this.loading = true
      getUpdateLogs({
        per_page: 15
      }).then(response => {
        this.dataLogForView = response.data.data[0]
        this.dataLogs.push(response.data.data)
        if (response.data.links.next !== null) {
          this.moreLink = true
        } else {
          this.moreLink = false
        }
        this.current_page = response.data.meta.current_page
        this.loading = false
      }).catch(error => {
        this.dataLog = []
        if (error.statusCode !== 404) {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        this.loading = false
      })
    },

    loadMore() {
      this.loadingLogs = true
      getUpdateLogs({
        per_page: 15,
        page: this.current_page + 1
      }).then(response => {
        this.dataLogs.push(response.data.data)
        if (response.data.links.next !== null) {
          this.moreLink = true
        } else {
          this.moreLink = false
        }
        this.current_page = response.data.meta.current_page
        this.loadingLogs = false
      }).catch(error => {
        this.dataLog = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingLogs = false
      })
    },

    handleGetGrabfoodStore(data) {
      this.loading = true
      fetchGrabfoodStore().then(response => {
        if (response.data.data.group_menu.length) {
          this.grabfoodData = { ...response.data.data}
          this.editData = [ ...this.grabfoodData.group_menu]
          this.data = [ ...this.grabfoodData.group_menu]
          this.data.map(m => {
            m.categories.map(i => {
              i.menus.map(j => {
                j.category = {
                  is_alias: i.is_alias,
                  id: i.id,
                  name: i.name
                }
                j.group_id = m.id
              })
            })
          })

          this.findInfoAddon()
        } else {
          this.$router.push('/service-activation-v2')
        }
        this.loading = false
      }).catch(() => {
        this.grabfoodData = {}
        this.loading = false
      })
    },

    handleSelectedSectionChange() {
      this.selectedTime = null
    },

    handleDropdownSection(command) {
      if (command === 'edit') {
        this.visibleDialogEditSection = true
      } else if (command === 'delete') {
        if (this.data.length > 1) {
          this.destroySection(this.selectedSection.id)
        } else {
          this.$message({
            type: 'error',
            message: 'Tidak bisa hapus section, harus ada minimal 1 section'
          })
        }
      } else if (command === 'addon' ) {
        this.visibleDialogListAddon = true
      }
    },

    destroySection(sectionId) {
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
        destroySection(data).then(response => {
          this.$message({
            type: 'success',
            message: response.data.data.message
          })
          this.visibleDialogEditSection = false
          this.selectedSection = {}
          this.refreshData()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
        })
      }).catch(() => {
      })
    },

    refreshData () {
      console.log('aaa')
      this.handleGetGrabfoodStore()
      this.getUpdateLogs()
      this.visibleDialogListAddon = false
    },

    beforeUpdateCategory (block, item, indexCategories, indexMenu) {
      let message = ''
      if (item.is_available === 0) {
        message = block === 'category' ? 'Group ' + item.name + ' akan "Tidak tersedia" di menu GrabFood' : 'Item ' + item.alias_name + ' akan "Tidak tersedia" di menu GrabFood'
      } else if (item.is_available === 1) {
        message = block === 'category' ? 'Group ' + item.name + ' akan "Tersedia" di menu GrabFood' : 'Item ' + item.alias_name + ' akan "Tersedia" di menu GrabFood'
      }
      this.$confirm(message, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: item.is_available === 0 ? 'warning' : 'success'
      }).then(() => {
        if (block === 'category') {
          this.updateCategory(item, indexCategories)
        } else if (block === 'menu') {
          this.updateMenu(item, indexMenu)
        }
        
      }).catch(() => {
        // console.log('troce')
        if (block === 'category') {
          this.selectedSection.categories[indexCategories].is_available = item.is_available === 1 ? 0 : 1
        } else if (block === 'menu') {
          this.selectedSection.categories[indexCategories].menus[indexMenu].is_available = item.is_available === 1 ? 0 : 1
        }
        
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled'
        // })
      })
    },

    updateCategory (item, index) {
      this.loadingSection = true
      let data = {
        store_grabfood_id: this.grabfoodData.id,
        category: {
          is_alias: 1,
          is_available: item.is_available,
          name: item.name,
          id: item.id
        },
        category_id: item.id
      }
      updateMenuCategory(data).then(response => {
        this.data = [ ...response.data.data.group_menu]
        this.findInfoAddon()
        this.data.map(i => {
          if (this.selectedSection.id === i.id) {
            this.selectedSection.categories[index] = i.categories[index]
          }
        })
        
        this.$message({
          type: 'success',
          message: 'Data berhasil diupdate'
        })
        this.loadingSection = false
      }).catch(error => {
        this.selectedSection.categories[index].is_available = item.is_available === 1 ? 0 : 1
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSection = false
      })
    },

    updateMenu (item, index) {
      this.loadingSection = true
      if (item.product_type === 'Product') {
        item.product_type = 'P'
      } else if (item.product_type === 'Variant') {
        item.product_type = 'V'
      } else if (item.product_type === 'Product Combo') {
        item.product_type = 'C'
      }
      let data = {
        store_grabfood_id: this.grabfoodData.id,
        menu: [item]
      }
      updateMenuBatch(data).then(response => {
        // this.data = [ ...response.data.data.group_menu]
        this.refreshData()
        this.findInfoAddon()
        this.data.map(i => {
          if (this.selectedSection.id === i.id) {
            // i.map(m => {
              i.categories.map(item => {
                item.menus.map(j => {
                  j.category = {
                    is_alias: item.is_alias,
                    id: item.id
                  }
                  j.group_id = i.id
                })
              })
            // })
            this.selectedSection = { ...i}
          }
        })
        this.$message({
          type: 'success',
          message: 'Data berhasil diupdate'
        })
        this.loadingSection = false
      }).catch(error => {
        console.log('tr', item)
        this.selectedSection.categories.map(i => {
          if (i.id === item.category.id) {
            i.menus.map(j => {
              if (j.id === item.id) {
                j.is_available = item.is_available === 1 ? 0 : 1
              }
            })
          }
        })
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSection = false
      })
    },

    updateTograb () {
      let data = {
        store_grabfood_id: this.grabfoodData.id
      }
      this.loadingUpdate = true
      updateGrab(data).then(response => {
        console.log('trace', response)
        this.$message({
          type: 'success',
          message: 'Berhasil update data ke Grab'
        })
        this.loadingUpdate = false
      }).catch(error => {
        // console.log('tr', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingUpdate = false
      })
    },

    handleCancel () {
      this.visibleDialogEditSection = false
      this.refreshData()
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

    infoMiscAddon (data) {
      let dataInfo = []
      let nameCategory = ''
      this.data.map(i => {
        if (i.categories.length) {
          i.categories.map(category => {
            if (category.menus.length) {
              category.menus.map(menu => {
                if (menu.is_needed_items === 1) {
                  dataInfo.push({
                    id: i.id,
                    name: i.name
                  })
                }
              })
            }
          })
        }
      })
      let filtered = dataInfo.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
      // console.log('datainfo', filtered)
      if (filtered.length === 1) {
        nameCategory = filtered[0].name
      } else if (filtered.length > 1) {
        var name = []
        filtered.map(i => {
          name.push(i.name + ',')
        })
        name[filtered.length - 1] = '& ' + filtered[filtered.length - 1].name
        name[filtered.length - 2] = filtered[filtered.length - 2].name
        nameCategory = name.join(' ')
      }
      return {
        data: dataInfo,
        name: nameCategory
      }
    },

    findInfoAddon () {
      if (this.data.length) {
        this.data.map(section => {
          if (section.categories.length) {
            section.categories.map(menu => {
              if (menu.menus.length) {
                menu.menus.map(addon => {
                  addon.is_needed_items = 0
                  if (addon.addon_group.length) {
                    addon.addon_group.map(item => {
                      if (item.needed_items !== 0) {
                        // console.log('needed', menu.name)
                        addon.is_needed_items = 1
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    },

    editAddon (menu) {
      this.formEditSectionMenu = menu
      this.visibleOffscreenEditAddon = true
    },

    updateAddon (item) {
      this.data = [ ...item]
      this.findInfoAddon()
      this.data.map(i => {
        if (this.selectedSection.id === i.id) {
          this.selectedSection = { ...i}
        }
      })
      this.selectedSection.categories.map(i => {
        if (i.id === this.formEditSectionMenu.category.id) {
          i.menus.map(j => {
            if (j.id === this.formEditSectionMenu.id) {
              this.formEditSectionMenu.addon_group = [ ...j.addon_group]
            }
          })
        }
      })
    },

    getTimeSection (day) {
      let days_available = this.selectedSection.days_available
      let times = []
      if (days_available) {
        days_available.map(i => {
          if (i.day_id === day) {
            times = i.times
          }
        })
      }
      return times
      // this.selectedSection.days_available.map(i => {
      //   if (i.day_id === day) {
      //     return i.times
      //   }
      // })
    },

    async getDataPeriod() {
      this.loading = true
      this.dataPeriods = []
      await getDataPeriod({
        sort_column: 'id',
        sort_type: 'asc'
      }).then(response => {
        this.loading = false
        this.dataPeriods = response.data.data
      }).catch(error => {
        this.dataPeriods = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },
  }
}
</script>
