<template>
  <div class="flat-list">
    <el-button
      class="btn-absolute"
      size="mini"
      type="danger"
      circle
      @click="remove(data.id)"
      :disabled="disabledButton"
      icon="el-icon-close" />
    <el-row :gutter="10">
      <el-col :span="4">
        <img
          class="force-square-image-80 img-circle"
          :src="data.photo_md"
          :alt="data.product_name" />
      </el-col>
      <el-col :span="20">
        {{ data.product_name }}
        <el-row>
          <el-col :span="18">
            <template v-if="data.product_variant_name">
              <small>{{ lang.variant }}</small>
              <div>
                <el-select
                  @change="dataChanges"
                  size="mini"
                  v-model="data.product_variant_id"
                  :placeholder="lang.please_select">
                  <el-option
                    v-for="item in data.variant"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-col>
          <el-col :span="6">
            <small>{{ lang.qty }}</small>
            <div>
              <el-input
                @change="dataChanges"
                type="number"
                v-model="data.qty"
                size="mini"/>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <hr/>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    itemRemoved: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      disabledButton: false,
      loading: false
    }
  },

  computed: {
    data() {
      return this.item
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    itemRemoved(bool) {
      if (bool === true) {
        this.disabledButton = false
      }
    }
  },

  methods: {
    remove(id) {
      this.disabledButton = true
      this.$emit('remove', id)
    },
    dataChanges() {
      let data = Object.assign({}, this.data)
      this.$emit('data-changes', data)
    }
  }
}
</script>
