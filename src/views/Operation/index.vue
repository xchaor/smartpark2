<template>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import { onBeforeUnmount, onMounted, } from 'vue'
import { useStore } from "vuex";
export default {
  name:'Operation',
  setup(){
    //数据
    let attributesArr=[]
    const store=useStore()
    const pickingEntity={
    }
    let znywLoc='static/model/物联网设备/'
    //函数
    function flyTo() {
      const viewPoints=require('@/jsons/cream.json')
      store.commit('FLYTOPOINT',viewPoints[1])
    }
    function addBillboard() {
      const params={
        data:[]
      };
      const modelAttributes=require('../../../public/static/model/attributes_GeoJSON.json')
      attributesArr=modelAttributes.features
      let icon
      for (var i = 0; i < attributesArr.length; i++) {
          var vote = {};
          vote.lon = attributesArr[i].geometry.coordinates[0];
          vote.lat = attributesArr[i].geometry.coordinates[1];
          vote.gc = 1;
          params.data.push(vote);
          icon = attributesArr[i].properties.icon;
          attributes_FN(icon, vote);
      }
        function attributes_FN(typeIcon, vote) {
          var image = document.createElement("img");
          if (typeIcon === "renlian") {
              image.src = "./static/img/图层 41.png";
          }
          else if (typeIcon === "ludeng") {
              image.src = "./static/img/图层 42.png";
          }
          else if (typeIcon === "dici") {
              image.src = "./static/img/图层 44.png";
          }
          else if (typeIcon === "lajitong") {
              image.src = "./static/img/图层 45.png";
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
                  //循环添加公告牌
                  name(canvas, vote);
              }
          };
      }
      function name(canvas, value) {
          viewer.entities.add({
              id: value.type,
              position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
              billboard: {
                  image: canvas,
                  scaleByDistance: new Cesium.NearFarScalar(150, 1, 15000000, 0.5),
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  width: canvas.width,
                  height: canvas.height,
              },
              show: true
          });
    }
      
    }
    function clickHandler() {
        handler.setInputAction(function (click){
          const pickingEntity=viewer.scene.pick(click.position);
          if (pickingEntity !== undefined){
            if(pickingEntity.tileset!==undefined){
              //点击智能运维3dtile模型时调用editHandlerSmart()
              if(pickingEntity.tileset._basePath === znywLoc){
                editHandlerSmart(click.position.x, click.position.y)
                //判断以前是否选择要素
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
                pickingEntity.color = Cesium.Color.RED;
              }else{
                //点击其他模型还原前选择要素的本颜色
                previousPickedEntity.feature.color =previousPickedEntity.originalColor;
              }
            }
          }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
    };
    function editHandlerSmart(x, y) {
        //将点击事件的坐标赋值给弹窗的方位
        shapeEditMenu.style.width="200px"
        shapeEditMenu.style.height="170px"
        shapeEditMenu.style.display = "block";
        shapeEditMenu.style.left = x + "px";
        shapeEditMenu.style.top = y + "px";
        editHandlerSmartHtml(shapeEditMenu);
    };
    function editHandlerSmartHtml(shapeEditMenu) {
        var imei;
        var objTable;
        for (var i = 0; i < attributesArr.length; i++) {
          if (
            attributesArr[i].properties.NAME === viewer.selectedEntity.name
          ) {
            imei = attributesArr[i].properties.IMEI;
            break;
          }
        }
        const equipList=require('../../../public/static/model/设备列表(除人脸设备外).json')
          for (var i = 0; equipList.length; i++) {
            if (equipList[i].imei === imei) {
              objTable = equipList[i];
              break;
            }
          }
          var textContent =
            '\t<div class="znywAlert">\n' +
            '\t\t<div class="znywAlert-title">设备信息</div>\n' +
            "\t\t<div> 设备识别码：" +
            objTable.imei +
            "</div>\n" +
            "\t\t<div> \t\t设备类型：" +
            objTable.equipmentType +
            "</div>\n" +
            "\t\t<div> \t\t事件编号：" +
            objTable.eventId +
            "</div>\n" +
            "\t\t<div> \t\t事件名称：" +
            objTable.eventName +
            "</div>\n" +
            "\t\t<div> \t\t详情编号：" +
            objTable.equipmentId +
            "</div>\n" +
            "\t\t<div> \t\t设备名称：" +
            objTable.equipmentName +
            "</div>\n" +
            "\t\t<div> \t\t设备地址：" +
            objTable.address +
            "</div>\n" +
            "\t\t<div> \t\t上报时间：" +
            objTable.reportTime +
            "</div>\n" +
            "\t</div>";
          shapeEditMenu.innerHTML = textContent;
    }
    
    onMounted(()=>{
      addBillboard()
      clickHandler()
      flyTo()
    })
    onBeforeUnmount(()=>{
      store.dispatch('clearArrAll')
    })
    return{
      attributesArr,znywLoc,addBillboard,clickHandler,flyTo
    }
  },
}
</script>

<style>

</style>