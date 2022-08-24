<template>
    <van-nav-bar
    class="navBar"
    title="透视分析 "
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    />
    <div class="analysis-Control" >
        <van-button round type="primary" @click="showPopup">输入高度</van-button>
    </div>

    <van-popup  v-model:show="show" position="bottom" >
        
        <van-field v-model="state.startAlti" type="number" label="起点高度"  />
        <van-field v-model="state.targetAlti" type="number" label="终点高度"  />
        <div class="btns">
            <van-button class="lineSightAdd_btn" round type="primary" @click="lineSightAdd()">开始绘制</van-button>
        </div>
    </van-popup>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import {useStore} from 'vuex' 
import hideNavBtn from '@/hooks/hideNavBtn'
import { reactive,ref,onMounted,onBeforeUnmount} from 'vue';

export default {
    name:'VisibilityAnalysis',
    setup(){
         hideNavBtn()//隐藏主导航按钮
        const onClickLeft = () => history.back();
        const store=useStore()
        const state=reactive({
            startAlti:0,
            targetAlti:0,
            lineSightPoints : [], //鼠标拾取的数据集
            sightlonlats : [], //存储两点间插值组合完成后的结果集
            visualLine : null, //绘制可视线对象
            unvisualLine : null, //绘制不可视线对象
            sverticalLine : null, //起点竖线
            everticalLine : null, //终点竖线
        })
        const show = ref(false);
        const showPopup = () => {
        show.value = true;
        };

        function lineSightAdd() {
            show.value=false
            var pickPointsArr = []; //拾取点数组
            var assistPointArr = []; //辅助点对象
            //是否高程遮挡
            viewer.scene.globe.depthTestAgainstTerrain = true;
            handler = new Cesium.ScreenSpaceEventHandler(
                viewer.scene._imageryLayerCollection
            );
            clearAll();
            handler.setInputAction(function (movement) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                pickPointsArr.push(cartesian);
                assistPointArr.push(cartesian.clone());
                var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                    cartesian
                );
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                state.lineSightPoints.push({
                    lon: longitudeString,
                    lat: latitudeString,
                    height: cartographic.height,
                });
                if (state.lineSightPoints.length > 1) {
                    sampleHeights(
                    pickPointsArr[pickPointsArr.length - 2],
                    pickPointsArr[pickPointsArr.length - 1]
                    );

                    //getSightLerpPoint(lineSightPoints[lineSightPoints.length - 2], lineSightPoints[lineSightPoints.length - 1]);
                    state.lineSightPoints = [];
                    pickPointsArr = [];
                    clearAll();

                }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                //双击取消绘制
              handler.setInputAction(function () {
                state.lineSightPoints = [];
                clearAll();
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        }
        function clearAll() {
             //清除可视绘制线
            if (state.visualLine) {
                viewer.entities.remove(state.visualLine);
                state.visualLine = null;
            }
            //清除不可视绘制线
            if (state.unvisualLine) {
                viewer.entities.remove(state.unvisualLine);
                state.unvisualLine = null;
            }
            //清除起点竖线
            if (state.sverticalLine) {
                viewer.entities.remove(state.sverticalLine);
                state.sverticalLine = null;
            }
            //清除终点竖线
            if (state.everticalLine) {
                viewer.entities.remove(state.everticalLine);
                state.everticalLine = null;
            }
            //释放鼠标事件
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        }

        //通视分析方法
        function sampleHeights(point1, point2) {
            var sValue = state.startAlti
            var eValue = state.targetAlti
            //清除辅助线
            viewer.entities.removeById("assistLine");

            var lineSightPoints2 = [];
            var lineSightPoints3 = [];
            var index = null; //是否通视界线索引

            var cartesian1 = new Cesium.Cartesian3(point1.x, point1.y, point1.z);
            var cartesian2 = new Cesium.Cartesian3(point2.x, point2.y, point2.z);

            var point1cartographic = Cesium.Cartographic.fromCartesian(cartesian1);
            var point2cartographic = Cesium.Cartographic.fromCartesian(cartesian2);
            //根据经纬度计算出距离
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            //获取起点和终点之间的曲面距离
            var stance = geodesic.surfaceDistance.toFixed(0);

            //默认按照50米插值计算插值点
            var count = Math.round(stance / 50);
            var cartesians = new Array(count);
            for (var i = 0; i < count; ++i) {
                var offset = i / (count - 1);
                cartesians[i] = Cesium.Cartesian3.lerp(
                cartesian1,
                cartesian2,
                offset,
                new Cesium.Cartesian3()
                );
            }

            
                viewer.scene.clampToHeightMostDetailed(cartesians)
                .then(function (clampedCartesians) {


                //获取插值点对应坐标数组
                for (var j = 0; j < clampedCartesians.length; j++) {
                    var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                    clampedCartesians[j]
                    );
                    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                    lineSightPoints2.push({
                    lon: longitudeString,
                    lat: latitudeString,
                    height: cartographic.height,
                    });
                }

                for (var i = 0; i < lineSightPoints2.length; i++) {
                    //插值经纬度和高程数组
                    var lon = Cesium.Math.lerp(
                    lineSightPoints2[0].lon,
                    lineSightPoints2[lineSightPoints2.length - 1].lon,
                    i / (clampedCartesians.length - 1)
                    );
                    var lat = Cesium.Math.lerp(
                    lineSightPoints2[0].lat,
                    lineSightPoints2[lineSightPoints2.length - 1].lat,
                    i / (clampedCartesians.length - 1)
                    );
                    var heights = Cesium.Math.lerp(
                    lineSightPoints2[0].height + Number(sValue),
                    lineSightPoints2[lineSightPoints2.length - 1].height + Number(eValue),
                    i / (clampedCartesians.length - 1)
                    );
                    lineSightPoints3.push({ lon: lon, lat: lat, height: heights });
                }

                for (var i = 0; i < lineSightPoints3.length; i++) {
                    if (lineSightPoints2[i].height > lineSightPoints3[i].height) {
                    index = i;
                    break;
                    } else {
                    index = lineSightPoints3.length - 1;
                    }
                }

                //显示起点竖线
                state.sverticalLine = viewer.entities.add({
                    polyline: {
                    show: true,
                    //positions: horizonPositions,
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints2[0].lon,
                        lineSightPoints2[0].lat,
                        lineSightPoints2[0].height,
                        lineSightPoints2[0].lon,
                        lineSightPoints2[0].lat,
                        lineSightPoints2[0].height + Number(sValue),
                    ]),
                    material: Cesium.Color.GOLD, //纹理
                    width: 2,
                    clampToGround: false,
                    //指定在折线位于地形下方时用于绘制折线的材质
                    depthFailMaterial: Cesium.Color.GOLD,
                    },
                });

                //显示终点竖线
                state.everticalLine = viewer.entities.add({
                    polyline: {
                    show: true,
                    //positions: horizonPositions,
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints2[lineSightPoints2.length - 1].lon,
                        lineSightPoints2[lineSightPoints2.length - 1].lat,
                        lineSightPoints2[lineSightPoints2.length - 1].height,
                        lineSightPoints2[lineSightPoints2.length - 1].lon,
                        lineSightPoints2[lineSightPoints2.length - 1].lat,
                        lineSightPoints2[lineSightPoints2.length - 1].height +
                        Number(eValue),
                    ]),
                    material: Cesium.Color.GOLD, //纹理
                    width: 2,
                    clampToGround: false,
                    //指定在折线位于地形下方时用于绘制折线的材质
                    depthFailMaterial: Cesium.Color.GOLD,
                    },
                });

                //可视线
                state.visualLine = viewer.entities.add({
                    polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints3[0].lon,
                        lineSightPoints3[0].lat,
                        lineSightPoints3[0].height,
                        lineSightPoints3[index].lon,
                        lineSightPoints3[index].lat,
                        lineSightPoints3[index].height,
                    ]),
                    width: 2,
                    material: Cesium.Color.GREEN,
                    },
                });

                //不可视线
                state.unvisualLine = viewer.entities.add({
                    polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints3[index].lon,
                        lineSightPoints3[index].lat,
                        lineSightPoints3[index].height,
                        lineSightPoints3[lineSightPoints3.length - 1].lon,
                        lineSightPoints3[lineSightPoints3.length - 1].lat,
                        lineSightPoints3[lineSightPoints3.length - 1].height,
                    ]),
                    width: 2,
                    material: Cesium.Color.RED,
                    },
                });
                });
        }
        onBeforeUnmount(()=>{
            store.dispatch('clearArrAll')
        })
        return {
            state,onClickLeft,show,showPopup,lineSightAdd,sampleHeights
        }
    }
}
</script>

<style lang='less' scoped>
    .analysis-Control{
        position: absolute;
        display: flex;
        justify-content: center;
        bottom: 20px;
        width: 100vw;
    }
    .btns{
        padding: 20px;
        display: flex;
        justify-content: center;
    }
</style>