<template>
  <el-dialog
    :visible.sync="show"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :show-close="false"
    fullscreen>
    <div slot="title" class="flex-container">
      <h4 class="dialog-title font-bold flex-grow-1 text-left">{{ rootLang.add_promotion }}</h4>
      <div class="text-right">
        <el-button @click="beforeClose">
          {{ lang.cancel }}
        </el-button>
        <el-button type="info" @click="download">
          {{ rootLang.download }}
        </el-button>
        <el-button :loading="isSaving" type="success" @click="handleSave">
          {{ lang.save }}
        </el-button>
      </div>
    </div>
    <div class="dialog-body">
      <designer
        ref="designer"
        :is-saving="isSaving"
        :form-data="formData"
        @saved="handleSaveSuccess"
      />
    </div>
  </el-dialog>
</template>

<script>
import Designer from './Designer'
import eventHub from '@/eventHub'
export default {
  name: 'DialogFormDesigner',
  components: {
    Designer
  },

  props: ['show', 'rootLang', 'lang', 'formData'],

  data() {
    return {
      isSaving: false
    }
  },

  beforeDestroy() {
    console.log('destory dialog')
  },

  methods: {
    beforeClose() {
      this.$emit('close')
    },
    download() {
      eventHub.$emit('download', 2) 
    },
    handleSave() {
      this.isSaving = true
    },
    handleSaveSuccess() {
      this.isSaving = false
      this.beforeClose()
      this.$emit('refresh')
    }
  }
}
</script>
