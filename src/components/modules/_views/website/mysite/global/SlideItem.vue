<template>
  <div class="dd-handle">
    <div class="flex-container">
      <div class="hand">
        <i class="el-icon-rank"></i>
      </div>

      <div class="mr-4">
        <el-avatar :src="item.photo"/>
      </div>

      <div style="flex-grow: 1;">
        <div class="color-info">
          <div class="mb-4">
            {{ item.title }}
          </div>
          <div class="size-12 oldgrey">
            <i class="fa fa-link fa-fw" aria-hidden="true"></i>
            {{ item.link_type_name }}
          </div>
        </div>
      </div>

      <el-button size="mini" type="primary"
        @click="edit(item)" class="btn-plain" icon="el-icon-edit">
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
    edit(item) {
      let data = Object.assign(item)
      this.$emit('edit', data)
    }
  }
}
</script>
