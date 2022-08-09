<template>
  <div>
    <button-action-authenticated
      :permission="['catalog/products', 'edit']"
      type="primary"
      @click="openModal">
      {{ lang.add_variant }}
    </button-action-authenticated>

    <el-dialog v-loading="loading" :title="$lang[langId].variant_product" :visible.sync="modalVarian" @close="handleCancel" width="80%">
      <el-form v-for="(item, idx) in tmp" :key="idx" :model="item" ref="variantForm" :rules="rules">
        <el-form-item prop="label">
          <el-card class="box-card">
            <div slot="header">
              <label>{{ lang.add }} {{ lang.variant_type }}</label>
            </div>
            <div class="flex-container flex-container--wrap">
              <el-input
                v-model="item.label"
                placeholder="type here..."
                size="mini"
                type="text"
                style="width: 220px; margin-right: 8px;"
                @keyup.native.enter="handleAddLabel(idx)"
              />
              <el-button
                size="mini"
                type="primary"
                @click="handleAddLabel(idx)">
                {{ lang.add }}
              </el-button>
            </div>
            <div class="tag-in-loop-wrapper">
              <el-tag
                v-for="(item, key) in tipe"
                :key="key"
                closable
                @close="removeItem(key)">
                {{ item }}
              </el-tag>
            </div>
          </el-card>
        </el-form-item>

        <hr/>

        <el-card class="box-card">
          <div slot="header">
            <label>{{ $lang[langId].fill_variant }}</label>
          </div>

          <table class="table">
            <tbody>
              <tr>
                <td v-for="(item, key) in fields" :key="key">
                  {{item.label}}
                </td>
                <td>{{ lang.sku_or_barcode }}</td>
                <td v-if="variantData.product.track_inventory === 1">{{ lang.stock_qty }}</td>
                <td>{{ $lang[langId].weight }}</td>
                <td>{{ $lang[langId].comission }}</td>
              </tr>
              <tr>
                <td v-for="(it, ix) in fields" :key="ix">
                  <el-form-item prop="name">
                    <el-select
                      v-model="item.name[ix]"
                      :placeholder="lang.info_choose_existing_or_add_new"
                      size="mini"
                      allow-create
                      filterable
                      clearable>
                      <el-option
                        v-for="(name, key) in it.names"
                        :value="name"
                        :label="name"
                        :key="key"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item prop="sku">
                    <el-input size="mini" type="text" v-model="item.sku" />
                  </el-form-item>
                </td>
                <td v-if="variantData.product.track_inventory === 1">
                  <el-form-item prop="stock_qty">
                    <el-input size="mini" type="text" v-model="item.stock_qty" />
                  </el-form-item>
                </td>
                <td >
                  <el-form-item prop="weight">
                    <el-input size="mini" type="number" v-model="item.weight" />
                  </el-form-item>
                </td>
                <td>
                  <div class="el-input el-input--mini">
                  <el-form-item prop="lpoint">
                    <!-- <money
                        v-model="item.comission"
                        v-bind="$store.state.inputMoney"
                        class="el-input__inner"
                      /> -->
                      <input-money v-bind="$store.state.inputMoney" v-model="item.comission" />
                  </el-form-item>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-card>

        <hr/>

        <el-card class="box-card">
          <div slot="header">
            <label>{{ lang.price }}</label>
          </div>
          <table class="table">
            <tbody>
              <tr>
                <td v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS' && !selectedStore.is_hide_buy_price">{{ lang.buy_price }}</td>
                <td>{{ lang.market_price }}r</td>
                <td>{{ lang.online_selling_price }}</td>
                <td>{{ lang.selling_price_in_store }}</td>
              </tr>
              <tr>
                <td v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS' && !selectedStore.is_hide_buy_price">
                  <div class="el-input el-input--mini">
                    <el-form-item prop="buy_price">
                      <input-money v-bind="$store.state.inputMoney" v-model="item.buy_price" />
                    </el-form-item>
                  </div>
                </td>
                <td>
                  <div class="el-input el-input--mini">
                    <el-form-item prop="market_price">
                      <input-money v-bind="$store.state.inputMoney" v-model="item.market_price" />
                    </el-form-item>
                  </div>
                </td>
                <td>
                  <div class="el-input el-input--mini">
                    <el-form-item prop="sell_price">
                      <input-money v-bind="$store.state.inputMoney" v-model="item.sell_price" />
                    </el-form-item>
                  </div>
                </td>
                <td>
                  <div class="el-input el-input--mini">
                    <el-form-item prop="sell_price_pos">
                      <input-money v-bind="$store.state.inputMoney" v-model="item.sell_price_pos" />
                    </el-form-item>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-card>

        <hr/>

        <!-- <el-card class="box-card">
          <div slot="header">
            <label>{{ lang.photo }}</label>
          </div>
          <el-upload
            :action="uploadPhotoUrl"
            list-type="picture-card"
            :headers="headers"
            :file-list="fileList"
            :on-success="handleUploadSuccess"
            multiple>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-card> -->
        <el-button type="primary" @click="multipleVariant">{{ lang.add_variant }}</el-button>

        <hr/>

        <el-form-item class="text-right">
          <!-- <div class="row"> -->
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
            <el-button type="primary" :disabled="disableBtnConfirm" @click="confirmData('variantForm')">{{ $lang[langId].confirm }}</el-button>
          <!-- </div> -->
          <el-button @click="handleCancel">{{ lang.cancel }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>  <!-- {{tableData}} -->
  </div>
</template>

<script>
import axios from 'axios'
import { baseApi } from 'src/http-common'
import InputMoney from '@/components/InputMoneyV2'

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  props: ['productSku', 'variantData'],

  mixins: [basicComputedMixin],

  components: {
    InputMoney
  },

  data() {
    return {
      loading: false,
      uploadPhotoUrl: baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'product/upload'),
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      },
      modalVarian: false,
      data: {
        labels: []
      },
      tmp: [{
        name: [],
        label: '',
        sku: '',
        stock_qty: '',
        lpoint: '',
        buy_price: this.variantData.product.buy_price,
        sell_price: this.variantData.product.sell_price,
        sell_price_pos: this.variantData.product.sell_price_pos,
        market_price: this.variantData.product.market_price,
        file: []
      }],
      fields: [{
        label: '',
        names: []
      }],
      rules: {
        name: [
          { required: true, message: 'Please input', trigger: 'blur' }
        ],
        sku: [
          { required: true, message: 'Please input', trigger: 'blur' }
        ],
        stock_qty: [
          { required: true, message: 'Please input', trigger: 'blur' }
        ],
        sell_price: [
          { required: true, message: 'Please input', trigger: 'blur' }
        ]
      },
      tipe: [],
      storeToBeSaved: [],
      productId: this.variantData.product.id,
      outlets: [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ]
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    // fileList() {
    //   let photos = []
    //   if (this.tmp.file.length > 0) {
    //     photos = this.tmp.file.map((b) => {
    //       b.url = b.photo_md
    //       return b
    //     })
    //   }
    //   return photos
    // },
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
      let temp = this.tmp.filter(i => {
        return i.name.length === this.fields.length
      })
      if (temp.length !== this.tmp.length) {
        disable = true
      }
      return disable
    }
  },

  mounted() {
    if (this.variantData.product.track_inventory === 0) {
      this.rules.sku[0].required = false
      this.rules.stock_qty[0].required = false
    }

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
        this.storeToBeSaved = store.url_id
      }
    }
  },

  methods: {
    resetData() {
      this.tmp = [{
        name: [],
        label: '',
        sku: '',
        stock_qty: '',
        lpoint: '',
        buy_price: '',
        sell_price: '',
        sell_price_pos: '',
        market_price: '',
        file: []
      }],
      this.fields = []
      this.fields.push({
        label: '',
        names: []
      })
      this.data = {
        labels: []
      }
    },

    handleAddLabel(idx) {
      if (this.tmp[idx].label === '') {
        this.$notify({
          type: 'warning',
          title: this.lang.variant_type,
          message: this.$lang[this.langId].tipe_variant_cant_empty
        })
      } else {
        this.fields.push({
          label: this.tmp[idx].label,
          names: []
        })
        // this.tipe.push(this.tmp.label)
        this.data.labels.push(this.tmp[idx].label)
        this.tmp[idx].label = ''
      }
    },

    handleUploadSuccess(response, file, fileList) {
      this.tmp.file.push(response.data[0])
    },

    loadLabels() {
      this.fields.shift()
      const data = Object.assign({}, this.variantData)
      console.log(this.variantData)
      const labels = Object.keys(data.variant_label)
      const names = Object.values(data.variant_label)
      //
      this.tipe = labels
      labels.map((item, idx) => {
        this.fields.push({
          label: item,
          names: Object.values(names[idx])
        })
      })
      this.data.labels = labels
    },

    handleCancel() {
      this.resetData()
      this.modalVarian = false
    },

    confirmData(formName) {
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
          let to_store_id = this.selectedStore.store_id
          let to_allstore_id = 0
          // if (this.storeToBeSaved === 'All') {
          //   this.outlets.map(i => {
          //     to_store_id.push(i.store_id)
          //   })
          // } else {
          //   this.outlets.map(i => {
          //     if (this.storeToBeSaved === i.url_id) {
          //       to_store_id.push(i.store_id)
          //     }
          //   })
          // }
          // if (this.saveToAllAccessStore.includes(this.selectedStore.url_id)) {
            if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
              to_allstore_id = 1
            } else if (this.storeToBeSaved.length) {
              to_store_id = this.storeToBeSaved.join(',')
            }
          // }
          this.loading = true
          // const data = Array.assign({}, this.tmp)
          let data = [ ...this.tmp]
          const arrLabels = Object.assign({}, this.data)
          // data.name = data.name.join(',')
          // data.label = arrLabels.labels.join(',')
          // data.product_id = this.variantData.product.id
          
          var varian = {
            product: {
              variant_label: arrLabels.labels.join(',')
            },
            variant: [],
            to_store_id,
            to_allstore_id
          }
          data.map(i => {
            if (i.name.length && Array.isArray(i.name)) {
              i.name = i.name.join(',')
            }
            i.label = arrLabels.labels.join(',')
            i.product_id = this.variantData.product.id
            if (i.file && i.file.length === 0) {
              console.log('file', i)
              delete i.file
            }

            varian.variant.push(i)
          })

          // console.log('name', varian.variant)
          
          axios({
            method: 'POST',
            url: baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'product/addvariant/' + this.productId),
            headers: this.headers,
            data: varian
          }).then(response => {
            this.loading = false
            this.handleCancel()
            this.$emit('saved', varian.product)
          }).catch(error => {
            console.log('err', error.response)
            this.loading = false
            this.$notify({
              type: 'warning',
              message: error.response.data.error.error
            })
          })
        // } else {
        //   this.loading = false
        // }
      // })
    },

    openModal() {
      this.loadLabels()
      this.storeToBeSaved = [this.selectedStore.store_id]
      this.modalVarian = true
    },

    removeItem(key) {
      if (this.fields.length > 1) {
        this.tipe.splice(key,1)
        this.fields.splice(key,1)
      }
    },

    multipleVariant () {
      this.tmp.push({
        name: [],
        label: '',
        sku: '',
        stock_qty: '',
        lpoint: '',
        buy_price: this.variantData.product.buy_price,
        sell_price: this.variantData.product.sell_price,
        sell_price_pos: this.variantData.product.sell_price_pos,
        market_price: this.variantData.product.market_price,
        file: []
      })
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
