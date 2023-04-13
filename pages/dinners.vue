<template>
  <div>
  <el-card class="mb-4">
    <div v-for="dinner in dinners" :key="dinner.id">
      <div class="flex gap-4 max-w-lg items-center">
      <el-select :model-value="dishes.find(d => d.id === dinner.dishId).name" 
          class="m-2"
          size="large" 
          @update:model-value="(event) => updateDishValue(event,dinner.id)">
          <el-option
            v-for="dish in dishes.filter(d => d.id !== dinner.dishId)"
            :key="dish.id"
            :label="dish.name"
            :value="dish.id"
          />
      </el-select>
      <el-input :model-value="dinner.amount" @update:model-value="event => updateDishAmount(event,dinner.id)"/>
      <IconClose class="h-4 w-4 text-primary hover:cursor-pointer" @click="deleteDish(dinner.id)"/>
    </div>
    </div>
    <div class="flex justify-end">
      <el-button @click="isDialogOpened = true">Додати страву</el-button>
    </div>
    <el-dialog v-model="isDialogOpened">
    <template #header>
      <h3 class="text-center">
      Додати страву
      </h3>
    </template>
    <div>
      <el-select v-model="newDish.dish" class="m-2" placeholder="Блюдо" size="large">
          <el-option
            v-for="dish in dishes"
            :key="dish.id"
            :label="dish.name"
            :value="dish.id"
          />
      </el-select>
      <el-input v-model="newDish.amount" placeholder="Кількість людей"/>
        <el-button @click.prevent="addDish">Додати</el-button>
      </div>
  </el-dialog>
  </el-card>
  <el-card>
    <div v-for="ingredient in ingredients" :key="ingredient.id">
      <p>{{ ingredient.name }} {{ count[ingredient.id] || 0 }}</p>
      
    </div>
  </el-card>
  </div>
</template>

<script setup>

definePageMeta({
  pageLabel: 'Меню',
})

const dinners = ref([])
const dishes = ref([])
const ingredients = ref([])
const isDialogOpened = ref(false)
const newDish = ref({dish:'',amount:''})
const client = useSupabaseClient()
async function updateDishAmount(value,dinnerId){
  await client.from('dinners').update({...dinners.value.find(d => dinnerId === d.id),amount:parseInt(value)}).eq('id',dinnerId)
  await init()
}
async function init(){
  const [dishesData,dinnersData,ingredientsData] = await Promise.all([client.from('dishes').select('*'), client.from('dinners').select('*'),client.from('ingredients').select('*')])

  dinners.value = dinnersData.data
  dishes.value = dishesData.data
  ingredients.value = ingredientsData.data
  let ingredientsAmount = {}

}

async function deleteDish(id){
  await client.from('dinners').delete().eq('id',id)
  await init()
}

async function updateDishValue(dishId,dinnerId) {
  await client.from('dinners').update({...dinners.value.find(d => dinnerId === d.id),dishId}).eq('id',dinnerId)
  await init()
}

async function addDish(){
  await client.from('dinners').insert({dishId:newDish.value.dish,amount:parseInt(newDish.value.amount)})
  isDialogOpened.value = false
  await init()
}

const count = computed(()=>{
  const ingredientsAmount = {}
   dinners.value.forEach(d => {
    Object.keys(dishes.value.find(dish => `${dish.id}` === `${d.dishId}`).ingredients)
    .map(ing => {ingredientsAmount[ing] = (ingredientsAmount[ing] || 0) + d.amount * dishes.value.find(dish => `${dish.id}` === `${d.dishId}`).ingredients[ing]
  })
  })
  return ingredientsAmount
})

onMounted(init)
</script>