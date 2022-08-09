<template>
  <div class="table-responsive">
    <table class="table table-hover table-bordered table-striped bs-table">
      <thead v-if="header && header.length">
        <tr>
          <template v-if="sortable">
            <th
              v-for="(item, key) in header"
              :key="key" @click="sorting(item)">
              <div class="flex-container pointer">{{ item.name }} <i v-if="item.sort" :class="item.asc ? 'el-icon-top color-primary' : 'el-icon-bottom color-primary'" /></div>
            </th>
          </template>
          <template v-else>
            <th
              v-for="(item, key) in header"
              :key="key">
              {{ item }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script>
import data from './modules/_views/tutorial/data'
export default {
  props: {
    header: {
      type: Array,
      default: () => {
        return []
      }
    },
    sortable: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    sorting (data) {
      if (data.sort) {
        this.$emit('sort', data)
      }
    }
  }
}
</script>
