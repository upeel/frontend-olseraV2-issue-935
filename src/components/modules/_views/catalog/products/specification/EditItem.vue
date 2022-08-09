<template>
  <el-dialog
    :visible.sync="isEditing"
    :before-close="cancel"
    width="360px"
    title="Edit">
    <div
      v-loading="loading"
      class="dialog-body">
      <el-form :model="data" label-position="top">
        <el-form-item :label="lang.name">
          <el-input v-model="data.name" />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer flex-container">
      <div style="flex-grow: 1;">
        <delete-button custom-permission="catalog/specifications" @confirm="handleDelete" />
      </div>
      <el-button
        @click="cancel">
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
  props: ['isEditing', 'item', 'specifications', 'loading'],

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
    cancel() {
      this.$emit('close')
      this.data = {}
      this.showSelectCategory = false
    },

    async save() {
      await this.$emit('save', this.data)
      this.cancel()
    },

    async handleDelete() {
      await this.$emit('delete', this.item)
      this.cancel()
    }
  }
}
</script>
