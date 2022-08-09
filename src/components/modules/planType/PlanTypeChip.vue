<template>
  <span
    v-if="selectedPlan"
    :style="{
      background: 'transparent linear-gradient(180deg, '+ selectedPlan.color_grad +' 0%, '+ selectedPlan.color_grad_2 +' 100%) 0% 0% no-repeat padding-box'
    }"
    class="plan-type-chip">
    <img :src="'/static/img/store-types/' + computedIcon" width="20" class="mr-8" />
    <slot>{{ selectedPlan.name }}</slot>
  </span>
</template>

<script>
import { planTypeLevel } from '@/utils/hiddenFeaturesByPlanType'
export default {
  props: {
    planTypeId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      otherPlanTypes: {
        'is_onlineshop': {
          name: 'Online Store',
          codename: 'ol'
        },
        'link_android_app': {
          name: 'Android App',
          codename: 'mobile'
        },
        'link_ios_app': {
          name: 'iOs App',
          codename: 'mobile'
        },
        'free_catalog' : {
          name: 'Free catalog',
          codename: 'ol'
        }
      }
    }
  },

  computed: {
    planTypes() {
      const planTypes = require('/static/data/package-types.json')
      return planTypes
    },
    selectedPlan() {
      if (!planTypeLevel.includes(this.planTypeId)) {
        if (this.otherPlanTypes[this.planTypeId]) {
          return {
            color_grad: '#FFFFFF',
            color_grad_2: '#EDF7E9',
            id: this.otherPlanTypes[this.planTypeId].codename,
            name: this.otherPlanTypes[this.planTypeId].name
          }
        } else {
          return {}
        }
      } else {
        return this.planTypes.find(plan => {
          return plan.id === this.planTypeId
        })
      }
    },
    computedIcon() {
      let prefix = 'icon-plan-'
      if (!planTypeLevel.includes(this.planTypeId)) {
        prefix = 'icon-with-'
      }
      return prefix + this.selectedPlan.id + '.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-type-chip {
  border-radius: 100px;
  font-size: 12px;
  color: #272727;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  + .plan-type-chip{
    margin-left: 8px;
  }
  &.warning {
    background: #F44336 !important;
    color: #fff;
  }
  &.danger {
    background: #F44336 !important;
    color: #fff;
  }
}
.olsera-menu-item {
  .plan-type-chip {
    position: absolute;
    right: 8px;
    top: 6px;
  }
}
.el-menu--collapse .plan-type-chip {
  display: none;
}
</style>
