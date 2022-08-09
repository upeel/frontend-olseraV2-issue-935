<template>
  <div class="dd-handle">
    <span class="hand">
      <i class="el-icon-rank"></i>
    </span>
    <el-row :gutter="10">
      <el-col :sm="18">
        {{ item.payment_type }}
        <p class="input-desc size-12 oldgrey" style="margin-bottom: 0; margin-top: 0;">
          <template v-if="item.name">{{ item.name }}</template>
          <template v-if="item.pp_user_name">{{ item.pp_user_name }}</template>
          <span v-if="item.bank_name">({{ item.bank_name }})</span>
        </p>
      </el-col>
      <el-col :sm="6" class="text-right">
        <el-button
          @click="edit"
          size="mini"
          type="text"
          icon="el-icon-edit-outline">
        </el-button>
      </el-col>
    </el-row>
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

