<template>
    <van-nav-bar
    class="navBar"
    title="地图量算 "
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    />
    <div class="buttonsForDrawing">
        <van-button class="btnStart" type="primary" size="normal" @click='measureAreaSpace'>绘制图形</van-button>
        <van-button :disabled="state.clearBtnDisable" class="btnClear" type="danger" size="normal" @click="removeMeasure">清除图形</van-button>
    </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import {useStore} from 'vuex' 
import { onMounted,onBeforeUnmount,reactive, watch } from 'vue'
import hideNavBtn from '@/hooks/hideNavBtn'
// Toast
import { Toast } from 'vant';
import 'vant/es/toast/style';
export default {
    name:'MapMeasure',
    setup(){
        hideNavBtn()//隐藏主导航按钮
        const onClickLeft = () => history.back();
        const state = reactive({
            areapointArray:[],
            clearBtnDisable:true
        })
        const store=useStore()
        function measureAreaSpace () {
            removeMeasure()
            removeTip()
            viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            //鼠标事件
            handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
            var positions = [];
            var tempPoints = [];
            var polygon = null, areaText = null;
            var cartesian = null, areaArray = [];
            var floatingPoint;//浮动点
            handler.setInputAction(function (movement) {
                let ray = viewer.camera.getPickRay(movement.endPosition);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if (positions.length >= 2) {
                    if (!Cesium.defined(polygon)) {
                        polygon = new PolygonPrimitive(positions);
                    } else {
                        positions.pop();
                        positions.push(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.setInputAction(function (movement) {
                let ray = viewer.camera.getPickRay(movement.position);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
                //在三维场景中添加点
                var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                var heightString = cartographic.height;
                tempPoints.push({lon: longitudeString, lat: latitudeString, hei: heightString});
                floatingPoint = viewer.entities.add({
                    name: '多边形面积',
                    position: positions[positions.length - 1],
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.RED,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
                areaArray.push(floatingPoint);
                state.areapointArray = areaArray;
                //清除按钮禁用状态激活
                if (areaArray.length>0) {
                    if(state.clearBtnDisable){
                        state.clearBtnDisable=false
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            handler.setInputAction(function (movement) {
                handler.destroy();
                positions.pop();
                var textArea = getArea(tempPoints) + "平方米";
                areaText = viewer.entities.add({
                    name: '多边形面积',
                    position: positions[positions.length - 1],
                    point : {
                    pixelSize : 10,
                    color : Cesium.Color.RED,
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                    },
                    label: {
                        text: textArea,
                        font: '.5rem sans-serif',
                        fillColor: Cesium.Color.BLUE,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(20, -40),
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                
                });
                areaArray.push(areaText);
                state.areapointArray = areaArray;
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);



            var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
            var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

            //计算多边形面积
            function getArea(points) {
                var res = 0;
                //拆分三角曲面
                for (var i = 0; i < points.length - 2; i++) {
                    var j = (i + 1) % points.length;
                    var k = (i + 2) % points.length;
                    var totalAngle = Angle(points[i], points[j], points[k]);

                    var dis_temp1 = distance(positions[i], positions[j]);
                    var dis_temp2 = distance(positions[j], positions[k]);
                    res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
                }
                return (res ).toFixed(2);
            }
            //角度
            function Angle(p1, p2, p3) {
                var bearing21 = Bearing(p2, p1);
                var bearing23 = Bearing(p2, p3);
                var angle = bearing21 - bearing23;
                if (angle < 0) {
                    angle += 360;
                }
                return angle;
            }
            //方向
            function Bearing(from, to) {
                var lat1 = from.lat * radiansPerDegree;
                var lon1 = from.lon * radiansPerDegree;
                var lat2 = to.lat * radiansPerDegree;
                var lon2 = to.lon * radiansPerDegree;
                var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
                if (angle < 0) {
                    angle += Math.PI * 2.0;
                }
                angle = angle * degreesPerRadian;//角度
                return angle;
            }

            var PolygonPrimitive = (function () {
                function _(positions) {
                    this.options = {
                        id: 'areaPolygon',
                        name: '多边形',
                        polygon: {
                            hierarchy: [],
                            material: Cesium.Color.GREEN.withAlpha(0.5),
                            heightReference:20000
                        }
                    };
                    this.hierarchy = {positions};
                    this._init();
                }
                _.prototype._init = function () {
                    var _self = this;
                    var _update = function () {
                        return _self.hierarchy;
                    };
                    //实时更新polygon.hierarchy
                    this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                    viewer.entities.add(this.options);
                };
                return _;
            })();
            function distance(point1, point2) {
                var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
                var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
                //根据经纬度计算出距离
                var geodesic = new Cesium.EllipsoidGeodesic();
                geodesic.setEndPoints(point1cartographic, point2cartographic);
                var s = geodesic.surfaceDistance;
                //返回两点之间的距离
                s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
                return s;
            }
        }
        //清除按钮
        function removeMeasure () {
        if (viewer.entities.getById("distancePolyline"))
            viewer.entities.removeById("distancePolyline");

        let areaentitys = state.areapointArray;
        if (state.areapointArray) {
            if (areaentitys.length > 0) {
                for (var i = 0; i < areaentitys.length; i++) {
                    viewer.entities.remove(areaentitys[i]);
                }
            }
        }
        if (viewer.entities.getById("areaPolygon"))
            viewer.entities.removeById("areaPolygon");

        if (viewer.entities.getById("measurePoint"))
            viewer.entities.removeById("measurePoint");

        //清除按钮禁用状态激活
        state.clearBtnDisable=true
        }
        function addTip() {
            Toast({
                message: '点击绘制图形，在地图上点击选择至少3个点，在选择最后一个点时双击完成图形绘制。',
                position: 'top',
                duration:0,
            });
        }
        function removeTip() {
            Toast.clear()
        }

        onMounted(()=>{
            addTip()
        })
        onBeforeUnmount(()=>{
            removeTip()
            removeMeasure()
        })
        return {
            onClickLeft,store,state,measureAreaSpace,removeMeasure
        }
    }
}
</script>

<style lang='less' scoped>
    .buttonsForDrawing{
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 60vw;
        transform: translateX(-50%);
        display: flex;
        justify-content: space-around;
        padding-bottom: 10px;
    }
</style>