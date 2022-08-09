<template>
  <el-card class="box-card with-left-poster" v-loading="loading">
    <div class="left-poster free">
      <i class="fa fa-truck fa-4x" aria-hidden="true"></i>
      <h3>{{ lang.free_shipping }}</h3>
      <p>{{ lang.info_free_shipping }}</p>
    </div>

    <div class="floating-buttons text-right">
      <button-action-authenticated
        v-if="!isEditing"
        :permission="['settings/shippings', 'edit']"
        type="primary"
        icon="el-icon-edit-outline"
        @click="edit">
        {{ lang.edit }}
      </button-action-authenticated>
      <el-button
        v-if="isEditing"
        type="info"
        @click="cancel">
        {{ lang.cancel }}
      </el-button>
      <el-button
        v-if="isEditing"
        type="success"
        icon="el-icon-check"
        @click="save">
        {{ lang.save }}
      </el-button>
    </div>

    <div
      v-if="!isEditing"
      class="shipping-desc text">
      <div class="block-data">
        <div class="size-12 oldgrey">{{ lang.free_shipping }}</div>
        <div class="item-value">
          <template v-if="data.free_shipping">
            {{ lang.yes }}
          </template>
          <template v-else>
            {{ lang.no }}
          </template>
        </div>
      </div>

      <div class="block-data">
        <div class="oldgrey size-12">{{ lang.min_order_amount }}</div>
        <div class="item-value">
          {{ data.free_shipping_min_order_amount }}
        </div>
      </div>

      <hr/>

      <div class="block-data">
        <div class="size-12 oldgrey">{{ lang.allow_pickup_at_store }}</div>
        <div class="item-value">
          <template v-if="data.shipping_self_pickup">
            {{ lang.yes }}
          </template>
          <template v-else>
            {{ lang.no }}
          </template>
        </div>
      </div>
    </div>

    <el-form
      v-if="isEditing"
      label-position="top"
      class="form-in-block-data">
      <el-form-item :label="lang.free_shipping">
        <p class="form-more-label">{{ lang.info_free_shipping }}</p>
        <el-switch
          v-model="data.free_shipping"
          :disabled="disabledField"
          :active-value="1"
          :inactive-value="0"
          :active-text="lang.yes"
          :inactive-text="lang.no">
        </el-switch>
      </el-form-item>

      <el-form-item
        :label="lang.min_order_amount">
        <el-input
          v-model="data.free_shipping_min_order_amount"
          :disabled="disabledField"
          type="number"
          min="1"
        />
      </el-form-item>

      <el-form-item :label="lang.allow_pickup_at_store">
        <p class="form-more-label">{{ lang.info_allow_pickup_at_store }}</p>
        <el-switch
          :disabled="disabledField"
          v-model="data.shipping_self_pickup"
          :active-value="1"
          :inactive-value="0"
          :active-text="lang.yes"
          :inactive-text="lang.no">
        </el-switch>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndpoint = 'shippings/freeshipping'

export default {
  data() {
    return {
      loading: true,
      isEditing: false,
      servedData: {},
      data: {},
      disabledButton: false,
      disabledField: false
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
    '$store.getters.selectedStore'() {
      this.getData()
    }
  },
  methods: {
    getData: function () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers
      }).then(response => {
        this.servedData = response.data.data
        this.data = {...this.servedData}
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    save() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = this.data
      data.min_order_amount = data.free_shipping_min_order_amount
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/update'),
        headers,
        data: this.data
      }).then(response => {
        this.loading = false
        this.servedData = response.data.data
        this.data = {...this.servedData}
        this.isEditing = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    edit() {
      this.isEditing = true
      this.data = {...this.data}
      this.disabledField = false
    },
    cancel() {
      this.isEditing = false
      this.data = {...this.servedData}
      this.disabledField = true
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

