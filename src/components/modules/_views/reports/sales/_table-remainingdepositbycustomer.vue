<template>
  <div v-loading="loading">
    <template v-if="!isDetail">
      <!-- <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        <el-table :data="summary" border>
          <el-table-column :label="$lang[langId].currency" prop="currency_id" />
          <el-table-column min-width="140px" :label="lang.return_totals" prop="ftotal_amount" />
        </el-table>
      </div> -->

      <hr/>

      <el-table :data="data" border @row-click="showDetail">
        <el-table-column :label="'Id ' + lang.customer" prop="id" />
        <el-table-column :label="lang.customer" prop="name" />
        <el-table-column min-width="140px" :label="lang.email" prop="email" />
        <el-table-column min-width="140px" :label="lang.remaining_deposit" prop="fbalance_amount" />
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

      <!-- <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        <el-table :data="summary" border>
          <el-table-column :label="$lang[langId].currency" prop="currency_id" />
          <el-table-column min-width="140px" :label="lang.return_totals" prop="ftotal_amount" />
        </el-table>
      </div> -->

      <hr/>

      <!-- <el-table :data="dataDetail" border>
        <el-table-column :label="'Id ' + lang.customer" prop="id" />
        <el-table-column :label="lang.customer" prop="name" />
        <el-table-column min-width="140px" :label="lang.email" prop="email" />
        <el-table-column min-width="140px" :label="lang.transaction_no" prop="transaction_no" />
        <el-table-column min-width="140px" :label="lang.transaction_type" prop="transaction_type_desc" />
        <el-table-column min-width="140px" :label="lang.begining_balance" prop="fbegining_balance" />
        <el-table-column min-width="140px" :label="lang.earned_amount" prop="fearned_amount" />
        <el-table-column min-width="140px" :label="lang.remaining_deposit" prop="fbalance_amount" />
      </el-table> -->

      <bs-table
        :header="[
          'Id ' + lang.customer,
          lang.customer,
          lang.email,
          lang.transaction_no,
          lang.transaction_type,
          lang.begining_balance,
          lang.earned_amount,
          lang.remaining_deposit
        ]">
        <tr
          v-for="(item, key) in dataDetail"
          :key="key">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.transaction_no }}</td>
          <td>{{ item.transaction_type_desc }}</td>
          <td>{{ item.begining_balance }}</td>
          <td>{{ item.earned_amount }}</td>
          <td>{{ item.fbalance_amount }}</td>
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
    </template>
  </div>
</template>

<script>
import { remainingDepositDetail, downloadDetailDepositCustomer } from '@/api/report/salesreport'
export default {
  name: 'TableRemainingDeposit',
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
      this.$emit('showdetail', false)
    },

    getDetail() {
      this.loading = true
      this.params.store_customer_deposit_id = this.tempDetail.id
      remainingDepositDetail(this.params).then(response => {
        this.dataDetail = response.data.data
        this.summary = response.data.totaldata
        this.isDetail = true

        this.totalDetail = response.data.meta.total
        this.currentPageDetail = response.data.meta.current_page
        this.loading = false
        this.$emit('showdetail', true)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // console.log('trace', error)
        this.loading = false
      })
    },

    getPDF(type) {
      this.loading = true
      let param = this.params
      // param.store_customer_deposit_id = this.tempDetail.id
      param.type = type
      downloadDetailDepositCustomer(param).then(response => {
        const fileName = 'Remaining_deposit-' + this.params.from + '__' + this.params.to + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
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
