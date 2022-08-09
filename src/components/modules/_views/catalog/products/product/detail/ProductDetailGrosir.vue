<template>
  <div class="row" v-loading="loading">
    <div class="col-md-12">
      <div class="panel panel-default box">
        <div class="box-header with-border">
          <h3 class="box-title">Daftar Tingkatan Harga</h3>
          <div class="pull-right">
            <span>Perubahan Tersimpan </span>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" @click="createDialog = true" icon="el-icon-plus"> Tambah</button-action-authenticated>
          </div>
          <p>{{ total }} Tingkatan Harga</p>
        </div>
        <div class="box-body">
          <div class="table-handler">
            <el-select class="inline-form" v-model="params.per_page" @change="handleSizeChange" filterable placeholder="Select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-table :data="pricetiersData" :key="index" style="width: 100%" stripe>
            <el-table-column label="Tipe Pelanggan">
              <template slot-scope="scope">
                <el-select placeholder="Pilih varian" v-model="scope.row.customer_type_name">
                  <el-option v-for="option in pricetiersData" :key="option.customer_type_id" :label="option.customer_type_name" :value="option.customer_type_id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Varian">
              <template slot-scope="scope">
                <el-select placeholder="Pilih varian" v-model="scope.row.product_variant_name">
                  <el-option v-for="option in pricetiersData" :key="option.product_variant_id" :label="option.product_variant_name" :value="option.product_variant_id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="QTY mulai">
              <template slot-scope="scope">
                <el-input-number controls-position="right" v-model="scope.row.qty_from"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Harga Jual">
              <template slot-scope="scope">
                <el-input-number controls-position="right" v-model="scope.row.sell_price"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Action" align="center">
              <template>
                <el-button type="text" icon="el-icon-delete" style="color: #F56C6C;"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin-top: 12px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="params.currentPage" :page-size="params.per_page" layout="prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
          <el-dialog title="Tambah Tingkatan Harga" :visible.sync="createDialog">
            <el-form :model="form">
              <el-form-item label="Tipe Pelanggan" :label-width="formLabelWidth">
                <el-select placeholder="Pilih varian">
                  <el-option label="Zone No.1"></el-option>
                  <el-option label="Zone No.2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Varian" :label-width="formLabelWidth">
                <el-select placeholder="Pilih varian">
                  <el-option label="Zone No.1"></el-option>
                  <el-option label="Zone No.2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="QTY mulai" :label-width="formLabelWidth">
                <el-input-number controls-position="right"></el-input-number>
              </el-form-item>
              <el-form-item label="Harga Jual" :label-width="formLabelWidth">
                <el-input-number controls-position="right">
                  <template slot="prepend">IDR</template>
                </el-input-number>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="createDialog = false">Hapus</el-button>
              <el-button type="primary" @click="createDialog = false">Tambah</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>

  </div>

</template>
<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'DetailGrosir',
  data() {
    return {
      loading: true,
      pricetiersData: [],
      total: null,
      createDialog: false,
      formLabelWidth: '50%',
      pages: [
        {
          value: 5,
          label: '5 Baris'
        },
        {
          value: 10,
          label: '10 Baris'
        },
        {
          value: 20,
          label: '20 Baris'
        }
      ],
      params: {
        currentPage: 1,
        per_page: 5,
        page: 1,
        product_id: this.$route.params.id
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
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },
  methods: {
    getPricetiers() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productpricetiers'),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.pricetiersData = response.data.data
          this.total = response.data.meta.total
          this.loading = false
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.total = 0
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.params.per_page = val
      this.getPricetiers()
    },
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getPricetiers()
    }
  },
  mounted() {
    this.getPricetiers()
  }
}
</script>
