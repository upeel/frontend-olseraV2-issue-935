<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li v-if="checkCustomPermission('settings/smsnotify', 'index')">
            <router-link :to="{ path: '/settings/notification/email' }">
              {{ lang.email }}
            </router-link>
          </li>
          <li v-if="checkCustomPermission('settings/smsnotify', 'index')">
            <router-link :to="{ path: '/settings/notification/sms' }">
              {{ $lang[langId].sms }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="tab-content">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script>
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
export default {
  mixins: [checkCustomPermission],
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    }
  }
}
</script>
