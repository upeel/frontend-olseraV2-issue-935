<template>
  <div class="dd-handle" style="width: 200px">
    <span class="hand handle">
      <i class="el-icon-rank"></i>
    </span>
    <el-card :body-style="{ padding: '0px' }" >
      <img :src="item.photo_md" style="width: 146px; height: 146px" @mouseover="deleteIcon = !deleteIcon">
      <div v-if="deleteIcon" class="flex-container justify-center" style="width: 146px; height: 146px;position: absolute; bottom: 15px;color: #FFFFFF; background: rgba(0, 0, 0, 0.5);" @click="handleRemove">
        <i class="el-icon-delete font-24"></i>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  data () {
    return {
      deleteIcon: false
    }
  },

  methods: {
    edit() {
      this.$emit('edit', this.item)
    },
    handleRemove () {
      this.$emit('remove', this.item)
    },
    showDelete () {
      console.log('hover')
    }
  }
}
</script>
