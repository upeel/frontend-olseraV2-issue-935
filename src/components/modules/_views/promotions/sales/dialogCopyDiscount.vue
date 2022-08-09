<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    title="Copy Diskon">
    <div v-loading="loadingData">
      <template v-if="selectStore">
        <div v-for="item in activeStores"
          :key="item.store_id"
          class="box-in-loop pointer"
          @click="getCopyDiscount(item, false)">
          <div v-if="!item.disable" class="flex-container">
            <el-avatar
              :src="item.logo"
              :size="32"
              style="flex-basis: 32px; min-width: 32px;"
            />
            <div class="ml-8" style="flex-grow: 2;">{{ item.name }}</div>
            <el-button
              round
              type="text"
              size="small"
              icon="el-icon-arrow-right">
            </el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <div>{{ lang.copy_from_store }}</div>
          <el-button
            class="btn-block mb-12"
            @click="refreshData">
            <div class="flex-container">
              <el-avatar
                :src="storeCopy.logo"
              />
              <div class="ml-8">
                {{ storeCopy.name }}
                <i class="el-icon-caret-bottom"/>
              </div>
            </div>
          </el-button>
        </div>

        <div style="padding-bottom: 40px;">
          <el-input
            v-model="params.search_text"
            :placeholder="lang.search"
            clearable
            prefix-icon="el-icon-search"
            class="mb-24 bg-f5"
            @change="handleSearchCopy">
          </el-input>

          <div class="mb-12">
            <div class="mb-12">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAllProductToCopy"
                @change="handleCheckAllChange">
                {{ $lang[langId].copy_all + '(Max 20)'}}
              </el-checkbox>
            </div>

            <div>
              <el-checkbox-group
                v-model="checkedDiscountToCopy"
                :max="20"
                class="flex-container flex-container--wrap"
                @change="handleCheckedDiscountToCopy">
                <div
                  v-for="item in dataDiscount"
                  :key="item.id"
                  class="flex-grid-2 px-12">
                  <el-checkbox
                    :label="item.id"
                    class="p-8 unset-height block checkbox-right"
                    border>
                    <div class="font-14 font-bold overflow-ellipsis text-capitalize">
                      {{ lang.min_order }} {{ item.fmin_order_amount }}
                    </div>
                    <div class="font-12 color-grey--placeholder">{{ lang.discount }} {{ item.fdiscount }}</div>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>

          <div v-if="disableMore">
            <el-button
              class="btn-block"
              icon="el-icon-arrow-down"
              @click="loadMore">
              {{ $lang[langId].load_more }}
            </el-button>
          </div>
          <div slot="footer" class="mt-24">
            <el-button
              :loading="loadingCopyDiscount"
              :disabled="btnCopy"
              type="success"
              class="btn-block"
              @click="saveCopyDiscount">
              {{ lang.save }}
            </el-button>
          </div>
        </div>
      </template>
    </div>
  </el-dialog>
</template>
<script>
import { getDiscountSales, saveCopyDiscount } from '@/api/marketing/discount'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import CloseEsc from '@/components/modules/CloseEsc'

export default {
  name: 'dialogCopyDiscount',
  props: {
    show: {
      default: false,
      type: Boolean
    }
  },

  mixins: [basicComputedMixin],

  components: {
    CloseEsc
  },

  data() {
    return {
      loadingData: false,
      dataDiscount: [],
      storeCopy: {},
      checkedDiscountToCopy: [],
      selectStore: true,
      params: {
        search_text: ''
      },
      isIndeterminate: false,
      checkAllProductToCopy: false,
      disableMore: false,
      next_page: 0,
      loadingCopyDiscount: false,
    }
  },

  computed: {
    activeStores() {
      return this.$store.getters.stores.filter(store => {
        return !store.disable
      })
    },
    btnCopy() {
      let btnCopy = true
      if (this.checkedDiscountToCopy.length > 0) {
        btnCopy = false
      } else {
        btnCopy = true
      }
      return btnCopy
    },
  },

  methods: {
    getCopyDiscount (item, search) {
      this.loadingData = true
      let param = {}
      if (!search) {
        this.storeCopy = item
        param = {
          per_page: 20,
          store_id: item.store_id
        }
      } else {
        param = {
          per_page: 20,
          search: this.params.search_text,
          store_id: item.store_id
        }
      }
      getDiscountSales(param).then(response => {
        this.dataDiscount = response.data.data
        this.selectStore = false
        // this.dialogCopyProductStoreList = false
        // this.dialogCopyProduct = true
        if (response.data.links.next !== null) {
          this.disableMore = true
          this.next_page = response.data.meta.current_page
        } else {
          this.disableMore = false
        }
        this.loadingData = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.dataDiscount = []
        this.loadingData = false
      })
    },

    loadMore() {
      this.loadingData = true

      let param = {
        per_page: 20,
        page: this.next_page + 1
      }

      getDiscountSales(param).then(response => {
        response.data.data.map(i => {
          this.dataDiscount.push(i)
        })
        if (response.data.links.next !== null) {
          this.disableMore = true
          this.next_page = response.data.meta.current_page
        } else {
          this.disableMore = false
        }
        this.loadingData = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingData = false
      })
    },

    handleCheckedDiscountToCopy(value) {
      const checkedCount = value.length
      this.checkAllProductToCopy = checkedCount === this.dataDiscount.length || 20
      this.isIndeterminate = false
    },

    handleCheckAllChange(bool) {
      const chkl = [...this.dataDiscount].slice(0, 20)
      if (bool) {
        this.checkedDiscountToCopy = chkl.map(item => {
          return item.id
        })
      } else {
        this.checkedDiscountToCopy = []
      }
      this.isIndeterminate = false
    },

    saveCopyDiscount() {
      this.loadingCopyDiscount = true

      let data = {
        store_id: this.storeCopy.store_id,
        discount_id: this.checkedDiscountToCopy.join(', '),
        type_voc: 'sales'
      }

      saveCopyDiscount(data).then(response => {
        this.loadingCopyDiscount = false
        // this.dialogCopyProduct = false
        this.$notify({
          type: 'success',
          title: 'Berhasil Salin Diskon',
          message: response.data.data[0].count_copy + ' Product berhasil di salin'
        })
        this.refreshData()
        this.$emit('save')
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingCopyDiscount = false
      })
    },

    handleSearchCopy(item) {
      if (item.length > 0) {
        this.getCopyDiscount(this.storeCopy, true)
      } else {
        this.getCopyDiscount(this.storeCopy, false)
      }
    },

    handleClose () {
      this.refreshData()
      this.$emit('save')
    },

    refreshData () {
      this.selectStore = true,
      this.dataDiscount = []
      this.storeCopy = {}
      this.checkedDiscountToCopy = []
      this.isIndeterminate = false
      this.checkAllProductToCopy = false
      this.disableMore = false
      this.next_page = 0
    },
  }
}
</script>