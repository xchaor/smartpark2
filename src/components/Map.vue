<template>
  <div id="cesiumContainer">
  </div>
</template>

<script>
// import "cesium/widgets.css";
import * as widgets from "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import { onMounted } from "vue";
export default {
    name:'Map',
    setup(){
        function initPark3dModel() {
            const tileset=viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: "  /apps/3dtitle/贝尔园区场景模型/tileset.json",
            })); 
            tileset.readyPromise
                .then(function (tileset) {
                viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.3, tileset.boundingSphere.radius * 1));
            })
                .catch(function (error) {
                console.log("出错了"+error);
            });
        };
        onMounted(() => {
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZWFkZjMzMS1kZTk1LTQyY2EtOTA0MC1kOGMxMWIyYzEwNTQiLCJpZCI6OTk0MzksImlhdCI6MTY1NjQ4Nzg2NX0.xAxSGKj9QR2uMMhkXLDqciQ_vb0CyYGJY0iLvMFOOmI";
            window.viewer = window.viewer ||new Cesium.Viewer("cesiumContainer",{
                infoBox: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                baseLayerPicker: false,
                navigationHelpButton: false,
                timeline: true,
                animation: false,
                fullscreenButton: false,
                vrButton: false,
                selectionIndicator: false,
            });
            viewer.cesiumWidget.creditContainer.style.display = "none";// 隐藏logo
            viewer.scene.skyAtmosphere.show = true; // 关闭大气层
            viewer.scene.globe.depthTestAgainstTerrain = true; // 地面以下不可见（高程遮挡）
            viewer.timeline.container.style.display = "none"; //隐藏时间线控件
            if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
                //判断是否支持图像渲染像素化处理
                viewer.resolutionScale = window.devicePixelRatio;
            }
            initPark3dModel()
        })


        return {
            initPark3dModel,
        }
    },
    
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