<template>
    <van-nav-bar
    title="路径绘制"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    />
    <div class="drawBtns" >
        <van-button round type="danger" @click="restart">重新绘制</van-button>
        <van-button round type="success" :disabled='!state.hasPointFlag'  @click="endDraw()">完成绘制</van-button>
    </div>
    <var-dialog v-model:show="state.show" @confirm="confirmHandler(state.dialogDate)" @cancel="state.routeName='';state.routeHeight=0" >
        <template #title>
            请输入属性
        </template>
        <template #default>
            <van-field v-model="state.dialogDate.routeName" label="名称" rows="1"  required   autosize placeholder="请输入名称"  maxlength="6" show-word-limit />
            <van-field v-model="state.dialogDate.routeHeight" label="高度（米）" rows="1"  autosize placeholder="高度" type="number" />
        </template>
    </var-dialog>
</template>

<script>
import {useRoute,useRouter,} from 'vue-router'
import { onMounted,onBeforeUnmount, reactive, watch, } from 'vue'
import { useStore } from "vuex";
import { Notify } from 'vant';
import 'vant/es/notify/style';
export default {
    name:'AddRoute',
    setup() {
        const store=useStore()
        const router=useRouter()
        const route=useRoute()
        const state=reactive({
            dialogDate:{
                routeName:'',
                routeHeight:100,
            },
            show:false,
            hasPointFlag:true
        })
        const onClickLeft = () =>{
            history.back() ;store.dispatch('clearArrAll') 
        } 

        function restart() {
            store.dispatch('clearArrAll') 
            store.dispatch('drawRoute')
        }
        function endDraw() {
            state.show=true
        }
        function confirmHandler(newRouteDate) {
            if (state.dialogDate.routeName==='') {
                Notify({ type: 'danger', message: '保存失败，名称不能为空' });
                return
            }
            store.dispatch("safeRoute",newRouteDate);
            state.dialogDate.routeName='';
            state.dialogDate.routeHeight=0
        }
        watch(()=>store.state.flyPoints,(newValue)=>{
            if(newValue.length){
                state.hasPointFlag=true
            }else{
                state.hasPointFlag=false
            }
        },{deep:true})
        onMounted(() => {
            const optionsBtns=document.querySelector('.options')
            const controlBtns=document.querySelector('.MovingControl')
            optionsBtns.style.display='none'
            controlBtns.style.display='none'
            store.dispatch('drawRoute')
        });
        onBeforeUnmount(()=>{
            optionsBtns.style.display='block'
            controlBtns.style.display='flex'
            store.dispatch('clearArrAll')   
        })
        return{
           state,onClickLeft,confirmHandler,restart,endDraw            
        }
    }

}
</script>

<style lang='less' scoped>
    .drawBtns{
        position: absolute;
        display: flex;
        justify-content: space-around;
        bottom: 20px;
        width: 100vw;
    }
</style>