<template>
    <van-nav-bar
    title="路径漫游"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    />
    <div class="options">
        <div class="optionItem">
            <img src="../../../assets/images/icons/huabi.png" alt="">
            <span>绘制</span>
        </div>
            <router-link class="optionItem" to="/routeTravel/routeList">
                <img src="../../..//assets/images/icons/list.png" alt="">
                <span>列表</span>
            </router-link>
    </div>

    <div class="MovingControl">
        <van-button round type="primary" @click="MoveNPause">移动/暂停</van-button>
    </div>
    <router-view></router-view>
</template>

<script>
import {useRoute,useRouter,} from 'vue-router'
import { onBeforeUnmount, reactive,ref } from 'vue'
import hideNavBtn from '@/hooks/hideNavBtn'
import { useStore } from "vuex";

export default {
    name:'RouteTravel',
    setup(){
        hideNavBtn()//隐藏主导航按钮
        const store=useStore()
        const router=useRouter()
        const route=useRoute()
        const state=reactive({
        })
        function MoveNPause() {
            store.dispatch("MoveNPause")
        }
        onBeforeUnmount(()=>{
            store.dispatch('clearArrAll')
        })
        const onClickLeft = () => history.back();
        return {
            state,store,MoveNPause,onClickLeft,
        }
    }
}
</script>

<style lang='less' scoped>
    .options{
        border-radius: 10px;
        position: absolute;
        right: 0;
        bottom: 20vh;
        background-color: #fff;
        font-size: 10px;
        .optionItem{
            display: flex;
            flex-direction: column;
            align-content: center;
            padding: 10px;
            img{
                width: 30px
            };
            span{
                text-align: center;
            }
        }
        .optionItem:first-child{
            border-bottom: 1px solid rgba(0, 0, 0, .2);
        }
    }
    .MovingControl{
        position: absolute;
        display: flex;
        justify-content: center;
        bottom: 20px;
        width: 100vw;
    }
</style>