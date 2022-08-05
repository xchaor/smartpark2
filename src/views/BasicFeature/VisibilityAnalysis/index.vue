<template>
    <van-nav-bar
    class="navBar"
    title="透视分析 "
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    fixed
    />
</template>

<script>
import hideNavBtn from '@/hooks/hideNavBtn'

export default {
    name:'VisibilityAnalysis',
    setup(){
         hideNavBtn()//隐藏主导航按钮
        const onClickLeft = () => history.back();
        return {
            onClickLeft
        }
    }
}
</script>

<style lang='less' scoped>

</style>