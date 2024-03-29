import { tables, type Database } from '../database';
import type { Lecture } from '../scraper/schema';
import { chunkArray } from '../utils/chunkArray';
import { enumerate } from '../utils/enumerate';

const teachers = new Map<[string, string], number>();

const insertLecture = async (db: Database, lecture: Lecture) => {
  const insertedLectures = await db
    .insert(tables.lectures)
    .values({
      url: lecture.url,
      title: lecture.title,
      origin: lecture.origin,
      placeType: lecture.place.type,
      placeValue: lecture.place.type === 'raw' ? lecture.place.value : null,
      codeGrade: `${lecture.code.grade}`,
      codeValue: lecture.code.value,
      credit: lecture.credit as number,
      year: lecture.year,
      quarter: lecture.quarter,
      language: lecture.language,
    })
    .returning({ id: tables.lectures.id })
    .onConflictDoNothing();

  if (insertedLectures.length === 0) return;
  const lectureId = insertedLectures[0].id;

  const teacherIdPromises = lecture.teachers.map(async (teacher) => {
    const key: [string, string] = [teacher.name, teacher.url];
    const teacherId = teachers.get(key);
    if (teacherId) return teacherId;

    const [{ id: newTeacherId }] = await db
      .insert(tables.teachers)
      .values({
        name: teacher.name,
        url: teacher.url,
      })
      .returning({ id: tables.teachers.id });
    teachers.set(key, newTeacherId);
    return newTeacherId;
  });
  const teacherIds = await Promise.all(teacherIdPromises);

  const lecturePlaces =
    lecture.place.type === 'normal' &&
    lecture.place.periods.map((period) => ({
      lectureId,
      classroom: period.classroom,
      period: period.period,
    }));
  if (lecturePlaces && lecturePlaces.length > 0) {
    await db
      .insert(tables.lecturePeriods)
      .values(lecturePlaces)
      .onConflictDoNothing();
  }

  if (teacherIds.length > 0) {
    const teacherIdChunks = chunkArray(teacherIds, 20);
    for (const teacherIdsChunk of teacherIdChunks) {
      await db.insert(tables.teacherAssignment).values(
        teacherIdsChunk.map((teacherId) => ({
          lectureId,
          teacherId,
        }))
      );
    }
  }
};

export const registerDatabase = async (db: Database, lectures: Lecture[]) => {
  for (const [i, lecture] of enumerate(lectures)) {
    await insertLecture(db, lecture);
    // console.log(`[${i + 1}/${lectures.length}] ${lecture.title} registered`);
  }
};

export const loadTeachers = async (db: Database) => {
  const teacherRows = await db
    .select({
      id: tables.teachers.id,
      name: tables.teachers.name,
      url: tables.teachers.url,
    })
    .from(tables.teachers);
  for (const teacherRow of teacherRows) {
    teachers.set([teacherRow.name, teacherRow.url], teacherRow.id);
  }
};

export const deleteAll = async (db: Database) => {
  await db.delete(tables.teacherAssignment).run();
  await db.delete(tables.teachers).run();
  await db.delete(tables.lecturePeriods).run();
  await db.delete(tables.lectures).run();
};
