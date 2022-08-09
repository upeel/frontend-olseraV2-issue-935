<template>
  <div class="dd-handle mb-12" style="padding-left: 8px;">
    <div class="flex-container flex-container--wrap">
      <div class="mr-8">
        <el-tag type="success" style="padding: 2px 6px;"
          v-if="item.sms_notify_type_id === 1 || item.sms_notify_type_id === 2 ||
          item.sms_notify_type_id === 3|| item.sms_notify_type_id === 4">
          <svg-icon icon-class="message-square" style="margin-right: 0; stroke: #67c23a;"></svg-icon>
        </el-tag>
        <el-tag type="warning" style="padding: 2px 6px;"
          v-if="item.sms_notify_type_id === 7 || item.sms_notify_type_id === 8">
          <svg-icon icon-class="message-square" style="margin-right: 0; stroke: #f56c6c;"></svg-icon>
        </el-tag>
        <el-tag type="danger" style="padding: 2px 6px;"
          v-if="item.sms_notify_type_id === 5 || item.sms_notify_type_id === 6">
          <svg-icon icon-class="message-square" style="margin-right: 0; stroke: #e6a23c;"></svg-icon>
        </el-tag>
      </div>

      <div style="flex-grow: 1;">
        {{ item.sms_notify_type_name }}
        <p class="input-desc size-12 oldgrey" style="margin-bottom: 0; margin-top: 0;">
          {{ item.sms_notify_type_description }}
        </p>
      </div>

      <button-action-authenticated
        :permission="['settings/smsnotify', 'edit']"
        size="mini"
        type="text"
        icon="el-icon-edit-outline"
        @click="edit">
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

  methods: {
    edit() {
      let dataList = {...this.item}
      this.$emit('edit', dataList)
    }
  }
}
</script>
