<template>
  <div v-loading="loading">
    <el-form ref="form" class="form-edit-variant" :model="data">
      <el-table
        ref="tablevar"
        :data="productData"
        :key="index"
        stripe
        style="width: 100%"
        border>
        <el-table-column prop="name" :label="lang.variant" min-width="120">
        </el-table-column>
        <el-table-column prop="sku" :label="lang.sku" min-width="120">
        </el-table-column>
        <el-table-column v-if="!selectedStore.is_hide_buy_price" :label="lang.buy_price" prop="stock_qty" sortable min-width="120">
          <template slot-scope="scope">
            <div>
              <!-- <p>{{ props.row.buy_price }}</p> -->
              <span
                v-if="!isEditingBuy[scope.$index]"
                class="editable"
                @click="beginUpdateTariffVarian(scope.row, scope.$index, 3)">
                {{ scope.row.fbuy_price }}
              </span>
              <div
                v-if="isEditingBuy[scope.$index]"
                class="form-in-cell">
                <el-input v-model="temp.buy_price" type="number" min="1" size="small" />
                <el-button size="mini" icon="el-icon-close"
                  @click="cancelUpdateTariffVarian(scope.$index, 3)"
                  type="info">
                </el-button>
                <el-button size="mini" icon="el-icon-check"
                  @click="updateTariffVarian(temp, scope.$index, 3)"
                  type="success">
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock_qty" :label="lang.stock_qty">
          <template slot-scope="props">
            <div v-if="trackInventory === 1">
              <div v-if="props.row.hold_qty !== '0'" style="color: #1685C7" @click="showHoldInfo(props.row)">{{ props.row.stock_qty }} ( {{props.row.hold_qty}} )</div>
              <div v-else>{{ props.row.stock_qty }}</div>
            </div>
            <div v-else>Unlimited</div>
            </template>
        </el-table-column>
        <el-table-column :label="labelHarga" min-width="250">
          <template slot-scope="scope">
            <el-row :gutter="20" style="margin-top: 5px;">
              <el-col :md="5">
                <el-tooltip class="item" effect="dark" :content="lang.selling_price_online" placement="top">
                  <span style="border-radius: 50%; width: 27px; height: 27px; display: inline-block; background-color: #E1E2E1; text-align: center; cursor:pointer">O</span>
                </el-tooltip>
              </el-col>
              <el-col :md="19" style="color: #329DD7;">
                <span
                  v-if="!isEditing[scope.$index]"
                  class="editable"
                  @click="beginUpdateTariffVarian(scope.row, scope.$index, 0)">
                  {{ scope.row.fsell_price }}
                </span>
                <div
                  v-if="isEditing[scope.$index]"
                  class="form-in-cell">
                  <el-input v-model="temp.sell_price" type="number" min="1" size="small" />
                  <el-button size="mini" icon="el-icon-close"
                    @click="cancelUpdateTariffVarian(scope.$index, 0)"
                    type="info">
                  </el-button>
                  <el-button size="mini" icon="el-icon-check"
                    @click="updateTariffVarian(temp, scope.$index, 0)"
                    type="success">
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 15px">
              <el-col :md="5">
                <el-tooltip class="item" effect="dark" :content="lang.selling_price_in_store" placement="bottom">
                  <span style="border-radius: 50%; width: 27px; height: 27px; display: inline-block; background-color: #E1E2E1; text-align: center; cursor:pointer">T</span>
                </el-tooltip>
              </el-col>
              <el-col :md="19" style="color: #92CE74;">
                <span
                  v-if="!isEditingPos[scope.$index]"
                  class="editable"
                  @click="beginUpdateTariffVarian(scope.row, scope.$index, 1)">
                  {{ scope.row.fsell_price_pos }}
                </span>
                <div
                  v-if="isEditingPos[scope.$index]"
                  class="form-in-cell">
                  <el-input v-model="temp.sell_price_pos" type="number" min="1" size="small" />
                  <el-button size="mini" icon="el-icon-close"
                    @click="cancelUpdateTariffVarian(scope.$index, 1)"
                    type="info">
                  </el-button>
                  <el-button size="mini" icon="el-icon-check"
                    @click="updateTariffVarian(temp, scope.$index, 1)"
                    type="success">
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex-container">
        <div class="font-bold">
          {{ lang.variant }}
          <div v-for="(item, key) in productData" :key="key">
            {{ item.name }}
          </div>
        </div>
        <div class="font-bold">
          {{ lang.sku }}
          <div v-for="(item, key) in productData" :key="key">
            {{ item.sku }}
          </div>
        </div>
        <div class="font-bold">
          {{ lang.buy_price }}
          <div v-for="(item, key) in productData" :key="key">
            {{ item.buy_price }}
          </div>
        </div>
        <div class="font-bold">
          {{ lang.stock_qty }}
          <div v-for="(item, key) in productData" :key="key">
            {{ item.name }}
          </div>
        </div>
        <div class="font-bold">
          {{ lang.price }}
          <div v-for="(item, key) in productData" :key="key">
            {{ item.price }}
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'VariantDetail',

  props: ['productId', 'productData', 'trackInventory', 'productName'],

  data() {
    return {
      data: {},
      file: [],
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      isEditing: false,
      inputDisabled: true,
      uploadPhotoUrl: '',
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      },
      isEditing: [],
      isEditingPos: [],
      isEditingBuy: [],
      temp: {},
      labelHarga: ''
    }
  },

  computed: {
    fileList() {
      if (this.data.photos) {
        this.data.photos.map((b) => {
          b.url = b.photo_md
          return b
        })
      }
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
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },

  watch: {
    productData: {
      handler(data) {
        let isEditing = []
          if (data.length > 0) {
            data.map(() => {
              isEditing.push(false)
            })
          }
          this.isEditing = isEditing
          this.isEditingPos = isEditing
          this.isEditingBuy = isEditing
      },
      deep: true,
      immediate: true
    },
  },

  methods: {
    beginUpdateTariffVarian(data, index, pos) {
      //
      // console.log('pos', pos)
      if (pos === 0) {
        this.isEditing = this.isEditing.map(() => {
          return false
        })
        this.isEditing[index] = true
      } else if (pos === 3) {
        this.isEditingBuy = this.isEditingBuy.map(() => {
          return false
        })
        this.isEditingBuy[index] = true
      } else {
        this.isEditingPos = this.isEditingPos.map(() => {
          return false
        })
        this.isEditingPos[index] = true
      }
      this.temp = {...data}
    },
    cancelUpdateTariffVarian(index, pos) {
      //
      if (pos === 0) {
        this.isEditing[index] = false
      } else if (pos === 3) {
        this.isEditingBuy[index] = false
      } else {
        this.isEditingPos[index] = false
      }
      this.temp = {}
    },
    updateTariffVarian(data, index, pos) {
      //
      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let product = {
        id: data.id,
        buy_price: parseInt(data.buy_price),
        sell_price: parseInt(data.sell_price),
        sell_price_pos: parseInt(data.sell_price_pos),
        product_id: data.product_id,
        is_default: data.is_default
      }
      data = product
        // console.log('prod', product)
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariants/' + product.id),
        headers,
        data
      }).then(response => {
        this.productData[index] = response.data.data
        this.tmp = {}
        this.isEditing[index] = false
        this.isEditingPos[index] = false
        this.isEditingBuy[index] = false
        this.cancelUpdateTariffVarian(index)
        // this.filterStore(this.$store.getters.selectedStore)
        this.loading = false
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
    changeLabel() {
      this.labelHarga = this.lang.price + '\t' + '(' + this.selectedStore.currency_id + ')'
    },
    showHoldInfo(data) {
      var dataHold = {
        item: data,
        product_id: this.productId,
        product_name: this.productName
      }
      this.$emit('holdinfo', dataHold)
    }
  },

  mounted() {
    this.changeLabel()
    // this.uploadPhotoUrl = baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'product/upload')
    // this.getData()
  }
}
</script>
