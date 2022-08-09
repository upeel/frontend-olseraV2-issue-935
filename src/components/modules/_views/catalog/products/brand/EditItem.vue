<template>
  <el-dialog
    :visible.sync="isEditing"
    :before-close="close"
    width="360px"
    title="Edit">
    <div
      v-loading="loading"
      class="dialog-body">
      <el-form
        :model="data"
        label-position="top"
        @submit.native.prevent
        @keyup.native.enter="save">

        <el-form-item :label="lang.name">
          <el-input v-model="data.name" />
        </el-form-item>

        <el-form-item :label="lang.comission">
          <el-input v-model="data.comission_pct" />
        </el-form-item>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer flex-container">
      <div style="flex-grow: 1;">
        <delete-button custom-permission="catalog/brands" @confirm="handleDelete" />
      </div>
      <el-button
        @click="close">
        {{ lang.cancel }}
      </el-button>

      <el-button
        type="primary"
        @click="save">
        {{ lang.save }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import DeleteButton from '@/components/modules/DeleteButton'
export default {
  props: ['isEditing', 'item', 'loading'],

  components: {
    DeleteButton
  },

  data() {
    return {
      data: {},
      showSelectCategory: false
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    item: {
      handler(item) {
        this.data = { ...item }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    close() {
      this.$emit('close')
      this.data = {}
      this.showSelectCategory = false
    },

    async save() {
      await this.$emit('save', this.data)
      this.close()
    },

    async handleDelete() {
      await this.$emit('delete', this.item)
      this.close()
    }
  }
}
</script>

