<template>
  <div>
    <button-action-authenticated
      :permission="['catalog/products', 'edit']"
      type="primary"
      @click="modalVarian = true">
      {{ lang.manage }} {{ lang.variant }}
    </button-action-authenticated>

    <el-dialog
      :title="$lang[langId].variant_product"
      :visible.sync="modalVarian"
      custom-class="mw-1200">
      <div>
        <el-row :gutter="10">
          <el-col :span="6">
            <strong>{{ lang.variant_type }}</strong>
          </el-col>
          <el-col :span="12">
            <strong>{{ lang.variant }}</strong>
          </el-col>
          <el-col :span="6">
            <strong>{{ $lang[langId].action }}</strong>
          </el-col>
        </el-row>

        <hr/>

        <el-row
          v-for="(field, key) in fields"
          :key="key"
          :gutter="10"
          style="border-bottom: 1px solid #f0f0f0; padding-top: 12px;padding-bottom: 12px;">
          <el-col :span="6">
            <el-input
              size="mini"
              style="margin-top: 0; width: 100%;"
              :placeholder="lang.info_variant_type"
              v-model="field.label">
            </el-input>
          </el-col>

          <el-col :span="12">
            <template v-if="field.names.length >= 1">
            <el-tag
              v-for="tag in field.names"
              :key="tag"
              :disable-transitions="false"
              closable
              class="mr-4 mb-4"
              @close="handleRemoveVariantName(tag, key)">
              {{tag}}
            </el-tag>
            </template>

            <template v-else>
              <el-tag
                :key="tag"
                v-for="tag in field.names"
                :disable-transitions="false"
                @close="handleRemoveVariantName(tag, key)">
                {{tag}}
              </el-tag>
            </template>

            <el-input
              class="input-new-tag"
              ref="saveTagInput"
              size="mini"
              v-if="field.control.showAddName"
              v-model="newVariantName"
              @keyup.enter.native="handleInputVariantName(key)"
              @blur="handleInputVariantName(key)">
            </el-input>

            <el-button v-else class="button-new-tag"
              size="mini"
              @click="handleInputVariantNameVisible(key)">
              + {{ lang.add }} {{ lang.variant }}
            </el-button>
          </el-col>

          <el-col :span="6">
            <el-button
              v-if="key !== 0"
              icon="el-icon-delete" circle
              type="danger"
              @click="handleDeleteField(key)">
            </el-button>
          </el-col>
        </el-row>

        <el-button type="text"
          v-if="dataCompleted"
          icon="el-icon-plus"
          @click="handleAddVariant">
          {{ lang.type }} {{ lang.variant }}
        </el-button>
      </div>

      <div>
        <div v-if="productNew" class="flex-container" style="margin-top: 8px">
          <div class="font-bold font-14 mr-8">
            {{ lang.track_inventory }}
          </div>
          <div class="mr-8">
            <el-switch
              v-model="track_inventory"
              inactive-color="#ff4949"
              @change="changeTrackInventory"
            />
            <strong v-if="track_inventory" class="font-12 color-info">{{ lang.yes }}</strong>
            <strong v-else class="font-12 color-info">{{ lang.no }}</strong>
          </div>
        </div>

        <el-divider></el-divider>

				<el-table :data="tableData" style="width: 100%" v-if="fields[0].label === 'satuan'">
          <el-table-column
            prop="name"
            :label="lang.variant"
            min-width="150">
          </el-table-column>
          <el-table-column
            label="Unit"
            min-width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unit" placeholder="Unit" style="width:100%; margin-top:0;"/>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.sku"
            min-width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sku" :placeholder="lang.sku" style="width:100%; margin-top:0;"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS' && !selectedStore.is_hide_buy_price"
            :label="lang.buy_price"
            min-width="200">
            <template slot-scope="scope">
              <!-- <money v-model="scope.row.buy_price" class="el-input__inner"></money> -->
              <input-money v-model="scope.row.buy_price" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.market_price"
            min-width="200">
            <template slot-scope="scope">
              <input-money v-model="scope.row.market_price" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.online_selling_price"
            min-width="200">
            <template slot-scope="scope">
              <input-money v-model="scope.row.sell_price" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.selling_price_in_store"
            min-width="200">
            <template slot-scope="scope">
              <input-money v-model="scope.row.sell_price_pos" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column v-if="disabledQty"
            :label="lang.stock_qty"
            width="150">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.stock_qty"
                type="number"
              />
            </template>
          </el-table-column>

          <el-table-column
            :label="$lang[langId].action"
            width="70">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-delete" circle
                type="danger"
                @click="handleDeleteVariant(scope.$index)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table :data="tableData" style="width: 100%" v-else>
          <el-table-column
            prop="name"
            :label="lang.variant"
            min-width="150">
          </el-table-column>
          <el-table-column
            :label="lang.sku"
            min-width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sku" :placeholder="lang.sku" style="width:100%; margin-top:0;"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS' && !selectedStore.is_hide_buy_price"
            :label="lang.buy_price"
            min-width="200">
            <template slot-scope="scope">
              <!-- <money v-model="scope.row.buy_price" class="el-input__inner"></money> -->
              <input-money v-model="scope.row.buy_price" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.market_price"
            min-width="200">
            <template slot-scope="scope">
              <input-money v-model="scope.row.market_price" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.online_selling_price"
            min-width="200">
            <template slot-scope="scope">
              <input-money v-model="scope.row.sell_price" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.selling_price_in_store"
            min-width="200">
            <template slot-scope="scope">
              <input-money v-model="scope.row.sell_price_pos" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column v-if="disabledQty"
            :label="lang.stock_qty"
            width="150">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.stock_qty"
                type="number"
              />
            </template>
          </el-table-column>

          <el-table-column
            :label="$lang[langId].action"
            width="70">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-delete" circle
                type="danger"
                @click="handleDeleteVariant(scope.$index)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <template>
          <span>{{ $lang[langId].save_at }}:</span>
          <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
            <el-option
              v-for="item in outlets"
              :key="item.store_id"
              :label="item.name"
              :value="item.store_id">
            </el-option>
          </el-select>
        </template>
        <el-button @click="modalVarian = false">{{ lang.cancel }}</el-button>
        <el-button type="primary" @click="confirmData">{{ $lang[langId].confirm }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InputMoney from '@/components/InputMoneyV2'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  props: [
    'productSku',
    'variantData',
    'productData',
    'productNew'
  ],

  mixins: [basicComputedMixin],

  components: {
    InputMoney
  },

  data() {
    return {
      modalVarian: false,
      labelLength: 0,
      data: {
        labels: [],
        names: []
      },
      dataCompleted: false,
      tableData: [],
      variants: [],
      maxLength: 0,
      firstArray: [],
      newVariantName: '',
      fields: [{
        label: '',
        name: '',
        names: [],
        control: {showAddName: false, confirmed: false}
      }],
      disabledQty: false,
      track_inventory: false,
      storeToBeSaved: [],
      outlets: [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ]
    }
  },

  mounted () {
    const stores = this.$store.state.userStores.stores
    if (stores) {
      stores.map(item => {
        this.outlets.push({ ...item })
      })
    }

    const store = this.$store.getters.selectedStore
    if (store) {
      if (store.constructor === Array) {
        this.storeToBeSaved = 'all'
      } else {
        this.storeToBeSaved[0] = store.store_id
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
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },

    disableBtnConfirm () {
      let disable = false
      let temp = this.fields.filter(i => {
        return i.label !== ''
      })
      if (temp.length !== this.fields.length) {
        disable = true
      }
      return disable
    }
  },

  watch: {
    productData: {
      handler(data) {
        //
        if (!this.productNew) {
          // console.log('data', data)
          if (data.track_inventory === 0) {
            this.disabledQty = false
          } else {
            this.disabledQty = true
          }
        }
      },
      deep: true,
      immediate: true
    },
    variantData: {
      handler(data) {
        if (data) {
          this.loadLabels()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    refreshTable() {
      this.data.labels = []
      this.data.names = []
      this.fields.map((item) => {
        this.data.labels.push(item.label)
        this.data.names.push(item.names)
      })
      let tableData = []
      // console.log('new2', this.data.names.length)
      if (this.data.names[0].length >= 1) {
        // combine to variant names
        let allVariants = this.printCombinations(this.data.names)
        // console.log('print', allVariants)
        // put in to array object
        allVariants.forEach((item, idx) => {
					let unit = ''
          let sku = ''
          let buyPrice = ''
          let marketPrice = ''
          let sellPrice = ''
          let sellPricePos = ''
          let stockQty = ''
          if (this.productData) {
            if (this.productData.sku) {
              sku = this.productData.sku + '-' + idx
            } else {
              sku = ''
            }
            if (this.productData.buy_price) {
              buyPrice = this.productData.buy_price
            }
            if (this.productData.market_price) {
              marketPrice = this.productData.market_price
            }
            if (this.productData.sell_price) {
              sellPrice = this.productData.sell_price
            }
            if (this.productData.sell_price_pos) {
              sellPricePos = this.productData.sell_price_pos
            }
            if (this.productData.stock_qty) {
              stockQty = this.productData.stock_qty
            }
          }
          if (this.tableData.length > 0) {
            this.tableData.map((list, index) => {
              if (idx === index) {
								unit = list.unit
                sku = list.sku
                buyPrice = list.buy_price
                marketPrice = list.market_price
                sellPrice = list.sell_price
                sellPricePos = list.sell_price_pos
                stockQty = list.stock_qty
              } else {
                return false
              }
            })
          }
          let newData = {
            name: item,
						unit: unit,
            sku: sku,
            buy_price: buyPrice,
            market_price: marketPrice,
            sell_price: sellPrice,
            sell_price_pos: sellPricePos,
            stock_qty: stockQty
          }
          tableData.push(newData)
        })
      } else if (this.data.names.length === 1 && this.data.names.length !== 0) {
        let names = this.data.names[0]
        names.forEach((item, idx) => {
          // console.log('item', item)
					let unit = ''
          let sku = ''
          let sellPrice = ''
          let sellPricePos = ''
          if (this.productData) {
            if (this.productData.sku) {
              sku = this.productData.sku + '-' + idx
            }
            if (this.productData.sell_price) {
              sellPrice = this.productData.sell_price
            }
            if (this.productData.sell_price_pos) {
              sellPricePos = this.productData.sell_price_pos
            }
          }
          let singleData = {
            name: item,
						unit: unit,
            sku: sku,
            sell_price: sellPrice,
            sell_price_pos: sellPricePos
          }
          tableData.push(singleData)
        })
      }
      this.tableData = tableData
      // this.tableData.push(tableData)
      this.dataCompleted = true
    },

    loadLabels() {
      this.fields.shift()
      const labels = Object.keys(this.variantData.variant_label)
      const names = Object.values(this.variantData.variant_label)
      labels.map((item, idx) => {
        this.fields.push({
          label: item,
          name: '',
          names: Object.values(names[idx]),
          control: {showAddName: false, confirmed: false}
        })
      })
      const tableData = this.variantData.data
      this.tableData = tableData
      this.dataCompleted = true
    },

    handleAddVariant() {
      this.fields.push({
        label: '',
        name: '',
        names: [],
        control: {
          showAddName: false,
          confirmed: false
        }
      })
      this.dataCompleted = false
    },

    handleInputVariantName(key) {
      let name = this.newVariantName
      if (name !== '') this.fields[key].names.push(name)
      if (name !== '') this.variants.push(name)
      if (name !== '') this.refreshTable()
      this.newVariantName = ''
      this.fields[key].control.showAddName = false
    },

    handleInputVariantNameVisible(key) {
      this.fields[key].control.showAddName = true
    },

    handleRemoveVariantName(tag, key) {
      this.fields[key].names.splice(this.fields[key].names.indexOf(tag), 1)
      this.refreshTable()
    },

    handleDeleteVariant(row) {
      this.tableData.splice(row, 1)
    },

    handleDeleteField(row) {
      this.fields.splice(row, 1)
      this.refreshTable()
    },

    printCombinations(arr) {
      function allPossibleCases(arr) {
        if (arr.length === 1) {
          return arr[0]
        } else {
          var result = []
          // recur with the rest of array
          var allCasesOfRest = allPossibleCases(arr.slice(1))
          for (var i = 0; i < allCasesOfRest.length; i++) {
            for (var j = 0; j < arr[0].length; j++) {
              result.push(arr[0][j] + ',' + allCasesOfRest[i])
            }
          }
          return result
        }
      }
      return allPossibleCases(arr)
    },

    changeTrackInventory(value) {
      if (value) {
        this.disabledQty = true
      } else {
        this.disabledQty = false
      }
    },

    confirmData() {
      if (this.disableBtnConfirm) {
        this.$notify({
          type: 'warning',
          title: this.lang.variant_type,
          message: this.$lang[this.langId].tipe_variant_cant_empty
        })
      } else {
        this.modalVarian = false
        let to_store_id = this.selectedStore.store_id
        let to_allstore_id = 0
        // if (this.saveToAllAccessStore.includes(this.selectedStore.url_id)) {
          if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
            to_allstore_id = 1
          } else if (this.storeToBeSaved.length) {
            to_store_id = this.storeToBeSaved.join(',')
          }

          this.tableData.map(i => {
            i.to_store_id = to_store_id
            i.to_allstore_id = to_allstore_id
          })
        // }
        // console.log('tabledata', this.tableData)
        this.$emit('saved', this.tableData, this.data.labels, this.track_inventory)
      }
    },

    handleCheckVariant () {
      if (this.disableBtnConfirm) {
        this.$notify({
          type: 'warning',
          title: this.lang.variant_type,
          message: this.$lang[this.langId].tipe_variant_cant_empty
        })
        this.modalVarian = true
      }
    },

    handleSelectAll (data) {
      if (data.length) {
        data.map(i => {
          if (i === 0) {
            this.storeToBeSaved = [0]
          }
        })
      }
    },
  }
}
</script>
