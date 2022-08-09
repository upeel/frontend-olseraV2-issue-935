<template>
  <div class="flat-list">
    <div v-for="(i) in item" :key="i.id">
      <div class="flex-container">
          <div class="flex-container">
            <div>
              <el-button
                size="mini"
                type="danger"
                circle
                @click="remove(i.id)"
                :disabled="disabledButton"
                icon="el-icon-close" />
            </div>
            <div class="full-width ml-24">
              <img
                class="force-square-image-80 img-circle"
                :src="i.photo_md"
                :alt="i.product_name"
                style="width: 80px" />
            </div>
          </div>
        <div class="px-8">
          <div class="font-bold">{{ i.product_name }}</div>
          <div class="flex-container">
            <div v-if="i.variant.length > 0" class="mr-4">
              <small>{{ lang.variant }}</small>
              <div>
                <el-select
                  @change="dataChanges"
                  size="mini"
                  v-model="i.product_variant_id"
                  :placeholder="lang.please_select">
                  <el-option
                    :label="lang.all"
                    :value="0">
                  </el-option>
                  <el-option
                    v-for="item in i.variant"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div>
              <small>{{ lang.qty }}</small>
              <div>
                <el-input
                  @change="dataChanges"
                  type="number"
                  v-model="i.qty"
                  size="mini"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <div v-for="j in i.children.data" :key="j.id">
        <div class="flex-container">
          <div class="flex-container">
            <div>
              <el-button
                size="mini"
                type="danger"
                circle
                @click="remove(j.id)"
                :disabled="disabledButton"
                icon="el-icon-close" />
            </div>
            <div class="full-width ml-24">
              <img
                class="force-square-image-80 img-circle"
                :src="j.photo_md"
                :alt="j.product_name"
                style="width: 80px" />
            </div>
          </div>
          <div class="px-8">
            {{ j.product_name }}
            <div class="flex-container">
              <div class="full-width">
                <template v-if="j.variant.length > 0">
                  <small>{{ lang.variant }}</small>
                  <div>
                    <el-select
                      @change="dataChanges"
                      size="mini"
                      v-model="j.product_variant_id"
                      :placeholder="lang.please_select">
                      <el-option
                        :label="lang.all"
                        :value="0">
                      </el-option>
                      <el-option
                        v-for="item in j.variant"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </template>
              </div>
              <div>
                <small>{{ lang.qty }}</small>
                <div>
                  <el-input
                    @change="dataChanges"
                    type="number"
                    v-model="j.qty"
                    size="mini"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr/>
      </div>
    </div>

    <div slot="footer" class="align-right text-right">
      <el-button
        :loading="loading"
        :disabled="disabledButton"
        type="success"
        @click="saveManageItems">
        {{ lang.save }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Array,
      default: null
    },
    itemRemoved: {
      type: Boolean,
      default: false
    },
    loading: {
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
    // data() {
    //   if (this.item.variant.length > 0) {
    //     let temp = [{
    //       id: 0,
    //       product_id: this.item.product_id,
    //       name: this.lang.all
    //     }]
    //     this.item.variant.map(i => {
    //       temp.push(i)
    //     })
    //     this.item.variant = temp
    //   }
    //   return this.item
    // },
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

    clearDisableButton () {
      this.disabledButton = false
    },

    dataChanges() {
      // let data = Object.assign({}, this.data)
      // // console.log(data)
      // this.$emit('data-changes', data)
    },

    saveManageItems() {
      let data = Object.assign([], this.item)
      // this.item.map(i => {
      //   console.log(i)
      // })
      this.$emit('data-changes', data)
    }
  }
}
</script>
