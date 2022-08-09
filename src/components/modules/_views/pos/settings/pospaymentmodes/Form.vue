<template>
  <el-card v-loading="loading">
    <div slot="header" class="table-handler-flex">
      <h4 style="flex-grow: 1;">{{ lang.info_manage_payment_mode }}</h4>
      <div>
        <el-button
          v-if="(data.id && checkCustomPermission('settings/pospaymentmodes', 'edit')) || (!data.id && checkCustomPermission('settings/pospaymentmodes', 'store'))"
          :disabled="disabledSave"
          @click="save"
          type="success"
          icon="el-icon-check">
          {{ lang.save }}
        </el-button>
        <button-action-authenticated
          v-if="data.id"
          :permission="['settings/pospaymentmodes', 'destroy']"
          :disabled="disabledSave"
          @click="remove"
          type="danger"
          icon="el-icon-delete">
        </button-action-authenticated>
      </div>
    </div>

    <div class="card-body">
      <el-form :model="data" label-width="120px" @submit.native.prevent>
        <el-form-item :label="lang.payment_methods" :required="true">
          <template v-if="!data.id">
            <el-select
              v-model="data.payment_type_id"
              filterable
              remote
              :placeholder="lang.search"
              reserve-keyword
              :loading="searchingPaymentTypes"
              :remote-method="searchPaymentTypes">
              <el-option
                v-for="item in paymentTypes"
                :label="item.name_id"
                :value="item.id"
                :key="item.id">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <el-select
              disabled
              v-model="data.payment_type_id" >
            </el-select>
          </template>
        </el-form-item>
        <el-form-item :label="lang.name" :required="true">
          <el-input type="text" v-model="data.name" :placeholder="$lang[langId].please_input+lang.name"></el-input>
        </el-form-item>
        <el-form-item :label="rootLang.extra_charge_name" :required="false">
          <el-input type="text" v-model="data.extra_charge_name" :placeholder="$lang[langId].please_input+rootLang.extra_charge_name"></el-input>
        </el-form-item>
        <el-form-item :label="lang.extra_charge" :required="false">
          <el-input type="number" v-model="data.extra_charge_percent" :placeholder="$lang[langId].input_number">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import ButtonActionAuthenticated from '../../../../../ButtonActionAuthenticated.vue'
const apiEndPoint = 'pospaymentmodes/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: { ButtonActionAuthenticated },
  mixins: [checkCustomPermission],
  props: ['saved', 'loading', 'formData'],

  data() {
    return {
      searchingPaymentTypes: false,
      disabledSave: true,
      data: {
        name: ''
      },
      control: {},
      paymentTypes: []
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
    },
    rootLang() {
      return this.$lang[this.langId]
    }
  },

  watch: {
    data: {
      handler(data) {
        if ((data.name && data.name !== '') && (data.payment_type_id && data.payment_type_id !== '')) {
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
    searchPaymentTypes(query) {
      this.control.searchingPaymentTypes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'payment'),
        params: {
          search: query
        },
        headers: headers
      }).then(response => {
        this.control.searchingPaymentTypes = false
        // this.paymentTypes = response.data.data.map(item => {
        //   return item
        // })
        this.paymentTypes = response.data.data
      }).catch(() => {
        this.control.searchingPaymentTypes = false
        this.paymentTypes = []
      })
    },
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    }
  },

  mounted() {
    this.searchPaymentTypes()
  }
}
</script>
