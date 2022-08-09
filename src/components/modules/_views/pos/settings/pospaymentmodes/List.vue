<template>
  <div :class="!item.editable ? 'disabled' : ''" class="dd-handle">
    <div class="flex-container flex-container--flex">
      <div
        class="hand">
        <i class="el-icon-rank"></i>
      </div>
      <div style="flex-grow: 1;">
        {{ item.payment_type }}
        <div class="font-12">
          {{ item.name }} {{ parseInt(item.extra_charge_percent) > 0 ? "(+" + item.fextra_charge_percent + ')' : ''}}
        </div>
      </div>
      <div v-if="item.editable">
        <button-action-authenticated
          :permission="['settings/pospaymentmodes', 'show']"
          size="mini"
          type="text"
          icon="el-icon-edit-outline"
          @click="edit">
        </button-action-authenticated>
      </div>
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
      let data = {...this.item}
      this.$emit('edit', data)
    }
  }
}
</script>
