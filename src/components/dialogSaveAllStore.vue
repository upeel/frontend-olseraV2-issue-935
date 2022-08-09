<template>
  <el-dialog
  :visible.sync="showDialog"
  :show-close="false"
  append-to-body>
  <div class="text-center">
    <div class="font-20">Anda Yakin simpan ke semua toko?</div>
    <div class="full-width mt-24">
      <el-button class="btn-block" @click="handleClose">{{ lang.cancel }}</el-button>
      <el-button type="danger" class="btn-block" @click="handleSave">{{ lang.yes }}</el-button>
    </div>
  </div>
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'DialogSaveAllStore',
  mixins: [basicComputedMixin],

  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClose () {
      this.$emit('close')
    },

    handleSave () {
      this.$emit('save')
    }
  }
}
</script>