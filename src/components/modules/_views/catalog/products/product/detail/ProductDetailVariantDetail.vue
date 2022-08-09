<template>
  <div v-loading="loading">
    <el-form
      ref="form" class="form-edit-variant"
      :model="data">
      <div class="text-right flex-container flex-container--content-end">
        <template v-if="isEditing">
          <p>{{ $lang[langId].save_at }}:</p>
          <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
            <el-option
              v-for="item in outlets"
              :key="item.store_id"
              :label="item.name"
              :value="item.store_id">
            </el-option>
          </el-select>
        </template>
        <el-button size="mini" v-if="isEditing" class="ml-4" type="success" @click="save">{{ lang.save }}</el-button>
        <el-button size="mini" v-if="isEditing" type="default" @click="cancel">{{ lang.cancel }}</el-button>
        <el-button size="mini" v-if="!isEditing" type="primary" @click="handleVariantEditing">{{ lang.edit }}</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleVariantDelete">
          {{ $lang[langId].delete }}
        </el-button>
      </div>
      <hr/>
      <div class="varian-upload">
        <label>{{ $lang[langId].photo_variants }}</label>
        <el-upload
          v-if="isEditing"
          :action="uploadPhotoUrl"
          :headers="headers"
          :on-success="handleUploadSuccess"
          drag
          class="upload-demo"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        </el-upload>

        <div
          v-if="sourcePhotos.length"
          class="flex-container flex-container--wrap">
          <div
            v-for="(photo, key) in sourcePhotos"
            :key="key"
            class="photo-box-edit mr-4 mb-4">
            <el-image
              :src="photo.photo_md"
              fit="cover"
            />
            <el-button
              v-if="isEditing"
              type="text"
              class="photo-box-edit--trigger"
              @click="handleRemoveFile(photo, key)">
              <i class="el-icon-close"></i>
            </el-button>
          </div>
        </div>
        <div v-else class="font-12 color-info">
          -
        </div>
      </div>

      <!-- <el-row v-for="(i, idx) in variantName" :key="idx" :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ variant_label[idx] }}</label>
        </el-col>
        <el-col :span="10">
           <el-form-item prop="sku">
            <el-input :disabled="inputDisabled" v-model="variantName[idx]"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row v-for="(i, idx) in variantLabel" :key="idx" :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ i }}</label>
        </el-col>
        <el-col :span="10">
           <el-form-item prop="sku">
            <el-input :disabled="inputDisabled" v-model="variantName[idx]"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.sku }}</label>
          <p>{{ $lang[langId].info_sku_search_product }}</p>
        </el-col>
        <el-col :span="10">
           <el-form-item prop="sku">
            <el-input :disabled="inputDisabled" v-model="data.sku"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ $lang[langId].weight }}</label>
          <p>{{ $lang[langId].product_kg_decimal }}</p>
        </el-col>
        <el-col :span="10">
           <el-form-item prop="weight">
            <el-input :disabled="inputDisabled" v-model="data.vweight" type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.loyalty_point }}</label>
          <p>{{ lang.info_loyalty_point_earned_per_item }}</p>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="loyalty_points">
            <el-input :disabled="inputDisabled" v-model="data.loyalty_points"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.comission }}</label>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="comission">
            <!-- <money class="el-input__inner" v-bind="$store.state.inputMoney" :disabled="inputDisabled" v-model="data.comission"></money> -->
            <input-money v-bind="$store.state.inputMoney" :disabled="inputDisabled" v-model="data.comission" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS' && !selectedStore.is_hide_buy_price" :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.buy_price }}</label>
          <div v-if="data.has_auto_buy_price" class="font-12">{{ '(Auto ' + data.fauto_buy_price + ')' }}</div>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="last_buy_price">
            <input-money v-bind="$store.state.inputMoney" :disabled="inputDisabled" v-model="data.buy_price" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.market_price }}</label>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="market_price">
            <input-money v-bind="$store.state.inputMoney" :disabled="inputDisabled" v-model="data.market_price" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.online_selling_price }}</label>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="sell_price">
            <input-money v-bind="$store.state.inputMoney" :disabled="inputDisabled" v-model="data.sell_price" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ $lang[langId].shop_selling_price_pos }}</label>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="sell_price_pos">
            <input-money v-bind="$store.state.inputMoney" :disabled="inputDisabled" v-model="data.sell_price_pos" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.out_of_stock }}</label>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="is_out_stock">
            <el-switch v-model="data.is_out_stock" :disabled="inputDisabled" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14" class="text-right">
          <label>{{ lang.default_selection }}</label>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="is_default">
            <el-switch v-model="data.is_default" :disabled="inputDisabled" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'VariantDetail',

  props: ['variantId', 'productData'],

  mixins: [basicComputedMixin],

  components: {
    InputMoney
  },

  data() {
    return {
      data: {},
      file: [],
      loading: true,
      dialogImageUrl: '',
      dialogVisible: false,
      isEditing: false,
      inputDisabled: true,
      uploadPhotoUrl: '',
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      },
      variant_label: this.productData.variant_label.split(','),
      variantName: [],
      storeToBeSaved: []
    }
  },

  watch: {
    productData(val) {
      this.variant_label = val.variant_label
    }
  },

  computed: {
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
    },
    sourcePhotos() {
      let sourcePhotos = []
      if (!this.isEditing && this.data.photos) {
       sourcePhotos = this.data.photos
      } else if (this.isEditing) {
        sourcePhotos = this.file
      }
      return sourcePhotos
    },

    variantLabel () {
      let label = this.productData.variant_label.split(',')
      return label
    }
  },

  mounted() {
    this.uploadPhotoUrl = baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'product/upload')
    this.getData()
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'productvariants/' + this.variantId),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        if (this.selectedStore.currency_id === 'IDR') {
          this.data.last_buy_price = parseInt(this.data.last_buy_price)
          this.data.sell_price = parseInt(this.data.sell_price)
          this.data.sell_price_pos = parseInt(this.data.sell_price_pos)
          this.data.comission = parseInt(this.data.comission)
          this.data.market_price = parseInt(this.data.market_price)
          this.data.buy_price = parseInt(this.data.buy_price)
          this.data.comission = parseInt(this.data.comission)
          // console.log(this.data.sell_price, ':after')
        }
        this.variantName = this.data.name.split(',')
        this.loading = false
      }).catch(error => {
        // console.log(error)
        this.loading = false
      })
    },
    save() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      if (this.file.length > 0) {
        // only send newly added photos
        const files = this.file.filter(file => {
          return file.file_name
        })
        this.$set(this.data, 'file', files)
      }

      let to_store_id = this.selectedStore.store_id
      let to_allstore_id = 0
      if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
          to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          to_store_id = this.storeToBeSaved.join(',')
        }

        this.data.to_store_id = to_store_id
        this.data.to_allstore_id = to_allstore_id
      }

      this.data.name = this.variantName.join(',')
      this.data.weight = this.data.vweight
      axios({
        method: 'PUT',
        url: baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'productvariants/' + this.variantId),
        headers: headers,
        data: this.data
      }).then(response => {
        this.loading = false
        this.isEditing = false
        this.inputDisabled = true
        this.data = response.data.data
        if (this.selectedStore.currency_id === 'IDR') {
          this.data.last_buy_price = parseInt(this.data.last_buy_price)
          this.data.sell_price = parseInt(this.data.sell_price)
          this.data.sell_price_pos = parseInt(this.data.sell_price_pos)
          this.data.comission = parseInt(this.data.comission)
          this.data.market_price = parseInt(this.data.market_price)
          this.data.buy_price = parseInt(this.data.buy_price)
          this.data.comission = parseInt(this.data.comission)
        }
        this.$emit('update')
      }).catch(error => {
        this.loading = false
        this.isEditing = false
        this.inputDisabled = true
        this.$notify({
          type: 'warning',
          message: error.response.data.error.error
        })
      })
    },
    cancel() {
      this.isEditing = false
      this.inputDisabled = true
      this.file = []
      this.getData()
    },
    handleRemoveFile(file, key) {
      if (file.id) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'DELETE',
          url: baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'productvariantsphotos/' + file.id),
          headers: headers
        }).then(response => {
          this.loading = false
          this.isEditing = false
          this.inputDisabled = true
          this.file.splice(key, 1)
        }).catch(error => {
          this.loading = false
          this.isEditing = false
          this.inputDisabled = true
          this.$notify({
            type: 'warning',
            message: error.response.data.error.error
          })
        })
      } else {
        this.file.splice(key, 1)
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleVariantEditing() {
      this.isEditing = true
      this.inputDisabled = false
      this.file = [...this.data.photos]
      if (this.storeToBeSaved.length === 0) {
        this.storeToBeSaved = [this.selectedStore.store_id]
      }
    },
    handleVariantDelete() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.$store.getters.selectedStore.url_id, this.langId, 'productvariants/' + this.variantId),
        headers: headers
      }).then(response => {
        this.loading = false
        this.isEditing = false
        this.$emit('variant-deleted')
      }).catch(error => {
        this.loading = false
        this.isEditing = false
        this.inputDisabled = true
        this.getData()
        this.$notify({
          type: 'warning',
          message: error.response.data.error.error
        })
      })
    },
    handleUploadSuccess(response, file, fileList) {
      this.file.push(...response.data)
    },

    handleSelectAll (data) {
      if (data.length) {
        data.map(i => {
          if (i === 0) {
            this.storeToBeSaved = [0]
          }
        })
      }
    }
  }
}
</script>
