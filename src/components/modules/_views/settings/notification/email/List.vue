<template>
  <div class="dd-handle mb-12" style="padding-left: 8px;">
    <div class="flex-container flex-container--wrap">
      <div class="mr-8">
        <el-tag type="success"
          v-if="item.email_notify_type_id === 1 || item.email_notify_type_id === 2 ||
          item.email_notify_type_id === 3|| item.email_notify_type_id === 4">
          <i class="el-icon-message"></i>
        </el-tag>
        <el-tag type="warning" v-if="item.email_notify_type_id === 7 || item.email_notify_type_id === 8">
          <i class="el-icon-message"></i>
        </el-tag>
        <el-tag type="danger" v-if="item.email_notify_type_id === 5 || item.email_notify_type_id === 6">
          <i class="el-icon-message"></i>
        </el-tag>
      </div>

      <div style="flex-grow: 1;">
        {{ item.email_notify_type_name }}
        <p class="input-desc size-12 oldgrey" style="margin-bottom: 0; margin-top: 0;">
          {{ item.email_notify_type_description }}
        </p>
      </div>

      <button-action-authenticated
        :permission="['settings/smsnotify', 'edit']"
        size="mini"
        type="text"
        icon="el-icon-edit-outline"
        @click="edit">
        {{ lang.edit }}
      </button-action-authenticated>
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

