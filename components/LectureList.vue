<script lang="ts" setup>
import type { SearchQuery } from '~/schema/searchQuery';

const props = defineProps<{ query: SearchQuery }>();
const query = computed(() => props.query);
const { lectures, finished, loading, error, loadNext } = useLectureList(query);

watch(lectures, () => {
  console.log(lectures.value.map((l => ({ title: l.title, id: l.id }))));
})

const skeletons = ref<HTMLDivElement>();

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) loadNext();
    },
    {
      root: document,
      threshold: 0,
      rootMargin: "0px",
    }
  );
  if (skeletons.value) {
    observer.observe(skeletons.value);
  }
});

const dialogVisible = ref(false);
const dialogContent = ref<Lecture | null>(null);

const openDialogHandler = (lecture: Lecture) => {
  dialogContent.value = lecture;
  dialogVisible.value = true;
};
</script>

<template>
  <div>
    <div v-if="error">
      <p class="text-red-500 font-bold">講義の取得中に何らかのエラーが発生しました</p>
    </div>
    <div class="relative pb-8">
      <div v-if="loading" class="absolute inset-0 bg-white/60 z-10"></div>
      <div v-if="lectures.length === 0 && !loading && !error">該当する講義は見つかりませんでした</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LectureListItem v-for="lecture in lectures" :key="`${lecture.id}`" :lecture="lecture"
          @open-dialog="openDialogHandler" />
      </div>
      <div v-if="!finished && !error" ref="skeletons" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Skeleton v-for="_ in new Array(20)" height="8rem" />
      </div>
    </div>
    <Dialog :class="{ 'hidden': !dialogContent }" v-model:visible="dialogVisible" modal :header="dialogContent?.title"
      class="w-[40rem] mx-4">
      <div class="flex flex-col gap-2">
        <div>
          <div class="text-sm font-bold">曜日・時限</div>
          <div>{{ dialogContent?.periods.join(' / ') }}</div>
        </div>
        <div>
          <div class="text-sm font-bold">担当教員</div>
          <div class="flex gap-1 flex-wrap">
            <template v-for="(teacher, i) in dialogContent?.teachers">
              <CustomLink target="_blank" rel="noopener noreferrer" :href="teacher.url">
                {{ teacher.name }}
              </CustomLink>
              <span v-if="i < (dialogContent?.teachers.length ?? 0) - 1">/</span>
            </template>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <div class="text-sm font-bold">開講元</div>
            <div>{{ dialogContent?.origin }}</div>
          </div>
          <div>
            <div class="text-sm font-bold">科目コード (番台)</div>
            <div>{{ dialogContent?.codeValue }} ({{ dialogContent?.codeGrade }})</div>
          </div>
          <div>
            <div class="text-sm font-bold">単位数</div>
            <div>{{ dialogContent?.credit }}単位</div>
          </div>
          <div>
            <div class="text-sm font-bold">開講クォーター</div>
            <div>{{ dialogContent?.quarter }}</div>
          </div>
          <div>
            <div class="text-sm font-bold">言語</div>
            <div>{{ dialogContent?.language }}</div>
          </div>
        </div>
        <a class="w-full px-4 py-2 grid place-content-center bg-slate-200 rounded-md no-underline text-slate-700 font-bold hover:bg-slate-300 transition-colors duration-200"
          :href="dialogContent?.url" target="_blank" rel="noopener noreferrer">シラバスページへ移動</a>
      </div>
    </Dialog>
  </div>
</template>
