<template>
  <div class="flex h-full">
    <!-- SIDEBAR -->
    <div class="w-[300px] border-r border-gray-300 flex flex-col">
      <div class="h-20 flex items-center justify-center shrink-0 border-b border-gray-300 shadow">Logo</div>
      <div class="flex-grow p-5">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="{ name: item.name }"
          :class="[
            'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
          ]"
          active-class="bg-gray-100 text-gray-900"
        >
          {{ item.meta?.pageLabel }}
        </NuxtLink>
      </div>
    </div>

    <div class="flex-grow flex flex-col">
      <!-- HEADER -->
      <div class="shrink-0 flex items-center h-20 bg-white shadow border-b border-gray-300 px-5">
        <Compute
          #default="{ labelClass, pageLabel }"
          :labelClass="'font-bold text-lg'"
          :pageLabel="$route.meta?.pageLabel"
        >
          <slot name="header" :labelClass="labelClass" :pageLabel="pageLabel">
            <p :class="labelClass">{{ pageLabel }}</p>
          </slot>
        </Compute>
      </div>

      <!-- MAIN -->
      <main class="flex-grow p-5">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()

const navigation = router.options.routes.slice().sort((a, b) => (a.meta?.navOrder ?? 0) - (b.meta?.navOrder ?? 0))
</script>
