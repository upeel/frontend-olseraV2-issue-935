<template>
  <div>
    <bs-table
      :header="[
        lang.product,
        lang.sku,
        lang.qty,
        lang.unit_of_measurement,
        rootLang.conversion_value + ' - ' + lang.unit_of_measurement,
        lang.buy_price
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.product_name }}</td>
        <td>{{ item.sku }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.uom }}</td>
        <td>{{ item.uom_conversion }}</td>
        <td>{{ item.fbuy_price }}</td>
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
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'TableProductMaterials',
  mixins: [MixinReportTable, basicComputedMixin]
}
</script>
