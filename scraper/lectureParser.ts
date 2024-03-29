import type { Lecture, LecturePeriod, LecturePlace } from './schema';

export const parseLectureCode = (code: string): Lecture['code'] => {
  return {
    grade: parseInt(code.substring(5, 6) + '00', 10),
    value: code,
  };
};

export const parseLecturePlace = (place: string): LecturePlace => {
  const formattedPlace = place
    .replace(/&nbsp;/g, ' ')
    .replace(/,,/g, ',')
    .trim();

  if (formattedPlace.search('集中講義等') > -1) {
    return { type: 'intensive' };
  }

  if (formattedPlace === '講究等') {
    return { type: 'research' };
  }

  if (formattedPlace === 'インターンシップ') {
    return { type: 'internship' };
  }

  if (formattedPlace === '未定') {
    return { type: 'TBD' };
  }

  if (['', '-'].includes(formattedPlace)) {
    return { type: 'null' };
  }

  if (
    formattedPlace.search(/(月|火|水|木|金|土)(\d\d?)-(\d\d?)(?:\((.+)\))?/) ===
    -1
  ) {
    return {
      type: 'raw',
      value: formattedPlace,
    };
  }

  const places = formattedPlace.split('  ');

  try {
    const periods = places
      .map((place) => {
        const match = place.match(
          /(月|火|水|木|金|土)(\d\d?)-(\d\d?)(?:\((.+)\))?/
        );
        if (match === null) return null;

        const periodStart = parseInt(match[2], 10);
        const periodEnd = parseInt(match[3], 10);

        const rawPeriods = new Array(periodEnd - periodStart + 1)
          .fill(0)
          .map((_, i) => `${match[1]}${i + periodStart}`);
        const classroom = match[4] ?? null;

        return rawPeriods.map((period) => ({
          period: period as LecturePeriod['period'],
          classroom,
        }));
      })
      .filter(Boolean)
      .flat() as LecturePeriod[];

    return {
      type: 'normal',
      periods,
    };
  } catch (err) {
    console.error(err);

    return {
      type: 'raw',
      value: formattedPlace,
    };
  }
};
