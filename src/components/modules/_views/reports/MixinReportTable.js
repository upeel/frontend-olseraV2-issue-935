const MixinReportTable = {
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  data() {
    return {
      localCurrentPage: this.currentPage ? this.currentPage : 1
    }
  },
  methods: {
    showDetailData(path, data) {
      this.$emit('showdetaildata', path, data)
    },
    handleChangePage(page) {
      this.$emit('changePage', page)
      this.$emit('currentPage', this.localCurrentPage)
    },
    handleChangeSizePage(page) {
      this.localCurrentPage = 1
      this.$emit('changeSizePage', page)
    }
  }
}

export { MixinReportTable }
