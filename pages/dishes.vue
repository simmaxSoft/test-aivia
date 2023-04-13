

<template>
  <div v-loading="loading">
  <el-card>
    <div class="flex justify-end">
      <el-button @click="openModal">Створити страву</el-button>
    </div>
    <el-collapse class="mt-4">
    <el-collapse-item v-for="dish in dishes" :key="dish.id" :title="dish.name">
      <div
        label-position="top" 
        v-for="ingredient in Object.keys(dish.ingredients)"          
        :key="ingredient"
        class="flex gap-4 items-center">
        <el-select 
          :model-value="ingredients.find(i => `${ingredient}` === `${i.id}`).name"
          @change="event => onSelectChange(event,ingredient,dish.id)"
          class="m-2"
          placeholder="Інгредієнт">
          <el-option
            v-for="item in ingredients.filter(i => !Object.keys(dish.ingredients).includes(`${i.id}`))"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input v-model="dish.ingredients[ingredient]"/>
        <IconClose class="w-4 h-4 hover:cursor-pointer" @click="deleteIngredient(dish,ingredient)"/>
      </div>

      <div class="flex justify-between items-center mt-4">
        <el-button type="primary" @click="addNewDishIngredient(dish.id)">Додати Інгредієнт</el-button>

        <el-button type="primary" @click="onDishChange(dish)">Зберегти</el-button>
      </div>
    </el-collapse-item>
  </el-collapse>
  </el-card>
  <el-dialog v-model="isDialogOpened">
    <template #header>
      <h3 class="text-center">
      Нова Страва
    </h3>
    </template>
    <div>
      <div class="flex justify-center">
        <el-input placeholder="Назва" v-model="newDishName" class="max-w-sm mx-auto"/>
      </div>
      <div v-for="(item,idx) in dishIngredients" :key="idx" class="flex gap-4 items-center mx-2">
        <el-select v-model="item.ingredient" class="m-2" placeholder="Інгредієнт" size="large">
          <el-option
            v-for="ingredient in ingredients"
            :key="ingredient.name"
            :label="ingredient.name"
            :value="ingredient.id"
          />
        </el-select>
        <el-input v-model="item.amount" placeholder="кількість грам на людину"/>
        <IconClose v-if="idx !== 0" class="h-4 w-4 hover:cursor-pointer" @click="deleteItem(idx)"/>
      </div>
      <div class="flex justify-end">
        <el-button  @click="addIngredient">Додати Інгредієнт</el-button>
      </div>
      <div class="flex justify-center">
       <el-button  @click="createDish">Створити</el-button>
      </div>
    </div>

  </el-dialog>
</div>

</template>

<script setup>
import { ElNotification } from 'element-plus';


const client = useSupabaseClient()

definePageMeta({
  pageLabel: 'Страви',
})

const newDishName = ref('')
const loading = ref(false)
const dishIngredients = ref([{ingredient:'',amount:''}])
const isDialogOpened = ref(false)
const ingredients = ref([])
const dishes = ref([])

function openModal(){
  isDialogOpened.value = true
}

function addIngredient(){
  dishIngredients.value.push({ingredient:'', amount: ''})
}

function deleteItem(idx){
  dishIngredients.value = dishIngredients.value.slice(0, idx).concat(dishIngredients.value.slice(idx + 1,dishIngredients.value.length))
}

function deleteIngredient(dish,ingredient){
  dishes.value.forEach((d) => {
    if(d.id === dish.id){
      delete d.ingredients[ingredient]
    } 
  })
}

async function init() {
  loading.value = true
  const [ingredientsRes,dishesRes] = await Promise.all([client.from('ingredients').select('*'),client.from('dishes').select('*').order('id')])
  ingredients.value = ingredientsRes.data
  dishes.value = dishesRes.data
  loading.value = false
}

function addNewDishIngredient(dishId){
  const dish = dishes.value.find(d => d.id === dishId)
  dishes.value.find(d => d.id === dishId).ingredients = {...dish.ingredients, [ingredients.value.filter(i => !Object.keys(dish.ingredients).includes(`${i.id}`))[0].id]:0} 
}

async function onDishChange(dish){
  if(Object.keys(dish.ingredients).some(k => dish.ingredients[k] === 0)){
    return ElNotification({ message:'Кільксть грам не може бути 0', type:'info' })
  }
  try{
    const {error} = await client.from('dishes').update(dish).eq('id',dish.id)
    if(error){
      return ElNotification({message:error.message,type:'error'})
    }
    ElNotification({message:'Успішно поновлено', type:'success'})
    
  }
  catch (e){

  }
  init()
}

function onSelectChange(newVal,lastVal,dishId){
  dishes.value.forEach((d) => {
    if(d.id === dishId){
      const amount = d.ingredients[lastVal]
      delete d.ingredients[lastVal]
      d.ingredients[newVal] = amount
    } 
  })
}

async function createDish(){
  if(dishIngredients.value.some(e => e.amount === '0')){
    return ElNotification({ message:'Кільксть грам не може бути 0', type:'info' })
  }
  const items = dishIngredients.value.reduce((obj,i) => ({...obj,[i.ingredient]:i.amount}), {} )
  try{
    loading.value = true
    const {error} = await client.from('dishes').insert({ name: newDishName.value, ingredients: items })
    if(error){
      ElNotification({message:error.message, type: 'error'})
    }
    isDialogOpened.value = false
    init()
  }
  catch (e) {
    ElNotification({message:e,type:'error'})
  }
  finally {
    loading.value = false
  }
}

onMounted(init)

</script>