<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="[summary]" border>
        <el-table-column :label="lang.stock_qty" prop="ftotal_stock_qty" />
        <el-table-column :label="lang.total_sales_qty" prop="ftotal_sales_qty" />
      </el-table>
    </div>

    <bs-table
      :header="[
        lang.product,
        lang.variant,
        lang.category,
        lang.total_sales_qty,
        lang.avg_sales_qty,
        lang.stock_qty,
        lang.stock_age
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>
          <strong>{{ item.product_name }} <span v-if="!item.product_variant_id && item.product_sku">({{ item.product_sku }})</span></strong><br/>
          <span v-if="item.product_variant_id" class="size-11">
            {{ item.product_variant_name }} <span v-if="item.product_variant_sku">({{ item.product_variant_sku }})</span>
          </span>
        </td>
        <td>{{ item.product_variant_name }}</td>
        <td>{{ item.product_group_name }}</td>
        <td>{{ item.sales_qty }}</td>
        <td>{{ item.avg_sales_qty }}</td>
        <td>{{ item.stock_qty }}</td>
        <td>{{ item.stock_age }}</td>
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
export default {
  name: 'TableQtysold',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
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

