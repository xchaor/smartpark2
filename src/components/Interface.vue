<template>

    <div class="main_nav_buttons">
        <!-- 首页平台 -->
        <router-link replace active-class="active" to="/home"><div class="button home"> <img src="@/assets/images/icons/shouye.png" alt=""></div></router-link>
        <!-- 智能运维 -->
        <router-link replace active-class="active" to="/operation"><div class="button operation"> <img src="@/assets/images/icons/wulianwang.png" alt=""></div></router-link>
        <!-- 视频监控 -->
        <router-link replace active-class="active" to="/cameras"><div class="button cameras"> <img src="@/assets/images/icons/jiankong.png" alt=""></div></router-link>
        <!-- 人员监控 -->
        <router-link replace active-class="active" to="/personel"><div class="button personel"> <img src="@/assets/images/icons/renyuan.png" alt=""></div></router-link>
        <!-- 基础功能 -->
        <router-link replace active-class="active" to="/"><div class="button basicFeature" @click="showPopup"><img src="@/assets/images/icons/gongnengguanli.png" alt=""></div></router-link>
    </div>
    <van-popup class="dropDownMenu" v-model:show="show" position="right" :style="{ width:'10%',height: '100%' }" >
        <div class="content">
            <h4>基础功能</h4>
            <van-cell-group >
                <van-cell :icon="require('@/assets/images/icons/xiangji.png')" title="地图标签"  is-link to="/viewMarker" clickable size="large" @click=showMenuClick />

              <van-swipe-cell v-for="(item,index) in storeState.viewPointArray.value" :key="index" v-show="showMenu" >
                <van-cell   :title="item.name" :label="item.createDate" @click="toViewPoint(item)" />
                <template #right>
                  <van-button square class="delete-button" type="danger" text="删除" @click="deleteHandler(item.guid)" />
                </template>
              </van-swipe-cell>

                <van-cell :icon="require('@/assets/images/icons/qushuchakanshuxing2.png')" title="属性查询" is-link to="/attributeQuery" clickable size="large" @click="show=false" />
                <van-cell :icon="require('@/assets/images/icons/cemianji.png')" title="地图量算"  is-link to="/mapMeasure" clickable size="large" @click="show=false" />
                <van-cell :icon="require('@/assets/images/icons/feijichangtianchong.png')" title="路径漫游"  is-link to="/routeTravel" clickable size="large" @click="show=false" />
                <van-cell :icon="require('@/assets/images/icons/iconfonttubiao_tongshifenxi.png')" title="通视分析"  is-link to="/visibilityAnalysis" clickable size="large" @click="show=false" />
            </van-cell-group>
        </div>
    </van-popup>
    <router-view></router-view>
</template>
<script>
import { reactive,ref,onMounted } from 'vue'
import { useStore } from "vuex";
import { useRouter , useRoute } from 'vue-router'
import hideNavBtn from "@/hooks/hideNavBtn";
import {useState} from "@/hooks/useState";

export default {
    name:'Interface',
  data() {
    return {
      showMenu: false,
    }
  },
    setup() {
        const router=useRouter()
        const route=useRoute()
        const store=useStore()
        const show = ref(false);
        const showPopup = () => {
            show.value = true;
            router.replace({path:'/'})
        };
        function getCurrentIndex() {
            const viewPoints=require('@/jsons/cream.json')
            const buttons=document.getElementsByClassName('button')
            for(let i=0;i<buttons.length;i++){
                buttons[i].onclick=()=>{
                    if(i==4){
                        store.dispatch("clearArrAll")
                    }
                }
            }
        };
        onMounted(()=>{
            getCurrentIndex()
        })




      // const VanDialog = Dialog.Component;
      // hideNavBtn()//隐藏主导航按钮
      const state=reactive({
        viewPointName:'',
        show: false
      })
      //视点标签数据数组对象
      const storeState=useState({viewPointArray:state=>state.viewPointArray})
      //返回按钮
      const onClickLeft = () => history.back();
      //点击添加弹出输入框
      function addItem() {
        state.show=true
      }
      //确认添加视点
      function confirm(pointName) {
        store.dispatch("addViewPoint",pointName)
        state.viewPointName=''
      }
      //点击单元格切换cesium镜头
      function toViewPoint(data) {
        history.back();
        store.dispatch('flyToPoint',data)
      }
      //删除单元格
      function deleteHandler(guid) {
        store.dispatch("deleteViewPoint",guid)
      }


      return { state,storeState,onClickLeft,addItem,toViewPoint,deleteHandler,confirm,show,showPopup,getCurrentIndex,}
    },
  methods: {
    showMenuClick() {
     this.show = false;
     this.showMenu = !this.showMenu;
    },

  },

}
</script>

<style lang='less'>
    .button{
        width: 41px;
        height: 41px;
        background-color: #fff;
        border-radius: 15%;
        font-size: 15px;
        padding: 4px;
        margin-bottom:10px; ;
        img{
            width: 100%;
        }
    }
    .main_nav_buttons{
        position: absolute;
        right: 0;
        top: 20vh;
        padding: 6px;
        display: flex;
        flex-direction: column;
    }
    .active{
        .button{
            background-color: gray;
        }
    }
    
    .content{
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #F7F8FA;
        padding: 16px 16px 20px;
        h4{
            font-size: 20px;
            font-weight: normal;
            color: gray;
            margin-bottom: 10px;
        }
    }
</style>