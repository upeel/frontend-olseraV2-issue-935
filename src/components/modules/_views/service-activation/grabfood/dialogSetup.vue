<template>
  <el-dialog
    :visible.sync="show"
    :before-close="cancel"
    :title="rootLang.manage_list_menu"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div class="form-wizard">
      <div class="form-wizard--step">
        <div
          v-loading="loadingDialog"
          v-for="(item, key) in steps"
          :key="item"
          :class="[
            completeSteps.includes(item) ? 'active' : '',
            item === activeStep ? 'current' : ''
          ]"
          class="form-wizard--step--item pointer" @click="handleBack(item, key)">
          {{ key + 1 }}. {{ item }}
        </div>
      </div>

      <div class="form-wizard--content">
        <setup-open-hours
          v-show="activeStep === 'jam buka'"
          :grabfoodData="grabfoodData"
          :update="updateopenhours"
          :data-periods="dataPeriods"
          @submit="handleSubmit($event, 'section', 1)"
        />
        <setup-section
          v-show="activeStep === 'section'"
          :setup-data="formData"
          :data-periods="dataPeriods"
          @submit="handleSubmit($event, 'category', 2)"
        />
        <setup-category
          v-show="activeStep === 'category'"
          :setup-data="formData"
          :grabfoodData="grabfoodData"
          @submit="handleSubmit($event, 'item', 3)"
        />
        <setup-item
          v-show="activeStep === 'item'"
          :setup-data="formData"
          :loading="loadingSubmit"
          :grabfoodData="grabfoodData"
          @submit="handleSubmit($event)"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import setupSection from './setupSection'
import setupCategory from './setupCategory'
import setupItem from './setupItem'
import setupOpenHours from './setupOpenHours'
import { createItemSetupMenu as create, getGrabPeriodStore } from '@/api/thirdParty/grabfood'
import moment from 'moment'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    setupData: {
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

  components: {
    setupSection,
    setupCategory,
    setupItem,
    setupOpenHours
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loadingSubmit: false,
      activeStep: 'jam buka',
      steps: ['jam buka', 'section', 'category', 'item'],
      completeSteps: ['jam buka'],
      formData: {
        store_grabfood_id: this.grabfoodData.id,
        checkedDays: []
      },
      // dataPeriods: [],
      loadingDialog: false,
      updateopenhours: false
    }
  },

  watch: {
    setupData: {
      deep: true,
      immediate: true,
      handler(setupData) {
        this.formData.store_grabfood_id = this.grabfoodData.id
      }
    },
  },

  methods: {
    submit() {
      this.$emit('submit')
    },

    handleClickStep(item, key, shortcut = false) {
      if (shortcut && this.activeStep === 'section') {
        return
      }
      this.completeSteps = []
      this.activeStep = item
      this.steps.map((stepItem, stepKey) => {
        if (stepKey <= key) {
          this.completeSteps.push(stepItem)
        }
      })
      console.log(this.activeStep)
    },

    handleSubmit(data, item, key) {
      if (item !== 'section' && key !== 1) {
        this.formData = { ...this.formData, ...data }
      }
      if (item && key) {
        if (item === 'section' && key === 1) {
          this.getDataPeriod()
        }
        this.handleClickStep(item, key)
      } else {
        this.handleDone()
      }
    },

    cancel () {
      console.log(this.show)
    },

    async handleDone() {
      this.loadingSubmit = true
      // console.log(this.formData)
      // const category = {
      //   is_alias: this.formData.group_menu[0].categories[0].is_alias,
      //   id: this.formData.group_menu[0].categories[0].id,
      // }
      if (this.formData.category.is_alias === 1) {
        // this.$delete(this.formData.category, 'id')
        this.formData.category.id = this.formData.group_menu[0].categories[0].id
      }
      const submitData = {
        store_grabfood_id: this.formData.store_grabfood_id,
        name: this.formData.name,
        group_id: this.formData.group_menu[0].id,
        category: this.formData.category,
        // days: [],
        menu: []
      }

      /**
       * DAYS
       */
      // await this.formData.days.map(day => {
      //   // if (this.formData.selected_days.includes(day.day_id)) {
      //     submitData.days.push(day)
      //   // }
      // })

      /**
       * MENUS
       */
      if (this.formData.menus) {
        await this.formData.menus.map(async item => {
          console.log(item)
          const obj = {
            product_id: item.id,
            addon_item: item.addon_item,
            product_type: item.type,
            is_available: 1,
            alias_name: item.name,
            alias_price: item.alias_price,
            description: item.description,
            available: [],
            is_percentage: item.is_percentage
          }

          if (this.stageLevel === 'dev') {
            if (obj.is_percentage === 0) {
              console.log('ooo', obj.is_percentage)
              obj.amount = item.amount
              // this.$delete('percentage', obj)
            } else if (obj.is_percentage && obj.is_percentage === 1) {
              obj.percentage = item.percentage
              // this.$delete('amount', obj)
            }
          }
          await item.available.map((menuAvailable) => {
            // console.log('menuAvailable', menuAvailable)
            if (
              item.selected_days.includes(menuAvailable.day_id) &&
              menuAvailable.selected_time.length
            ) {
              const availableObj = {
                day: menuAvailable.day_id,
                time: menuAvailable.selected_time.join(','),
                status: 1
              }
              obj.available.push(availableObj)
            }
          })
          submitData.menu.push(obj)
        })
      }

      console.log(submitData)

      create(submitData).then(response => {
        this.loadingSubmit = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
        this.$router.push({
          path: '/service-activation-v2/grabfood/manage'
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSubmit = false
      })
    },

    async getDataPeriod () {
      this.loadingDialog = true
      let date = moment().format('YYYY-MM-DD')
      await getGrabPeriodStore().then(response => {
        this.dataPeriods = response.data.data
        this.dataPeriods.map(i => {
          if (i.times.length) {
            i.times.map(j => {
              j.start_time = moment(date + ' ' + j.start_time).format('HH:mm')
              j.end_time = moment(date + ' ' + j.end_time).format('HH:mm')
            })
          }
          i.checked = false
          if (i.period_type === 1) {
            i.checked = true
          }
        })
        this.loadingDialog = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDialog = false
      })
    },

    handleBack (item, key) {
      if (key === 0) {
        // this.getDataPeriod()
        this.$emit('getperiod')
        this.handleClickStep(item, key)
        this.updateopenhours = true
      }
    },

    setUpdate () {
      this.updateopenhours = true
    }
  }
}
</script>
