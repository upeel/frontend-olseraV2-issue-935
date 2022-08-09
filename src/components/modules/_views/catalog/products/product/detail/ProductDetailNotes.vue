<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header" class="clearfix">
        <h4>{{ lang.predefined_order_notes }}</h4>
        <div class="card-buttons">
          <button-action-authenticated
            :permission="['catalog/products', 'edit']"
            :disabled="disabledSave"
            size="small"
            type="success"
            icon="el-icon-check"
            @click="save">
            {{ lang.save }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="card-body">
        <el-form class="form-sidebyside">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item :required="true">
                <p>{{ lang.info_predefined_order_notes }}. {{ lang.info_input_tags_enter }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item>
                <el-input type="text" v-model="data" @keyup.native.enter="handleAddMetaKeywords"></el-input>
                <p class="wrapper-tags">
                  <el-tag
                    v-for="(item, key) in tags"
                    :key="key"
                    closable
                    @close="handleRemoveMetaKeyword(key)">
                    {{ item }}
                  </el-tag>
                </p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <div style="position: relative; z-index: -10">
              <el-form-item>
                <el-input
                  v-model="data.comission_pct"
                  type="number"
                  min="0.01">
                </el-input>
              </el-form-item>
            </div>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'courselinegroup/'

export default {
  props: ['saved', 'formData'],

  data() {
    return {
      disabledSave: true,
      data: '',
      product: {},
      control: {},
      loading: false,
      tags: []
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
    tags: {
      handler(data) {
        if ((data.length > 0)) {
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
        this.product = {...data}
        if(data.predefined_order_notes !== null) {
          console.log('json', data.predefined_order_notes.split(','))
          this.tags = data.predefined_order_notes.split(',')
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    save() {
      this.disabledSave = true
      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
        'Content-Type': 'application/json'
      }

      let url = baseApi(this.selectedStore.url_id, this.langId, 'product/updateordernotes/' + this.product.id)
      let data = {
        predefined_order_notes: this.tags
      }

      axios({
        method: 'PUT',
        url: url,
        headers: headers,
        data: data
      })
        .then(response => {
          this.loading = false
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.product = response.data.data
          if (response.data.data.predefined_order_notes === null) {
            this.tags = []
          } else {
            this.tags = response.data.data.predefined_order_notes.split(',')
          }
          if (this.tags.length > 0) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
          this.$emit('update', this.product)
        })
        .catch((error) => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    },
    handleAddMetaKeywords() {
      if (this.data) {
        this.tags.push(this.data)
        this.data = ''
      }
    },
    handleRemoveMetaKeyword(key) {
      this.tags.splice(key, 1)
      this.save()
    }
  }
}
</script>
