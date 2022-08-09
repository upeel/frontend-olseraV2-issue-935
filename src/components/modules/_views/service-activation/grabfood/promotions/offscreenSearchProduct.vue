<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-center color-white--bg" style="z-index: 10">
          {{ lang.add }} {{ lang.product }}
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>
        
        <div class="table-handler-flex full-width text-right px-24" >
          <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" size="small"></el-input>
        </div>

        <div class="p-24 text-center mb-42" v-loading="loadingSearch">
          <div v-if="dataSearch.length === 0">
            <img src="/static/img/service-activation/tokopedia/no_product_search.png" >
          </div>

          <div v-else>
            <div id="here" v-for="data in dataProduct" :key="data.id" 
            :class="data.selected ? 'active' : ''"
            class="like-table-wrapper--item pointer flex-container" @click="handleSelect(data)">
              <div class="full-width text-left">
                <div class="flex-container full-width" >
                  <el-avatar
                    :src="data.detail.default_photo"
                    :size="32"
                    shape="square"
                  />
                  <div>
                    <div class="font-bold font-16 ml-8">
                      {{ data.alias_name }}
                    </div>
                    <div class="font-12 ml-8">
                      {{ data.falias_price }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="data.selected" class="container-icon">
                <svg-icon icon-class="awesome-check-circle" />
              </div>
              <div v-else class="text-right" style="width: 40%">
                {{ data.detail.stock_qty }} stock
              </div>
            </div>
            <el-button
              v-if="last_page > current_page"
              class="btn-block mt-24"
              @click="getAddonGroup">
              {{ rootLang.load_more }}
            </el-button>
          </div>
        </div>

        <div class="offscreen-right-sidebar--footer">

          <el-button
            v-if="selectedProduct.length"
            :loading="loadingPair"
            type="success"
            class="btn-block mt-24"
            @click="handleSave">
            {{ rootLang.save }}
          </el-button>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'

import { getListDataGrabfood } from '@/api/thirdParty/grabfood'

export default {
  components: {
    CloseEsc,
  },
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // formEdit: {
    //   type: Object,
    //   default: null
    // },
    fromBulk: {
      type: Boolean,
      default: false
    },
    fromGrabCampaign: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      params: {
        search: '',
        // search_column: 'name',
        per_page: 50
      },
      dataSearch: [],
      current_page: 0,
      last_page: 0,
      loadingSearch: false,
      selectedProduct: [],
      loadingPair: false
    }
  },

  // watch: {
  //   formEdit(formEdit) {
  //     console.log('tracert', formEdit)
  //     if (formEdit) {
  //       this.formData = { ...formEdit }
  //       console.log(this.formData)
  //     }
  //   }
  // },

  computed: {
    dataProduct () {
      let data = [ ...this.dataSearch]
      if (data.length) {
        data.map(i => {
          i.selected = false
          if (this.selectedProduct.length) {
            this.selectedProduct.map(j => {
              if (i.id === j.id) {
                i.selected = true
              }
            })
          }
        })
      }
      return data
    }
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    handleSearch () {
      this.loadingSearch = true
      if (this.params.search !== '') {
        getListDataGrabfood(this.params).then(response => {
          this.dataSearch = [ ...response.data.data]
          this.dataSearch.map(i => {
            i.select = false
          })
          this.current_page = response.data.meta.current_page
          this.last_page = response.data.meta.last_page
          this.loadingSearch = false
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.dataSearch = []
          this.loadingSearch = false
        })
      } else {
        this.dataSearch = []
        this.loadingSearch = false
      }
    },

    handleSelect (data) {
      const exist = this.selectedProduct.some(({id}) => id === data.id)
      if (exist) {
        this.selectedProduct.map((i, idx) => {
          if (i.id === data.id) {
            this.selectedProduct.splice(idx, 1)
          }
        })
      } else {
        this.selectedProduct.push(data)
      }
    },

    handleClose () {
      this.selectedProduct = []
      this.dataSearch = []
      this.params = {
        search: '',
        per_page: 50
      },
      this.$emit('cancel')
    },

    handleSave () {
      this.$emit('setproduct', this.selectedProduct)
      this.selectedProduct = []
    }
  }
}
</script>
