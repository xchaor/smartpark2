<template>
  <div id="app">
    <Map></Map>
    <Interface></Interface>
  </div>
</template>

<script>
import Map from './components/Map.vue';
import Interface from '@/components/Interface.vue'
export default {
    name:'App',
    components: { Map,Interface }
}
</script>

<style lang='less'>
.app{
  position: relative;
}
</style>