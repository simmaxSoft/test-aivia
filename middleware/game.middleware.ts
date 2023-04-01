export default defineNuxtRouteMiddleware(async (to) => {
  const { isLogin } = useGeneralStore()
  const { $routeNames } = useNuxtApp()
  console.log(isLogin.value)

  if(!isLogin.value){
    return navigateTo({name:$routeNames.index})
  } 
  return 
})