<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="14">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4>{{ lang.pos_pass_key }}</h4>
          </div>

          <div class="card-body">
            <el-form
              @submit.native.prevent
              :model="data"
              :rules="rules"
              ref="ruleForm" label-width="140px">
              <el-form-item :label="lang.pos_pass_key_for_draft" prop="pos_pass_key" :required="true">
                <el-row style="height: 35px">
                  <el-col :md="18">
                    <el-input :disabled="!checkCustomPermission('settings/pospasskey', 'edit')" type="number" v-model="data.pos_pass_key" @change="update"></el-input>
                  </el-col>
                  <el-col v-if="checkCustomPermission('settings/pospasskey', 'edit')" :md="5" class="my-4" style="margin-left: 5px">
                    <el-switch v-model="data.pos_pass_key_for_draft"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update">
                    </el-switch>
                  </el-col>
                </el-row>
                <span class="size-12 input-desc oldgrey">
                  {{ lang.info_pos_pass_key_for_draft }}
                </span>
              </el-form-item>
              <el-form-item :label="lang.pos_pass_key_for_discount" prop="pos_pass_key_discount" :required="true">
                <el-row style="height: 35px">
                  <el-col :md="18">
                    <el-input :disabled="!checkCustomPermission('settings/pospasskey', 'edit')" type="number" v-model="data.pos_pass_key_discount" @change="update"></el-input>
                  </el-col>
                  <el-col v-if="checkCustomPermission('settings/pospasskey', 'edit')" :md="5" class="my-4" style="margin-left: 5px">
                    <el-switch v-model="data.pos_pass_key_for_discount"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update">
                    </el-switch>
                  </el-col>
                </el-row>
                <span class="size-12 input-desc oldgrey">
                  {{ lang.info_pos_pass_key_for_discount }}
                </span>
              </el-form-item>
              <el-form-item :label="lang.pos_pass_key_for_customer" prop="pos_pass_key_customer" :required="true">
                <el-row style="height: 35px">
                  <el-col :md="18">
                    <el-input :disabled="!checkCustomPermission('settings/pospasskey', 'edit')" type="number" v-model="data.pos_pass_key_customer" @change="update"></el-input>
                  </el-col>
                  <el-col v-if="checkCustomPermission('settings/pospasskey', 'edit')" :md="5" class="my-4" style="margin-left: 5px">
                    <el-switch v-model="data.pos_pass_key_for_customer"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update">
                    </el-switch>
                  </el-col>
                </el-row>
                <span class="size-12 input-desc oldgrey">
                  {{ lang.info_pos_pass_key_for_customer }}
                </span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'pospasskey/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],
  data: function() {
    return {
      loading: true,
      data: {},
      disabledButton: false,
      rules: {
        pos_pass_key: [
          { required: true, message:  this.$store.state.userStores.lang.required, trigger: 'blur' },
          { min: 6, max: 6, message: this.$lang[this.$store.state.userStores.langId].length_should_be_6, trigger: 'blur' }
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
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    save(data, resolve, reject) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'store-update'),
        headers: headers,
        data
      }).then(response => {
        resolve(response.data.data)
      }).catch(error => {
        reject(error.response.data.error)
      })
    },
    update() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.disabledButton = true
          let data = {...this.data}
          data.pass_key = data.pos_pass_key
          let promise = new Promise((resolve, reject) => {
            this.save(data, resolve, reject)
          })
          promise.then(() => {
            this.disabledButton = false
            this.getData()
            this.$message({
              type: 'success',
              message: 'saved'
            })
          }).catch(error => {
            this.disabledButton = false
            this.loading = false
            this.$notify({
              type: 'warning',
              title: error.message,
              message: error.error
            })
          })
        } else {
          return false
        }
      })
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
