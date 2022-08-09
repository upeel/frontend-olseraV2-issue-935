<template>
  <div>
    <el-table :data="data" row-key="id" border default-expand-all>
      <el-table-column :label="lang.order_no" min-width="180px" prop="order_no" />
      <el-table-column :label="lang.sales_date" prop="order_date" />
      <el-table-column :label="lang.pos_served_by" prop="serve_by_name" />
      <el-table-column :label="lang.product_combo_name" min-width="150px" prop="product_combo_name" />
      <el-table-column :label="lang.qty" prop="qty" />
      <el-table-column :label="lang.amount" min-width="150px" align="right" header-align="center" prop="famount" />
    </el-table>
    <!-- <el-table
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border>
    <el-table-column
      prop="style"
      label="date"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="date"
      label="Name"
      sortable
      width="180">
    </el-table-column>
  </el-table> -->

    <div
      v-if="total > 0"
      class="table-handler-bottom">
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
  name: 'TableComboDetails',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  data() {
    return {
      loadingForm: false,
      tableData: [{
          id: 1,
          style: 'pos',
          date: '2016-05-02',
          name: 'wangxiaohu'
        }, {
          id: 2,
          style: 'pos',
          date: '2016-05-04',
          name: 'wangxiaohu'
        }, {
          id: 3,
          style: 'pos',
          date: '2016-05-01',
          name: 'wangxiaohu',
          children: [{
              id: 31,
              date: '2016-05-01',
              name: 'wangxiaohu'
            }, {
              id: 32,
              date: '2016-05-01',
              name: 'wangxiaohu'
          }]
        }, {
          id: 4,
          style: 'pos',
          date: '2016-05-03',
          name: 'wangxiaohu'
        }]
    }
  },
  watch: {
    data: {
        handler(data) {
          if (data.length > 0) {
            var dat = []
            data.map(j => {
              if (typeof j.products !== 'undefined') {
                if (j.products.length > 0) {
                  j.children = []
                  j.products.map(i => {
                    j.children.push({
                      id: i.product_id,
                      product_combo_name: i.product_name,
                      qty: i.total_qty,
                      famount: i.ftotal_amount
                    })
                  })
                }
              }
            })
          }
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
    }
  }
}
</script>

