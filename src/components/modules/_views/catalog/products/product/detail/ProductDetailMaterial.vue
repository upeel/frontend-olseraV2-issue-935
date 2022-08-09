<template>
  <div class="row" v-loading="loading">
    <div class="col-md-12">
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <div class="box-title" style="flex-grow: 1;">
            <h4>{{ lang.material_items }}</h4>
            <p v-if="showMaterial">{{ total }} {{ lang.item }} {{ lang.material }}</p>
            <p v-else>0 {{ lang.item }} {{ lang.material }}</p>
          </div>

          <div>
            <button-action-authenticated
              :permission="['catalog/products', 'edit']"
              type="primary"
              @click="createDialog">
              {{ lang.add }}
            </button-action-authenticated>
          </div>
        </div>

        <div class="card-body">
          <div v-if="!showMaterial" class="no-product">
            <p>{{ $lang[langId].no_product }}</p>
            <img src="/static/img/no-data.svg" alt="No Data Picture">
          </div>

          <div v-else>
            <div class="table-handler-flex">
              <el-select class="inline-form" v-model="params.per_page" @change="handleSizeChange" filterable :placeholder="lang.please_select" size="small">
                <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>

            <el-divider></el-divider>

            <div v-for="(group, index) in materialsGroup" :key="index">
              <div v-if="group.materials.length > 0">
                <div>
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>{{ group.name }}</strong></p>
                    </div>
                  </div>
                  <el-row>
                    <el-col :span="12" v-for="(list, item) in group.materials" :key="item">
                      <div class="flex-container">
                        <el-avatar
                          :src="list.photo_md"
                          :alt="list.product_name"
                          class="mr-8" />
                        <div>
                          <p>
                            <strong>{{ list.product_name }}</strong>
                            <div>{{ list.product_variants_name }}</div>
                          <p>{{ lang.qty }}
                            <span v-if="selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2' || selectedStore.url_id === 'antotest' || selectedStore.url_id === 'antotest2'">{{ list.qty }}</span>
                            <span v-else><el-input-number controls-position="right" :min="0" v-model="list.qty" @change="materialSave(list)"></el-input-number></span>
                          </p>
                          <p>{{ lang.unit_of_measurement }}: (1 {{ list.uom }} - {{ list.fuom_conversion }})</p>
                          <el-button v-if="selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2' || selectedStore.url_id === 'antotest' || selectedStore.url_id === 'antotest2'" circle @click="handleEditItem(list)" ><svg-icon icon-class="edit-2" class="color-primary" /></el-button>
                          <el-button circle icon="el-icon-delete" style="color:#FF0000;" @click="deleteMaterial(list)"></el-button>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div v-else class="card-bahan">
                <strong>{{ group.name }}</strong>
              </div>
            </div>
            <div class="block text-center" style="margin-top: 12px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="params.currentPage" :page-size="params.per_page" layout="prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :title="lang.add_materials_or_recipes" :visible.sync="materialCreate">
      <template v-if="!isEdit">
        <el-form :model="form">
          <el-form-item
            v-if="variants.length"
            :label="lang.apply_to_variant"
            :label-width="formLabelWidth">
            <el-select
              v-model="form.variant"
              :placeholder="lang.please_select"
              filterable
              class="inline-form"
              @change="handleSelected(form.variant)">
              <el-option :label="lang.all" :value="0" />
              <el-option
                v-for="item in variants"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="lang.product" :label-width="formLabelWidth">
            <el-autocomplete v-model="form.product_name" :fetch-suggestions="getProductSearch" :placeholder="lang.search_products" @select="getProductSelect"></el-autocomplete>
            <div>
              <el-tag :key="tag" v-for="tag in dataTag" closable :disable-transitions="false" @close="handleClose(tag)">
                {{tag}}
              </el-tag>
            </div>
          </el-form-item>
          <hr>
          <el-form-item :label="$lang[langId].information_detail" :label-width="formLabelWidth"></el-form-item>
          <el-form-item :label="$lang[langId].measure_unit" :label-width="formLabelWidth">
            <el-autocomplete 
              v-model="form.uom" 
              :fetch-suggestions="getUomSearch" 
              :placeholder="lang.search" 
              @select="getUomSelect">
            </el-autocomplete>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <label>{{ $lang[langId].conversion_value }} - {{ $lang[langId].measure_unit }}</label>
            <el-input auto-complete="off" type="number" v-model="form.uom_conversion"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template v-else>
        <el-form :model="tempList">
          <!-- <el-form-item
            v-if="variants.length"
            :label="lang.apply_to_variant"
            :label-width="formLabelWidth">
            <el-select
              v-model="form.variant"
              :placeholder="lang.please_select"
              filterable
              class="inline-form"
              @change="handleSelected(form.variant)">
              <el-option :label="lang.all" :value="0" />
              <el-option
                v-for="item in variants"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item :label="lang.product" :label-width="formLabelWidth">
            <div class="font-16 font-bold">{{ tempList.product_name }}</div>
            <!-- <div>
              <el-tag :key="tag" v-for="tag in dataTag" closable :disable-transitions="false" @close="handleClose(tag)">
                {{tag}}
              </el-tag>
            </div> -->
          </el-form-item>
          <hr>
          <el-form-item :label="$lang[langId].information_detail" :label-width="formLabelWidth"></el-form-item>
          <el-form-item :label="$lang[langId].measure_unit" :label-width="formLabelWidth">
            <div>{{ tempList.uom }}</div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <label>{{ $lang[langId].conversion_value }} - {{ $lang[langId].measure_unit }}</label>
            <el-input auto-complete="off" type="number" v-model="tempList.fuom_conversion" ></el-input>
            
          </el-form-item>
            <el-form-item
            :label="lang.qty"
            :label-width="formLabelWidth">
            <el-input auto-complete="off" type="number" v-model="tempList.qty"></el-input>
          </el-form-item>
          
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer flex-container">
        <div class="full-width text-left">
          <div>{{ $lang[langId].save_at }}:</div>
          <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
            <el-option
              v-for="item in outlets"
              :key="item.store_id"
              :label="item.name"
              :value="item.store_id">
            </el-option>
          </el-select>
        </div>
        <div class="full-width flex-container">
          <!-- <template v-if="stageLevel === 'dash' || stageLevel === 'prod'">
            <el-button class="btn-block" style="margin-top: 20px" type="primary" @click="createNewMaterials">{{ lang.add }}</el-button>
          </template> -->
          <template>
            <el-button v-if="!isEdit" class="btn-block" style="margin-top: 20px" type="primary" @click="createNewMaterials">{{ lang.add }}</el-button>
            <el-button v-else class="btn-block" style="margin-top: 20px" type="success" :loading="loadingSave" @click="materialSave(tempList)">{{ lang.save }}</el-button>
          </template>
          <el-button class="btn-block" style="margin-top: 20px" @click="handleCloseAdd">{{ lang.cancel }}</el-button>
        </div>
      </span>
    </el-dialog>

    <dialog-save-all-store :show-dialog="showDialogSaveAllStore" @close="handleSaveData(false)" @save="handleSaveData(true)" />

  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import { searchUoms } from '@/api/product'
import axios from 'axios'

import DialogSaveAllStore from '@/components/dialogSaveAllStore'

export default {
  name: 'DetailMaterials',
  props: ['productData'],
  mixins: [basicComputedMixin],

  components: {
    DialogSaveAllStore
  },

  data() {
    return {
      loading: true,
      materialsGroup: [],
      searchData: [],
      dataTag: [],
      product_selectId: [],
      variants: [],
      total: null,
      materialCreate: false,
      formLabelWidth: '50%',
      isEditMaterial: false,
      showMaterial: false,
      form: {
        variant: '',
        product_name: '',
        uom: '',
        uom_conversion: '',
        save_type: 'one'
      },
      pages: [
        {
          value: 5,
          label: '5 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 10,
          label: '10 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 20,
          label: '20 ' + this.$store.state.userStores.lang.rows
        }
      ],
      params: {
        search: null,
        currentPage: 1,
        per_page: 5,
        page: 1,
        product_id: this.$route.params.id
      },
      uoms: [
        {
          label: 'Milimeter',
          value: 'mm'
        },
        {
          label: 'Centimeter',
          value: 'cm'
        },
        {
          label: 'Meter',
          value: 'm'
        },
        {
          label: 'Kilometer',
          value: 'km'
        },
        {
          label: 'Gram',
          value: 'g'
        },
        {
          label: 'Kilogram',
          value: 'kg'
        },
        {
          label: 'Liter',
          value: 'lt'
        }
      ],
      product: {},
      searchDataUoms: [],
      storeToBeSaved: [],
      tempList: {},
      isEdit: false,
      loadingSave: false,
      showDialogSaveAllStore: false
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
    productData: {
      handler(data) {
        this.product = {...data}
        if (typeof this.product.uom !== 'undefined') {
          this.form.uom = this.product.uom
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    clearDataCreate() {
      this.searchData = []
      this.dataTag = []
      this.product_selectId = []
      this.tempList= {}
      this.form.variant = ''
      this.form.product_name = ''
      this.form.uom_conversion = ''
      this.form.save_type = 'one'
      this.isEdit = false


    },
    getMaterials() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productmaterials'),
        headers: headers,
        params: this.params
      })
        .then(response => {
         
          this.materialsGroup = response.data.data.material_groups
          this.total = response.data.meta.total
          this.showMaterial = true
          this.loading = false
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.total = 0
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.params.per_page = val
      this.getMaterials()
    },
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getMaterials()
    },
    getVariants() {
      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        product_id: this.$route.params.id,
        per_page: 100
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariants'),
        headers: headers,
        params: params
      }).then(response => {
        this.variants = response.data.data
        this.loading = false
      })
      .catch(() => {
        this.variants = []
        this.loading = false
      })
    },

    // getProductSearch(queryString, callback) {

    //   this.loading = true

    //   let headers = {
    //     Authorization: 'Bearer ' + this.token.access_token
    //   }

    //   let params = {
    //     sort_column: 'name',
    //     sort_type: 'asc',
    //     search: queryString,
    //     per_page: 50,

    //   }
    //   if (this.materialsGroup[0].all_materials_product_string !== "") {
    //     params.search_column = 'product_id'
    //     params.search_text = this.materialsGroup[0].all_materials_product_string
    //     params.search_operator = 'notin'

    //   }


    //   axios({
    //     method: 'GET',
    //     url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
    //     headers: headers,
    //     params: params
    //   }).then(response => {
    //     for (let i of response.data.data) {
    //       i.value = i.name
    //     }
    //     this.searchData = response.data.data
    //     callback(this.searchData)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     callback('No Data')
    //   })
    // },

    getProductSearch(queryString, callback) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,
        per_page: 50
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
        headers: headers,
        params: params
      }).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchData = response.data.data
        callback(this.searchData)
      })
      .catch(error => {
        console.log(error)
        this.searchData = [{
          value: 'No Data'
        }]
        callback(this.searchData)
      })
    },

    getUomSearch(queryString, callback) {
      this.loading = true
      let params = {
        q: queryString
      }

      searchUoms(params).then(response => {
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

    materialSave(list) {
      if (list.qty ==- 0) {
        this.$message({
          message: 'Qty tidak boleh 0',
          type: 'error'
        })
      } else {
        this.loadingSave = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        let id = list.id
        let data = {
          qty: list.qty,
          uom_conversion: list.fuom_conversion,
          uom: list.uom
        }

        let to_store_id = this.selectedStore.store_id
        let to_allstore_id = 0
        // if (this.saveToAllAccessStore.includes(this.selectedStore.url_id)) {
          if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
            to_allstore_id = 1
          } else if (this.storeToBeSaved.length) {
            to_store_id = this.storeToBeSaved.join(',')
          }

          data.to_store_id = to_store_id
          data.to_allstore_id = to_allstore_id
        // }

        axios({
          method: 'PUT',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productmaterials/' + id),
          headers: headers,
          data: data
        }).then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.materialsGroup = response.data.data.material_groups
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.loadingSave = false
          this.materialCreate = false
          this.getMaterials()
        }).catch(error => {
          console.log('ee', error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadingSave = false
          this.getMaterials()
        })
      }
    },

    createDialog() {
      this.materialCreate = true
      this.clearDataCreate()

      

      if (this.storeToBeSaved.length === 0) {
        this.storeToBeSaved = [this.selectedStore.store_id]
      }
    },

    deleteMaterial(item) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = item.id
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productmaterials/' + id),
        headers: headers
      })
        .then(response => {
          this.deleteResponse = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.loading = false
          this.getMaterials()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.getMaterials()
        })
    },

    createNewMaterials() {
      console.log(this.form)
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        product_ids: [
          this.$route.params.id,
          this.form.variant
        ].join('|'),
        material_product_ids: this.product_selectId.toString(''),
        save_type: this.form.save_type,
        uom: this.form.uom,
        uom_conversion: this.form.uom_conversion
      }

      let to_store_id = this.selectedStore.store_id
      let to_allstore_id = 0
      // if (this.saveToAllAccessStore.includes(this.selectedStore.url_id)) {
        if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
          to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          to_store_id = this.storeToBeSaved.join(',')
        }

        data.to_store_id = to_store_id
        data.to_allstore_id = to_allstore_id
      // }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productmaterials'),
        headers: headers,
        data: data
      }).then(response => {
        this.result = response.data
        if (response.data.status === 200) {
          this.materialsGroup = response.data.data.material_groups
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.materialCreate = false
        }
        if (response.data.error) {
          this.$message({
            message: 'Error',
            type: 'error'
          })
        }
        this.loading = false
        this.materialCreate = false
        this.form.uom = ''
        this.getMaterials()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
        this.materialCreate = true
      })
    },
    changeValue() {
      this.form.uom_conversion = parseInt(this.form.uom_conversion)
    },
    handleSelected(item) {
      if (item === 0) {
        this.form.save_type = 'all'
        this.form.variant = 0
      } else {
        this.form.save_type = 'one'
      }
    },
    getProductSelect(item) {
      this.form.product_name = item.name
      if (this.dataTag.length === 0) {
        if (item.uom !== null) {
          this.form.uom = item.uom
        }
      }
      this.handleInputConfirm(item)
    },

    handleInputConfirm(item) {
      let inputValue = this.form.product_name
      if (inputValue) {
        this.dataTag.push(inputValue)
        this.product_selectId.push(item.product_id)
      }
      this.form.product_name = ''
    },
    handleClose(tag) {
      this.dataTag.splice(this.dataTag.indexOf(tag), 1)
    },

    getUomSelect (item) {
      console.log('uom', item)
      this.form.uom_conversion = item.conversion_value
    },

    handleSelectAll (data) {
      console.log('aa', data)
      if (data.length) {
        data.map(i => {
          if (i === 0) {
            // this.storeToBeSaved = [0]
            this.showDialogSaveAllStore = true
          }
        })
      }
    },

    handleSaveData (args) {
      if (args) {
        this.storeToBeSaved = [0]
      } else {
        this.storeToBeSaved.map((i, idx) => {
          if (i === 0) {
            this.storeToBeSaved.splice(idx, 1)
          }
        })
      }
      this.showDialogSaveAllStore = false
    },

    handleEditItem (data) {
      console.log(data);
      this.tempList = { ...data}
      this.isEdit = true
      this.materialCreate = true
    },

    handleCloseAdd () {
      this.materialCreate = false
      this.isEdit = false
      this.loading = false
    }
  },
  mounted() {
    this.getMaterials()
    this.getVariants()
  }
}
</script>

