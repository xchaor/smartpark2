<template>
  首页平台
</template>

<script>
import { onMounted, } from 'vue'
import { useStore } from "vuex";

export default {
  name:'Home',
  setup(){
    const store=useStore()

    function flyTo() {
      const viewPoints=require('@/jsons/cream.json')
      store.commit('FLYTOPOINT',viewPoints[0])
    }
    onMounted(() => {
      flyTo()
    });
    return{
        flyTo
    }
  },
}
</script>

<style>

</style>