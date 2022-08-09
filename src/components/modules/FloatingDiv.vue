<template>
  <el-card class="div_float">
    <div v-if="!onGrab" class="div_title">{{ rootLang.save_change }}</div>
    <div v-else class="div_title font-16">Update Perubahan ke GrabFood</div>
    <div class="div_btn">
      <el-button v-if="showCancel" class="btn_cancel" :disabled="disableBtnCancel" @click="handleCancel">{{ lang.cancel }}</el-button>
      <el-button :loading="loading" type="success" class="btn_save" :disabled="disableBtnSave" @click="handleSave">{{ onGrab ? lang.update : lang.save }}</el-button>
    </div>
  </el-card>
</template>
<script>
export default {
  // props: ['showCancel', 'onGrab', 'loading'],
  props: {
    showCancel: {
      type: Boolean,
      default: false
    },

    onGrab: {
      type: Boolean,
      default: false
    },

    loading: {
      type: Boolean,
      default: false
    },

    disableBtnCancel: {
      type: Boolean,
      default: false
    },

    disableBtnSave: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },
  methods: {
    handleSave () {
      this.$emit('confirm')
    },

    handleCancel () {
      this.$emit('cancel')
    }
  }
}
</script>
