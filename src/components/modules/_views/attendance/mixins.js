const mixins = {
  computed: {
    hasAccessFaceRecog() {
      const planTypeIds = ['P']
      return planTypeIds.includes(this.$store.getters.selectedStore.plan_type_id)
    }
  }
}
export {
  mixins
}