<template>
  <div
    class="chacheli-designer"
    :class="{ dragging: dragging.active }" >
    <chacheli-designer-layout
      ref="layoutComp"
      :layout="layout"
      :chachelis="chachelis" 
      :dragging="dragging"
      @cell-clicked="cellClicked"
      @update-position="updatePosition"
      @remove="handleRemove"
    />
    <chacheli-chooser
      v-if="checkCustomPermission('settings/posrestolayout', 'edit')"
      :chachelis="chachelis"
      :dragging="dragging"
    />
  </div>
</template>

<script>
  import ChacheliDesignerLayout from './internal/ChacheliDesignerLayout.vue'
  import ChacheliChooser from './internal/ChacheliChooser.vue'
  import { checkCustomPermission } from '@/mixins/checkCustomPermission'

  export default {
    name: 'chacheli-designer',

    components: { ChacheliDesignerLayout, ChacheliChooser },

    props: [ 'layout', 'chachelis' ],

    mixins: [checkCustomPermission],

    data() {
      return {
        dragging: {
          active: false,
          cancelled: false,
          index: 0
        },
        showDialog: false
      }
    },

    methods: {
      minColumns() {
        return this.$refs.layoutComp.minColumns()
      },
      minRows() {
        return this.$refs.layoutComp.minRows()
      },
      cellClicked(data) {
        this.$emit('cell-clicked', data)
        this.showDialog = true
      },
      updatePosition(data) {
        this.$emit('update-position', data)
      },
      handleRemove (data) {
        this.$emit('remove', data)
      }
    }
  }
</script>
