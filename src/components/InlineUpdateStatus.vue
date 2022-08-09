<template>
  <div class="form-in-cell-wrapper">
    <div v-if="!isEditing"
      class="pointer"
      @click="beginEditing">
      <div v-if="status === 'A'">
        <el-tag size="mini" type="primary">{{ rootLang.has_confirm }}</el-tag>
      </div>
      <div v-if="status === 'T'">
        <el-tag size="mini" type="success">{{ lang.delivered }}</el-tag>
      </div>
      <div v-if="status === 'S'">
        <el-tag size="mini" type="info">{{ rootLang.being_sent }}</el-tag>
      </div>
      <div v-if="status === 'P'">
        <el-tag size="mini" type="warning">{{ rootLang.pending }}</el-tag>
      </div>
      <div v-if="status === 'X'">
        <el-tag size="mini" type="warning">{{ rootLang.cancel }}</el-tag>
      </div>
      <div v-if="status === 'Z'">
        <el-tag size="mini" type="success">{{ rootLang.complete }}</el-tag>
      </div>
    </div>
    <div
      v-if="isEditing"
      v-loading="loading"
      class="form-in-cell"
      style="width: 180px">
      <el-select
        v-model="statusOrder"
        :placeholder="lang.status"
        style="max-width: 120px;"
        @change="update(statusOrder)">
        <el-option
          v-for="item in statusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
      <el-button
        :loading="loadingUpdatePrice"
        size="mini"
        icon="el-icon-close"
        @click="cancel"
        type="info">
      </el-button>
    </div>
  </div>
</template>

<script>
import InputMoney from '@/components/InputMoneyV2'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  props: {
    status: {
      type: String,
      default: null
    },
    itemId: {
      type: [String, Number],
      default: ''
    },
    additionalData: {
      type: [Object, Array],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  components: {
    InputMoney
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      isEditing: false,
      statusOrder: this.status
    }
  },

  computed: {
    statusSelect () {
      return [
        {
          value: 'P',
          label: this.$lang[this.$store.getters.langId].pending,
          disabled: false
        },
        {
          value: 'A',
          label: this.$lang[this.$store.getters.langId].has_confirm,
          disabled: false
        },
        {
          value: 'S',
          label: this.$lang[this.$store.getters.langId].being_sent,
          disabled: false
        },
        {
          value: 'T',
          label: this.$lang[this.$store.getters.langId].delivered,
          disabled: false
        },
        {
          value: 'Z',
          label: this.$lang[this.$store.getters.langId].complete,
          disabled: false
        },
        {
          value: 'X',
          label: this.$lang[this.$store.getters.langId].cancel,
          disabled: false
        }
      ]
    }
  },

  methods: {
    beginEditing() {
      this.isEditing = true
    },
    update(val) {
      this.$emit('update', {
        status: val,
        order_id: this.itemId})
      this.reset()
    },
    reset() {
      this.isEditing = false
    },
    cancel() {
      this.$emit('cancel')
      this.reset()
    }
  }
}
</script>
