<template>
  <div>
    <el-form
      :model="form"
      :rules="formRules"
      ref="packageForm"
      v-loading="stateAddingItem">
      <el-form-item prop="items" :label="lang.product" label-width="200px">
        <el-select
          v-model="form.items"
          :placeholder="lang.info_auto_complete_product"
          :remote-method="searchProducts"
          :loading="searching"
          multiple
          filterable
          remote
          style="width: 100%;">
          <el-option
            v-for="item in searchResultProducts"
            :key="item.product_id"
            :label="item.name"
            :value="item.product_id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="lang.qty" prop="qty" label-width="120px">
        <el-input type="number" :min="1" v-model="form.qty" />
      </el-form-item>

      <el-form-item class="text-right">
        <el-button @click="hideDialog">
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
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
export default {
  mixins: [basicComputedMixin],
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
      form: {
        items: [],
        qty: 1
      },
      searchResultProducts: [],
      searching: false,
      stateAddingItem: false,
      disabledButton: true,
      formRules: {
        qty: [
          { required: true, message: 'This is required field', trigger: 'blur' }
        ],
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
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    }
  },

  watch: {
    form: {
      handler(data) {
        if (data.qty && data.items.length > 0) {
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
    hideDialog() {
      this.$emit('close')
    },

    refreshData () {
      this.form.items = []
    },

    searchProducts(query) {
      // this.form.items = []
      this.form.qty = 1
      this.searching = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc',
        per_page: 50
      }
      let endPoint = this.stageLevel === 'dev' || this.stageLevel === 'sit'? 'productandvariantsearch' : 'productvariantsearch'
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, endPoint),
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
    }
  }
}
</script>
