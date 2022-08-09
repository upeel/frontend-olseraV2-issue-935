<template>
  <el-card v-loading="loading">
    <div slot="header" class="clearfix">
      <h4 v-if="!data.id">{{ lang.add }}</h4>
      <h4 v-else>{{ lang.edit }}</h4>
      <div class="card-buttons">
        <el-button
          v-if="(data.id && checkCustomPermission('settings/courselinegroup', 'edit')) || (!data.id && checkCustomPermission('settings/courselinegroup', 'store'))"
          :disabled="disabledSave"
          size="small"
          @click="save"
          type="success"
          icon="el-icon-check">
          {{ lang.save }}
        </el-button>
        <button-action-authenticated
          :permission="['settings/courselinegroup', 'destroy']"
          v-if="data.id"
          :disabled="disabledSave"
          size="small"
          @click="remove"
          type="danger"
          icon="el-icon-delete">
        </button-action-authenticated>
      </div>
    </div>

    <div class="card-body">
      <el-form v-model="data" label-width="120px" @submit.native.prevent>
        <el-form-item :label="lang.name" :required="true">
          <el-input type="text" v-model="data.name" :placeholder="$lang[langId].please_input+lang.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
export default {
  mixins: [checkCustomPermission],

  props: ['saved', 'loading', 'formData'],

  data() {
    return {
      disabledSave: true,
      data: {},
      control: {}
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
    data: {
      handler(data) {
        if ((data.name && data.name !== '')) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    }
  }
}
</script>
