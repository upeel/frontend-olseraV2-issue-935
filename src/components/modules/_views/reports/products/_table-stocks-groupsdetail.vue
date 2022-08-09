<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button class="el-icon-back" @click="getBack" />
    </div>
    <div class="summary mb-16">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="lang.sold_qty" prop="ftotal_qty" />
        <el-table-column :label="lang.sales_amount" prop="ftotal_stock_amount" />
      </el-table>
    </div>
    <bs-table
      :header="[
        lang.product,
        lang.variant,
        lang.category,
        lang.qty,
        lang.buy_price,
        lang.subtotal,
        lang.sell_price
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>
          {{ item.product_name }} <span v-if="item.product_sku">({{ item.product_sku }})</span>
        </td>
        <td>{{ item.product_variant_name }} <span v-if="item.product_variant_sku">({{ item.product_variant_sku }})</span></td>
        <td>{{ item.product_group_name }}</td>
        <td>
          <span v-if="item.stock_qty === 0 && item.track_inventory === 0">
            ∞
          </span>
          <span v-else>
            {{ item.stock_qty }}
          </span>
        </td>
        <td>{{ item.fbuy_price }}</td>
        <td>{{ item.fstock_amount }}</td>
        <td>{{ item.fsell_price }}</td>
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
  name: 'TableStocksGrupsDetail',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  methods: {
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
    },
    getBack() {
      this.$emit('back')
    }
  }
}
</script>
