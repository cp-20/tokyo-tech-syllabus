import { fetchContent, parseHTML } from './util';

export const fetchLectureList = async (url: string) => {
  const html = await fetchContent(url);
  const document = parseHTML(html);

  const lectureLinkElements = Array.from(
    document.querySelectorAll('.ranking-list tbody tr .course_title a'),
  );

  return lectureLinkElements
    .map((el) => 'http://www.ocw.titech.ac.jp' + el.getAttribute('href'))
    .filter(Boolean) as string[];
};
