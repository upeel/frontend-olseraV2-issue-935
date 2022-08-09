<template>
  <div>
    <template v-if="!isDetail">
      <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        <el-table :data="summary" border>
          <el-table-column :label="$lang[langId].currency" prop="currency_id" />
          <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
        </el-table>
      </div>

      <hr/>

      <el-table :data="data" border>
        <el-table-column :label="$lang[langId].sales_by_source">
          <template slot-scope="scope">
            {{ scope.row.sales_by_name }} ( {{scope.row.order_source_name}} )
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].devices" align="center" >
          <template slot-scope="scope">
            <template>
              <el-button v-if="scope.row.station" type="text" @click="showDetail(scope.row)" >
              <div>
                {{ scope.row.station }}
              </div>
            </el-button>
            <!-- <el-button v-else type="text" > -->
              <div v-else>
                -
              </div>
            <!-- </el-button> -->
            </template>
          </template>
        </el-table-column>
        <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
      </el-table>

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
    </template>
    <template v-else>
      <div style="margin-bottom: 10px">
        <el-button class="el-icon-back" @click="handleBack" />
      </div>

      <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        <bs-table
          :header="[
            $lang[langId].currency,
            lang.sales_amount,
            lang.shipping + lang.tax,
            lang.product_cost,
            lang.profit,
            lang.service_charge,
            lang.discount
          ]">
          <tr
            v-for="(item, key) in summaryDetail"
            :key="key">
            <td>{{ item.currency_id }}</td>
            <td>{{ item.ftotal_amount }}</td>
            <td>{{ item.ftotal_shipping_tax_amount }}</td>
            <td>{{ item.ftotal_cost_amount }}</td>
            <td>{{ item.fprofit_nett }}</td>
            <td>{{ item.ftotal_service_charge_amount }}</td>
            <td>{{ item.ftotal_discount_amount }}</td>
          </tr>
        </bs-table>
      </div>

      <hr/>

      <bs-table
        :header="[
          lang.order_no,
          lang.date,
          lang.sales_by,
          lang.customer,
          $lang[langId].customer_id,
          lang.sales_amount,
          lang.shipping + lang.tax,
          lang.product_cost,
          lang.profit,
          lang.service_charge,
          lang.discount
        ]">
        <tr
          v-for="(item, key) in dataDetail"
          :key="key">
          <td>
            <el-button v-if="$store.getters.webviewMode" type="text" @click="showDetailData(
                {path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder/' + item.id,
                query: {'rpt': true, 'path': 'salesdetails'}},
                {...item}
              )">
              {{ item.order_no }}
            </el-button>
            <router-link
              v-else
              :to="{path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder/' + item.id,
              query: {'rpt': true, 'path': 'salesdetails'}}">
              {{ item.order_no }}
            </router-link>
          </td>
          <td>{{ item.forder_date }}</td>
          <td>{{ item.sales_by_name }} ( {{item.order_source_name}} )</td>
          <td>{{ item.customer_name }}</td>
          <td class="text-right">{{ item.customer_id }}</td>
          <td class="text-right">{{ item.ftotal_amount }}</td>
          <td class="text-right">{{ item.fshipping_tax_amount }}</td>
          <td class="text-right">{{ item.ftotal_cost_amount }}</td>
          <td class="text-right">{{ item.fprofit_nett }}</td>
          <td class="text-right">{{ item.fservice_charge_amount }}</td>
          <td class="text-right">{{ item.fdiscount_amount }}</td>
        </tr>
      </bs-table>

      <div class="table-handler-bottom">
        <el-pagination
          :total="totalDetail"
          :page-sizes="[15, 50, 100]"
          :page-size="paramDetail.per_page"
          :current-page.sync="currentPageDetail"
          background
          layout="sizes, prev, pager, next"
          @current-change="handleChangePageDetail"
          @size-change="handleChangeSizePageDetail"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { salesdetail } from '@/api/report/salesreport'

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'TableSalesdetails',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage', 'params'],

  mixins: [basicComputedMixin],

  data () {
    return {
      isDetail: false,
      loading: false,
      dataDetail: [],
      summary: [],
      tempDetail: {},
      totalDetail: 0,
      summaryDetail: {},
      nextDetail: '',
      prevDetail: '',
      paramDetail: {
        from: this.params.from,
        to: this.params.to,
        per_page: 15
      }
    }
  },
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
      this.$emit('currentPage', this.currentPage)
    },
    handleChangeSizePage(page) {
      this.currentPage = 1
      this.$emit('changeSizePage', page)
    },

    showDetail (item) {
      this.tempDetail = item
      this.getDetail()
    },

    getDetail() {
      this.loading = true
      this.paramDetail.from = this.params.from
      this.paramDetail.to = this.params.to
      this.paramDetail.station = this.tempDetail.station
      salesdetail(this.paramDetail).then(response => {
        this.dataDetail = response.data.data
        this.summaryDetail = response.data.totaldata
        this.isDetail = true

        this.totalDetail = response.data.meta.total
        this.nextDetail = response.data.link.next
        this.prevDetail = response.data.link.prev
        this.currentPageDetail = response.data.meta.current_page
        window.scrollTo(0,0)
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // console.log('trace', error)
        this.loading = false
      })
    },

    handleBack () {
      this.tempDetail = {}
      this.paramDetail = {
        from: this.params.from,
        to: this.params.to,
        page: 1,
        per_page: 15
      }
      this.isDetail = false
    },

    handleChangePageDetail (page) {
      this.paramDetail.page = page
      // this.param.current_page = page
      this.getDetail()
    },

    handleChangeSizePageDetail (val) {
      this.paramDetail.per_page = val
      this.paramDetail.page = 1
      this.getDetail()
    }
  }
}
</script>
