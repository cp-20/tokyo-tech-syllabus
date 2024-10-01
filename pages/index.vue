<script lang="ts" setup>
import { ref } from 'vue';
import type { SearchQuery } from '../schema/searchQuery';

const searchQuery = ref<SearchQuery>({});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="mb-8 mt-8">

      <h1 class="text-3xl font-bold m-0">東工大シラバス</h1>
      <p class="text-slate-400 m-0 mt-2">東工大の講義を爆速で検索できるサイト</p>
      <p class="text-slate-600">このサイト上の全ての情報は <CustomLink href="https://www.ocw.titech.ac.jp/">TOKYO TECH OCW
        </CustomLink> から提供されており
        <CustomLink href="https://creativecommons.org/licenses/by-nc-sa/2.1/jp/deed.ja">CC-BY-NC-SA 2.1 JP
          DEED</CustomLink> の元で自由に利用可能です
      </p>
    </div>
    <SearchOptions v-model="searchQuery" />
    <LectureList :query="searchQuery" />
  </div>
</template>


<style scoped></style>