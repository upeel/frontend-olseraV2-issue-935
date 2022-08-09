<template>
  <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
    <li v-for="el in tasks" :key="el.name">
      <p>{{ el.name }}</p>
      <nested-draggable :tasks="el.children" />
    </li>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  props: {
    tasks: {
      required: true,
      type: Array
    }
  },
  components: {
    draggable
  },
  name: 'nested-draggable'
}
</script>
