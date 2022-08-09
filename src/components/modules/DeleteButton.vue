<template>
  <el-popover
    v-if="(customPermission && hiddenByPermission() || !customPermission)"
    placement="top"
    width="160"
    v-model="visible">
    <p>{{ $lang[$store.state.userStores.langId].are_you_sure }}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="visible = false">{{ lang.cancel }}</el-button>
      <el-button type="primary" size="mini" @click="confirm">{{ lang.remove }}</el-button>
    </div>
    <el-button
      v-if="!block"
      slot="reference"
      icon="el-icon-delete"
    />
    <el-button
      v-else
      :loading="loading"
      icon="el-icon-delete"
      slot="reference"
      class="btn-block color-danger">
      <span v-if="text">
        {{ text }}
      </span>
      <span v-else>
        {{ rootLang.delete }}
      </span>
    </el-button>
  </el-popover>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  props: {
    block: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    customPermission: {
      type: String,
      default: ''
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visible: false
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  methods: {
    confirm() {
      this.$emit('confirm')
      this.visible = false
    },
    hiddenByPermission() {
      return this.checkCustomPermission(this.customPermission, 'destroy')
    }
  }
}
</script>


