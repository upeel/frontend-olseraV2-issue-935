<template>
  <div>
    <div v-for="(item,key) in data" :key="key">
      <h5>{{ item.customer_name }}</h5>
      <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        <el-table :data="item.totaldata" border>
          <el-table-column min-width="120px" :label="lang.sales_amount" prop="ftotal_amount" />
        <el-table-column min-width="120px" :label="lang.prepayment" prop="fprepayment_amount" />
        <el-table-column min-width="120px" :label="lang.balance" prop="foutstanding_amount" />
        </el-table>
      </div>
      <hr/>

      <bs-table
        :header="[
          lang.order_no,
          lang.sales_date,
          lang.due_date,
          lang.name,
          lang.sales_amount,
          lang.prepayment,
          lang.balance
        ]">
        <tr
          v-for="(i, key) in item.orders"
          :key="key">
          <td>
            <el-button
              v-if="$store.getters.webviewMode"
              type="text"
              @click="showDetailData(
                {path: '/sales/openorder/' + i.id,query: {'rpt': true, 'path': 'outstandingpayment'}},
                {...i}
              )">
              {{ i.order_no }}
            </el-button>
            <router-link
              v-else
              :to="{path: '/sales/openorder/' + i.id,query: {'rpt': true, 'path': 'outstandingpayment'}}">
              {{ i.order_no }}
            </router-link>
          </td>
          <td>{{ i.forder_date }}</td>
          <td>{{ i.fpayment_due_date }}</td>
          <td>{{ i.customer_name }}</td>
          <td>{{ i.ftotal_amount }}</td>
          <td>{{ i.fprepayment_amount }}</td>
          <td>{{ i.foutstanding_amount }}</td>
        </tr>
      </bs-table>

      <!-- <el-table :data="item.orders">
        <el-table-column min-width="150px" :label="lang.order_no" prop="order_no" >
          <template slot-scope="scope">
            <el-button
              v-if="$store.getters.webviewMode"
              type="text"
              @click="showDetailData(
                {path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'outstandingpayment'}},
                {...scope.row}
              )">
              {{ scope.row.order_no }}
            </el-button>
            <router-link
              v-else
              :to="{path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'outstandingpayment'}}">
              {{ scope.row.order_no }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" :label="lang.sales_date" prop="forder_date" />
        <el-table-column min-width="120px" :label="lang.due_date" prop="fpayment_due_date" />
        <el-table-column min-width="120px" :label="lang.name" prop="customer_name" />
        <el-table-column min-width="120px" :label="lang.sales_amount" prop="ftotal_amount" />
        <el-table-column min-width="120px" :label="lang.prepayment" prop="fprepayment_amount" />
        <el-table-column min-width="120px" :label="lang.balance" prop="foutstanding_amount" />
      </el-table> -->

      <hr/><br>
    </div>

    <!-- <el-table :data="data">
      <el-table-column :label="lang.name">
        <template slot-scope="scope">
          {{ scope.row.customer_name }}<br/>
          <span class="size-11">
            {{ scope.row.customer_email }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="lang.order_no" prop="order_no" />
      <el-table-column :label="lang.amount" prop="ftotal_amount" />
    </el-table> -->

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
export default {
  name: 'TableOutstandingpayment',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
    },
    handleChangeSizePage(page) {
      this.$emit('changeSizePage', page)
    },

    showOpenorder (data) {
      this.$router.push('/sales/openorder/' + data.id)
    },
    showDetailData(path, data) {
      console.log('aaaa')
      this.$emit('show', path, data)
    },
  }
}
</script>
