import { parseLectureCode, parseLecturePlace } from './lectureParser';
import { type Lecture, LectureSchema } from './schema';
import { fetchContent, parseHTML } from './util';

type FetchLectureDetailError = {
  type: 'error';
  cause: 'fetch' | 'parse';
};

export const fetchLectureDetail = async (
  url: string,
): Promise<
  | { success: true; data: Lecture }
  | { success: false; error: FetchLectureDetailError }
> => {
  const html = await fetchContent(url);
  if (html === null) {
    return {
      success: false,
      error: { type: 'error', cause: 'fetch' },
    };
  }

  try {
    const document = parseHTML(html);

    const rawTitle = document.querySelector('.page-title-area > h3')?.innerHTML;
    if (!rawTitle) throw new Error(`Failed to get title`);
    const title = rawTitle
      .split('　')
      .slice(1)
      .join('　')
      .split('&nbsp;&nbsp;&nbsp;')[0];

    const details = document.querySelectorAll('.gaiyo-data dl');

    const origin = details.item(0).querySelector('dd')?.innerHTML.trim();

    const teachers = [...details.item(1).querySelectorAll('dd > a')].map(
      (el) => ({
        name: el.innerHTML.trim(),
        url: el.getAttribute('href') ?? '',
      }),
    );

    const rawPlace = details.item(4).querySelector('dd')?.innerHTML.trim();
    if (!rawPlace) throw new Error('Failed to get place');
    const place = parseLecturePlace(rawPlace);

    const rawLectureClass = details.item(5).querySelector('dd')?.innerHTML;
    const lectureClass = rawLectureClass === '-' ? null : rawLectureClass;

    const rawCode = details.item(6).querySelector('dd')?.innerHTML;
    if (!rawCode) throw new Error('Failed to get code');
    const code = parseLectureCode(rawCode);

    const rawCredit = details.item(7).querySelector('dd')?.innerHTML;
    if (!rawCredit) throw new Error('Failed to get credit');
    const credit = parseInt(rawCredit, 10);

    const year = details.item(8).querySelector('dd')?.innerHTML.trim();
    const quarter = details.item(9).querySelector('dd')?.innerHTML.trim();
    const language = details.item(12).querySelector('dd')?.innerHTML.trim();

    const rawLecture = {
      url,
      title,
      origin,
      class: lectureClass,
      teachers,
      place,
      code,
      credit,
      year,
      quarter,
      language,
    };

    const result = LectureSchema.safeParse(rawLecture);

    if (!result.success) {
      throw new Error(
        `error parsing lecture detail\n\n${JSON.stringify(rawLecture)}`,
      );
    }

    const lecture = result.data;

    return { success: true, data: lecture };
  } catch (error) {
    console.error(`Failed to parse lecture detail: ${url}`);
    console.error(error);

    return {
      success: false,
      error: { type: 'error', cause: 'parse' },
    };
  }
};
