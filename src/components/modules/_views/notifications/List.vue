<template>
  <div>
    <ul class="list-unstyled">
      <li v-for="(notif, key) in item.items" :key="key" style="margin-bottom: 0; padding-bottom: 0">
        <template v-if="!notif.id">
          <router-link
            v-if="notif.tipe === 'openorder'"
            to="/sales/openorder">
            {{ notif.message }}
          </router-link>
          <router-link
            v-if="notif.tipe === 'product'"
            to="/catalog/product">
            {{ notif.message }}
          </router-link>
          <router-link
            v-if="notif.tipe === 'customer'"
            :to="'/customersupplier/customer/'">
            {{ notif.message }}
          </router-link>
        </template>
        <template v-else>
          <router-link
            v-if="notif.tipe === 'product'"
            :to="'/catalog/product/' + notif.id">
            {{ notif.message }}
          </router-link>
          <router-link
            v-if="notif.tipe === 'productcombo'"
            :to="'/catalog/package/' + notif.id">
            {{ notif.message }}
          </router-link>
          <!-- <router-link
            v-if="notif.tipe === 'customer'"
            :to="'/customersupplier/customer/' + notif.id">
            {{ notif.message }}
          </router-link> -->
          <router-link
            v-if="notif.tipe === 'customerreview'"
            :to="'/customersupplier/customerreview/' + notif.id">
            {{ notif.message }}
          </router-link>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  }
}
</script>
