export default defineNuxtRouteMiddleware(async (to) => {
  const { isLogin } = useGeneralStore()
  const { $routeNames } = useNuxtApp()

  if(!isLogin.value){
    return navigateTo({name:$routeNames.index})
  } 
  return 
})