<template>
  <div>
    <el-card class="box-card" v-loading="loading">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :md="12">
            <h4>{{ lang.manage }} {{ lang.group }} - {{data.name}}</h4>
          </el-col>
          <el-col :md="12" class="text-right">
            <el-button
              size="small"
              @click="cancel"
              type="info">
              {{ lang.cancel }}
            </el-button>
            <el-button
              v-if="data.group_ids < 1"
              :disabled="disabledSave"
              size="small"
              @click="save"
              type="success"
              icon="el-icon-check">
              {{ lang.save }}
            </el-button>
            <el-button
              v-else
              :disabled="disabledSave"
              size="small"
              @click="update"
              type="success"
              icon="el-icon-check">
              {{ lang.save }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="card-body">
        <el-form v-model="data" label-width="140px">
          <el-form-item :label="lang.product_group" :required="true">
            <div
              v-if="data.group_ids && data.group_ids.length > 0"
              style="margin-bottom: 12px;">
              <el-tag
                v-loading="loadingEL"
                v-for="(item, key) in data.group_ids"
                type="info"
                closable
                @close="remove(item, key)"
                :key="key">
                {{item.product_group_name}}
              </el-tag>
            </div>

            <el-select
              v-if="data.group_ids < 1"
              key="selectGroup"
              style="width: 100%;"
              v-model="fresh.group_ids"
              filterable
              remote
              multiple
              :placeholder="lang.info_auto_complete_product_group"
              reserve-keyword
              :loading="control.searchingProductGroups"
              :remote-method="searchProductGroups">
              <el-option
                v-for="(item, key) in productgroups"
                :label="item.name"
                :value="item.id"
                :key="key">
              </el-option>
            </el-select>
            <p v-if="data.group_ids < 1"
              class="input-desc size-12 oldgrey">
              {{ lang.desc_can_add_other_groups }}
            </p>
          </el-form-item>

          <el-form-item :label="lang.discount" :required="true">
            <el-input type="number" :placeholder="this.$lang[langId].input_number" v-model="data.discount">
              <template slot="append">%</template>
            </el-input>
            <p class="input-desc size-12 oldgrey">
              {{ lang.desc_price_cut_for_reseller }}
            </p>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'reseller/type'

export default {
  props: ['saved', 'loading', 'formData'],

  data() {
    return {
      loadingEL: false,
      disabledSave: true,
      dialogVisible: false,
      data: {},
      fresh: {},
      control: {
        searchingProductGroups: false
      },
      productgroups: []
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
    }
  },

  watch: {
    data: {
      handler(data) {
        if ((data.group_ids && data.group_ids !== '') && (data.discount && data.discount !== '')) {
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
        this.data = data
        this.data.group_ids = data.group_ids
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    searchProductGroups(query) {
      this.control.searchingProductGroups = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
        params: {
          search_column: 'name',
          search_text: query
        },
        headers: headers
      }).then(response => {
        this.productgroups = response.data.data
        this.control.searchingProductGroups = false
      }).catch(() => {
        this.control.searchingProductGroups = false
        this.productgroups = []
      })
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      this.disabledSave = true
      let data = {...this.data}
      if (this.fresh.group_ids && this.fresh.group_ids.length > 0) {
        data.group_ids = [...this.fresh.group_ids]
      }
      data.group_ids = data.group_ids.join(',')
      this.$emit('save', data)
    },
    update() {
      this.disabledSave = true
      let data = {...this.data}
      data.group_ids = data.group_ids.map(item => {
        return item.product_group_id
      })

      data.group_ids = data.group_ids.join(',')
      this.$emit('updategroups', data)
    },
    remove(data, key) {
      this.loadingEL = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + 'deleteproductgroup/' + data.id),
        headers
      }).then(response => {
        this.data.group_ids.splice(key, 1)
        this.$emit('group-removed')
        this.loadingEL = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        if(this.data.group_ids.length < 1) {
          this.cancel()
        }
      }).catch(error => {
        this.loadingEL = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  }
}
</script>
