<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand">
        <i class="el-icon-rank"></i>
      </div>

      <div class="mr-8">
        <el-tag type="warning" v-if="item.published === 0">
          <i class="el-icon-warning"></i>
        </el-tag>
      </div>

      <div style="flex-grow: 1;">
        {{ item.title }}
        <div v-if="item.link_type_name">
          <svg-icon icon-class="link" /> {{ item.link_type_name }}
        </div>
      </div>

      <el-button
        @click="edit"
        size="mini"
        type="text"
        icon="el-icon-edit-outline">
        {{ lang.edit }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  methods: {
    edit() {
      let data = {...this.item}
      this.$emit('edit', data)
    }
  }
}
</script>

