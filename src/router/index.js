import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path:'/home',
    component:()=>import('@/views/Home'),
    name:'Home' 
  },
  {
    path:'/operation',
    component:()=>import('@/views/Operation'),
    name:'Operation'
  },
  {
    path:'/cameras',
    component:()=>import('@/views/Cameras'),
    name:'Cameras'
  },
  {
    path:'/personel',
    component:()=>import('@/views/Personel'),
    name:'Personel'
  },
  {
    path:'/',
    children:[
      //基础功能
      {
        path:'/viewMarker',
        component:()=>import('@/views/BasicFeature/ViewMarker'),
        name:'ViewMarker'
      },
      {
        path:'/attributeQuery',
        component:()=>import('@/views/BasicFeature/AttributeQuery'),
        name:'AttributeQuery'
      },
      {
        path:'/mapMeasure',
        component:()=>import('@/views/BasicFeature/MapMeasure'),
        name:'MapMeasure'
      },
      {
        path:'/routeTravel',
        component:()=>import('@/views/BasicFeature/RouteTravel'),
        name:'RouteTravel',
        children:[
          {
            path:'routeList',
            component:()=>import('@/views/BasicFeature/RouteTravel/RouteList'),
            name:'RouteList'
          },
          {
            path:'addRoute',
            component:()=>import('@/views/BasicFeature/RouteTravel/AddRoute'),
            name:'AddRoute'
          },
        ]
      },
      {
        path:'/visibilityAnalysis',
        component:()=>import('@/views/BasicFeature/VisibilityAnalysis'),
        name:'VisibilityAnalysis'
      },
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
