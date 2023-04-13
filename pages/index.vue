

<template>
  <el-card>
    <div class="flex gap-4 mb-4">
      <el-input v-model="newIngredient" class="max-w-md"/>
      <el-button type="primary" @click.prevent="addIngredient">Додати</el-button>
    </div>
    <div>
    <p v-for="ingredient in ingredients" :key="ingredient.id" class="text-lg flex items-center gap-2">
      {{ ingredient.name }}
    </p>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus';


definePageMeta({
  pageLabel: 'Інградієнти',
  navOrder: 1
})

const client = useSupabaseClient()
const newIngredient = ref('')
const ingredients = ref([])
async function addIngredient(){
  try{
    const {error} = await client.from('ingredients').insert({name:newIngredient.value})
    console.log(error)
    if(error){
      ElNotification({message: error.message, type: 'error'})  
    }
  }
  catch (e){
    ElNotification({message:`${e}`,type:'error',duration:1000})
  }
  finally{
    init()
  }
}
onMounted(init)

async function init() {
  const {data} = await client.from('ingredients').select('*')
  ingredients.value = data
}

</script>