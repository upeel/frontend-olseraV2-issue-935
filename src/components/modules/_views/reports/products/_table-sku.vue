<template>
  <div class="no-summary">
    <bs-table
      :sortable="true"
      :header="headerTable"
      @sort="handleSort">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.product_group_name }}</td>
        <td>{{ item.product_name }} <template v-if="item.product_sku">({{ item.product_sku }})</template></td>
        <td>{{ item.product_variant_name }} <template v-if="item.product_variant_sku">({{ item.product_variant_sku }})</template></td>
        <td>{{ item.total_qty }}</td>
        <td>{{ item.ftotal_amount }}</td>
        <td>{{ item.ftotal_profit }}</td>
      </tr>
    </bs-table>

    <div
      v-if="total > 0"
      class="table-handler-bottom">
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
  name: 'TableSku',
  mixins: [MixinReportTable],

  computed: {
    headerTable () {
      return [
        {
          name: this.lang.group,
          sort: true,
          sort_by: 'group',
          asc: true
        },
        {
          name: this.lang.product,
          sort: true,
          sort_by: 'name',
          asc: true
        },
        {
          name: this.lang.variant
        },
        {
          name: this.lang.sold_qty,
          sort: true,
          sort_by: 'qty',
          asc: true
        },
        {
          name: this.lang.sales_amount,
          sort: true,
          sort_by: 'sales_amount',
          asc: true
        },
        {
          name: this.lang.profit,
          sort: true,
          sort_by: 'profit',
          asc: true
        }
      ]
    }
  },

  methods: {
    handleSort(data) {
      this.headerTable.map(i => {
        if (data.sort) {
          if (data.sort_by === i.sort_by) {
            i.asc = !data.asc
          } else {
            i.asc = true
          }
        }
      })
      this.$emit('sort', data)
    }
  }
}
</script>

