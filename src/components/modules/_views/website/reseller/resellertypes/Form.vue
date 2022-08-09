<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :md="12">
            <h4>{{ lang.add_reseller_type }}</h4>
          </el-col>
          <el-col :md="12" class="text-right">
            <el-button
              size="small"
              @click="cancel"
              type="info">
              {{ lang.cancel }}
            </el-button>
            <el-button
              :disabled="disabledSave"
              size="small"
              @click="save"
              type="success"
              icon="el-icon-check">
              {{ lang.save }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="card-body">
        <el-form v-model="data" label-width="140px">
          <el-form-item :label="lang.reseller_type_name" :required="true">
            <el-input type="text" v-model="data.name">
            </el-input>
          </el-form-item>

          <el-form-item :label="lang.product_groups" :required="true">
            <el-select
              style="width: 100%;"
              v-model="data.group_ids"
              filterable
              remote
              multiple
              :placeholder="lang.search+' '+lang.product_groups"
              reserve-keyword
              :loading="control.searchingProductGroups"
              :remote-method="searchProductGroups">
              <el-option
                v-for="item in productgroups"
                :label="item.name"
                :value="item.id"
                :key="item.id">
              </el-option>
            </el-select>
            <p class="input-desc size-12 oldgrey">
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

const apiEndPoint = 'productgroup'

export default {
  props: ['saved', 'loading', 'formData', 'roleOptions'],

  data() {
    return {
      disabledSave: true,
      dialogVisible: false,
      data: {},
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
        if ((data.name && data.name !== '') && (data.group_ids && data.group_ids !== '') && (data.discount && data.discount !== '')) {
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

  methods: {
    searchProductGroups(query) {
      this.control.searchingProductGroups = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
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
      let data = Object.assign({}, this.data)
      data.group_ids = data.group_ids.join(',')
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    }
  }
}
</script>
