<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin">
          <li
            v-if="checkCustomPermission('website/pages', 'index')">
            <router-link :to="{path: '/website/pages/static'}">
              {{ lang.page }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('website/articles', 'index')">
            <router-link :to="{path: '/website/pages/articles'}">
              {{ lang.article }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('website/faqs', 'index')">
            <router-link :to="{path: '/website/pages/faqs'}">
              {{ lang.f_a_q }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('website/testimonial', 'index')">
            <router-link :to="{path: '/website/pages/testimonial'}">
              {{ lang.testimonial }}
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
  name: 'MySiteIndex',
  mixins: [checkCustomPermission],
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  }
}
</script>
