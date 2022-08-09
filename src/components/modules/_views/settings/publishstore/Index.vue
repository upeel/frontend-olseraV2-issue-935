<template>
  <div class="content-wrapper">
    <section class="content sales-list no-subpage">
      <el-card class="box-card" v-loading="loading">
        <div slot="header">
          <h4>{{ lang.publish_store }}</h4>
        </div>

        <div class="biodata mb-8">
          <el-checkbox v-model="checked" @change="checkedChange">{{ lang.website_ready_for_publish }}</el-checkbox><br>
          <span style="font-size: 12px">{{ lang.info_website_published }}</span>
        </div>

        <button-action-authenticated
          :permission="['settings/publishstore', 'edit']"
          type="success"
          icon="el-icon-check"
          @click="save">
          {{ lang.save }}
        </button-action-authenticated>
      </el-card>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'publishstore'

export default {
  data() {
    return {
      loading: true,
      disabledSave: false,
      data: {},
      checked: false
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        if (response.data.data.website_published === 1) {
          this.checked = true
        } else {
          this.checked = false
        }
        this.loading = false
      }).catch(error => {
        this.data = {}
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    save() {
      this.loading = true
      this.disabledSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = this.data
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/update'),
        headers: headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.loading = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    checkedChange(val) {
      if (val) {
        this.data.website_published = 1
      } else {
        this.data.website_published = 0
      }
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
