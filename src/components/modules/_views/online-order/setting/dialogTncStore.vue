<template>
  <el-dialog 
    :visible.sync="show"
    :show-close="false"
    :before-close="() => $emit('close')"
    custom-class="dialog-card mw-1056">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ rootLang.tnc_store }}
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <!-- <close-esc @close="$emit('close')" /> -->
        <el-button type="info" @click="$emit('close')">{{ lang.cancel }}</el-button>
        <el-button :loading="loadingSave" type="success" @click="save" >{{ lang.save }}</el-button>
      </div>
    </div>

    <div class="flex-container p-16 mb-12">
      <div class="full-width font-20">Syarat & ketentuan</div>
      <div>
        <el-button type="info" @click="showUseDefault = true">{{ rootLang.use }} Template</el-button>
      </div>
    </div>

    <wysiwyg ref="htmleditor" :online-order-setting="true" v-model="dataSetting.tnc_store_content" />

    <el-dialog
      :visible.sync="showUseDefault"
      :show-close="false"
      append-to-body>
      <div slot="title" class="word-break text-center">Apakah Anda yakin ingin menggunakan template? Syarat & Ketentuan saat ini akan tidak akan tersimpan</div>
      <div class="text-center">
        <div>
          <el-button :loading="loadingSave" type="primary" class="btn-block" @click="setToDefault">Gunakan Template Sekarang</el-button>
          <el-button type="info" class="btn-block" @click="showUseDefault = false">{{ lang.cancel }}</el-button>
        </div>
      </div>
    </el-dialog>

  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { updateSetting } from '@/api/onlineorder'

import CloseEsc from '@/components/modules/CloseEsc'
import baseURL from '@/utils/baseURL'

import Wysiwyg from '@/components/Wysiwyg'

export default {
  name: 'DialogTncStore',
  components: {
    CloseEsc,
    Wysiwyg
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSetting: {
      type: Object,
      default: {}
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      // 
      showUseDefault: false,
      loadingSave: false
     }
  },

  mounted() {
    // this.getBannerDinein()
  },

  methods: {
    setToDefault () {
      this.dataSetting.tnc_store_content = this.dataSetting.tnc_store_default.content
      this.save()
    },

    save() {
      this.loadingSave = true
      let data = {
        tnc_store_content: this.dataSetting.tnc_store_content
      }
      updateSetting(data).then(response => {
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loadingSave = false
        this.showUseDefault = false
        this.$emit('close')
      }).catch(error => {
        this.loadingSave = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    refreshEditor () {
      console.log('ref', this.$refs.htmleditor)
    }
  }
}
</script>