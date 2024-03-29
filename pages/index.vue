<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { SearchQuery } from '../schema/searchQuery';

const searchQuery = ref<SearchQuery>({});

watch(searchQuery, (newVal) => {
  console.log(newVal);
});

</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-8 mt-8">

      <h1 class="text-3xl font-bold m-0">東工大シラバス</h1>
      <p class="text-slate-400 m-0 mt-2">TOKYO TECH OCWを爆速にしたシラバスです</p>
    </div>
    <SearchOptions v-model="searchQuery" />
    <LectureList :query="searchQuery" />
  </div>
</template>


<style scoped></style>