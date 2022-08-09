<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="main-content">
        <div class="container-768">
          <div class="closable-banner newfeature-banner">
            <h1>{{ rootLang.create_your_own_design_promotions }}</h1>
            <h3>{{ rootLang.now_easier }}</h3>

            <div class="rounded-2" />
            <div class="rounded-1" />
          </div>

          <div class="flex-container">
            <h4 class="main-content__title flex-grow-1">{{ rootLang.design_promotions }}</h4>
            <el-button
              type="success"
              @click="showDialogFormDesigner">
              {{ lang.add }}
            </el-button>
          </div>

          <hr />

          <div
            v-loading="loading"
            class="like-table-wrapper">
            <div
              v-for="(item, key) in data"
              :key="key"
              class="like-table-wrapper--item pointer"
              @click="handleEdit(item)">
              <div class="mr-8">
                <image-thumb :image-id="item.configBackgroundImage.imageId" />
              </div>
              <div class="flex-grow-1">
                <div class="font-18 font-bold">{{ item.configHeaderText.text }}</div>
                <div class="font-11 color-info">{{ item.selectedPaperSize }}</div>
              </div>
              <el-button
                type="text"
                class="color-info">
                <i class="el-icon-arrow-right" />
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <dialog-form-designer
      :show="visibleFormDesigner"
      :lang="lang"
      :root-lang="rootLang"
      :form-data="formData"
      @close="handleCloseFormDesigner"
      @refresh="fetchList"
    />
  </div>
</template>

<script>
import DialogFormDesigner from './DialogFormDesigner'
import ImageThumb from './components/ImageThumb'
export default {
  components: {
    DialogFormDesigner,
    ImageThumb
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.langId]
    }
  },

  data() {
    return {
      loading: false,
      data: [],
      visibleFormDesigner: false,
      env: process.env.NODE_ENV,
      formData: {}
    }
  },

  mounted() {
    this.fetchList()
  },

  methods: {
    fetchList() {
      this.loading = true
      const data = localStorage.getItem('olsbo_marketingdesigner')
      setTimeout(() => {
        if (data) {
          const listItem = JSON.parse(localStorage.getItem('olsbo_marketingdesigner'))
          this.data = []
          this.data.push({ ...listItem })
        }
        this.loading = false
      }, 1000)
    },
    showDialogFormDesigner() {
      this.visibleFormDesigner = true
    },
    handleCloseFormDesigner() {
      this.visibleFormDesigner = false
    },
    handleEdit(item) {
      this.formData = { ...item }
      this.showDialogFormDesigner()
    }
  }
}
</script>
