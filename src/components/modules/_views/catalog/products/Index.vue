<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('catalog/products', 'index')">
            <router-link :to="{ path: '/catalog/product' }">
              {{ lang.product }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('catalog/productcombo', 'index')">
            <router-link :to="{ path: '/catalog/package' }">
              {{ lang.combo }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.is_pos_only !== 1 && checkCustomPermission('catalog/lookbook', 'index')">
            <router-link :to="{ path: '/catalog/lookbook' }">
              {{ lang.look_book }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('catalog/productgroups', 'index')">
            <router-link :to="{ path: '/catalog/product-group' }">
              {{ lang.group }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('catalog/brands', 'index')">
            <router-link
              :to="{ path: '/catalog/product-brand' }">
              {{ lang.brand }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.is_pos_only !== 1 && checkCustomPermission('catalog/collections', 'index')">
            <router-link :to="{ path: '/catalog/collection' }">
              {{ lang.collection }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.is_pos_only !== 1 && checkCustomPermission('catalog/specifications', 'index')">
            <router-link :to="{ path: '/catalog/specification' }">
              {{ lang.specifications }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.is_pos_only !== 1 && checkCustomPermission('catalog/lookbookgroups', 'index')">
            <router-link :to="{ path: '/catalog/grouplookbook' }">
              {{ lang.look_book_group }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('catalog/prodaddon', 'index')">
            <router-link :to="{ path: '/catalog/addon' }">
              {{ lang.product_addons }}
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
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'PackageIndex',
  mixins: [basicComputedMixin]
}
</script>
