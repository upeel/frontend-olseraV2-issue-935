<template>
  <div class="row" v-loading="loading">
    <div class="col-md-12">
      <el-card class="box-card">
        <div slot="header" class="flex-container flex-container--wrap">
          <div style="flex-grow: 1;">
            <h3 class="box-title">{{ $lang[langId].list }} {{ lang.product_specifications }}</h3>
            <p v-if="showSpesification">{{ total }} {{ lang.product_specifications }}</p>
            <p v-else>0 {{ lang.product_specifications }}</p>
          </div>
          <button-action-authenticated
            :permission="['catalog/products', 'edit']"
            type="primary"
            icon="el-icon-plus"
            @click="dialogSpesification">
            {{ lang.add }}
          </button-action-authenticated>
        </div>

        <div class="card-body">
          <div v-if="!showSpesification" class="no-product">
            <p>{{ $lang[langId].no_product }}</p>
            <img src="/static/img/no-data.svg" alt="No Data Picture">
          </div>
          <div v-else>
            <div v-for="(group, index) in specificationsData" :key="index" class="card-bahan">
              <el-card v-if="group.childs.length > 0">
                <p>
                  <strong>{{ group.name }}</strong>
                </p>
                <el-row>
                  <el-col :span="12" v-for="(list, index) in group.childs" :key="index">
                    <div class="row">
                      <div class="col-md-10">
                        <p>
                          <strong>{{ list.name }}</strong>
                        </p>
                      </div>
                      <div class="col-md-2 text-right">
                        <el-dropdown trigger="click" class="pull-right">
                          <el-button type="text" style="color:#909399">
                            <i class="material-icons md-18">more_vert</i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                              <el-button type="text" @click="deleteRowSpesification(list.detail.specification_id)" style="color:#FF0000;">
                                <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                                {{ $lang[langId].delete }}
                              </el-button>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                    <el-input v-model="list.detail.value" @change="updateSpec(list.detail)"></el-input>
                  </el-col>
                </el-row>
              </el-card>
              <el-card v-else>
                <p>
                  <strong>{{ group.name }}</strong>
                </p>
                <el-col :span="12">
                  <div class="row">
                    <div class="col-md-10">
                      <el-input v-if="group.detail" v-model="group.detail.value" @change="updateSpec(group.detail)"></el-input>
                    </div>
                    <div class="col-md-2 text-right">
                      <el-dropdown trigger="click" class="pull-right">
                        <el-button type="text" style="color:#909399">
                          <i class="material-icons md-18">more_vert</i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <el-button type="text" @click="deleteRowSpesification(group.detail.specification_id)" style="color:#FF0000;">
                              <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                              {{ $lang[langId].delete }}
                            </el-button>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>

                </el-col>
              </el-card>

            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :title="lang.add_specification" :visible.sync="createDialog">
      <el-form :model="form">
        <el-form-item :label="lang.specification_type" :label-width="formLabelWidth">
          <el-select v-model="form.selectSpec" :placeholder="lang.please_select">
            <template v-for="group in specificationsType">
              <el-option-group v-if="group.children.length > 0" :key="group.id" :label="group.name" :value="group.id">
                <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-option-group>
              <el-option v-else :key="group.id" :label="group.name" :value="group.id" style="border-top: 1px solid #ddd;">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label="lang.specification_value" :label-width="formLabelWidth">
          <el-input v-model="form.valueSpec" type="number" :placeholder="$lang[langId].input_number" @change="changeValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false">{{ lang.cancel }}</el-button>
        <el-button type="primary" @click="createNewSpec">{{ lang.add }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'DetailSpesifications',
  data() {
    return {
      loading: true,
      specificationsData: [],
      specificationsType: [],
      specificationId: null,
      total: null,
      formLabelWidth: '50%',
      createDialog: false,
      showSpesification: false,
      form: {
        selectSpec: null,
        valueSpec: null
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
  methods: {
    clearFormCreate() {
      this.form = {
        selectSpec: null,
        valueSpec: null
      }
    },

    getSpesificationData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        product_id: this.$route.params.id
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productspecifications'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.specificationsData = response.data.data
          this.total = response.data.meta.total
          this.showSpesification = true
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.specificationsData = []
          this.total = null
          this.showSpesification = false
          this.loading = false
        })
    },

    getSpesificationType() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'specification'),
        headers: headers
      })
        .then(response => {
          this.specificationsType = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },

    deleteRowSpesification(val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        product_id: this.$route.params.id,
        specification_id: val
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productspecifications'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loading = false
          this.deleteData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.getSpesificationData()
        })
        .catch(error => {
          console.log(error)
          this.loading = false
          this.getSpesificationData()
        })
    },

    createNewSpec() {
      this.loading = true
      let data = {
        product_id: this.$route.params.id,
        specification_id: this.form.selectSpec,
        value: this.form.valueSpec
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productspecifications'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.loading = false
          this.specificationsData = response.data.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.createDialog = false
            this.getSpesificationData()
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },

    updateSpec(item) {
      this.loading = true
      let data = {
        product_id: item.product_id,
        specification_id: item.specification_id,
        value: item.value
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productspecifications'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.specificationsData = response.data.data
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
          this.getSpesificationData()
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },

    dialogSpesification() {
      this.createDialog = true
      this.clearFormCreate()
    },

    changeValue() {
      this.form.valueSpec = parseInt(this.form.valueSpec)
    }
  },
  mounted() {
    this.getSpesificationData()
    this.getSpesificationType()
  }
}
</script>
