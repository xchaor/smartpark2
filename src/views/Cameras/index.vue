<template>
  视频监控
    <div v-show="videoIsShow" class="videocontainer">
      <div class="iconBox_close" @click="videoIsShow=false"></div>
      <video src="@/assets/video/jiankongvideo.mp4" muted controls autopictureinpicture="false"  disablePictureInPicture controlslist="nodownload" ></video>
    </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import { onMounted,onBeforeUnmount,ref } from 'vue'
import { useStore } from "vuex";
export default {
  name:'Cameras',
  setup(){
    // 数据
    let monitorArr=[]
    const store=useStore()
    function flyTo() {
      const viewPoints=require('@/jsons/cream.json')
      store.commit('FLYTOPOINT',viewPoints[2])
    }
    function addBillboard() {
      console.log('添加公告牌');
      const params={
        data:[]
      }
      const modelMonitor=require('../../../public/static/model/monitor.json')
      monitorArr=modelMonitor.features
      let icon
      for (var i = 0; i < monitorArr.length; i++) {
          var vote = {};
          vote.lon = monitorArr[i].geometry.coordinates[0];
          vote.lat = monitorArr[i].geometry.coordinates[1];
          vote.gc = monitorArr[i].geometry.coordinates[2];
          vote.id = monitorArr[i].geometry.id;
          icon = monitorArr[i].geometry.status;
          params.data.push(vote);
          monitor_FN(icon, vote);
      }
      function monitor_FN(typeIcon, vote) {
          var image = document.createElement("img");
          if (typeIcon === "正常") {
              image.src = "./static/img/图层 51.png";
          }
          else if (typeIcon === "故障") {
              image.src = "./static/img/图层 53.png";
          }
          else if (typeIcon === "检修") {
              image.src = "./static/img/图层 52.png";
          }
          image.onload = image.onreadystatechange = function () {
              if (!this.readyState ||
                  this.readyState == "loaded" ||
                  this.readyState == "complete") {
                  var canvas = document.createElement("canvas");
                  canvas.height = image.height;
                  canvas.width = image.width;
                  var ctx = canvas.getContext("2d");
                  ctx.drawImage(image, 0, 0);
                  name(canvas, vote);
              }
          };
      }
      function name(canvas, value) {
          viewer.entities.add({
              name: "视频监控",
              id: value.id,
              position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
              billboard: {
                  name: value.id,
                  image: canvas,
                  scaleByDistance: new Cesium.NearFarScalar(150, 1, 15000000, 0.5),
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  width: canvas.width,
                  height: canvas.height,
              },
          });
      }
    }
    //点击billboard处理
    let videoIsShow=ref(false)
    function clickHandler() {
        handler.setInputAction(function (click){
          const pickingEntity=viewer.scene.pick(click.position);
          if (pickingEntity !== undefined){
              if(pickingEntity.id !== undefined ){
                if (pickingEntity.id._id !== undefined) {
                  var index = Number(pickingEntity.id._id);
                  if (monitorArr !== undefined){
                    mapClick.czlArr.push(index);
                  if (mapClick.czlArr.length > 2) {
                    mapClick.czlArr.shift();
                  }
                  if (mapClick.czlArr.length <= 2) {
                    if (
                      mapClick.czlArr[0] !== mapClick.czlArr[1] ||
                      mapClick.czlArr[1] === undefined
                    ) {
                        var radar = viewer.entities.getById(index);
                        viewer.entities.remove(radar);
                        checkMapMonitor(index);
                      }
                  }
                  // 显示视频
                  videoIsShow.value=true
                  }
                }
              };
          }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    function checkMapMonitor(index) {
        var type = monitorArr[index].geometry.status;
        var radar = viewer.entities.getById(mapClick.czlArr[0]);
        var isTrue = viewer.entities.remove(radar);
        if (isTrue) {
          addLastTime(mapClick.czlArr[0]);
        }
        var image = document.createElement("img");
        if (type === "正常") {
          image.src = "./static/img/icons/map-spjk-1.png";
        } else if (type === "故障") {
          image.src = "./static/img/icons/map-spjk-3.png";
        } else if (type === "检修") {
          image.src = "./static/img/icons/map-spjk-2.png";
        }
        var vote = {};
        vote.lon = monitorArr[index].geometry.coordinates[0];
        vote.lat = monitorArr[index].geometry.coordinates[1];
        vote.gc = monitorArr[index].geometry.coordinates[2];
        vote.id = monitorArr[index].geometry.id;
        image.onload = image.onreadystatechange = function () {
          if (
            !this.readyState ||
            this.readyState == "loaded" ||
            this.readyState == "complete"
          ) {
            var canvas = document.createElement("canvas");
            canvas.height = image.height;
            canvas.width = image.width;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            name(canvas, vote);
          }
        };
        function name(canvas, value) {
          viewer.entities.add({
            id: value.id,
            position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
            billboard: {
              name: value.id,
              image: canvas,
              scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              width: canvas.width,
              height: canvas.height,
            },
          });
        }
        function addLastTime(index) {
          var vote = {};
          var params = {
            data: [],
          };
          var icon;
          vote.lon = monitorArr[index].geometry.coordinates[0];
          vote.lat = monitorArr[index].geometry.coordinates[1];
          vote.gc = monitorArr[index].geometry.coordinates[2];
          vote.id = monitorArr[index].geometry.id;
          icon = monitorArr[index].geometry.status;
          params.data.push(vote);
          monitor_FN(icon, vote);
          function monitor_FN(typeIcon, vote) {
            var image = document.createElement("img");
            if (typeIcon === "正常") {
              image.src = "./static/img/图层 51.png";
            } else if (typeIcon === "故障") {
              image.src = "./static/img/图层 53.png";
            } else if (typeIcon === "检修") {
              image.src = "./static/img/图层 52.png";
            }
            image.onload = image.onreadystatechange = function () {
              if (
                !this.readyState ||
                this.readyState == "loaded" ||
                this.readyState == "complete"
              ) {
                var canvas = document.createElement("canvas");
                canvas.height = image.height;
                canvas.width = image.width;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);
                name(canvas, vote);
              }
            };
          }
          function name(canvas, value) {
            viewer.entities.add({
              id: value.id,
              position: Cesium.Cartesian3.fromDegrees(
                value.lon,
                value.lat,
                value.gc
              ),
              billboard: {
                name: value.id,
                image: canvas,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                width: canvas.width,
                height: canvas.height,
              },
            });
          }
        }
    }
    onMounted(()=>{
      console.log('视频监控');
      addBillboard()
      clickHandler()
      flyTo()
    })
    onBeforeUnmount(()=>{
      store.dispatch('clearArrAll')
    })
    return{
        monitorArr,addBillboard,clickHandler,videoIsShow,flyTo
    }
  },
}
</script>

<style lang="less" scoped>
  .videocontainer{
    z-index: 8;
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, .7);
    display: flex;
    align-items: center;
    video{
      width: 100%;
    }
    .iconBox_close{
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      width: .64rem;
      height: .64rem;
      background: url(@/assets/images/icons/close.png);
      background-size: contain;
    }
  }

</style>