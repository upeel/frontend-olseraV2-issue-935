<template>
  <div>
    <el-form
      :model="form"
      :rules="formRules"
      ref="packageForm"
      v-loading="stateAddingItem">
      <el-form-item prop="items" :label="lang.product" label-width="200px">
        <el-select
          style="width: 100%;"
          v-model="form.items"
          multiple
          filterable
          remote
          reserve-keyword
          :placeholder="lang.info_auto_complete_product"
          :remote-method="searchProducts"
          :loading="searching">
          <el-option
            v-for="item in searchResultProducts"
            :key="item.product_id"
            :label="item.name"
            :value="item.product_id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="text-right">
        <el-button @click="cancel">
          {{ lang.cancel }}
        </el-button>
        <el-button
          :disabled="disabledButton"
          type="primary"
          @click="save">
          {{ this.$lang[langId].confirm }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
export default {
  data() {
    var validateItems = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('This is required field'))
      } else {
        if (this.form.items !== '') {
          this.$refs.packageForm.validateField('items')
        }
        callback()
      }
    }
    return {
      form: {},
      searchResultProducts: [],
      searching: false,
      stateAddingItem: false,
      disabledButton: true,
      formRules: {
        items: [
          { validator: validateItems, trigger: 'blur' }
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
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  watch: {
    form: {
      handler(data) {
        if (data.items.length > 0) {
          this.disabledButton = false
        }
      },
      deep: true
    }
  },

  methods: {
    save() {
      this.disabledButton = true
      this.$emit('save', this.form)
    },
    searchProducts(query) {
      this.searching = true
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
          this.searching = false
          this.searchResultProducts = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searching = true
          this.searchResultProducts = []
        })
      }
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
