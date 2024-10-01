import { cache } from './cache';
import { fetchLectureDetail } from './fetchLectureDetail';
import { fetchLectureList } from './fetchLectureList';
import type { Lecture } from './schema';
import { Parallels } from './util';

const lectureListPageUrls = [
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=1&lang=JA',
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=2&lang=JA',
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=3&lang=JA',
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=4&lang=JA',
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=5&lang=JA',
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=6&lang=JA',
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=7&lang=JA',
  'http://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=10&lang=JA',
];

const getLectureUrls = async (): Promise<string[]> => {
  const fetchingLectureUrls = lectureListPageUrls.map(fetchLectureList);
  const lectureUrls = (await Promise.all(fetchingLectureUrls)).flat();

  return lectureUrls;
};

const getLectureDetails = async (
  urls: string[],
): Promise<{ lectures: Lecture[]; fetchFailedUrls: string[] }> => {
  const lectures: Lecture[] = [];
  const fetchFailedUrls: string[] = [];

  const tryFetch = async (url: string) => {
    const result = await fetchLectureDetail(url);
    if (!result.success) {
      if (result.error.cause === 'fetch') {
        fetchFailedUrls.push(url);
      }
      return;
    }
    lectures.push(result.data);
  };

  const ps = Parallels();
  for (let i = 0; i < urls.length; i++) {
    ps.add(tryFetch(urls[i]));
    await ps.wait(5);
    if (i % 100 === 0) await Bun.sleep(100);
  }

  return { lectures, fetchFailedUrls };
};

const lectureUrlsFile = Bun.file('scraper/assets/lecture-urls.json');
const lecturesFile = Bun.file('scraper/assets/lectures.json');

const getCurrentUrls = async () => {
  if (!(await lectureUrlsFile.exists())) return [];
  if (!(await lecturesFile.exists())) return [];
  return (await lecturesFile.json()) as Lecture[];
};

const getScrapingUrls = async (urls: string[]) => {
  const prev = await getCurrentUrls();
  const prevUrlSet = new Set(prev.map((l: Lecture) => l.url));
  const newUrls = urls.filter((url) => !prevUrlSet.has(url));
  return newUrls;
};

export const scrape = async () => {
  const { result: lectureUrls } = await cache(getLectureUrls, lectureUrlsFile);

  const uniqueLectureUrls = [...new Set(lectureUrls)];
  const scrapingUrls = await getScrapingUrls(uniqueLectureUrls);

  const lectures = await (async () => {
    if (scrapingUrls.length === 0) {
      return await getCurrentUrls();
    }

    const result = await getLectureDetails(scrapingUrls);

    if (result.fetchFailedUrls.length > 0) {
      const newFetchingUrls = lectureUrls.filter(
        (url) => !result.fetchFailedUrls.includes(url),
      );
      Bun.write(lectureUrlsFile, JSON.stringify(newFetchingUrls));
    }

    const lectures = [...(await getCurrentUrls()), ...result.lectures];
    await Bun.write(lecturesFile, JSON.stringify(lectures));

    return lectures;
  })();
};

await scrape();
