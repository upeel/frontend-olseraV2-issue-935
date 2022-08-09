<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li v-if="checkCustomPermission('website/fbstore', 'index')">
            <router-link :to="{path: '/website/integrations/fbstore'}">
              {{ lang.facebook_store }}
            </router-link>
          </li>
          <li v-if="checkCustomPermission('website/facebooksso', 'index')">
            <router-link :to="{path: '/website/integrations/fbsso'}">
              {{ $lang[langId].facebook_login }}
            </router-link>
          </li>
          <li v-if="checkCustomPermission('website/facebookpixel', 'index')">
            <router-link :to="{path: '/website/integrations/fbpixel'}">
              {{ $lang[langId].facebook_pixel }}
            </router-link>
          </li>
          <li v-if="checkCustomPermission('website/mailchimp', 'index')">
            <router-link :to="{path: '/website/integrations/mailchimp'}">
              {{ lang.mailchimp_newsletter }}
            </router-link>
          </li>
          <li v-if="checkCustomPermission('website/googleanalytics', 'index')">
            <router-link :to="{path: '/website/integrations/googleanalytics'}">
              {{ lang.google_analytics }}
            </router-link>
          </li>
          <li v-if="checkCustomPermission('website/chatwidget', 'index')">
            <router-link :to="{path: '/website/integrations/chatwidget'}">
              {{ lang.chat_widget }}
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
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  }
}
</script>
