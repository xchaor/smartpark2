import { onMounted,onBeforeUnmount } from 'vue'
export default function () {
    const navBtn=document.querySelector(".main_nav_buttons")
    onMounted(() => {
        navBtn.style.display="none"
    })
    onBeforeUnmount(() => {
        navBtn.style.display="block"
    })
}