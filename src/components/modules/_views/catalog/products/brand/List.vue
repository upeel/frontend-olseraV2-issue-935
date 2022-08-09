<template>
  <div class="dd-handle">
    <div class="flex-container flex-container--wrap">
      <div class="hand handle">
        <i class="el-icon-rank"></i>
      </div>

      <div style="flex-grow: 1;">
        {{ item.name }} <span class="grey">({{item.total_product}})</span>
        <div v-if="checkCustomPermission('catalog/brands', 'show')">
          <small class="grey">{{ $lang[langId].comission }} {{item.comission_pct}} %</small>
        </div>
      </div>

      <el-button
        v-if="checkCustomPermission('catalog/brands', 'edit')"
        type="text"
        @click="edit">
        edit
      </el-button>
    </div>
  </div>
</template>

<script>
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  mixins: [checkCustomPermission],
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  methods: {
    edit() {
      this.$emit('edit', this.item)
    }
  }
}
</script>
