<template>
  <div>
    <bs-table
      :header="[
        lang.product,
        lang.category,
        lang.stock_qty,
        lang.buy_price,
        lang.selling_price_online,
        lang.selling_price_in_store
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.product_name }}</td>
        <td>{{ item.product_group_name }}</td>
        <td>
          <span v-if="item.stock_qty === 0 && item.track_inventory === 0">∞</span>
          <span v-else>{{ item.product_stock_qty }}</span>
        </td>
        <td>{{ item.fbuy_price }}</td>
        <td>{{ item.fsell_price }}</td>
        <td>{{ item.fsell_price_pos }}</td>
      </tr>
    </bs-table>

    <div v-if="total > 0" class="table-handler-bottom">
      <el-pagination
        :total="total"
        :page-sizes="[50, 100]"
        :page-size="15"
        :current-page.sync="localCurrentPage"
        background
        layout="sizes, prev, pager, next"
        @current-change="handleChangePage"
        @size-change="handleChangeSizePage"
      />
    </div>
  </div>
</template>

<script>
import { MixinReportTable } from '../MixinReportTable'
export default {
  name: 'TableUnsold',
  mixins: [MixinReportTable]
}
</script>

