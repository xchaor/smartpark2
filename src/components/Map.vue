<template>
  <div id="cesiumContainer">
  </div>
</template>

<script>
import "cesium/widgets.css";
import * as Cesium from 'cesium';
import { onMounted } from "vue";
export default {
    name:'Map',
    setup(){
        onMounted(() => {
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZWFkZjMzMS1kZTk1LTQyY2EtOTA0MC1kOGMxMWIyYzEwNTQiLCJpZCI6OTk0MzksImlhdCI6MTY1NjQ4Nzg2NX0.xAxSGKj9QR2uMMhkXLDqciQ_vb0CyYGJY0iLvMFOOmI";
            new Cesium.Viewer("cesiumContainer");
        }),
        
        function init() {
            
        }
        return {}
    }
}
</script>

<style>
    #cesiumContainer{
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: gray;
    }
</style>