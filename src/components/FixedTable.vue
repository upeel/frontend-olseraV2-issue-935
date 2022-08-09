<template>
  <div class="fixed-table">
    <table
      v-if="data.length && !loading"
      class="table table-striped table-bordered">
      <thead
        v-if="headers.length">
        <tr>
          <th
            v-for="(header, key) in computedHeaders"
            :key="key"
            :style="methodStyleHeader(header.label)"
            class="pointer"
            @click="setSortable(header)">
            <div class="flex-container">
              <slot :name="'header-' + key" :header="header.label">
                {{ header.label }}
              </slot>
              <div class="flex-grow-1"></div>
              <span v-if="header.sort_type">
                <i v-if="header.sort_type === 'asc'" class="el-icon-sort-up"></i>
                <i v-if="header.sort_type === 'desc'" class="el-icon-sort-down"></i>
              </span>
              <span v-if="!header.sort_type && header.sort_column">
                <i class="el-icon-sort"></i>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, key) in data"
          :key="key">
          <td
            v-for="col in cols"
            :key="col"
            :style="methodStyleColumn(col)">
            <slot :name="col" :row="row">
              {{ row[col] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="data.length && !loading"
      :style="{
        bottom: fixedBottom
      }"
      class="fixed-table__pagination">
      <el-pagination
        :total="totalData"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="perPage"
        :current-page="currentPage"
        background
        layout="sizes, prev, pager, next"
        @current-change="handleChangePage"
        @size-change="handleChangeSizePage"
      />
    </div>

    <data-empty
      v-if="!data.length && !loading"
      :desc="emptyDesc"
    />

    <div
      v-show="loading"
      class="fixed-table__loader">
      <loading-with-logo />
    </div>
  </div>
</template>

<script>
/**
 * headers structure
 * [
 *  {
 *    label: String,
 *    sort_column: String
 *  },
 *  {
 *    label: String,
 *    sort_column: String
 *  }
 *  ...,
 *  ...
 * ]
 */
import DataEmpty from '@/components/modules/DataEmpty'
import LoadingWithLogo from '@/components/LoadingWithLogo.vue'
export default {
  components: {
    DataEmpty,
    LoadingWithLogo
  },
  props: {
    fixedTop: {
      type: String,
      default: '0px'
    },
    fixedBottom: {
      type: String,
      default: '0px'
    },
    headers: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    cols: {
      type: Array,
      default: () => []
    },
    emptyDesc: {
      type: String,
      default: 'No data'
    },
    totalData: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 15
    },
    loading: {
      type: Boolean,
      default: false
    },
    styleHeaders: {
      type: Object,
      default: null
    },
    styleColumns: {
      type: Object,
      default: null
    },
    headerAsObject: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    computedHeaders() {
      if (this.headerAsObject) {
        return this.headers
      } else {
        const headers = []
        this.headers.map(header => {
          headers.push({
            'label': header
          })
        })
        return headers
      }
    }
  },

  methods: {
    handleChangePage(value) {
      this.$emit('changepage', value)
    },
    handleChangeSizePage(event) {
      //
      this.$emit('change-size', parseInt(event))
    },
    methodStyleHeader(headerKey) {
      let jsStyle = {
        top: this.fixedTop
      }
      if (this.styleHeaders && this.styleHeaders[headerKey]) {
        jsStyle = { ...jsStyle, ...this.styleHeaders[headerKey] }
      }
      return jsStyle
    },
    methodStyleColumn(col) {
      if (this.styleColumns && this.styleColumns[col]) {
        return this.styleColumns[col]
      } else {
        return {}
      }
    },
    setSortable(header) {
      if (header.sort_column) {
        if (header.sort_type) {
          if (header.sort_type === 'desc') {
            this.$set(header, 'sort_type', 'asc')
          } else if (header.sort_type === 'asc') {
            this.$set(header, 'sort_type', null)
          }
        } else {
          this.$set(header, 'sort_type', 'desc')
        }
        this.$emit('toggle-sort', header)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .fixed-table {
    thead > tr > th {
      background-color: #FFFFFF;
      position: sticky;
      top: 0;
      z-index: 4;
    }
    &__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px -2px 2px #0000001F;
      border-radius: 0px 0px 2px 2px;
      background-color: #fff;
      position: sticky;
      bottom: 0;
      z-index: 10;
      padding: 16px 8px;
      .el-pagination {
        margin-top: 0 !important;
      }
    }
  }
</style>
