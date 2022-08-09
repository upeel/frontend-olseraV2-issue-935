<template>
  <div class="content-wrapper">
    <section class="content">
      <div v-loading="loading">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1">{{ rootLang.more_settings }}</h4>
          </div>
          <div class="card-body">
            <div class="flex-container like-table-wrapper--item">
              <div class="full-width">
                <div class="font-14 font-semi-bold">{{ $lang[langId].signin_required }}</div>
                <span class="font-12 color-grey--placeholder">{{ rootLang.signin_required_desc }}</span>
              </div>
              <div class="pointer flex-container">
                <el-switch
                  v-model="dataSetting.signin_required"
                  :disabled="!checkCustomPermission('settings/mobilesetting', 'edit')"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateSetting">
                </el-switch>
              </div>
            </div>
            <div class="flex-container like-table-wrapper--item">
              <div class="full-width">
                <div class="font-14 font-semi-bold">{{ $lang[langId].blocked_customer_registration }}</div>
                <span class="font-12 color-grey--placeholder">{{ rootLang.blocked_customer_registration_desc }}</span>
              </div>
              <div class="pointer flex-container">
                <el-switch
                  v-model="dataSetting.blocked_customer_registration"
                  :disabled="!checkCustomPermission('settings/mobilesetting', 'edit')"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateSetting">
                </el-switch>
              </div>
            </div>
            <div class="flex-container like-table-wrapper--item">
              <div class="full-width">
                <div class="font-14 font-semi-bold">{{ $lang[langId].allow_customer_view_stock }}</div>
                <span class="font-12 color-grey--placeholder">{{ rootLang.allow_customer_view_stock_desc }}</span>
              </div>
              <div class="pointer flex-container">
                <el-switch
                  v-model="dataSetting.allow_customer_view_stock"
                  :disabled="!checkCustomPermission('settings/mobilesetting', 'edit')"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateSetting">
                </el-switch>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script>

import { fetchMoreSetting, updateMoreSetting } from '@/api/mobileapps'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'MoreSettings',
  components: {
    // draggable,
    // List,
    // ItemForm
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      // 
      dataSetting: {},
      tempSetting: {}
    }
  },
  computed: {
    disabledButton () {
      // if (this.tempSetting.sign)
      return true
    }
  },
  watch: {
    'store.getters.selectedStore': function () {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.loading = true
      fetchMoreSetting().then(response => {
        this.dataSetting = response.data.data
        this.tempSetting = response.data.data
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
    updateSetting () {
      this.loading = true
      updateMoreSetting(this.dataSetting).then(response => {
        this.dataSetting = response.data.data
        this.tempSetting = response.data.data
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
  },
  mounted() {
    this.getData()
  }
}
</script>
