<template>
  <div>
    <div class="flex-container mb-8 p-8">
      <div class="font-bold font-24 flex-container" style="width: 95%">
        <div v-if="!visibleItem" class="hand handle container-icon">
          <svg-icon icon-class="icon-sort"></svg-icon>
        </div>
        <div v-else class="container-icon">
        </div>
        <div class="wrap-text wrap-text--width80">{{ item.name }}</div>
        <div>( {{ item.menus.length }} )</div>
      </div>
    </div>
    <!-- <el-collapse-transition> -->
      <div v-show="visibleItem">
        <draggable
          v-model="item.menus"
          :list="item.menus"
          :options="{group:{ name:'brand1', pull: false}}"
          handle=".hand"
          class="dd-list dragArea"
          @change="sortsChanged">
          <div v-if="item.menus.length === 0" class="color-grey--bg mb-24" style="height: 72px"></div>
          <div v-else class="dd-item like-table-wrapper" v-for="(menu) in item.menus" :key="menu.id">
            <list-menu :item="menu" />
          </div>
        </draggable>
      </div>
    <!-- </el-collapse-transition> -->
  </div>
</template>
<script>
import ListMenu from './ListMenu.vue'
import draggable from 'vuedraggable'
export default {
  components: { 
    ListMenu,
    draggable
  },
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
      this.$emit('changeitem', this.item.menus)
    }
  }
}
</script>
