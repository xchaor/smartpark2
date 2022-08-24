<template>
  <div id="cesiumContainer">

  </div>
</template>

<script>
import * as widgets from "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import {useStore} from 'vuex' 
import { onMounted, ref,watch } from "vue";
export default {
    name:'Map',
    setup(){
        const store=useStore()
        function initPark3dModel() {
            const tileset=viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: " static/3dtitle/贝尔园区场景模型/tileset.json",
            })); 
            tileset.readyPromise
                .then(function (tileset) {
                viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.3, tileset.boundingSphere.radius * 1));
            })
                .catch(function (error) {
                console.log("出错了"+error);
            });
        };
        function initInternetThings() {
            const InternetThings=viewer.scene.primitives.add(new Cesium.Cesium3DTileset({ url: "static/model/物联网设备/tileset.json" }));
            viewer.scene.primitives.add(InternetThings);
        }
        function MouseMoveClearDis() {
            handler.setInputAction(function (e) {
                store.dispatch("clearDis")
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            //绑定地图移动
            handler.setInputAction(function (e) {
                store.dispatch("clearDis")
            }, Cesium.ScreenSpaceEventType.LEFT_UP);
            //绑定地图移动
            handler.setInputAction(function (e) {
                store.dispatch("clearDis")
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            //绑定地图缩放
            handler.setInputAction(function (e) {
                store.dispatch("clearDis")
            }, Cesium.ScreenSpaceEventType.WHEEL);
            //绑定滚轮点击事件
            handler.setInputAction(function (e) {
                store.dispatch("clearDis")
            }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
        }
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
            window.handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);// 事件句柄
            viewer.cesiumWidget.creditContainer.style.display = "none";// 隐藏logo
            viewer.scene.skyAtmosphere.show = true; // 关闭大气层
            viewer.scene.globe.depthTestAgainstTerrain = true; // 地面以下不可见（高程遮挡）
            viewer.timeline.container.style.display = "none"; //隐藏时间线控件
            if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
                //判断是否支持图像渲染像素化处理
                viewer.resolutionScale = window.devicePixelRatio;
            }
            window.shapeEditMenu =document.createElement('div')
            shapeEditMenu.style=`
                position:absolute;
                background:#153251;
                font-size:10px;
                padding:5px;
                border:1px solid #0976C1;
                z-index:7;
                color:#fff
                `
            shapeEditMenu.style.display="none"
            const cesiumContainer=document.querySelector("#cesiumContainer")
            cesiumContainer.appendChild(shapeEditMenu)
            //3d模型上一个颜色变量
            window.previousPickedEntity={
                feature: undefined,
                originalColor: undefined,
            }
            window.mapClick = {
                czlArr: [],
                warnArr: [],
                NumberArr: [],
                professionArr: [], //人员轨迹记录
            };
            initPark3dModel()
            initInternetThings()
            MouseMoveClearDis()
        });
        
        return {
            initPark3dModel,
            initInternetThings,
            MouseMoveClearDis
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