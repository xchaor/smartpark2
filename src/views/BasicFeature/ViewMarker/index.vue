<template>
    <div class="common-bgc">
        <van-nav-bar
        title="地图标签"
        left-text="返回"
        right-text="添加"
        left-arrow
        @click-left="onClickLeft"
        @click-right="addViewPoint"
        />

        <van-swipe-cell v-for="(item,index) in state.viewPointArray" :key="index" >
            <van-cell   :title="item.name" :label="item.createDate" @click="onClick(item)" />
            <template #right>
                <van-button square class="delete-button" type="danger" text="删除" @click="deleteHandler(item.name)" />
            </template>
        </van-swipe-cell>
    </div>
</template>

<script>
import { reactive,ref } from 'vue';
import { useStore } from "vuex";
// Dialog
import { Dialog } from 'vant';
import 'vant/es/dialog/style';
import hideNavBtn from '@/hooks/hideNavBtn'
export default {
    name:'ViewMarker',  
    setup(){
        hideNavBtn()//隐藏主导航按钮
        const store=useStore()
        const state=reactive({
            viewPointArray: [
            {
                "createDate": "2022-07-02 15:06:37",
                "guid": 1,
                "name": "主视角",
                "camera": [
                    {
                        "name": "position",
                        "x": -2860332.749037736,
                        "y": 4647974.354122533,
                        "z": 3290120.167669924
                    },
                    {
                        "name": "direction",
                        "x": 0.2947832384593607,
                        "y": 0.19010564717943956,
                        "z": -0.9364628584380154
                    },
                    {
                        "name": "up",
                        "x": -0.3506891517221309,
                        "y": 0.9331503028238961,
                        "z": 0.07904195850359014
                    },
                    {
                        "name": "right",
                        "x": 3.55271191725529,
                        "y": -0.5001288515567719,
                        "z": 6.281832655417258
                    }
                ],
                "cameraUse": {
                    "1": {
                        "x": 3.55271191725529,
                        "y": -0.5001288515567719,
                        "z": 6.281832655417258
                    }
                }
            },
            {
                "createDate": "2022-07-03 15:06:51",
                "guid": 2,
                "name": "侧面",
                "camera": [
                    {
                        "name": "position",
                        "x": -2860192.1590962117,
                        "y": 4648348.298639654,
                        "z": 3289536.0281834453
                    },
                    {
                        "name": "direction",
                        "x": -0.09421790120843149,
                        "y": -0.7694742325961886,
                        "z": 0.631690107934567
                    },
                    {
                        "name": "up",
                        "x": -0.47594888486792936,
                        "y": 0.592118864664766,
                        "z": 0.6502829454176722
                    },
                    {
                        "name": "right",
                        "x": 0.5149559225380482,
                        "y": -0.19154098851179535,
                        "z": 0.0014928513612790795
                    }
                ],
                "cameraUse": {
                    "2": {
                        "x": 0.5149559225380482,
                        "y": -0.19154098851179535,
                        "z": 0.0014928513612790795
                    }
                }
            },
            {
                "createDate": "2022-07-05 15:07:28",
                "guid": 3,
                "name": "门口",
                "camera": [
                    {
                        "name": "position",
                        "x": -2860232.48757479,
                        "y": 4648003.604541197,
                        "z": 3289812.1003417834
                    },
                    {
                        "name": "direction",
                        "x": 0.7982267854889015,
                        "y": 0.5728173909030784,
                        "z": -0.1863175665551836
                    },
                    {
                        "name": "up",
                        "x": -0.41986558609838315,
                        "y": 0.7508974833696297,
                        "z": 0.5097703983946282
                    },
                    {
                        "name": "right",
                        "x": 4.515643893101931,
                        "y": -0.03724883677001589,
                        "z": 6.280266325819543
                    }
                ],
                "cameraUse": {
                    "3": {
                        "x": 4.515643893101931,
                        "y": -0.03724883677001589,
                        "z": 6.280266325819543
                    }
                }
            },
            {
                "createDate": "2022-07-05 15:08:36",
                "guid": 4,
                "name": "鸟瞰",
                "camera": [
                    {
                        "name": "position",
                        "x": -2860497.2597352625,
                        "y": 4648447.425231509,
                        "z": 3290077.3903143983
                    },
                    {
                        "name": "direction",
                        "x": 0.4451647192229298,
                        "y": -0.7263594806702818,
                        "z": -0.5236700083063464
                    },
                    {
                        "name": "up",
                        "x": -0.419364417040824,
                        "y": 0.3475988406619264,
                        "z": -0.8386349215782126
                    },
                    {
                        "name": "right",
                        "x": 2.9656975736031534,
                        "y": -1.5648814800150528,
                        "z": 0
                    }
                ],
                "cameraUse": {
                    "4": {
                        "x": 2.9656975736031534,
                        "y": -1.5648814800150528,
                        "z": 0
                    }
                }
            },
            {
                "createDate": "2020-12-23 15:08:43",
                "guid": 5,
                "name": "水面",
                "camera": [
                    {
                        "name": "position",
                        "x": -2860296.457439772,
                        "y": 4648051.177703553,
                        "z": 3289866.3079465386
                    },
                    {
                        "name": "direction",
                        "x": 0.43362494288891934,
                        "y": -0.7190519770470459,
                        "z": -0.5430779531607925
                    },
                    {
                        "name": "up",
                        "x": -0.4751825524551617,
                        "y": 0.32960463725885003,
                        "z": -0.8158200322005212
                    },
                    {
                        "name": "right",
                        "x": 2.9074042219801437,
                        "y": -1.541154343648293,
                        "z": 0
                    }
                ],
                "cameraUse": {
                    "5": {
                        "x": 2.9074042219801437,
                        "y": -1.541154343648293,
                        "z": 0
                    }
                }
            }
            ],
            viewPointName:'',
        })
        //返回按钮
        const onClickLeft = () => history.back();
        //添加单元格
        function addViewPoint() {   
            console.log('add');
            Dialog.confirm({
                title: '添加视点',
                message:
                    '如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
                })
                .then(() => {
                    // on confirm
                })
                .catch(() => {
                    // on cancel
                });
        }
        //点击单元格
        function onClick(data) {
            history.back();
            store.commit('FLYTOPOINT',data)
            console.log('click');

        }
        //删除单元格
        function deleteHandler(name) {
            state.viewPointArray= state.viewPointArray.filter(viewPoint=> viewPoint.name!==name)
        }
        return {
            state,onClickLeft,addViewPoint,onClick,deleteHandler
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