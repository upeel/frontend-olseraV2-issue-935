<template>
  <div class="dd-handle">
    <div class="flex-container" style="height: 40px; padding: 11px 16px;">
      <div v-if="!visibleItem" class="hand handle container-icon">
        <!-- <i class="el-icon-rank"></i> -->
        <svg-icon icon-class="icon-sort"></svg-icon>
      </div>
      <div class="ml-8 font-18 font-bold full-width">{{ item.name }}</div>
      <div v-if="item.is_must_selected === 0" class="font-12 full-width text-right">Opsional • Min {{ item.selected_item_min }} • Maks {{ item.selected_item_max }}</div>
      <div v-if="item.is_must_selected === 1" class="font-12 full-width text-right mr-16">Harus pilih • Min {{ item.selected_item_min }} • Maks. {{ item.selected_item_max }}</div>
    </div>
    <el-collapse-transition>
      <div v-show="visibleItem">
        <draggable
          v-model="item.addon_items"
          :list="item.addon_items"
          :options="{group:{ name:'brand1', pull: false}}"
          handle=".hand"
          class="dd-list dragArea"
          @change="sortsChanged">
          <div v-if="item.addon_items.length === 0" class="color-grey--bg mb-24" style="height: 72px"></div>
          <div v-else class="dd-item" v-for="(addon) in item.addon_items" :key="addon.id">
            <list-item :item="addon" />
          </div>
        </draggable>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import ListItem from './ListItem.vue'
import draggable from 'vuedraggable'
export default {
  components: { ListItem, draggable },
  props: {
    item: {
      type: Object,
      default: null
    },
    visibleItem: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  methods: {
    sortsChanged () {
      this.$emit('changeitem', this.item.addon_items)
    }
  }
}
</script>