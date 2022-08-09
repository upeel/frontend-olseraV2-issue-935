<template>
  <ckeditor
    ref="CKEditor"
    v-model="localValue"
    :editor="editor"
    :config="editorConfig"
    @input="handleInput"
  />
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadAdapter from '../utils/uploadAdapter'

import { baseApi } from 'src/http-common.js'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [basicComputedMixin],
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  components: {
    ckeditor: CKEditor.component
  },

  data() {
    return {
      localValue: this.value,
      editor: ClassicEditor,
      editorConfig: {
          toolbar: [ 'heading', '|',
            'fontfamily', 'fontsize', '|',
            'alignment', '|',
            'fontColor', 'fontBackgroundColor', '|',
            'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
            'link', '|',
            'outdent', 'indent', '|',
            'bulletedList', 'numberedList', 'todoList', '|',
            'code', 'codeBlock', '|',
            'insertTable', '|',
            'uploadImage', 'blockQuote', '|',
            'undo', 'redo' ],
          table: {
              toolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
          },
          extraPlugins: [this.uploader]
      },
    }
  },

  computed: {
    uploadUrl () {
      return baseApi(this.selectedStore.url_id, this.langId, 'product/upload')
    },

    // editorConfig() {
    //   return {
    //     allowedContent: true,
    //     autoParagraph: false,
    //     fillEmptyBlocks: false,
    //     extraPlugins: [UploadAdapter],
    //     // plugins: [SimpleUploadAdapter]
    //     // extraPlugins: 'easyimage',
    //     // removePlugins: 'image',
    //     // cloudServices_uploadUrl: baseApi(this.selectedStore.url_id, this.langId, 'product/upload'),
    //     // Note: this is a token endpoint to be used for CKEditor 4 samples only. Images uploaded using this token may be deleted automatically at any moment.
    //     // To create your own token URL please visit https://ckeditor.com/ckeditor-cloud-services/.
    //     // cloudServices_tokenUrl: baseApi(this.selectedStore.url_id, this.langId, 'product/upload/') + 'Bearer ' + this.$store.state.user.token.access_token,
    //     // toolbar:[
    //     //   ['Bold','Italic','Underline', 'Strike','Subscript','Superscript'],
    //     //   ['NumberedList','BulletedList','-','Outdent','Indent'],
    //     //   ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock', '-', 'Table'],
    //     //   ['Styles','Format','Font','FontSize', 'Source', 'Fullscreen']
    //     // ]
    //   }
    // }
  },

  mounted() {
    // console.log('id', this.selectedStore.url_id)
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
      // console.log(editor)
      var dtd = CKEDITOR.dtd
      this.$emit('input')
      // console.log(dtd)
      for (var e in CKEDITOR.tools.extend({}, dtd.$nonBodyContent, dtd.$block, dtd.$listItem, dtd.$tableContent)) {
        editor.dataProcessor.writer.setRules(e, {
          indent: false,
          breakBeforeOpen: false,
          breakAfterOpen: false,
          breakBeforeClose: false,
          breakAfterClose: false
        })
      }
    },

    uploader(editor) {
        let url = {
          url_id: 'setdemo1',
          langId: this.langId
        }
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            return new UploadAdapter( loader, url );
        };
    },
  }
}
</script>
