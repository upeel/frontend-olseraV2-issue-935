<template>
  <div id="app">
    <!-- <ckeditor
      v-if="!onlineOrderSetting"
      ref="CKEditor"
      v-model="localValue"
      :config="editorConfig"
      @input="handleInput"
      @ready="editorReadyHandler"
    /> -->
    <jodit-editor v-if="!onlineOrderSetting" v-model="localValue" :config="joditConfig" @input="handleInput"/>
    <jodit-editor v-else-if="onlineOrderSetting" v-model="localValue" :config="joditConfig" :buttons="buttons" @input="handleInput"/>
  </div>
</template>

<script>
import CKEditor from 'ckeditor4-vue'

import { baseApi } from 'src/http-common.js'

import 'jodit/build/jodit.min.css'
import { JoditEditor } from 'jodit-vue'


import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [basicComputedMixin],
  props: {
    value: {
      type: String,
      default: ''
    },
    onlineOrderSetting: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 340
    }
  },

  components: {
    ckeditor: CKEditor.component,
    JoditEditor
  },

  watch: {
    value(data) {
      this.localValue = data
    }
  },

  data() {
    return {
      localValue: this.value,
      buttons: ['bold','italic','underline','ul','ol','indent','outdent','left','fontsize','paragraph']
    }
  },

  computed: {
    uploadUrl () {
      return baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/globaluploadonly')
    },

    joditConfig () {
      return {
        uploader: {
          // url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
          url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/globaluploadonly'),
          headers: {
            Authorization: 'Bearer ' + this.token.access_token
          },
          process: function (resp) {
            console.log('r', resp.data)
            return {
                files: resp.data,
                path: resp.data.path,
                baseurl: resp.data[0].photo_md,
                error: resp.error,
                msg: resp.data.messages
            };
          },
          // insertImageAsBase64URI: true
          filesVariableName: function (t) {
            return 'file[' + t + ']';
          },
          isSuccess: function (resp) {
              // return !resp.error;
              console.log('suc', !resp.error)
              return resp
          },
          defaultHandlerSuccess: function (data, resp) {
            // console.log('data', data)
            var i, field = this.options.uploader.filesVariableName;
            // console.log('resp', field)
            // if (data[field] && data[field].length) {
            //   for (i = 0; i < data[field].length; i += 1) {
                  this.selection.insertImage(data.baseurl);
            //   }
            // }
          },
        },
      }
    },

    editorConfig() {
      return {
        allowedContent: true,
        autoParagraph: false,
        fillEmptyBlocks: false,
        height: this.height
        // extraPlugins: 'easyimage',
        // removePlugins: 'image',
        // cloudServices_uploadUrl: baseApi(this.selectedStore.url_id, this.langId, 'product/upload'),
        // Note: this is a token endpoint to be used for CKEditor 4 samples only. Images uploaded using this token may be deleted automatically at any moment.
        // To create your own token URL please visit https://ckeditor.com/ckeditor-cloud-services/.
        // cloudServices_tokenUrl: baseApi(this.selectedStore.url_id, this.langId, 'product/upload/') + 'Bearer ' + this.$store.state.user.token.access_token,
        // toolbar:[
        //   ['Bold','Italic','Underline', 'Strike','Subscript','Superscript'],
        //   ['NumberedList','BulletedList','-','Outdent','Indent'],
        //   ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock', '-', 'Table'],
        //   ['Styles','Format','Font','FontSize', 'Source', 'Fullscreen']
        // ]
      }
    }
  },

  mounted() {
    // var writer = editor.dataProcessor.writer
    // const editor = this.$refs.CKEditor
    // this.$nextTick(() => {
    //   editor.on('instanceReady', () => {
    //     console.log(this)
    //   })
    // })
  },

  methods: {
    handleInput() {
      // console.log(this.localValue)
      this.$emit('input', this.localValue)
    },

    editorReadyHandler(editor) {
      console.log(editor)
      var dtd = CKEDITOR.dtd
      this.$emit('input', this.localValue)
      // // console.log(dtd)
      for (var e in CKEDITOR.tools.extend({}, dtd.$nonBodyContent, dtd.$block, dtd.$listItem, dtd.$tableContent)) {
        editor.dataProcessor.writer.setRules(e, {
          indent: false,
          breakBeforeOpen: false,
          breakAfterOpen: false,
          breakBeforeClose: false,
          breakAfterClose: false
        })
      }
    }
  }
}
</script>
