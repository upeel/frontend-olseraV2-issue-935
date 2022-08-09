<template>
  <div class="form-in-cell-wrapper">
    <span
      v-if="!isEditing"
      v-mask-money="amount"
      class="editable"
      @click="beginEditing"
    />
    <div
      v-if="isEditing"
      class="form-in-cell">
      <input-money
        v-model="editPrice"
        ref="inputMoney"
        @keyup.native.enter="update"
        @keyup.native.esc="cancel"
      />
      <el-button
        :loading="loading"
        size="mini"
        icon="el-icon-close"
        @click="cancel"
        type="info">
      </el-button>
      <el-button
        :loading="loading"
        size="mini"
        icon="el-icon-check"
        @click="update"
        type="success">
      </el-button>
    </div>
  </div>
</template>

<script>
import InputMoney from '@/components/InputMoneyV2'
export default {
  props: {
    amount: {
      type: [String, Number],
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    itemId: {
      type: [String, Number],
      default: ''
    },
    parentId: {
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

  data() {
    return {
      isEditing: false,
      editPrice: 0
    }
  },

  methods: {
    beginEditing() {
      const price = this.amount
      this.editPrice = price
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.inputMoney.setFocus()
      })
    },
    update() {
      // console.log(this.editPrice)
      this.$emit('update', {
        amount: this.editPrice,
        type: this.type,
        itemId: this.itemId,
        parentId: this.parentId,
        additionalData: this.additionalData
      })
      this.reset()
    },
    reset() {
      this.isEditing = false
      this.editPrice = 0
    },
    cancel() {
      this.$emit('cancel')
      this.reset()
    }
  }
}
</script>
