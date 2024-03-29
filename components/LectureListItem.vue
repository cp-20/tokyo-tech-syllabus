<script lang="ts" setup>
const periodsFormatter = (periods: string[]) => {
  for (let i = 1; i < periods.length; i++) {
    const period = periods[i];
    const prev = periods[i - 1];
    if (parseInt(period.slice(1)) - parseInt(prev.slice(1)) === 1) {
      periods[i - 1] = `${prev}-${period.slice(1)}`;
      periods.splice(i, 1);
      i--;
    }
  }
  return periods;
}

const props = defineProps<{ lecture: Lecture }>();

const emit = defineEmits<{
  (e: 'openDialog', lecture: Lecture): void;
}>();
</script>

<template>
  <div class="border border-solid border-slate-200 p-4 rounded-md">
    <div class="flex gap-2 items-center flex-wrap">
      <CustomLink :href="lecture.url" target="_blank" rel="noopener noreferrer" class="text-lg font-bold">
        {{ lecture.title }}
      </CustomLink>
      <span class="text-sm text-slate-600">({{ lecture.origin }})</span>
      <Button class="w-8 h-8 ml-auto" severity="secondary" icon="pi" aria-label="詳しい情報を見る"
        @click="emit('openDialog', lecture)">
        <InfoIcon class="w-4 h-4"></InfoIcon>
      </Button>
    </div>
    <div class="text-sm flex gap-1 flex-wrap text-slate-600 mt-1">
      <template v-for="(teacher, i) in lecture.teachers">
        <CustomLink target="_blank" rel="noopener noreferrer" :href="teacher.url">
          {{ teacher.name }}
        </CustomLink>
        <span v-if="i < lecture.teachers.length - 1">/</span>
      </template>
    </div>
    <div class="flex gap-2 flex-wrap mt-3">
      <Chip class="text-xs font-bold bg-orange-100 text-orange-500" :label="`${lecture.codeGrade}番台`" />
      <Chip class="text-xs font-bold bg-blue-100 text-blue-500" :label="`${lecture.credit}単位`" />
      <Chip class="text-xs font-bold bg-cyan-100 text-cyan-500" :label="lecture.quarter" />
      <Chip class="text-xs font-bold bg-rose-100 text-rose-400" v-for="period in periodsFormatter(lecture.periods)"
        :label="period" />
    </div>

  </div>
</template>