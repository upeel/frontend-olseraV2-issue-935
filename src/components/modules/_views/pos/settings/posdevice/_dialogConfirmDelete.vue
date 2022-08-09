<template>
  <el-dialog
    :visible.sync="show"
    :before-close="beforeClose"
    width="420px"
    append-to-body
    modal-append-to-body
    custom-class="dialog-without-header">
    <div class="font-18 mb-8">
      Apakah Anda yakin ingin mencabut akses perangkat ini?
    </div>
    <div>
      Perangkat yang berhasil dicabut aksesnya tidak dapat mengkases POS Anda
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">
        {{ lang.cancel }}
      </el-button>
      <el-button type="danger" @click="confirm">
        Ya, cabut akses
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.langId]
    }
  },

  methods: {
    beforeClose() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
