import type { SearchQuery } from '~/schema/searchQuery';

export type Lecture = {
  periods: string[];
  teachers: {
    name: string;
    url: string;
  }[];
  id: number;
  title: string;
  url: string;
  origin: string;
  codeGrade: string;
  codeValue: string;
  language: string;
  credit: number;
  quarter: string;
};

const fetchLectures = (query: string, limit: number, offset: number) =>
  $fetch('/api/lectures', { query: { query, limit, offset } });

export const useLectureList = (query: Ref<SearchQuery>) => {
  const lectures = ref<Lecture[]>([]);
  const finished = ref(false);
  const error = ref(false);
  const loading = ref(false);

  watch(
    query,
    async (newQuery) => {
      const queryString = JSON.stringify(newQuery);

      loading.value = true;
      try {
        const result = await fetchLectures(queryString, 20, 0);
        lectures.value = result.lectures;
        finished.value = result.finished;
        error.value = false;
      } catch (err) {
        error.value = true;
      } finally {
        loading.value = false;
      }
    },
    { immediate: true },
  );

  const loadNext = async () => {
    const queryString = JSON.stringify(query.value);
    if (finished.value || loading.value) return;

    const result = await fetchLectures(queryString, 20, lectures.value.length);

    lectures.value.push(...result.lectures);
    finished.value = result.finished;
  };

  return { lectures, finished, loading, error, loadNext };
};
