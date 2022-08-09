<template>
  <div class="breadcrumb-wrapper">
    <div class="breadcrumb">
      <template
        v-for="(item, index) in computedList">
        <div
          :key="index"
          class="breadcrumb-item">
          <router-link v-if="!isLast(index)" :to="item">{{ showName(item) }}</router-link><span v-if="!isLast(index)" class="mr-4 ml-4 color-white">/</span>
          <span v-if="isLast(index)" class="active">{{ showName(item) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    computedList() {
      // console.log(this.list)
      return this.list.filter(list => {
        return list.path !== ''
      })
    }
  },
  methods: {
    isLast(index) {
      return index === this.computedList.length - 1
    },
    showName(item) {
      let itemName = ''
      if (item.name && !item.meta.label) {
        itemName = item.name
      } else if (item.meta && item.meta.label) {
        itemName = item.meta.label
      }
      return itemName
    }
  }
}
</script>
