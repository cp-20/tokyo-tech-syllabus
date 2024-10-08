<script lang="ts" setup>
import {
  grades,
  type Grade,
  type SearchQuery,
  quarters,
  type Quarter,
  type Period,
} from '~/schema/searchQuery';
import InputText from 'primevue/inputtext';

const days = ['月', '火', '水', '木', '金', '土', '日'];
const periods = ['1-2', '3-4', '5-6', '7-8', '9-10', '11-12'];
const origins = ref([
  '数学系',
  '生命理工学コース',
  '物理学系',
  '電気電子コース',
  '材料コース',
  '数学コース',
  '応用化学コース',
  '物理学コース',
  '化学系',
  '機械コース',
  '地球環境共創コース',
  '原子核工学コース',
  '地球惑星科学系',
  '知能情報コース',
  '化学コース',
  '理学院',
  '地球惑星科学コース',
  'エネルギーコース',
  '地球生命コース',
  '経営工学系',
  '技術経営専門職学位課程',
  'ライフエンジニアリングコース',
  '経営工学コース',
  '情報通信コース',
  'システム制御コース',
  '情報通信系',
  '社会・人間科学コース',
  'エンジニアリングデザインコース',
  '工学院，物質理工学院，環境・社会理工学院共通科目',
  '機械系',
  '電気電子系',
  'システム制御系',
  '融合理工学系',
  '数理・計算科学コース',
  '工学院',
  '材料系',
  '応用化学系',
  '物質理工学院',
  '数理・計算科学系',
  '情報工学系',
  '情報工学コース',
  '情報理工学院',
  '生命理工学系',
  '生命理工学院',
  '土木・環境工学系',
  '建築学系',
  '建築学コース',
  '都市・環境学コース',
  '土木工学コース',
  '環境・社会理工学院',
  'イノベーション科学コース',
  '文系教養科目',
  'データサイエンス・AI全学教育機構',
  'アントレプレナーシップ科目',
  '理工系教養科目',
  '日本語・日本文化科目',
  '広域教養科目',
  '教職科目',
  '英語科目',
  'リーダーシップ教育課程',
  '第二外国語科目',
]);

const props = defineProps<{
  modelValue: SearchQuery;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: SearchQuery): void;
}>();

const lectureTitle = ref<string>(props.modelValue?.title ?? '');
const setTitle = debounce((newVal: string, query: SearchQuery) => {
  emit('update:modelValue', { ...query, title: newVal || undefined });
}, 500);
watch(lectureTitle, (newVal) => setTitle(newVal, props.modelValue));

const teacherName = ref<string>(props.modelValue?.teacher ?? '');
const setTeacher = debounce((newVal: string, query: SearchQuery) => {
  emit('update:modelValue', { ...query, teacher: newVal || undefined });
}, 500);
watch(teacherName, (newVal) => setTeacher(newVal, props.modelValue));

const origin = ref<string>(props.modelValue?.origin ?? '');
const setOrigin = debounce((newVal: string, query: SearchQuery) => {
  emit('update:modelValue', { ...query, origin: newVal || undefined });
}, 500);
watch(origin, (newVal) => setOrigin(newVal, props.modelValue));
const searchWithOrigin = (e: { query: string }) => {
  origins.value = origins.value.filter((origin) => origin.includes(e.query));
  emit('update:modelValue', {
    ...props.modelValue,
    origin: e.query || undefined,
  });
};

const selectedGrades = ref<string[]>(props.modelValue?.codeGrades ?? []);
watch(selectedGrades, (newVal) => {
  const newCodeGrade = newVal.length > 0 ? (newVal as Grade[]) : undefined;
  emit('update:modelValue', { ...props.modelValue, codeGrades: newCodeGrade });
});

const selectedQuarters = ref<string[]>(props.modelValue?.quarters ?? []);
watch(selectedQuarters, (newVal) => {
  const newQuarters = newVal.length > 0 ? (newVal as Quarter[]) : undefined;
  emit('update:modelValue', { ...props.modelValue, quarters: newQuarters });
});

const selectedPeriods = ref<string[]>(props.modelValue?.periods ?? []);
watch(selectedPeriods, (newVal) => {
  const newPeriods = newVal.length > 0 ? (newVal as Period[]) : undefined;
  emit('update:modelValue', { ...props.modelValue, periods: newPeriods });
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid sm:grid-cols-2 gap-4 grid-cols-1">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-bold" for="lecture-title">講義名</label>
        <InputText id="lecture-title" type="text" v-model="lectureTitle" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-bold" for="teacher-name">教員名</label>
        <InputText id="teacher-name" type="text" v-model="teacherName" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-bold" for="origin">開講元</label>
        <AutoComplete id="origin" v-model="origin" :suggestions="origins" @complete="searchWithOrigin" class="w-full"
          dropdown :pt="{ input: { class: 'w-full' } }" />
      </div>

      <div>

      </div>
      <div class="flex">
        <div class="flex flex-col gap-1 flex-1 flex-grow-[2]">
          <label for="code-grade" class="text-sm font-bold">科目コード (番台)</label>
          <div id="code-grade">
            <div v-for="grade in grades" class="flex gap-1 items-center h-6">
              <Checkbox v-model="selectedGrades" :input-id="`grade-${grade}`" :value="grade" name="code-grade-input" />
              <label :for="`grade-${grade}`">{{ grade }}番台</label>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1 flex-1">
          <label for="quarters" class="text-sm font-bold">クォーター</label>
          <div id="quarters">
            <div v-for="quarter in quarters" class="flex gap-1 items-center h-6">
              <Checkbox v-model="selectedQuarters" :input-id="`quarter-${quarter}`" :value="quarter"
                name="quarter-input" />
              <label :for="`quarter-${quarter}`">{{ quarter }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label for="quarters" class="text-sm font-bold">曜日・時限</label>
        <div class="grid period-table">
          <div></div>
          <div v-for="day in days" class="text-center">
            {{ day }}
          </div>
          <template v-for="period in periods">
            <div class="text-right">{{ period }}限</div>
            <div v-for="day in days" class="inline-flex justify-center">
              <Checkbox v-model="selectedPeriods" :input-id="`period-${day}${period}`" :value="`${day}${period}`"
                name="period-input" />
            </div>
          </template>
        </div>
      </div>

    </div>

    <div class="flex gap-4 flex-wrap">

    </div>
  </div>
</template>

<style scoped>
.period-table {
  width: 340px;
  grid-template-columns: 1fr repeat(7, 2rem);
  gap: 0.5rem;
}

@media screen and (max-width: 768px) {
  .period-table {
    width: 260px;
    grid-template-columns: 1fr repeat(7, 1.5rem);
    gap: 0.25rem;
  }
}
</style>