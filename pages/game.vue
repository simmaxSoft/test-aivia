

<template>
  <el-card class="w-full h-full">
    <div class="max-w-[200px]">
      <el-form-item label="Size x">
        <el-input v-model="sizes.x" type="number" :min="0"/>
      </el-form-item>
      <el-form-item label="Size y">
        <el-input v-model="sizes.y" type="number" :min="0"/>
      </el-form-item>
    </div>
    <div class="mb-4">
      <div class="mb-2">
          <span class="mr-2">Basic</span>
          <el-color-picker v-model="basicColor" />
      </div>
     
    </div>

    <div v-if="sizes.x && sizes.y" class="z-0 bg-black max-w-max p-4">
      <p v-for="y in parseInt(sizes.y)" :key="y" class="flex z-10">
        <p 
        v-for="x in parseInt(sizes.x)" 
        :key="x" 
        class="z-20 w-9 h-9 border-2 border-red-300 hover:cursor-pointer hover:!bg-blue-900"
        :style="{'background-color': basicColor}"
        />
      </p>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
definePageMeta({
  pageLabel: 'Game',
  navOrder: 2
})

const basicColor = ref('rgb(255,255,255)')
const sizes = reactive({ x: null, y: null })
</script>