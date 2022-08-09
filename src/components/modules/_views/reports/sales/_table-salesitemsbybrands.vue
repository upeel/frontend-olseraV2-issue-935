<template>
  <div>
    <div class="choose-time">
      <el-select
        v-model="selectedBrands"
        multiple
        filterable
        remote
        :placeholder="lang.add_brand"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 160px">
        <el-option
          v-for="(item, key) in brands"
          :key="key"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="success" @click="getData">
        {{ lang.submit }}
      </el-button>
    </div>

   
    <!-- <div style="text-align: right;"> -->
    <div v-if="selectedStore !== null && (this.selectedStore.url_id === 'dpn' || this.selectedStore.url_id === 'dma' || this.selectedStore.url_id === 'jtc')" style="text-align: right;">
      <small>Data Split </small>
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="selectedSplit"
          @change="getSplit"
          >
        </el-switch>
        <span v-if="selectedSplit === 0">{{ lang.no }}</span>
        <span v-if="selectedSplit === 1">{{ lang.yes }}</span>
    </div>


    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <bs-table
        :header="[
          $lang[langId].currency,
          lang.sales_amount,
          lang.product_cost,
          lang.profit,
          lang.total
        ]">
        <tr
          v-for="(item, key) in summary"
          :key="key">
          <td>{{ item.currency_id }}</td>
          <td>{{ item.ftotal_amount }}</td>
          <td>{{ item.ftotal_cost_amount }}</td>
          <td>{{ item.ftotal_profit }}</td>
          <td>{{ item.total_qty }}</td>
        </tr>
      </bs-table>
    </div>

    <hr/>

    <bs-table
      :header="[
        lang.order_no,
        lang.brand,
        lang.date,
        lang.sales_by,
        lang.item,
        lang.qty,
        lang.customer,
        lang.sales_amount,
        lang.product_cost,
        lang.profit
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td prop="order_no">
          <el-button v-if="$store.getters.webviewMode"  type="text" @click="showDetailData(
              {path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,query: {'rpt': true, 'path': 'creditsalesdetails'}},
              {...item}
            )">
            {{ item.order_no }}
          </el-button>
          <router-link v-else :to="{path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,query: {'rpt': true, 'path': 'salesitemsbybrands'}}">
            {{ item.order_no }}
          </router-link>
        </td>
        <td>{{ item.brand_name }}</td>
        <td>{{ item.forder_date }}</td>
        <td>{{ item.sales_by_name }} ( {{item.order_source_name}} )</td>
        <td>{{ item.product_name }} ( {{item.product_variant_name}} )</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.customer_name }}</td>
        <td>{{ item.famount }}</td>
        <td>{{ item.fcost_amount }}</td>
        <td>{{ item.fprofit }}</td>
      </tr>
    </bs-table>

    <div v-if="total > 0" class="table-handler-bottom">
      <el-pagination
        :total="total"
        :page-sizes="[50, 100]"
        :page-size="15"
        :current-page.sync="currentPage"
        background
        layout="sizes, prev, pager, next"
        @current-change="handleChangePage"
        @size-change="handleChangeSizePage"
      />
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'TableSalesdetailsbybrands',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  data() {
    return {
      selectedBrands: [],
      selectedSplit: 0,
      brands: '',
      loading: false
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    }
  },
  methods: {
    remoteMethod(query) {
      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      this.brands = []
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
        params: {
          search: query
        },
        headers
      }).then(response => {
        console.log('zxczxczczxczxczxc');
        this.brands = response.data.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getData() {
      let brandIds = [...this.selectedBrands]
      brandIds = brandIds.join(',')
      this.$emit('picked-brand', brandIds)
    },
    getSplit(data){
      // console.log('dghfhfghfgh', this);
      let sender = {
        path: this.$route.query.path,
        split: data,
        store: this.selectedStore.url_id,
      }
      // console.log(sender);
      this.$emit('pick-split', sender)

    },
    showDetailData(path, data) {
      this.$emit('showdetaildata', path, data)
    },
    handleChangePage(page) {
      this.$emit('changePage', page)
      this.$emit('currentPage', this.currentPage)
    },
    handleChangeSizePage(page) {
      this.currentPage = 1
      this.$emit('changeSizePage', page)
    }
  }
}
</script>
