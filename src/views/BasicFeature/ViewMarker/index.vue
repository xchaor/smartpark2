<template>
        <div class="common-bgc">
        <van-nav-bar
        title="地图标签"
        left-text="返回"
        right-text="添加"
        left-arrow
        @click-left="onClickLeft"
        @click-right="addItem"
        />
        <van-swipe-cell v-for="(item,index) in storeState.viewPointArray.value" :key="index" >
            <van-cell   :title="item.name" :label="item.createDate" @click="onClick(item)" />
            <template #right>
                <van-button square class="delete-button" type="danger" text="删除" @click="deleteHandler(item.guid)" />
            </template>
        </van-swipe-cell>
    </div>


    <var-dialog v-model:show="state.show" @confirm="confirm(state.viewPointName)" @cancel="state.viewPointName=''" >
        <template #title>
            添加视点标签
        </template>
        <template #default>
          <van-field v-model="state.viewPointName" label="名称" rows="1"  autosize placeholder="请输入名称"  maxlength="6" show-word-limit />
        </template>
    </var-dialog>

</template>

<script>
import { reactive,ref } from 'vue';
import { useStore } from "vuex";
import { useState } from '@/hooks/useState'
import hideNavBtn from '@/hooks/hideNavBtn'

export default {
    name:'ViewMarker', 
    setup(){
        // const VanDialog = Dialog.Component;
        hideNavBtn()//隐藏主导航按钮
        const store=useStore()
        const state=reactive({
            viewPointName:'',
            show: false
        })
        //视点标签数据数组对象
        const storeState=useState({viewPointArray:state=>state.viewPointArray})
        //返回按钮
        const onClickLeft = () => history.back();
        //添加单元格
        function addItem() {   
            state.show=true
        }
        function confirm(pointName) {
            store.commit("ADDVIEWPOINT",pointName)
            state.viewPointName=''
        }
        //点击单元格
        function onClick(data) {
            history.back();
            store.commit('FLYTOPOINT',data)
        }
        //删除单元格
        function deleteHandler(guid) {
            store.commit("DELETEVIEWPOINT",guid)
        }
        return {
            state,storeState,onClickLeft,addItem,onClick,deleteHandler,confirm,
        }
    },
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
</style>