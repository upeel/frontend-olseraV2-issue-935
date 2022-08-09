<template>
  <div class="content-wrapper">
    <section class="content sales-list no-subpage">
      <el-card class="box-card">
        <div slot="header">
          <h4>{{ lang.tax_and_charges }}</h4>
        </div>

        <div class="card-body" v-loading="loading">
          <el-form
            :model="data"
            label-position="top">
            <el-row :gutter="10">
              <el-col :md="12">
                <el-form-item :label="$lang[langId].tax_detail" class="form-subtitle" />

                <el-form-item :label="lang.tax_name">
                  <el-input
                    :disabled="!checkCustomPermission('settings/taxes', 'edit')"
                    @change="save"
                    v-model="data.tax_name"
                  />
                  <p class="size-12 input-desc oldgrey">
                    {{ lang.info_tax_name }}
                  </p>
                </el-form-item>

                <el-form-item :label="lang.tax_percentage">
                  <el-input :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" type="number" v-model="data.tax_percent">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>

                <el-form-item label-position="left" label-width="180" :label="lang.info_taxes_included">
                  <el-switch
                    :disabled="!checkCustomPermission('settings/taxes', 'edit')"
                    @change="save"
                    v-model="data.price_tax_included"
                    size="mini"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="lang.yes"
                    :inactive-text="lang.no">
                  </el-switch>
                </el-form-item>

                <el-form-item label-position="left" label-width="180" :label="lang.info_charge_taxes_on_shipping_cost">
                  <el-switch :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" v-model="data.shipping_taxable"
                    size="mini"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="lang.yes"
                    :inactive-text="lang.no">
                  </el-switch>
                </el-form-item>

                <el-form-item label-position="left" label-width="180"
                  :label="lang.info_tax_optional">
                  <el-switch :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" v-model="data.tax_optional"
                    size="mini"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="lang.yes"
                    :inactive-text="lang.no">
                  </el-switch>
                </el-form-item>
              </el-col>

              <el-col :md="12">
                <el-form-item :label="$lang[langId].service_charge_detail" class="form-subtitle">
                </el-form-item>

                <el-form-item :label="lang.service_charge">
                  <el-input :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" type="number" v-model="data.service_charge_percent">
                    <template slot="append">%</template>
                  </el-input>
                  <p class="input-desc size-12 oldgrey">
                    {{ lang.info_service_charge }}
                  </p>
                </el-form-item>

                <el-form-item label-width="280px"
                  :label="lang.info_service_charge_optional">
                  <el-switch :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" v-model="data.service_charge_optional"
                    size="mini"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="lang.yes"
                    :inactive-text="lang.no">
                  </el-switch>
                </el-form-item>
              </el-col>
              
              <el-col :md="12">
                <el-form-item :label="rootLang.food_delivery" class="form-subtitle">
                </el-form-item>

                <el-form-item label-width="280px"
                  label="Food Delivery dikenakan biaya layanan">
                  <el-switch :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" v-model="data.pos_food_delivery_with_service_charge"
                    size="mini"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="lang.yes"
                    :inactive-text="lang.no">
                  </el-switch>
                </el-form-item>

                <el-form-item label-width="280px"
                  label="Food Delivery dikenakan Pajak">
                  <el-switch :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" v-model="data.pos_food_delivery_with_tax"
                    size="mini"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="lang.yes"
                    :inactive-text="lang.no">
                  </el-switch>
                </el-form-item>

                <el-form-item label-width="280px"
                  label="Pembulatan biaya Food Delivery">
                  <el-switch :disabled="!checkCustomPermission('settings/taxes', 'edit')" @change="save" v-model="data.pos_food_delivery_with_rounding"
                    size="mini"
                    :active-value="1"
                    :inactive-value="0"
                    :active-text="lang.yes"
                    :inactive-text="lang.no">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'tax'

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  data: function() {
    return {
      loading: true,
      disabledSave: false,
      data: {
        tax_name: '',
        tax_percent: 1,
        price_tax_included: 0,
        shipping_taxable: 0,
        tax_optional: 0,
        service_charge_percent: 0,
        service_charge_optional: 0
      }
    }
  },

  mixins: [basicComputedMixin],

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
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    save() {
      console.log(this.data)
      this.loading = true
      this.disabledSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = { ...this.data}
      if (this.data.service_charge_percent === '') {
        data.service_charge_percent = 0
      }
      if (this.data.tax_percent === '') {
        data.tax_percent = 0
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/update'),
        headers: headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.disabledSave = false
        this.loading = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.disabledSave = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
