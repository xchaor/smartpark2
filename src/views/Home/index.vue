<template>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import { onMounted,onBeforeUnmount } from 'vue'
import { useStore } from "vuex";

export default {
  name:'Home',
  setup(){
    const store=useStore()
    let warnNote=[]
    function flyTo() {
      const viewPoints=require('@/jsons/cream.json')
      store.commit('FLYTOPOINT',viewPoints[0])
    }
    function addBillboard(){
      var params = {
                data: [],
      };
      const modelAttributes=require('../../../public/static/model/gjsb.json')
      warnNote=modelAttributes.features
      var typeIcon;
      for (var i = 0; i < warnNote.length; i++) {
          var vote = {};
          vote.lon = warnNote[i].geometry.coordinates[0];
          vote.lat = warnNote[i].geometry.coordinates[1];
          vote.gc = warnNote[i].geometry.coordinates[2];
          vote.id = warnNote[i].geometry.id;
          typeIcon = warnNote[i].geometry.name;
          params.data.push(vote);
          gjsb_FN(typeIcon, vote);
      }
      function gjsb_FN(typeIcon, vote) {
          var image = document.createElement("img");
          if (typeIcon === "设备告警") {
              image.src = "./static/img/图层 31.png";
          }
          else if (typeIcon === "安防告警") {
              image.src = "./static/img/图层 32.png";
          }
          else if (typeIcon === "能源告警") {
              image.src = "./static/img/图层 33.png";
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
                  nameJor(canvas, vote);
              }
          };
          image.onload = image.onreadystatechange = function () {
              if (!this.readyState ||
                  this.readyState == "loaded" ||
                  this.readyState == "complete") {
                  var canvas = document.createElement("canvas");
                  canvas.height = image.height;
                  canvas.width = image.width;
                  var ctx = canvas.getContext("2d");
                  ctx.drawImage(image, 0, 0);
                  nameJor(canvas, vote);
              }
          };
        }
        function nameJor(canvas, value) {
          viewer.entities.add({
              id: value.id,
              position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
              billboard: {
                  image: canvas,
                  // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                  // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
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
                if (pickingEntity.id._id !== undefined) {
                  var index = Number(pickingEntity.id._id);
                  if (warnNote !== undefined){
                      editWranLeverHtml(
                        movement.position.x ,
                        movement.position.y ,
                        index
                      );
                      mapClick.warnArr.push(index);
                      if (mapClick.warnArr.length > 2) {
                        mapClick.warnArr.shift();
                      }
                      if (mapClick.warnArr.length <= 2) {
                        if (
                          mapClick.warnArr[0] !== mapClick.warnArr[1] ||
                          mapClick.warnArr[1] === undefined
                        ) {
                          var radar = viewer.entities.getById(index);
                          viewer.entities.remove(radar);
                          checkWarn(index);
                        }
                      }
                  }
                }
              };
          }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
    function editWranLeverHtml(x, y, index) {
        shapeEditMenu.style.width="200px"
        shapeEditMenu.style.height="150px"
        shapeEditMenu.style.display = "block";
        shapeEditMenu.style.left = x + "px";
        shapeEditMenu.style.top = y + "px";
        showWranLeverHtml(shapeEditMenu, index)
    }
    function showWranLeverHtml(shapeEditMenu, index) {
        var objTable = warnNote[index];
        var start = objTable.properties.TIMESTART;
        var end = objTable.properties.TIMEEND;
        var cx = DateToTamp(end) - DateToTamp(start);
        var time =formatSecond(cx);
        var strNum2 =
          '<div class="redBg">\n' +
          '\t<div class="redBg_title">\n' +
          "\t\t告警等级</div>\n" +
          '\t<div class="redCont">\n' +
          "\t\t<div>告警等级：" +
          objTable.properties.LEVEL +
          "</div>\n" +
          "\t\t<div>告警信息：" +
          objTable.properties.NAME +
          "</div>\n" +
          "\t\t<div>告警开始时间：" +
          objTable.properties.TIMESTART +
          "</div>\n" +
          "\t\t<div>告警结束时间：" +
          objTable.properties.TIMEEND +
          "</div>\n" +
          "\t\t<div>告警持续时间：" +
          time.days +
          "天-" +
          time.hours +
          "小时-" +
          time.minutes +
          "分钟-" +
          time.seconds +
          "秒</div>\n" +
          "\t</div>\n" +
          "</div>";
        shapeEditMenu.innerHTML = strNum2;
    }
    function checkWarn(index) {
        var type = warnNote[index].geometry.name;
        var radar = viewer.entities.getById(mapClick.warnArr[0]);
        var isTrue = viewer.entities.remove(radar);
        if (isTrue) {
          addLastTime(mapClick.warnArr[0]);
        }
        var image = document.createElement("img");
        if (type === "设备告警") {
          image.src = "./static/img/icons/map-sbgj.png";
        } else if (type === "安防告警") {
          image.src = "./static/img/icons/map-afgj.png";
        } else if (type === "能源告警") {
          image.src = "./static/img/icons/map-nygj.png";
        }
        var vote = {};
        vote.lon = warnNote[index].geometry.coordinates[0];
        vote.lat = warnNote[index].geometry.coordinates[1];
        vote.gc = warnNote[index].geometry.coordinates[2];
        vote.id = warnNote[index].geometry.id;
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
          vote.lon = warnNote[index].geometry.coordinates[0];
          vote.lat = warnNote[index].geometry.coordinates[1];
          vote.gc = warnNote[index].geometry.coordinates[2];
          vote.id = warnNote[index].geometry.id;
          icon = warnNote[index].geometry.name;
          params.data.push(vote); 
          monitor_FN(icon, vote);
          function monitor_FN(typeIcon, vote) {
            var image = document.createElement("img");
            if (typeIcon === "设备告警") {
              image.src = "./static/img/图层 31.png";
            } else if (typeIcon === "安防告警") {
              image.src = "./static/img/图层 32.png";
            } else if (typeIcon === "能源告警") {
              image.src = "./static/img/图层 33.png";
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
    function formatSecond(second) {
        const days = Math.floor(second / 86400);
        const hours = Math.floor((second % 86400) / 3600);
        const minutes = Math.floor(((second % 86400) % 3600) / 60);
        const seconds = Math.floor(((second % 86400) % 3600) % 60);
        const forMatDate = {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        };
        return forMatDate;
    }
    function DateToTamp(oString) {
        var f = oString.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        //使用Date的构造函数，实力化并解析
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime() / 1000;
    }

    onMounted(() => {
      addBillboard()
      clickHandler()
      flyTo()
    });
    onBeforeUnmount(()=>{
      store.dispatch('clearArrAll')
    })
    return{

    }
  },
}
</script>

<style>

</style>