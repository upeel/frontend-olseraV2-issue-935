<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand">
        <i class="el-icon-rank"></i>
      </div>

      <div class="mr-8" style="flex-grow: 1;">
        {{ item.payment_type }}
        <p v-if="item.payment_type_id === 'BT'" class="input-desc size-12 oldgrey" style="margin-bottom: 0; margin-top: 0;">
          {{ item.bank_name }}
          <span v-if="item.bt_account_no">({{ item.bt_account_no }})</span>
        </p>
        <p v-if="item.payment_type_id === 'PP'" class="input-desc size-12 oldgrey" style="margin-bottom: 0; margin-top: 0;">
          {{ item.pp_user_name }}
        </p>
        <p v-else class="input-desc size-12 oldgrey" style="margin-bottom: 0; margin-top: 0;">
          {{ item.name }}
        </p>
      </div>

      <div class="text-right">
        <el-button
          @click="edit"
          size="mini"
          type="text"
          icon="el-icon-edit-outline">
        </el-button>
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

