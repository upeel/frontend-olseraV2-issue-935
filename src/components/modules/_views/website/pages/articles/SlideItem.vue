<template>
  <div class="dd-handle" v-if="isEdit">
    <span class="hand" v-if="item.id">
      <i class="el-icon-rank"></i>
    </span>
    <el-row>
      <el-col :span="5">
        <el-avatar :src="item.photo_md" class="img-50 img-circle"/>
      </el-col>
      <el-col :span="19">
        <span>{{ item.title }}</span>
        <el-button size="mini" type="primary"
          @click="edit(item)" class="btn-plain pull-right" icon="el-icon-edit">
        </el-button>
      </el-col>
    </el-row>
  </div>
  <div class="dd-handle" v-else style="padding: 5px 10px 5px 15px;">
    <el-row>
      <el-col :span="6">
        <el-avatar :src="item.photo_md" class="img-50 img-circle"/>
      </el-col>
      <el-col :span="18" style="margin-top: 10px;">
        {{ item.title }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEdit: this.showEdit
    }
  },
  methods: {
    edit(item) {
      let data = Object.assign(item)
      this.$emit('edit', data)
    }
  }
}
</script>
