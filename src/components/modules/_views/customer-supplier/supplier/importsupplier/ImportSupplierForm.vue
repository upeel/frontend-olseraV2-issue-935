<template>
  <div class="content-wrapper">
    <section class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <a
            :href="baseURL + '/olsera_supplier_import_template.csv'">
            <el-button icon="el-icon-download" native-type="submit" v-on:click=" collapsedorder = !collapsedorder">
              Download Template
            </el-button>
          </a>
        </div>
        <div class="card-body">
          <el-card>
            <div slot="header" class="clearfix">
              <p>Import dari CSV (max. 500 baris)</p>
            </div>
            <div id="app">
              <vue-dropzone 
                ref="dropzone" 
                id="drop1" 
                :options="{
                  url: baseURL + '/api/' + this.selectedStore.url_id + '/admin/v1/' + this.selectedStore.lang_code + '/supplier/importfromcsv',
                  headers: {
                    'Authorization' : 'Bearer ' + this.token.access_token,
                    'Cache-Control': null,
                  },
                  method: 'post',
                  acceptedFiles: '.csv'
                  }"
                @vdropzone-success="afterComplete"
                @vdropzone-error="failed"
              ></vue-dropzone>
              <button @click="removeAllFiles">Remove All Files</button>
            </div>
          </el-card>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import draggable from 'vuedraggable'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import baseURL from '@/utils/baseURL'

export default {
  components: {
    vueDropzone: vue2Dropzone,
    draggable,
    tokenc: ''
  },
  data() {
    return {
      dropOptions: {
        aa: 'aa'
      }
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    baseURL() {
      return baseURL
    }
  },
  watch: {
    'store.getters.selectedStore': function () {
      this.getData()
    }
  },
  mounted() {
    this.getStore()
  },
  methods: {
    getStore() {
      this.tokenc = this.token.access_token
      console.log(this.tokenc)
    },
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        this.$notify({
          title: 'Sukses',
          message: response.data + ' Supplier.'
        })
        this.$router.push({path: '/customersupplier/supplier'})
      }
    },
    failed(file, message, xhr) {
      let errorMessage = ''
      if (this.selectedStore.lang === 'id') {
        errorMessage = 'Gagal Menambahkan Supplier'
      } else {
        errorMessage = 'Add Supplier Failed'
      }
      this.$notify({
        title: 'Gagal',
        message: errorMessage
      })
      const $ = require('jquery')
      $('.dz-error-message span').text(errorMessage)
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles()
    }
  }
}
</script>
