<template>
  
    <div class="content-wrapper">
      <section class="content">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ lang.add }} {{ lang.look_book }}</h4>
            <div>
              <el-button type="text" @click="cancel">{{ lang.cancel }}</el-button>
              <el-button
                @click="save"
                icon="el-icon-check"
                :disabled="disabledSave"
                type="success">
                {{ lang.save }}
              </el-button>
            </div>
          </div>

          <div class="card-body" v-loading="loading">
            <el-form
              :model="data"
              :rules="dataRules"
              ref="packageForm"
              class="form-sidebyside">
              <div class="row">
                <div class="col-md-6">
                  <div class="open-create-body">
                      <el-row :gutter="10">
                        <el-col :md="11">
                          <el-form-item :label="this.$lang[langId].info_combo" class="form-subtitle">
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :md="11">
                          <el-form-item :label="lang.name" :required="true">
                          </el-form-item>
                        </el-col>
                        <el-col :md="13">
                          <el-form-item prop="name">
                            <el-input style="width: 100%;" type="text" v-model="data.name"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :md="11">
                          <el-form-item :label="lang.group">
                            <p>{{ lang.info_choose_existing_or_add_new }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :md="13">
                          <el-form-item prop="look_book_group">
                            <el-select
                              style="width: 100%;"
                              v-model="data.look_book_group"
                              filterable
                              allow-create
                              remote
                              reserve-keyword
                              :placeholder="this.$lang[langId].please_input+lang.look_book_group"
                              :remote-method="searchLookbookGroups"
                              :loading="searchingLookbookGroups">
                              <el-option
                                v-for="item in searchResultLookbookGroups"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                  </div>
                </div>

                <div class="col-md-6">
                  <el-row :gutter="10">
                    <el-col :md="11">
                      <el-form-item :label="$lang[langId].product_in_lookbook" class="form-subtitle">
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :md="11">
                      <el-form-item :label="lang.product" :required="true">
                        <p>{{ lang.info_combo_products }}</p>
                      </el-form-item>
                    </el-col>
                    <el-col :md="13">
                      <el-form-item prop="relateds">
                        <el-select
                          style="width: 100%;"
                          v-model="data.relateds"
                          multiple
                          filterable
                          remote
                          reserve-keyword
                          :placeholder="lang.info_auto_complete_product"
                          :remote-method="searchProducts"
                          :loading="searchingProducts">
                          <el-option
                            v-for="item in searchResultProducts"
                            :key="item.product_id"
                            :label="item.name"
                            :value="item.product_id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-md-2">
                </div>
                <div class="col-md-10" style="padding-left:70px;">
                  <el-checkbox v-model="data.published" :true-label="1" :false-label="0">{{ lang.publish }}</el-checkbox>
                  <p style="padding-left: 25px;">{{ lang.info_publish_to_website }}</p>
                </div>
              </div>
            </el-form>
          </div>
        </el-card>
      </section>
    </div>
  
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      searchingProducts: false,
      searchingLookbookGroups: false,
      disabledSave: true,
      data: {
        published: 1
      },
      searchResultProducts: [],
      searchResultLookbookGroups: [],
      dataRules: {
        name: [
          { required: true, message: 'This is required field', trigger: 'blur' },
          { min: 2, message: 'Length should min. 2', trigger: 'blur' }
        ]
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
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    data: {
      handler(val) {
        console.log(val)
        if (val.name !== '' && (val.relateds && val.relateds.length > 0)) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    searchProducts(query) {
      //
      this.searchingProducts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productsearch'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProducts = false
          this.searchResultProducts = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProducts = false
          this.searchResultProducts = []
        })
      }
    },
    searchLookbookGroups(query) {
      //
      this.searchingLookbookGroups = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'lookbookgroup'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingLookbookGroups = false
          this.searchResultLookbookGroups = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingLookbookGroups = false
          this.searchResultLookbookGroups = []
        })
      }
    },
    save() {
      this.searchingProducts = true
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      data.relateds = data.relateds.join(',')
      if (Number.isInteger(data.look_book_group)) {
        data.look_book_group_id = data.look_book_group
      } else {
        data.look_book_group_id = data.look_book_group
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook'),
        headers,
        data
      }).then(response => {
        this.searchingProducts = false
        this.disabledSave = false
        this.$router.push({path: '/catalog/lookbook/' + response.data.data.id})
      }).catch(error => {
        console.log(error)
        this.searchingProducts = false
        this.disabledSave = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: 'Error'
        })
      })
    },
    cancel() {
      this.$router.push({path: '/catalog/lookbook'})
    }
  },

  mounted() {
  }
}
</script>
