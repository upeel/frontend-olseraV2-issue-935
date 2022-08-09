<template>
  <div class="report-list-wrapper">
    <div class="mobile-report-list">
      <el-button
        @click="visibleDialogReportList = true"
        type="primary"
        icon="el-icon-menu"
        class="btn-block mobile-report-list--trigger">
        {{ $lang[langId].reports_list }}
      </el-button>

      <el-dialog
        :visible.sync="visibleDialogReportList"
        :title="$lang[langId].reports_list"
        append-to-body
        width="90%">
        <el-input
          v-model="searchKeyword"
          :placeholder="$lang[langId].type_keyword">
          <el-button slot="append"><svg-icon icon-class="search" /></el-button>
        </el-input>
        <ul class="mobile-report-list--list list-unstyled">
          <li
            v-for="(item, key) in computedPaths"
            :key="key"
            :class="[
              { active: item.active },
              methodCheckAccessModuleByPlanType(item) ? 'sidebarmenu-disabled' : ''
            ]"
            @click="showReport(item.path, key, item.premium)">
            <div class="reports-list__item flex-container">
              <div class="flex-grow-1">
                {{ item.label }}
              </div>
              <svg-icon
                v-if="methodCheckAccessModuleByPlanType(item)"
                icon-class="lock"
              />
            </div>
          </li>
        </ul>
      </el-dialog>
    </div>

    <el-card class="search-sidebar-report-desktop without-padding closeable-card">
      <div slot="header" class="mask-hover table-handler-flex pointer" @click="toggleReportList">
        <h4>{{ $lang[langId].reports_list }}</h4>
        <div class="closeable-card--text">
          {{ $lang[langId].click_hide }}
        </div>
      </div>

      <div v-show="showlist" class="card-body" style="padding: 5px;">
        <div class="search-sidebar-report" style="margin-bottom: 12px">
          <el-select
            v-model="selected"
            :placeholder="$lang[langId].type_keyword"
            :filterable="true"
            style="width: 100%;"
            class="search-sidebar-report--search"
            @change="showReportBySearch">
            <el-option
              v-for="(item) in computedPaths"
              :disabled="selectedStore.pos_freemium && item.premium ? true : false"
              :key="item.path"
              :label="item.label"
              :value="item.path"
            />
          </el-select>
        </div>

        <ul class="reports-list">
          <li
            v-for="(item, key) in computedPaths"
            :key="key"
            :class="[
              { active: item.active },
              methodCheckAccessModuleByPlanType(item) ? 'sidebarmenu-disabled' : ''
            ]">
            <div
              v-if="!item.staging"
              class="reports-list__item flex-container"
              @click="showReport(item.path, key, item.premium)">
              <div class="flex-grow-1">
                {{ item.label }}
              </div>
              <svg-icon
                v-if="methodCheckAccessModuleByPlanType(item)"
                icon-class="lock"
              />
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['selectedReportBySearch', 'paths', 'showlist', 'menu'],

  data() {
    return {
      selected: '',
      searchKeyword: '',
      visibleDialogReportList: false
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },

    computedPaths() {
      if (!this.searchKeyword) {
        return this.paths.filter(item => {
          return !item.hide
        })
      }
      return this.paths.filter(path => {
        if (!path.hide) {
          return path.label.toLowerCase().includes(this.searchKeyword.toLowerCase())
        }
      })
    },

    selectedStore () {
      if (this.$store.getters.webviewMode) {
        return this.$store.getters.webviewSelectedStore
      } else {
        return this.$store.getters.selectedStore
      }
    }
  },

  watch: {
    selectedReportBySearch(value) {
      // console.log('watch selectedReportBySearch', value)
      this.selected = value
    }
  },

  mounted() {
    console.log(this.selectedStore)
  },

  methods: {
    showReportBySearch(itemPath) {
      // console.log(itemPath)
      const index = this.paths.findIndex(item => {
        return item.path === itemPath
      })
      this.selected = itemPath
      this.showReport(itemPath, index)
    },
    showReport(path, index, isPremium = false) {
      this.visibleDialogReportList = false
      this.selected = path
      if (this.selectedStore.plan_type_id === 'L' && isPremium && this.selectedStore.is_onlineshop !== 1) {
        this.$emit('show-report', 'freemium', index)
      } else {
        this.$emit('show-report', path, index)
      }
      this.searchKeyword = ''
    },
    toggleReportList() {
      if (document.body.classList.contains('hide-report-list')) {
        document.body.classList.remove('hide-report-list')
      } else {
        document.body.classList.add('hide-report-list')
      }
    },
    methodCheckAccessModuleByPlanType(item) {
      return item.premium && this.selectedStore.plan_type_id === 'L' && this.selectedStore.is_onlineshop !== 1
    }
  }
}
</script>
