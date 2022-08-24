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

        //点击路径item
        function flyToModel(name) {
            history.back()
            store.dispatch("flyToModel",name)
        }
        //删除路径
        function deleteRoute(name) {
            store.dispatch('deleteFlyRoute',name)
        }
        return {
            storeState,onClickLeft,flyToModel,deleteRoute
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