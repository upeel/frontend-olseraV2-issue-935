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
          v-for="(item, key) in steps"
          :key="item"
          :class="[
            completeSteps.includes(item) ? 'active' : '',
            item === activeStep ? 'current' : ''
          ]"
          class="form-wizard--step--item">
          {{ key + 1 }}. {{ item }}
        </div>
      </div>

      <div class="form-wizard--content">
        <setup-section
          v-show="activeStep === 'section'"
          @submit="handleSubmit($event, 'category', 1)"
        />
        <setup-category
          v-show="activeStep === 'category'"
          :setup-data="formData"
          :grabfoodData="grabfoodData"
          @submit="handleSubmit($event, 'item', 2)"
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
import setupSection from './setupSectionOld'
import setupCategory from './setupCategoryOld'
import setupItem from './setupItem'
import { createItemSetupMenu as create } from '@/api/thirdParty/grabfood'
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
    }
  },
  components: {
    setupSection,
    setupCategory,
    setupItem
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loadingSubmit: false,
      activeStep: 'section',
      steps: ['section', 'category', 'item'],
      completeSteps: ['section'],
      formData: {
        store_grabfood_id: this.grabfoodData.id
      }
    }
  },
  watch: {
    setupData: {
      deep: true,
      immediate: true,
      handler(setupData) {
        this.formData.store_grabfood_id = this.grabfoodData.id
      }
    }
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
      this.formData = { ...this.formData, ...data }
      console.log('handleSubmit', item, key)
      if (item && key) {
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
        days: [],
        menu: []
      }
      /**
       * DAYS
       */
      await this.formData.days.map(day => {
        // if (this.formData.selected_days.includes(day.day_id)) {
          submitData.days.push(day)
        // }
      })
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
            alias_price: item.sell_price_pos,
            description: item.description,
            available: []
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
    }
  }
}
</script>