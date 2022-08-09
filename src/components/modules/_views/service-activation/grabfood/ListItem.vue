<template>
  <div class="dd-handle">
    <div class="flex-container">
      <div class="hand handle container-icon">
        <svg-icon icon-class="icon-sort"></svg-icon>
      </div>
      <div>
          <div class="mr-8 ml-8" style="flex-grow: 1;">
            <div class="font-bold font-14">
              {{ item.name }}
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
    edit() {
      this.$emit('edit', this.item)
    }
  }
}
</script>