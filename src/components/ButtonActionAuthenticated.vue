<template>
  <el-button
    v-if="isButtonVisible"
    :icon="icon"
    :type="type"
    :size="size"
    @click="handleClick">
    <slot />
  </el-button>
</template>

<script>
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],

  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'default'
    },
    icon: {
      type: String,
      default: ''
    },
    permission: {
      type: Array,
      default: () => [] // [permissionId, permissionType]
    }
  },

  computed: {
    isButtonVisible() {
      if (this.permission && this.permission.length === 2) {
        return this.checkCustomPermission(this.permission[0], this.permission[1])
      } else {
        return true
      }
    }
  },

  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
