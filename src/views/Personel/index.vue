<template>
  <van-popup
  v-model:show="show"
  round
  position="bottom"
  :style="{ height: '35%' }"
  >
  <div class="content">
    <h4 >起始时间:</h4>
    <van-cell is-link @click="showStartDatePicker=!showStartDatePicker">{{formatTime(startDate)}}</van-cell>
    <van-action-sheet v-model:show="showStartDatePicker">
      <van-datetime-picker
          v-model="startDate"
          type="datetime"
          title="选择起始时间"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onConfirm1"
          @cancel="onCancel1"
        />
    </van-action-sheet>

    <h4>结束时间:</h4>
    <van-cell is-link @click="showEndDatePicker=!showEndDatePicker">{{formatTime(endDate)}}</van-cell>
    <van-action-sheet v-model:show="showEndDatePicker">
      <van-datetime-picker
        v-model="endDate"
        type="datetime"
        title="选择结束时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm2"
        @cancel="onCancel2"
      />
    </van-action-sheet>
    <van-button type="primary" id="cxbtn" @click="queryStart">查询</van-button>
  </div>
  </van-popup>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import { useStore } from "vuex";
import { onMounted,onBeforeUnmount,ref, reactive } from 'vue'
export default {
  name:'Personel',
  setup(){
    const show = ref(false);
    const minDate=new Date(2000, 0, 1)
    const maxDate=new Date(2025, 10, 1)
    const startDate=ref(new Date(2020,11,11,10,0,0))
    const endDate=ref(new Date(2020,11,11,12,0,0))
    let showStartDatePicker=ref(false)
    let showEndDatePicker=ref(false)
    function onConfirm1(value) {
        startDate.value=value
        showStartDatePicker.value= false
    }
    function onCancel1() {
        showStartDatePicker.value= false
    }
    function onConfirm2(value) {
        endDate.value=value
        showEndDatePicker.value= false
    }
    function onCancel2() {
        showEndDatePicker.value= false
      
    }
    //数据
    let trackArr=[]
    const store=useStore()
    function flyTo() {
      const viewPoints=require('@/jsons/cream.json')
      store.commit('FLYTOPOINT',viewPoints[3])
    }
    //添加billboard
    function addTrackPoint() {
      let fileNum = 10;
      for (var i = 1; i <= fileNum; i++) {
        const modelTrack=require(`../../../public/static/model/czml/巡检路线${i}.json`)
        var trackArrResult = modelTrack[1].position.cartographicDegrees;
        trackArr.push(trackArrResult);
        var icon;
        var vote = {};
        vote.lon = trackArrResult[1]; 
        vote.lat = trackArrResult[2];
        vote.gc = trackArrResult[3];
        vote.id = modelTrack[1].id;
        icon = modelTrack[1].name;
        TrackPoint(icon, vote);
      }
        function TrackPoint(icon, vote) {
          var image = document.createElement("img");
          if (icon === "员工") {
            image.src = "./static/img/rwjk/图层 56.png";
          } else if (icon === "访客") {
            image.src = "./static/img/rwjk/图层 57.png";
          } else if (icon === "安保") {
            image.src = "./static/img/rwjk/abry.png";
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
              name(canvas, vote, icon);
            }
          };
        }
        function name(canvas, value, icon) {
          viewer.entities.add({
            id: value.id + "_" + icon,
            position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
            billboard: {
              image: canvas,
              scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              width: canvas.width,
              height: canvas.height,
            },
          });
        }
    }
    function clickHandler() {
        handler.setInputAction(function (movement){
          const pickingEntity=viewer.scene.pick(movement.position);
          if (pickingEntity !== undefined){
            if(pickingEntity.id !== undefined ){
              var index = Number(pickingEntity.id._id);
              if(trackArr !== undefined){
                var NumberPro = Number(pickingEntity.id._id.split("_")[1]);
                var profession = pickingEntity.id._id.split("_")[2];
                var id = pickingEntity.id._id;
                mapClick.NumberArr.push(NumberPro);
                mapClick.professionArr.push(profession);
                if (mapClick.NumberArr.length > 2) {
                  mapClick.NumberArr.shift();
                  mapClick.professionArr.shift();
                }
                if (mapClick.NumberArr.length <= 2) {
                  if (
                    mapClick.NumberArr[0] !== mapClick.NumberArr[1] ||
                    mapClick.NumberArr[1] === undefined
                  ) {
                      // 移除当前点击的
                      var radarNew = viewer.entities.getById(id);
                      viewer.entities.remove(radarNew);
                      checkTrack(NumberPro);
                      editHandlerTrack(
                        movement.position.x - 60,
                        movement.position.y - 80,
                        NumberPro,
                        profession
                      );
                    }
                }
              }
            };
          }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
        function checkTrack(index) {
          // 移除上次点击的
          var radar = viewer.entities.getById(
            "track" + "_" + mapClick.NumberArr[0] + "_" + mapClick.professionArr[0]
          );
          var isTrue = viewer.entities.remove(radar);
          if (isTrue) {
            checkLastTrack(mapClick.NumberArr[0]);
          }
          // 数组索引对应-1 添加这次点击的加上圆环
            const modelBillboard=require(`../../../public/static/model/czml/巡检路线${index}.json`)
            var trackArrResult = modelBillboard[1].position.cartographicDegrees;
            var icon;
            var vote = {};
            vote.lon = trackArrResult[1];
            vote.lat = trackArrResult[2];
            vote.gc = trackArrResult[3];
            vote.id = modelBillboard[1].id;
            icon = modelBillboard[1].name;
            TrackPoint(icon, vote);
            function TrackPoint(icon, vote) {
              var image = document.createElement("img");
              if (icon === "员工") {
                image.src = "./static/img/icons/map-ryjk-1.png";
              } else if (icon === "访客") {
                image.src = "./static/img/icons/map-ryjk-2.png";
              } else if (icon === "安保") {
                image.src = "./static/img/icons/map-ryjk-3.png";
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
                  name(canvas, vote, icon);
                }
              };
            }
            function name(canvas, value, icon) {
              viewer.entities.add({
                id: value.id + "_" + icon,
                position: Cesium.Cartesian3.fromDegrees(
                  value.lon,
                  value.lat,
                  value.gc
                ),
                billboard: {
                  image: canvas,
                  scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  width: canvas.width,
                  height: canvas.height,
                },
              });
            }
          //上次点击 还原
          function checkLastTrack(index) {
            const modelLastUrl=require(`../../../public/static/model/czml/巡检路线${index}.json`)
              var trackArrResult = modelLastUrl[1].position.cartographicDegrees;
              var icon;
              var vote = {};
              vote.lon = trackArrResult[1];
              vote.lat = trackArrResult[2];
              vote.gc = trackArrResult[3];
              vote.id = modelLastUrl[1].id;
              icon = modelLastUrl[1].name;
              TrackPoint(icon, vote);
              function TrackPoint(icon, vote) {
                var image = document.createElement("img");
                if (icon === "员工") {
                  image.src = "./static/img/rwjk/图层 56.png";
                } else if (icon === "访客") {
                  image.src = "./static/img/rwjk/图层 57.png";
                } else if (icon === "安保") {
                  image.src = "./static/img/rwjk/abry.png";
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
                    name(canvas, vote, icon);
                  }
                };
              }
              function name(canvas, value, icon) {
                viewer.entities.add({
                  id: value.id + "_" + icon,
                  position: Cesium.Cartesian3.fromDegrees(
                    value.lon,
                    value.lat,
                    value.gc
                  ),
                  billboard: {
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
        function editHandlerTrack(x, y, index, type) {
          var trackArrResult = trackArr[Number(index) - 1];
          var vote = {};
          vote.lon = trackArrResult[1];
          vote.lat = trackArrResult[2];
          shapeEditMenu.style.display = "block";
          shapeEditMenu.style.left = x + "px";
          shapeEditMenu.style.top = y + "px";
          shapeEditMenu.onclick = function () {
            //加入人员轨迹
            viewer.entities.removeAll();
            shapeEditMenu.style.display = "none";
            peopleTrack(Number(index), type);
          };
        }
        function peopleTrack(i, t) {
          var dronePromise;
          var flyNumber;
          var type;
          flyNumber = i;
          type = t;
          const modelRoutes=require(`../../../public/static/model/czml/巡检路线${i}.json`)
            dronePromise = viewer.dataSources
              .add(Cesium.CzmlDataSource.load(modelRoutes))
              .then(function (ds) {
                viewer.trackedEntity = ds.entities.getById("track_" + flyNumber);
                var colorStyle;
                if (type === "员工") {
                  colorStyle = Cesium.Color.fromBytes(0, 255, 191, 255);
                } else if (type === "访客") {
                  colorStyle = Cesium.Color.fromBytes(0, 120, 255, 255);
                } else if (type === "安保") {
                  colorStyle = Cesium.Color.fromBytes(255, 135, 0, 255);
                }
                viewer.trackedEntity.path.material._color._value = colorStyle;
                // viewer.trackedEntity.orientation =new  Cesium.VelocityOrientationProperty(viewer.trackedEntity.position);
                viewer.trackedEntity.billboard.horizontalOrigin =
                  Cesium.HorizontalOrigin.TOP;
                viewer.trackedEntity.billboard.verticalOrigin =
                  Cesium.VerticalOrigin.BOTTOM;
              });
            //显示弹出栏
          show.value=true
          handler.setInputAction(function (movement){
          const pickingEntity=viewer.scene.pick(movement.position);
          if(pickingEntity.id !== undefined ){
            show.value=true
          }
          },Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }
    }
    //查询按钮
    function queryStart() {
      var startTime = formatTime(startDate.value).replace(" ", "T") + "Z";
      var stopTime = formatTime(endDate.value).replace(" ", "T") + "Z";
      viewer.clock.startTime = Cesium.JulianDate.fromIso8601(startTime);
      viewer.clock.stopTime = Cesium.JulianDate.fromIso8601(stopTime);
      viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
      viewer.clock.shouldAnimate = true;
      show.value=false
    }

    // 时间格式化
    function formatTime(date) {
        let year=date.getFullYear()
        let month=date.getMonth()+1 
        if (month<10) {
          month="0"+month;
        }
        let dateN=date.getDate()
        if (dateN<10) {
          dateN="0"+dateN;
        }
        let hour=date.getHours()
        if (hour<10) {
          hour="0"+hour;
        }
        let minute=date.getMinutes()
        if (minute<10) {
          minute="0"+minute;
        }
        let second=date.getSeconds()
        if (second<10) { 
          second="0"+second;
        }
        return `${year}-${month}-${dateN} ${hour}:${minute}:${second}`
    }

    onMounted(()=>{
      //初始化弹窗
      shapeEditMenu.style = `
      position:absolute;
      left:-24px;
      top:38px;
      width:1.6rem;
      height:1.1rem;
      background:#153251;
      font-size:10px;
      padding:5px;
      z-index:7;
      border:1px solid #0976C1`
      ;
      shapeEditMenu.innerHTML=
      '\t<div class="lsgj">\n' +
      '\t\t<div class="lsgj_Billboard">\n' +
      '\t\t\t<img src="./static/img/rwjk/组 2.png" alt="">\n' +
      "\t\t\t<h5>历史轨迹</h5>\n" +
      "\t\t</div>\n" +
      "\t</div>";
      shapeEditMenu.style.display = "none";
      addTrackPoint()
      clickHandler()
      flyTo()
    })
    onBeforeUnmount(()=>{
      store.dispatch('clearArrAll')
    })
  return{
      flyTo,
      addTrackPoint,
      trackArr,
      clickHandler,
      formatTime ,
      showStartDatePicker,
      showEndDatePicker,
      minDate,
      maxDate,
      onConfirm1,
      onCancel1,
      onConfirm2,
      onCancel2,
      queryStart,
      startDate,
      endDate,
      show,
    }
},
}
</script>
<style lang="less" scoped>
  .content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #F7F8FA;
    padding: 16px 16px 20px;
    #cxbtn{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: 5px 0 0;
    }
  }

  h4{
    font-size: .4rem;
    font-weight: normal;
  }
</style>

