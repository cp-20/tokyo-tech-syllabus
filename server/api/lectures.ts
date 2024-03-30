import { and, eq, inArray, like, sql } from 'drizzle-orm';
import { getDB, tables } from '~/database';
import {
  Grade,
  Quarter,
  validateQuery,
  expandPeriodQuery,
  limitSchema,
  offsetSchema,
} from '~/schema/searchQuery';

const queryByCodeGrade = (codeGrades: Grade[]) =>
  inArray(tables.lectures.codeGrade, codeGrades);
const queryByCode = (code: string) => eq(tables.lectures.codeGrade, code);
const queryByQuarter = (quarters: Quarter[]) =>
  inArray(tables.lectures.quarter, quarters);

const andOrNothing = (
  conditions: (Parameters<typeof and>[0] | undefined | '')[]
) => and(...(conditions.filter((x) => x) as Parameters<typeof and>));

export default defineEventHandler(async (event) => {
  const rawQuery = getQuery(event);

  const parsedQuery = validateQuery(rawQuery?.query ?? '{}');
  const parsedLimit = limitSchema.safeParse(Number(rawQuery?.limit ?? 20));
  const parsedOffset = offsetSchema.safeParse(Number(rawQuery?.offset ?? 0));

  if (!parsedQuery.success || !parsedLimit.success || !parsedOffset.success) {
    return setResponseStatus(event, 400);
  }

  try {
    const query = parsedQuery.data;
    const limit = parsedLimit.data;
    const offset = parsedOffset.data;
    const db = getDB(event.context.cloudflare.env.DB);

    let lecturesQuery = db
      .select({
        id: tables.lectures.id,
        title: tables.lectures.title,
        url: tables.lectures.url,
        origin: tables.lectures.origin,
        codeGrade: tables.lectures.codeGrade,
        codeValue: tables.lectures.codeValue,
        language: tables.lectures.language,
        credit: tables.lectures.credit,
        quarter: tables.lectures.quarter,
      })
      .from(tables.lectures)
      .limit(limit + 1)
      .offset(offset);

    const conditions = [
      query.code && queryByCode(query.code),
      query.codeGrades && queryByCodeGrade(query.codeGrades),
      query.quarters && queryByQuarter(query.quarters),
    ];

    if (query.title) {
      lecturesQuery = lecturesQuery.innerJoin(
        sql`lecture_titles`,
        eq(tables.lectures.id, sql`lecture_titles.id`)
      );
      const spacedTitle = query.title.split('').join(' ');
      conditions.push(sql`lecture_titles.title MATCH ${`"${spacedTitle}"`}`);
    }

    if (query.periods && query.periods.length > 0) {
      lecturesQuery = lecturesQuery.innerJoin(
        tables.lecturePeriods,
        eq(tables.lectures.id, tables.lecturePeriods.lectureId)
      );
      conditions.push(
        inArray(tables.lecturePeriods.period, expandPeriodQuery(query.periods))
      );
    }

    if (query.teacher) {
      lecturesQuery = lecturesQuery
        .innerJoin(
          tables.teacherAssignment,
          eq(tables.lectures.id, tables.teacherAssignment.lectureId)
        )
        .innerJoin(
          sql`teacher_names`,
          eq(tables.teacherAssignment.teacherId, sql`teacher_names.id`)
        );
      const spacedTeacher = query.teacher.split('').join(' ');
      conditions.push(sql`teachers.name MATCH ${`"${spacedTeacher}"`}`);
    }

    const enhancedLecturesQuery = lecturesQuery.where(andOrNothing(conditions));

    const lectures = await enhancedLecturesQuery;

    const lectureIds = lectures.map((lecture) => lecture.id);

    if (lectureIds.length === 0) {
      return { lectures: [], finished: true };
    }

    const periods = await db
      .select({
        id: tables.lecturePeriods.lectureId,
        periods: tables.lecturePeriods.period,
      })
      .from(tables.lecturePeriods)
      .where(inArray(tables.lecturePeriods.lectureId, lectureIds));

    const teachers = await db
      .select({
        id: tables.teacherAssignment.lectureId,
        name: tables.teachers.name,
        url: tables.teachers.url,
      })
      .from(tables.teachers)
      .where(inArray(tables.teacherAssignment.lectureId, lectureIds))
      .leftJoin(
        tables.teacherAssignment,
        eq(tables.teachers.id, tables.teacherAssignment.teacherId)
      );

    const enhancedLectures = lectures.map((lecture) => ({
      ...lecture,
      periods: periods
        .filter((period) => period.id === lecture.id)
        .map((period) => period.periods),
      teachers: teachers
        .filter((teacher) => teacher.id === lecture.id)
        .map((teacher) => ({
          name: teacher.name,
          url: teacher.url,
        })),
    }));
    return {
      lectures: enhancedLectures.slice(0, limit),
      finished: enhancedLectures.length <= limit,
    };
  } catch (err) {
    console.error(err);
    return setResponseStatus(event, 500);
  }
});
