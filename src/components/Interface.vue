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
    <van-popup class="dropDownMenu" v-model:show="show" position="right" :style="{ width:'80%',height: '100%' }" >
        <div class="content">
            <h4>基础功能</h4>
            <van-cell-group >
                <van-cell :icon="require('@/assets/images/icons/xiangji.png')" title="地图标签"  is-link to="/viewMarker" clickable size="large" @click="show=false" />
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
import { ref,onMounted } from 'vue'
import { useStore } from "vuex";
import { useRouter , useRoute } from 'vue-router'
export default {
    name:'Interface',
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
        return {show,showPopup,getCurrentIndex,}
    }

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