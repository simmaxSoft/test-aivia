<template>
  {{ state }}
</template>

<script lang="ts" setup>
definePageMeta({
  pageLabel: 'Home',
  navOrder: 1
})

const { state } = useGeneralStore()

</script>
