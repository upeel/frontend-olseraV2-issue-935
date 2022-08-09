<template>
  <el-dialog
    :visible.sync="isEditing"
    :before-close="cancel"
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

        <el-form-item :label="lang.classification">
          <strong v-if="!showSelectCategory">{{ data.category_name }}</strong>

          <el-button
            v-if="!showSelectCategory"
            size="mini"
            type="text"
            @click="showSelectCategory = true">
            {{ lang.edit }}
          </el-button>

          <el-button
            v-if="showSelectCategory"
            size="mini"
            type="text"
            @click="showSelectCategory = false">
            {{ lang.cancel }}
          </el-button>

          <el-select
            v-if="showSelectCategory"
            v-model="data.category_id"
            :placeholder="lang.please_select"
            filterable>
            <el-option-group
              v-for="group in specifications"
              :key="group.id"
              :label="group.name">
              <el-option
                v-for="item in group.children"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item :label="lang.disabled">
          <el-switch
            v-model="data.disabled"
            :active-value="true"
            :inactive-value="false"
            active-text="yes"
            inactive-text="no"
          />
        </el-form-item>

        <el-form-item :label="lang.hide_in_pos">
          <el-switch
            v-model="data.pos_hidden"
            :active-value="1"
            :inactive-value="0"
            active-text="yes"
            inactive-text="no"
          />
        </el-form-item>

        <el-form-item :label="lang.hide_submenus_in_website_navigation">
          <el-switch
            v-model="data.ol_sub_hidden"
            :active-value="1"
            :inactive-value="0"
            active-text="yes"
            inactive-text="no"
          />
        </el-form-item>
      </el-form>
    </div>

    <div
      slot="footer"
      class="dialog-footer flex-container">
      <div style="flex-grow: 1;">
        <delete-button
          custom-permission="catalog/productgroups"
          @confirm="handleDelete"
        />
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

