<template>
  <div class="panel-body edit-form" v-loading="loading">
    <el-form v-if="product">
      <div class="container">

        <div class="row">
          <div class="text-right col-md-4">
            <label>{{ lang.photo }}</label>
            <p>{{ $lang[langId].recommendations_image }}</p>
          </div>
          <div class="col-md-8">
            <draggable
              v-model="newPhoto"
              :list="newPhoto"
              :options="{group:{ name:'brand'}}"
              handle=".hand"
              class="dd-list dragArea"
              style="display: flex !important; flex-wrap: wrap;"
              @change="sortsChanged">
              <div class="dd-item" style="width: 200px" v-for="(item) in newPhoto" :key="item.id">
                <list :item="item" @remove="handleRemove" />
              </div>
              <el-form-item prop="photos">
                <el-upload class="upload-demo"
                  :action="uploadPhotoUrl"
                  list-type="picture-card"
                  :show-file-list="false"
                  :headers="requestHeaders"
                  :on-progress="handleProgress"
                  :on-success="handleUploadSuccess"
                  :on-remove="handleRemove"
                  :before-upload="beforeAvatarUpload"
                  multiple>
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </draggable>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 text-right">
            <label>{{ lang.product_name }}</label>
            <p>{{ $lang[langId].fill_input_product }}</p>
          </div>
          <div class="col-md-8">
            <el-form-item prop="name">
              <el-input v-model="product.name"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 text-right">
            <label>{{ lang.group }}</label>
              <p>{{ lang.info_choose_existing_or_add_new }}</p>
          </div>
          <div class="col-md-8">
            <el-form-item prop="category_name">
              <select-grouped-product-category
                :allow-create="true"
                :selected-id="product.klasifikasi"
                @change="handleChangeSelectCategory"
                @create="handleCreateCategory"
              />
            </el-form-item>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 text-right">
            <label>{{ lang.collection }}</label>
            <p>{{ lang.info_collection }}</p>
          </div>
          <div class="col-md-8">
            <el-form-item prop="collection_names">
              <el-select
                v-model="product.collection_names"
                multiple
                allow-create
                filterable
                remote 
                :remote-method="searchCollection" 
                :loading="loadingSearch"
                :placeholder="lang.please_select"
                value-key="id">
                <!-- <el-option v-for="item in collections" :key="item.id" :label="item.name" :value="item.name"></el-option> -->
                <template
                  v-for="item in collections">
                  <template v-if="!item.children.length">
                    <el-option
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </template>
                  <template v-else-if="item.children.length">
                    <el-option-group
                      :key="item.id"
                      :label="item.name">
                      <el-option
                        v-for="child in item.children"
                        :key="child.id"
                        :label="child.name"
                        :value="child.name">
                      </el-option>
                    </el-option-group>
                  </template>
                </template>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 text-right">
            <label>{{ lang.brand }}</label>
            <p>{{ lang.info_choose_existing_or_add_new }}</p>
          </div>
          <div class="col-md-8">
            <el-form-item prop="brand_name">
              <el-select v-model="product.brand_name" allow-create clearable filterable :placeholder="lang.please_select" remote :remote-method="searchBrand" :loading="loadingSearch">
                <el-option v-for="item in brandDatas" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 text-right">
            <label>{{ lang.sku }}</label>
             <p>{{ lang.info_sku_or_barcode }}</p>
          </div>
          <div class="col-md-8">
            <el-form-item prop="sku">
              <el-input v-model="product.sku"></el-input>
            </el-form-item>
          </div>
        </div>

        <div v-if="userRole.is_pos_only !== 1" class="row">
          <div class="col-md-4 text-right">
            <label>{{ lang.condition }}</label>
          </div>
          <div class="col-md-8">
            <el-form-item prop="condition_id">
              <!-- <el-select v-model="product.condition_id">
                <el-option :key="null" :label="$lang[langId].there_is_no" :value="null" />
                <el-option key="N" :label="lang.new" value="N" />
                <el-option key="R" :label="$lang[langId].refurbished" value="R" />
                <el-option key="S" :label="$lang[langId].second" value="S" />
              </el-select> -->
              <el-autocomplete 
                v-model="product.condition_name" 
                :fetch-suggestions="getConditionSearch" 
                :placeholder="lang.search" 
                @select="getConditionSelect">
              </el-autocomplete>
            </el-form-item>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 text-right">
            <label>{{ rootLang.product_free_tax }}</label>
             <p>{{ $lang[langId].product_tax_free }}</p>
          </div>
          <div class="col-md-8 switch-varian">
            <el-form-item>
              <el-switch
                v-model="product.non_taxable"
                :inactive-value="0"
                :active-value="1"
                inactive-color="#ff4949"
              />
              <span v-if="product.non_taxable">
                <p class="desc-switch">
                  <strong>{{ lang.yes }}</strong>
                </p>
              </span>
              <div v-else>
                <p class="desc-switch">
                  <strong>{{ lang.no }}</strong>
                </p>
              </div>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import basicComputedMixin from '@/mixins/basicComputedMixin'
  import draggable from 'vuedraggable'
  import List from '@/components/ListPhoto'

  import axios from 'axios'
  import { baseApi } from 'src/http-common.js'
  import { searchConditions } from '@/api/product'

  import SelectGroupedProductCategory from 'components/modules/SelectGroupedProductCategory'
  export default {
    name: 'editProfile',
    props: ['data', 'newPhoto'],
    components: {
      SelectGroupedProductCategory,
      draggable,
      List
    },
    
    mixins: [basicComputedMixin],

    data() {
      return {
        loading: false,
        product: this.data,
        file: this.newPhoto,
        collections: [],
        brandDatas: [],
        uploadPhotoUrl: '',
        requestHeaders: {
          'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
        },
        params: {
          per_page: 100
        },
        loadingSearch: false
      }
    },

    computed: {
      fileList() {
        if (this.file) {
          let fileList = this.file.map((item, idx, array) => {
            item.url = item.photo_md
            item.name = item.title
            return item
          })
          return fileList
        }
      },
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
      userRole() {
        const selectedStore = this.$store.getters.selectedStore
        return {
          role_id: selectedStore.role_id,
          role_name: selectedStore.role_name,
          is_pos_only: selectedStore.is_pos_only,
          is_mobile: selectedStore.is_mobile
        }
      }
    },

    mounted() {
      this.getSelectCollection(false)
      this.getSelectBrand(false)
      this.uploadPhotoUrl = baseApi(this.selectedStore.url_id, this.langId, 'product/upload')
    },

    methods: {
      handleUploadSuccess(response, file, fileList) {
        this.file.push(response.data[0])
        this.$emit('updatephoto', this.file)
        this.loading = false
        // this.$emit('save')
      },

      handleRemove(file, fileList) {
        // console.log('file', file)
        this.file.splice(this.fileList.indexOf(file), 1)
        this.$emit('removephoto', this.file)
      },

      handleProgress(resp, file, fileList) {
        this.loading = true
      },

      getSelectCollection(search) {
        if (!search) {
          this.loading = true
        }
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'collection'),
          headers: headers,
          params: this.params
        })
          .then(response => {
            this.collections = response.data.data
            if (!search) {
              this.loading = false
            }
            this.loadingSearch = false
          })
          .catch(error => {
            console.log(error)
            if (!search) {
              this.loading = false
            }
            this.loadingSearch = false
          })
      },

      getSelectBrand(search) {
        if (!search) {
          this.loading = true
        }
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
          headers: headers,
          params: this.params
        })
          .then(response => {
            this.brandDatas = response.data.data
            if (!search) {
              this.loading = false
            }
            this.loadingSearch = false
          })
          .catch(error => {
            console.log(error)
            if (!search) {
              this.loading = false
            }
            this.loadingSearch = false
          })
      },

      handleChangeSelectCategory(val) {
        this.product.product_group_id = val.id
      },

      handleCreateCategory (val) {
        this.product.product_group_name = val
      },

      searchBrand(data) {
        if (data != '') {
          this.params.search_column = 'name'
          this.params.search_text = data
          this.loadingSearch = true
          this.getSelectBrand(true)
        } else {
          this.params = {
            per_page: 100
          }
          this.loadingSearch = true
          this.getSelectBrand(true)
        }
      },

      searchCollection(data) {
        if (data != '') {
          this.params.search_column = 'name'
          this.params.search_text = data
          this.loadingSearch = true
          this.getSelectCollection(true)
        } else {
          this.params = {
            per_page: 100
          }
          this.loadingSearch = true
          this.getSelectCollection(true)
        }
      },

      sortsChanged() {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        let sortedIds = this.newPhoto
        sortedIds = sortedIds.map((item) => {
          return {id: item.id}
        })
        let data = {
          product_id: this.data.id,
          sorted_ids: sortedIds
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productphotos/sorting'),
          headers: headers,
          data
        }).then(response => {
          this.newPhoto = response.data.data
          this.$message({
            type: 'success',
            message: 'Success'
          })
        }).catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      },

      beforeAvatarUpload(file) {
        console.log('size', file.size / 1024 / 1024)
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error(this.rootLang.image_over_size + ' 2MB!')
        }
        return isLt2M
      },

      getConditionSearch(queryString, callback) {
      // this.loading = true
      let params = {
        q: queryString
      }

      searchConditions(params).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchDataUoms = response.data.data
        callback(this.searchDataUoms)
      })
      .catch(error => {
        console.log(error)
      })
    },

    getConditionSelect (item) {
      console.log('uom', item)
      this.product.condition_id = item.id
    },

    }
  }
</script>
