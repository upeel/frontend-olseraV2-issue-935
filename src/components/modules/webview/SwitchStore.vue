<template>
  <div>
    <el-select
      v-model="localSelectedStore"
      value-key="store_id"
      filterable
      style="width: 100%;"
      @change="handleChangeSelectStore">
      <el-option
        v-for="(item, key) in stores"
        :key="key"
        :label="item.name"
        :value="item"
        :disabled="item.disable"
        class="box-in-loop pointer flex-container m-null">
        <div style="flex-grow: 1; line-height: 1;">
          <div class="font-bold font-14">{{ item.name }}</div>
          <span class="font-13">{{ item.url_id + '.myolsera.com' }}</span>
        </div>
        <span v-if="item.disable">
          <el-button
            round
            size="small"
            class="btn-block"
            type="danger">
            {{ rootLang.expired }}
          </el-button>
        </span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localSelectedStore: ''
    }
  },

  computed: {
    stores() {
      return this.$store.state.userStores.stores
    },

    selectedStore() {
      return this.$store.getters.selectedStore
    },

    token() {
      return this.$store.state.user.token
    },

    rootLang() {
      return this.$lang[this.langId]
    },

    langId() {
      return this.$store.state.userStores.langId
    },
  },

  watch: {
    selectedStore: {
      handler(store) {
        this.localSelectedStore = {...store}
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    handleChangeSelectStore(store) {
      this.$emit('change', store.store_id)
    }
  }
}
</script>

