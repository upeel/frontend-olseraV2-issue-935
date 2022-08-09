<template>
  <div>
    <el-card class="card-box" style="margin-top: 20px;">
      <div class="table-responsive">
        <el-table
          :data="dataTable"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            :label="lang.name">
            <template slot-scope="scope">
              <div class="clearfix">
                <div class="pull-left" style="padding-right: 12px;">
                  <template v-if="scope.row.product_photo_md">
                    <img :src="scope.row.product_photo_md" class="table-image table-image-80" :alt="scope.row.product_photo_md">
                  </template>
                </div>
                <div class="pull-left">
                  <strong>{{ scope.row.product_name }} - {{ scope.row.product_sku }}</strong>
                  <p>{{ scope.row.product_variant_name }} - {{ scope.row.product_variant_sku }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.time"
            prop="ftime"
            width="90">
          </el-table-column>
          <el-table-column
            :label="lang.system_qty"
            prop="qty_sys"
            width="120">
          </el-table-column>
          <el-table-column
            :label="lang.actual_qty"
            prop="qty"
            width="120">
          </el-table-column>
          <el-table-column
            :label="lang.difference"
            prop="qty_diff"
            width="120">
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    dataTable: {
      default: null,
      type: Array
    }
  },
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  }
}
</script>
