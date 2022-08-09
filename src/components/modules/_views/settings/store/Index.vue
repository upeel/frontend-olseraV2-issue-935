<template>
  <page-submenu
    :menus="menus"
  />
</template>

<script>
import PageSubmenu from '@/components/layouts/PageSubmenu.vue'
import { customPermissionAccess } from '@/data/customPermissionAccess.js'
export default {
  components: {
    PageSubmenu
  },
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    menus() {
      return [
        {
          label: this.$lang[this.langId].staffs,
          path: '/settings/store/staffs',
          roles_except: ['AS'],
          permission_id: null,
          permission_id: 'account/staffs',
          shown_for: []
        },
        {
          label: this.$lang[this.langId].staffs_permission,
          path: '/settings/store/staffs-permission',
          roles_except: ['AS','LW','PO','PS','PT','RP','SA','SS','ST'],
          permission_id: null,
          shown_for: customPermissionAccess
        },
        {
          label: this.lang.store,
          path: '/settings/store/general',
          roles_except: [],
          permission_id: 'settings/generalsetting',
          shown_for: []
        },
        {
          label: this.$lang[this.langId].branch,
          path: '/settings/store/storebranches',
          roles_except: [],
          permission_id: 'settings/storebranches',
          shown_for: []
        },
        {
          label: this.$lang[this.langId].currency,
          path: '/settings/store/storecurrency',
          roles_except: [],
          permission_id: 'settings/storecurrency',
          shown_for: []
        }
      ]
    }
  }
}
</script>
