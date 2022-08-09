<template>
  <el-card v-loading="loading">
    <div slot="header" class="table-handler-flex">
      <h4 style="flex-grow: 1;">{{ lang.add }} {{ lang.store_branches }}</h4>
      <div>
        <el-button
          size="small"
          @click="cancel"
          type="info">
          {{ lang.cancel }}
        </el-button>
        <button-action-authenticated
          :permission="['settings/storebranches', 'edit']"
          :disabled="disabledSave"
          size="small"
          @click="save"
          type="success"
          icon="el-icon-check">
          {{ lang.save }}
        </button-action-authenticated>
      </div>
    </div>

    <div class="card-body">
      <el-form v-model="data" label-width="140px">
        <el-form-item :label="lang.name" :required="true">
          <el-select
            v-model="data.branch_id"
            :placeholder="$lang[langId].please_input+lang.store_name"
            filterable
            style="width: 100%;">
            <el-option
              v-for="item in branches"
              :label="item.name + '  (' + item.url_id + '.myolsera.com)'"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
          <p class="input-desc oldgrey size-12">
            {{ lang.info_store_branches }}
          </p>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
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
      control: {},
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
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    userStores() {
      return this.$store.state.userStores
    }
  },

  watch: {
    data: {
      handler(data) {
        if (data.branch_id && data.branch_id !== '') {
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
    searchBranches() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let query = {
        search_column: 'role_id',
        search_text: 'OW',
        active: 1,
        per_page: 100
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
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    }
  }
}
</script>
