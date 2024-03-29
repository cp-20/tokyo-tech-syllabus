import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';

import * as schema from './schema';

export type Database = DrizzleD1Database<typeof import('./schema')>;

export const getDB = (DB: D1Database): Database => drizzle(DB, { schema });

export const tables = {
  lectures: schema.lectures,
  lecturePeriods: schema.lecturePeriods,
  teachers: schema.teachers,
  teacherAssignment: schema.teacherAssignment,
};
