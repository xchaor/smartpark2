<template>
    <div class="common-bgc">
        <van-nav-bar
        title="路径列表"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        />
        <van-swipe-cell v-for="(item, index) in storeState.flyLoadArr.value" :key="index">
            <van-cell :title="item.name" :label="'高度'+item.height+'米'" > <img @click="flyToModel(item.name)" :src="require('@/assets/images/icons/开始.png')" >  </van-cell>
            <template #right>
                <van-button square class="delete-button" type="danger" text="删除" @click="deleteRoute(item.name)"  />
            </template>
        </van-swipe-cell>
    </div>
</template>

<script>
import { reactive,ref,onMounted } from 'vue';
import { useStore } from "vuex";
import { useState } from '@/hooks/useState'
import * as Cesium from "cesium/Cesium";    

export default {
    name:'RouteList',
    setup(){
        //返回地图按钮
        const onClickLeft = () => history.back();
        const store=useStore()
        const storeState=useState({flyLoadArr:state=>state.flyLoadArr})
        const state = reactive({
            FlyName:null,
            FlyHeight:100,
            defaultFlyHeight : 100, //默认飞行点高度
            selectedRoadIndex : undefined, //当前选中或操作的路径索引
            selectedPointIndex : 0, //当前操作的路径上点位索引
            selectedModelType : 0, //默认选中模型类型
            flyPoints : [], //暂存点击点位群
            editNode : "", //存储编辑节点
            newRoadFlag : 0, //是否是新加路径
            isFlyFlag : 0, //是否在飞行中
            theFlyStopTime:null, //该次飞行动作结束时间
            flyExection : undefined, //飞行定时器捕捉
            /*控制线和点的显示与否*/
            showLineFlag : 1, //默认显示飞行路径
            flySpeedControl : {
                "value":200,
                "min":150,
                "max":400
            }
        })
        function flyToModel(name) {
            history.back()
            store.dispatch("flyToModel",name)
        }

        function flyToMode(name){
            history.back()
            var flyRoad=null;
            var flyEntity;  //飞行实体
            //根据Name获取route对象
            for(var i=0;i<storeState.flyLoadArr.value.length;i++){
                if(storeState.flyLoadArr.value[i].name===name){
                    flyRoad=storeState.flyLoadArr.value[i]
                    break
                }
            }
            //清除所有绘制与添加痕迹
            viewer.entities.removeAll();
            viewer.camera.setView({
                destination : Cesium.Cartesian3.fromDegrees(flyRoad.flyPoints[0].lon, flyRoad.flyPoints[0].lat, flyRoad.flyPoints[0].height+1000),
                orientation: {
                    heading : Cesium.Math.toRadians(0.0), //默认值north
                    pitch : Cesium.Math.toRadians(-90.0), // 默认值down
                    roll : 0.0 //默认值
                }
            });
            //运动暂停
            viewer.clock.shouldAnimate   = false;
            var info = flyRoad.flyPoints; //飞行点信息
            var modelUri = "./static/model/CesiumAir/Cesium_Air.glb"; //默认模型
            //设置初始位置
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(info[0].lon,info[0].lat,info[0].height), // 设置位置
                orientation:{
                    heading: Cesium.Math.toRadians(20.0), // 方向
                    pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
                    roll: 0
                },
                duration: 0, // 设置飞行持续时间，默认会根据距离来计算
                complete: function() {
                    // 到达位置后执行的回调函数
                },
                cancle: function() {
                    // 取消飞行回调函数
                },
                pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰的俯仰角度，并将地球保持在视口中
                maximumHeight: 500, // 相机最大飞行高度
                //flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
            });
            //给时间差值,并绘制原始点   /*拓展，差值应该用距离比计算*/
            var distance = 0;
            info[0].distance = 0;
            info[0].allDistance = 0;
            for (var j = 1; j < info.length; j++) {
                var point1cartographic = Cesium.Cartographic.fromDegrees(info[j-1].lon, info[j-1].lat, info[j-1].height);
                var point2cartographic = Cesium.Cartographic.fromDegrees(info[j].lon, info[j].lat, info[j].height);
                var geodesic = new Cesium.EllipsoidGeodesic();
                geodesic.setEndPoints(point1cartographic, point2cartographic);
                var s = geodesic.surfaceDistance;
                //返回两点之间的距离
                s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
                info[j].distance = s;
                info[j].allDistance = info[j-1].allDistance+s;
                distance = distance + s;
            }
            /*根据差值计算时间*/
            for (var j = 0; j < info.length; j++) {
                info[j].time = (info.length - 1) * 500 * info[j].allDistance/distance;
                viewer.entities.add({
                    id:"flyPoints"+j,
                    position: Cesium.Cartesian3.fromDegrees(info[j].lon, info[j].lat, info[j].height),
                    //clampToGround: true, //开启贴地
                    label: {
                        text: "飞行点"+(j+1),
                        font: '18px Helvetica'
                    },
                    point: {
                        pixelSize: 8,
                        color: Cesium.Color.CHARTREUSE
                    }
                });
            }
            // 飞行路径数据示例
            /*var data  = [{ longitude: 116.492339, dimension: 39.980411, height: 0, time: 0 }, { longitude: 101.909418, dimension: 39.649198, height: 0, time: 40 }, { longitude: 114.272402, dimension: 25.575537, height: 0, time: 80 }, { longitude: 85.572619, dimension: 40.046271, height: 0, time: 120 }, { longitude: 128.695882, dimension: 47.197037, height: 0, time: 160 }];*/
            // 起始时间
            var start =  Cesium.JulianDate.fromIso8601('2020-12-10T10:00:00Z')
            // 结束时间
            var stop = Cesium.JulianDate.fromIso8601('2020-12-10T12:00:00Z')
            state.theFlyStopTime = stop;
            // 设置始时钟始时间
            viewer.clock.startTime = start.clone();
            // 设置时钟当前时间
            viewer.clock.currentTime = start.clone();
            // 设置始终停止时间
            viewer.clock.stopTime = stop.clone();
            // 时间速率，数字越大时间过的越快
            viewer.clock.multiplier = state.flySpeedControl.value;   //拓展，速度控制
            //给时间线设置边界1
            //viewer.timeline.zoomTo(start, stop);
            // 循环执行 
            viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; //行为方式 CLAMPED可停止、LOOP_STOP循环、UNBOUNDED 一直沿着时间行进
            var property = computeFlight(info, start);
            // 添加模型
            flyEntity = viewer.entities.add({
                // 和时间轴关联
                availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                    start: start,
                    stop: stop
                })]),
                // 位置信息
                position: property,
                //基于位置移动自动计算方向.
                orientation: new Cesium.VelocityOrientationProperty(property),
                // 飞机模型数据
                model: {
                    uri: modelUri,
                    id: "plane",
                    minimumPixelSize: 128, //模型最小像素大小
                    //maximumScale : 1
                },
                //路径
                path: {
                    resolution: 1,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.1,
                        color: Cesium.Color.CORNFLOWERBLUE
                    }),
                    width: 15 //路径线宽
                }
            });
            flyEntity.position.setInterpolationOptions({
                interpolationDegree : 2,
                interpolationAlgorithm : Cesium.HermitePolynomialApproximation
            });

            viewer.trackedEntity = flyEntity; //跟随1
            viewer.trackedEntity.model.horizontalOrigin = undefined;
            viewer.trackedEntity.model.verticalOrigin = undefined;
            state.isFlyFlag = 1;
            //时间终止捕捉
            state.flyExection = function TimeExecution() {
                // 当前已经过去的时间，单位s
                //var delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
                if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
                    // ViewFlyModeClear();
                }
            };

            viewer.clock.onTick.addEventListener(state.flyExection);
        }
        function deleteRoute(name) {
            store.dispatch('deleteFlyRoute',name)
        }

        function computeFlight(source, start) {
            // 取样位置 相当于一个集合
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i < source.length; i++) {
                var time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
                var position = Cesium.Cartesian3.fromDegrees(source[i].lon, source[i].lat, source[i].height);
                // 添加位置，和时间对应
                property.addSample(time, position);
            }
            return property;
        }



        onMounted(() => {
        })
        return {
            storeState,onClickLeft,flyToModel,flyToMode,deleteRoute
        }
    }
}
</script>

<style lang='less' scoped>
    .common-bgc {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    overflow: scroll;
    }
    .delete-button{
        height: 100%;
    }
    img{
        height: 50%;
    }
</style>