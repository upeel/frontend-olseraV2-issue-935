<template>
  <div
    :class="useBorder ? 'card-info__bordered' : ''"
    class="card-info">
    <slot>
      <!-- <div v-if="stageLevel !== 'dev' && stageLevel !== 'sit'" class="flex-container flex-grow-1">
        <div v-if="thumbnail" class="card-info__thumbnail">
          <el-avatar :src="thumbnail" />
        </div>
        <div>
          <div
            v-if="title"
            class="font-14 font-semi-bold color-body">
            <slot name="title">
              {{ title }}
            </slot>
          </div>
          <div
            v-if="desc"
            class="font 12 color-info">
            <slot name="desc">
              {{ desc }}
            </slot>
          </div>
        </div>
      </div> -->
      <div
        v-loading="isLoading"
        class="flex-container flex-grow-1 pointer" >
        <div @click="handleShowList" class="flex-container">
          <div v-if="thumbnail" class="card-info__thumbnail">
            <el-avatar :src="thumbnail" />
          </div>
          <div>
            <div
              v-if="title"
              class="font-14 font-semi-bold color-body">
              <slot name="title">
                {{ title }}
              </slot>
            </div>
            <div
              v-if="desc"
              class="font 12 color-info">
              <slot name="desc">
                {{ desc }}
              </slot>
            </div>
          </div>
        </div>

        <transition name="el-zoom-in-top">
          <div
            v-if="merchantStore && merchantStore.length >= 1"
            v-show="visibleStoreList"
            class="custom-dropdown-store--list box-shadow radius-16 color-white--bg" style="top: 65px !important">
            <div
              v-for="item in merchantStore"
              :key="item.id"
              class="p-8 pointer"
              @click="handleSelectStore(item)">
              <template v-if="marketplaceId === 'Tokopedia'">
                <div class="flex-container p-8 radius-5" :class="item.status !== 'A' ? 'color-info--bg' : ''">
                  <div class="mr-8">
                    <el-avatar :src="item.photo" :class="item.status === 'P' || item.status === 'X'? 'img-grey' : ''" />
                  </div>
                  <div class="mr-8 font-bold" style="flex-grow: 1;">
                    {{ item.shop_name }}
                  </div>
                  <div v-if="item.status && item.status === 'P'">
                    {{ rootLang.pending }}
                  </div>
                  <div v-else-if="item.status && item.status === 'X'">
                    {{ 'Dihapus' }}
                  </div>
                  <div v-else>
                    {{item.total_products}} {{ lang.product }}
                  </div>
                </div>
              </template>
              <template v-else-if="'Shopee'">
                <div class="flex-container p-8 radius-5" 
                  :class="item.status !== 'A' ? 'color-info--bg' : ''" 
                  style="align-items: center;"
                >
                  <el-avatar :src="item.shopee_shop_images[0]" :class="item.status === 'P' || item.status === 'X'? 'img-grey' : ''">
                    <img src="/static/img/shopee.png"/>
                  </el-avatar>
                  <div class="ml-8 font-bold" style="flex-grow: 1;">
                    {{ item.shop_name }}
                  </div>
                  <div v-if="item.status && item.status === 'P'">
                    {{ rootLang.pending }}
                  </div>
                  <div v-else-if="item.status && item.status === 'X'">
                    {{ 'Dihapus' }}
                  </div>
                  <div v-else>
                    {{item.product_count}} {{ lang.product }}
                  </div>
                </div>
              </template>
            </div>
            <div v-if="merchantStore.length < 5" class="flex-container p-8" @click="handleAddMerchant">
              <el-button class="btn-block text-left"><i class="el-icon-plus" @click="handleAddMerchant" /> Tambah akun</el-button>
            </div>
          </div>
        </transition>
      </div>
      <div v-if="useButton" class="ml-8">
        <slot name="button" />
      </div>
    </slot>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],
  data () {
    return {
      visibleStoreList: false,
    }
  },
  props: {
    useButton: {
      type: Boolean,
      default: true
    },
    thumbnail: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    desc: {
      type: String,
      default: null
    },
    useBorder: {
      type: Boolean,
      default: false
    },
    merchantStore: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    marketplaceId: {
      type: String,
      default: 'Tokopedia'
    }
  },
  methods: {
    handleShowList () {
      this.visibleStoreList = !this.visibleStoreList
    },
    handleAddMerchant () {
      this.$emit('addmerchant')
    },
    handleSelectStore (item) {
      
      if (item.status === 'P') {
        this.$message({
          type: 'error',
          message: 'Status akun ' + this.marketplaceId + ' masih pending'
        })
      } if (item.status === 'X') {
        this.$message({
          type: 'error',
          message: 'Status akun ' + this.marketplaceId + ' sudah dihapus'
        })
      } else {
        this.$emit('changemerchant', item)
      }
      this.visibleStoreList = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-info {
    border-radius: 10px;
    margin-bottom: 24px;
    box-shadow: 0px 3px 6px #0000001F;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    &__bordered {
      box-shadow: none;
      border: 1px solid #CECECE;
    }
    &__thumbnail {
      line-height: 1;
      margin-right: 8px;
    }
  }
</style>