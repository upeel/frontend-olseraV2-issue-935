<template>
  <div v-loading="loading">
    <template v-if="!isDetail">
      <div
        v-for="(item, key) in data"
        :key="key"
        class="report-item">
        <el-button type="text" @click="showDetail(item)">
          <h4 class="font-bold">{{ item.serve_by_name }}</h4>
        </el-button>
        <div class="summary">
          <h5>{{ $lang[langId].summary }}</h5>
          {{ lang.amount }}: {{ item.totals[0].ftotal_amount }}<br/>
          <!-- {{ lang.sales_source }}: {{ item.order_source_name }}<br/> -->
        </div>
        <bs-table
          :header="[
            lang.date,
            lang.amount
          ]">
          <tr
            v-for="(item, key) in item.detail"
            :key="key">
            <td>{{ item.forder_date }}</td>
            <td>{{ item.ftotal_amount }}</td>
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
    <template v-else>
      <div style="margin-bottom: 10px">
        <el-button class="el-icon-back" @click="handleBack" />
      </div>

      <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        <bs-table
          :header="[
            $lang[langId].currency,
            lang.qty,
            lang.sales_amount,
            lang.product_cost,
            lang.profit
          ]">
          <tr
            v-for="(item, key) in summary"
            :key="key">
            <td>{{ item.currency_id }}</td>
            <td>{{ item.ftotal_qty }}</td>
            <td>{{ item.ftotal_amount }}</td>
            <td>{{ item.ftotal_cost_amount }}</td>
            <td>{{ item.ftotal_profit }}</td>
          </tr>
        </bs-table>
      </div>

      <hr/>

      <bs-table
        :header="[
          lang.order_no,
          lang.date,
          lang.sales_by,
          lang.item,
          lang.serial_no,
          lang.customer,
          $lang[langId].customer_id,
          lang.qty,
          lang.sales_amount,
          lang.product_cost,
          lang.profit
        ]">
        <tr
          v-for="(item, key) in dataDetail"
          :key="key">
          <td>
            <!-- <el-button v-if="$store.getters.webviewMode" type="text" @click="showDetailData(
                {path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,query: {'rpt': true, 'path': 'creditsalesdetails'}},
                {...item}
              )">
              {{ item.order_no }}
            </el-button>
            <router-link v-else :to="{path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id, query: {'rpt': true, 'path': 'salesitemsbydate'}}">
              {{ item.order_no }}
            </router-link> -->
            {{ item.order_no }}
          </td>
          <td>{{ item.forder_date }}</td>
          <td>{{ item.sales_by_name }} ( {{item.order_source_name}} )</td>
          <td>{{ item.product_name }} ( {{item.product_variant_name}} )</td>
          <td>{{ item.serial_no }}</td>
          <td>{{ item.customer_name }}</td>
          <td class="text-right">{{ item.customer_id }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ item.famount }}</td>
          <td>{{ item.fcost_amount }}</td>
          <td>{{ item.fprofit }}</td>
        </tr>
      </bs-table>

      <div v-if="totalDetail > 0" class="table-handler-bottom">
        <el-pagination
          :total="totalDetail"
          :page-sizes="[50, 100]"
          :page-size="15"
          :current-page.sync="currentPageDetail"
          background
          layout="sizes, prev, pager, next"
          @current-change="handleChangePageDetail"
          @size-change="handleChangeSizePageDetail"
        />
      </div>
    </template>
    <!-- <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column :label="lang.transaction_amount" prop="ftransaction_amount" />
        <el-table-column min-width="140px" :label="lang.comission" prop="ftotal_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.date" prop="forder_date" />
      <el-table-column :label="lang.staff" prop="serve_by_name" />
      <el-table-column :label="lang.transaction_amount" prop="ftransaction_amount" />
      <el-table-column min-width="140px" :label="lang.comission" prop="ftotal_amount" />
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
    </div> -->
  </div>
</template>

<script>
import { salesbysalesmanDetail } from '@/api/report/salesreport'
export default {
  name: 'TableComissionbyserver',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage', 'params'],
  data () {
    return {
      isDetail: false,
      loading: false,
      dataDetail: [],
      summary: [],
      tempDetail: {}
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

    handleBack () {
      this.tempDetail = {}
      this.isDetail = false
    },

    getDetail() {
      this.loading = true
      this.params.sales_by_name = this.tempDetail.serve_by_name
      salesbysalesmanDetail(this.params).then(response => {
        this.dataDetail = response.data.data
        this.summary = response.data.totaldata
        this.isDetail = true

        this.totalDetail = response.data.meta.total
        this.currentPageDetail = response.data.meta.current_page
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
  }
}
</script>
