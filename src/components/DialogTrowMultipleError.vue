<template>
  <el-dialog
    :visible.sync="show"
    :before-close="beforeClose"
    :title="errorList.title"
    append-to-body
    custom-class="mw-980">
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="8">
        <div class="table-handler-flex border--with-shadow radius-10 p-10 font-24" style="min-width: 190px;">
          <div class="flex-grow-1">Total request</div>
          <span class="fl-right">{{ errorList.total_data }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="table-handler-flex border--with-shadow radius-10 p-10 font-24" style="min-width: 190px;">
          <div class="flex-grow-1">{{ rootLang.success }}</div>
          <span class="fl-right color-success">{{ errorList.total_succed }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="table-handler-flex border--with-shadow radius-10 p-10 font-24" style="min-width: 190px;">
          <div class="flex-grow-1">{{ rootLang.failed }}</div>
          <span class="fl-right color-danger">{{ errorList.total_failed }}</span>
        </div>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      :data="errorList.errorList"
      stripe
      highlight-current-row
      class="table-main w-fit"
    >
      <el-table-column
        label="Nama"
        prop="name"
        width="200"
      >
        <template slot-scope="scope">
          <div class="container-flex">
            <div class="font-14 color-1 font-bold">
              {{ scope.row.name }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="deskripsi"
        prop="desc"
      >
        <template slot-scope="scope">
          <div class="font-14 color-1">
            {{ scope.row.desc }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    errorList: {
      type: Object,
      default: null
    }
  },

  data() {
    return {

    }
  },
  watch: {
    // errorList: {
    //   deep: true,
    //   immediate: true,
    //   handler(errorList) {
		// 		if (this.errorList) {
    //       console.log('errorList', this.errorList)
		// 		}
    //   }
    // }
  },

  methods: {
    beforeClose() {
      this.$emit('close')
    }

  }
}
</script>
