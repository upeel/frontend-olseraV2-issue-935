import { featureAccessByUrlIds } from '@/utils/hiddenFeaturesByPlanType'

const mixinHiddenFeatureByPlanType = {
  computed: {
    planType() {
      return this.$store.getters.selectedStore.plan_type_id
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  },

  watch: {
    planType: {
      handler(payload) {
        this.resetLock()
      }
    }
  },

  mounted() {
    // inject label hidden features
    this.resetLock()
  },

  destroyed() {
    this.resetLock()
  },

  methods: {
    precheckByUrlId(menu) {
      return featureAccessByUrlIds[this.selectedStore.url_id] && featureAccessByUrlIds[this.selectedStore.url_id].includes(menu)
    },
    resetLock() {
      this.destoryIconSubmenuDisabled()
      const hidden = document.querySelectorAll('.submenu-disabled a, .button-plan-type-disabled')
      if (hidden && hidden.length) {
        hidden.forEach(element => {
          element.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" class="ml-10 svg-icon icon-submenu-disabled"><use xlink:href="#icon-lock"></use></svg>')
        })
      }
    },
    destoryIconSubmenuDisabled() {
      const hidden = document.querySelectorAll('.panel.tab-list .icon-submenu-disabled, .button-plan-type-disabled .icon-submenu-disabled')
      if (hidden && hidden.length) {
        hidden.forEach(element => {
          element.remove()
        })
      }
    },
    methodRouteIsHidden(menu) {
      return this.$isHiddenByPlanType(this.planType, menu)
    },
    methodFeatureNameIsHidden(featureName) {
      return this.$isFeatureNameHiddenByPlanType(this.planType, featureName)
    },

    methodFeatureIsHiddenCellTable(featureName) {
      return this.handlerClassName(featureName, 'methodFeatureNameIsHidden', ['celltable'])
    },
    methodRouteIsHiddenSidebarMenuClass(menu, doubleCheck = false) {
      if (this.precheckByUrlId(menu)) {
        return false
      } else {
        return this.handlerClassName(menu, 'methodRouteIsHidden', ['sidebarmenu'], doubleCheck)
      }
    },
    methodRouteIsHiddenSubMenuClass(menu) {
      if (this.precheckByUrlId(menu)) {
        return false
      } else {
        return this.handlerClassName(menu, 'methodRouteIsHidden', ['submenu'])
      }
    },
    methodRouteIsHiddenButtonClass(featureName) {
      return this.handlerClassName(featureName, 'methodFeatureNameIsHidden', ['button', 'button-plan-type'])
    },
    /**
     * return class name with defined prefix
     * @param {*} menu String route.path or defined feature-name
     * @param {*} method method name: methodRouteIsHidden/methodFeatureNameIsHidden
     * @param {*} prefix[] prefix class name
     * @returns String
     */
    handlerClassName(menu, method, prefix, doubleCheck = false) {
      let append = '-enabled'
      if (this[method](menu) && !doubleCheck) {
        append = '-disabled'
      }
      const classNames = []
      prefix.map(pref => {
        classNames.push(pref + append)
      })
      return classNames.join(' ')
    }
  }
}

export { mixinHiddenFeatureByPlanType }
