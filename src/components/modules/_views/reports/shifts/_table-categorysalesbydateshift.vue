<template>
  <div>
    <!-- <el-table :data="data" border>
      <el-table-column :label="lang.group" prop="product_group_name" min-width="100px" />
      <el-table-column :label="lang.variant" prop="product_variant_name" min-width="180px" />
      <el-table-column :label="lang.sold_qty" prop="total_qty"/>
      <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
      <el-table-column min-width="140px" :label="lang.profit" prop="ftotal_profit" />
    </el-table> -->

    <bs-table
        :sortable="true"
        :header="headerTable"
        @sort="handleSort">
        <template
          v-for="(item, key) in data">
          <tr :key="key" class="active">
            <td>{{ item.product_group_name }}</td>
            <td>{{ item.product_variant_name }}</td>
            <td>{{ item.total_qty }}</td>
            <td>{{ item.ftotal_amount }}</td>
          </tr>
          <template v-if="item.product && item.product.length">
            <tr
              v-for="(subgroup, subgroupKey) in item.product"
              :key="subgroupKey"
              class="pointer"
              @click="getData(subgroup)">
              <td>
                <div class="ml-24">{{ subgroup.product_name }}</div>
              </td>
              <td>{{ subgroup.product_variant_name }}</td>
              <td>{{ subgroup.total_qty }}</td>
              <td>{{ subgroup.ftotal_amount }}</td>
            </tr>
          </template>
        </template>
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
  name: 'TableCategorysalesbydateshift',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
    },
    handleChangeSizePage(page) {
      this.$emit('changeSizePage', page)
    }
  },

  computed: {
    headerTable () {
      return [
        {
          name: this.lang.group
        },
        {
          name: this.lang.variant,
          // sort: true,
          // sort_by: 'qty',
          // asc: true
        },
        {
          name: 'Qty',
          // sort: true,
          // sort_by: 'sales_amount',
          // asc: true
        },
        {
          name: this.lang.sales_amount,
          // sort: true,
          // sort_by: 'sales_amount',
          // asc: true
        }
      ]
    }
  }
}
</script>
