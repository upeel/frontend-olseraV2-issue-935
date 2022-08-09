<template>
  <div class="dd-handle">
    <span
      v-if="checkCustomPermission('website/sitenav', 'edit')"
      class="hand">
      <i class="el-icon-rank"></i>
    </span>
    <el-row :gutter="10">
      <el-col :span="16">
        {{ item.title }} <br/>
        <span class="size-12 oldgrey">
          <i class="fa fa-link fa-fw" aria-hidden="true"></i>
          {{ item.link_type_name }}
        </span>
      </el-col>
      <el-col :span="8" class="text-right">
        <button-action-authenticated :permission="['website/sitenav', 'edit']" size="mini" type="primary"
          @click="edit(item)" class="btn-plain" icon="el-icon-edit">
          {{ lang.edit }}
        </button-action-authenticated>
      </el-col>
    </el-row>
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
