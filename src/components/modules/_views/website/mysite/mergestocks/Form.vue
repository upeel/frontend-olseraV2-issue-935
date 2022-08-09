<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header" class="clearfix">
        <h4>{{ lang.merge_stocks }}</h4>
        <div class="card-buttons">
          <el-button
            :disabled="disabledSave"
            size="small"
            @click="save"
            type="success"
            icon="el-icon-check">
            {{ lang.save }}
          </el-button>
          <el-button
            v-if="data.id"
            :disabled="disabledSave"
            size="small"
            @click="remove"
            type="danger"
            icon="el-icon-delete">
          </el-button>
        </div>
      </div>

      <div class="card-body">
        <el-form v-model="data" label-width="120px">
          <el-form-item :required="true" :label="this.$lang[langId].select_store">
            <el-select v-model="data.ref_id" :label="lang.please_select">
              <el-option
                v-for="item in branches"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p class="size-12 input-desc oldgrey">
              {{ lang.info_store_merge_stocks }}
            </p>
          </el-form-item>
          <el-form-item :label="this.$lang[langId].alias">
            <el-input type="text" v-model="data.alias" @keyup.native.enter="save"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'storebranches/'

export default {
  props: ['saved', 'loading', 'formData'],

  data() {
    return {
      disabledSave: true,
      data: {},
      branches: [],
      loading: false
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
    userStores() {
      return this.$store.state.userStores
    }
  },

  watch: {
    data: {
      handler(data) {
        if ((data.alias && data.alias !== '') && (data.ref_id && data.ref_id !== '')) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    this.searchBranches()
  },

  methods: {
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    },
    searchBranches() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let query = {
        search_column: 'role_id',
        search_text: 'OW',
        active: 1
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'gettoko'),
        params: query,
        headers: headers
      }).then(response => {
        this.branches = response.data.data
        this.loading = false
      }).catch(errror => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
  }
}
</script>
