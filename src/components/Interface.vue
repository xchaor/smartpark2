<template>
    <div class="button home"><img src="@/assets/images/icons/shouye.png" alt=""></div>
    <div class="button operation"><img src="@/assets/images/icons/wulianwang.png" alt=""></div>
    <div class="button cameras"><img src="@/assets/images/icons/jiankong.png" alt=""></div>
    <div class="button personel"><img src="@/assets/images/icons/renyuan.png" alt=""></div>
    <div class="button basicFeature" @click="showPopup"><img src="@/assets/images/icons/gongnengguanli.png" alt=""></div>
    <van-popup class="dropDownMenu" v-model:show="show" position="right" :style="{ width:'80%',height: '100%' }" >
        <div><h4>基础功能</h4></div>
        <van-cell-group>
            <van-cell title="地图标签" is-link />
            <van-cell title="属性查询" is-link />
            <van-cell title="地图量算" is-link />
            <van-cell title="路径漫游" is-link />
            <van-cell title="通视分析" is-link />
        </van-cell-group>
    </van-popup>
</template>

<script>
import { ref } from 'vue'
export default {
    name:'Interface',
    setup() {
        const show = ref(false);
        const showPopup = () => {
            show.value = true;
        };
        return {show,showPopup}
    }

}
</script>

<style lang='less'>
    .info_buttons{
        position: absolute;
        top: 15%;
        right: 10px;
        .button{
            margin-bottom: 10px;
        }
    }
    .button{
        width: 41px;
        height: 41px;
        background-color: #fff;
        border-radius: 15%;
        font-size: 15px;
        padding: 4px;
        img{
            width: 100%;
        }
    }
    .home{
        position: fixed;
        top: 70px;
        right: 10px;
    }
    .operation{
        position: fixed;
        top: 120px;
        right: 10px;
    }
    .cameras{
        position: fixed;
        top: 170px;
        right: 10px;
    }
    .personel{
        position: fixed;
        top: 220px;
        right: 10px;
    }
    .basicFeature{
        position: fixed;
        top: 270px;
        right: 10px;
    }
</style>