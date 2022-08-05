<template>
    <van-nav-bar
    title="属性查询"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    />
</template>

<script>
import * as Cesium from "cesium/Cesium";
import {useStore} from 'vuex' 
import { onMounted,onBeforeUnmount } from 'vue'
import hideNavBtn from '@/hooks/hideNavBtn'
export default {
    name:'AttributeQuery',
    setup(){
        hideNavBtn()//隐藏主导航按钮
        const onClickLeft = () => history.back();
        const store=useStore()

        function shapeEditMenuInit() {
            shapeEditMenu.style = `
                position:absolute;
                left:-24px;
                top:38px;
                width:170px;
                height:90px;
                background:#153251;
                font-size:10px;
                padding:5px;
                color:#fff;
                border:1px solid #0976C1`
                ;
            shapeEditMenu.style.display = "none";
        }
        function clickHandler() {
            handler.setInputAction(function (click){
            const pickingEntity=viewer.scene.pick(click.position);
            if (pickingEntity !== undefined){
                if(pickingEntity.tileset!==undefined){
                //点击智能运维3dtile模型时调用editHandlerSmart()
                if(pickingEntity.tileset._basePath === "static/3dtitle/贝尔园区场景模型/"){
                    //  第一种方式
                    var pick1 = new Cesium.Cartesian2(
                    click.position.x,
                    click.position.y
                    );
                    var cartesian3 = viewer.scene.globe.pick(
                    viewer.camera.getPickRay(pick1),
                    viewer.scene
                    );
                    var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                    cartesian3
                    );
                    var lon = (curPosition.longitude * 180) / Math.PI;
                    var lat = (curPosition.latitude * 180) / Math.PI;
                    var ellipsoid = viewer.scene.globe.ellipsoid;
                    var height = ellipsoid.cartesianToCartographic(viewer.camera.position)
                    .height;
                    editHandler3dtitle(
                    click.position.x - 318,
                    click.position.y - 242,
                    lon,
                    lat,
                    height,
                    click.position.x,
                    click.position.y
                    );
                    if (pickingEntity != previousPickedEntity.feature) {
                    if (previousPickedEntity.feature != undefined) {
                        //还原前选择要素的本颜色
                        previousPickedEntity.feature.color =
                        previousPickedEntity.originalColor;
                        //将当前选择要素及其颜色添加到previousPickedEntity1
                        previousPickedEntity.feature = pickingEntity;
                        previousPickedEntity.originalColor = pickingEntity.color;
                    }
                    //将当前选择要素及其颜色添加到previousPickedEntity
                    previousPickedEntity.feature = pickingEntity;
                    previousPickedEntity.originalColor = pickingEntity.color;
                    }
                    //将模型变为黄色高亮
                    
                    pickingEntity.color = Cesium.Color.fromBytes(255, 135, 0, 255);
                    //蓝色
                    // pickingEntity.color = Cesium.Color.fromBytes(124,167,233, 255);
                }
                }
            }
            },Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }
        function editHandler3dtitle(x, y, lon, lat, height,mx,my) {
            const cesiumContainer=document.querySelector("#cesiumContainer")
            cesiumContainer.appendChild(shapeEditMenu)
            console.log();
            shapeEditMenu.style.display = "block";
            shapeEditMenu.style.left = x + "px";
            shapeEditMenu.style.top = y + "px";
            editHandler3dtitleHtml(shapeEditMenu, lon, lat, height);
            /* 监听试试鼠标拖动*/
            var pick= new Cesium.Cartesian2(mx,my);
            var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
            var setPosition = function (cartesian) {
            var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,cartesian)
            var left =position.x- shapeEditMenu.offsetWidth;
            var top =position.y- shapeEditMenu.offsetHeight;
            shapeEditMenu.style.left=   left + "px";
            shapeEditMenu.style.top=   top + "px";
            };
            viewer.scene.postRender.addEventListener(function () {
            setPosition(cartesian)
            });
        }
        function editHandler3dtitleHtml(shapeEditMenu, lon, lat, height) {
            var strNum2 =
            '<div class="SxcxBg">\n' +
            '\t<div class="redBg_title">\n' +
            "\t\t属性信息\n" +
            "\t</div>\n" +
            "\t\t<p>经度：" +
            lon +
            "</p>\n" +
            "\t\t<p>纬度：" +
            lat +
            "</p>\n" +
            "\t\t<p>高度：" +
            height.toFixed(2) +
            "米</p>\n" +
            "\t\t<p>ID：" +
            viewer.selectedEntity.name +
            "</p>\n" +
            "\t</div>\n" +
            "</div>";
            shapeEditMenu.innerHTML = strNum2;
        }
        onMounted(() => {
            shapeEditMenuInit()
            clickHandler()
        })
        onBeforeUnmount(()=>{
            store.dispatch('clearArrAll')
        })
        return {
            onClickLeft,store,shapeEditMenuInit,clickHandler
        }
    }
}
</script>

<style lang='less' scoped>

</style>