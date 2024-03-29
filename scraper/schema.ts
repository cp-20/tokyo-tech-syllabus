import { z } from 'zod';

export const LectureTeacherSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export type LectureTeacher = z.infer<typeof LectureTeacherSchema>;

export const LecturePeriodSchema = z.object({
  period: z
    .string()
    .regex(/^(月|火|水|木|金|土|日)(1|2|3|4|5|6|7|8|9|10|11|12)$/),
  classroom: z.string().nullable(),
});

export type LecturePeriod = z.infer<typeof LecturePeriodSchema>;

export const LecturePlaceSchema = z.union([
  // 集中講義
  z.object({ type: z.literal('intensive') }),
  // 通常講義
  z.object({
    type: z.literal('normal'),
    periods: z.array(LecturePeriodSchema),
  }),
  // 講究等
  z.object({ type: z.literal('research') }),
  // インターンシップ
  z.object({ type: z.literal('internship') }),
  // 未定
  z.object({ type: z.literal('TBD') }),
  // 空文字または'-'のとき
  z.object({ type: z.literal('null') }),
  // その他
  z.object({
    type: z.literal('raw'),
    value: z.string(),
  }),
]);

export type LecturePlace = z.infer<typeof LecturePlaceSchema>;

export const LectureSchema = z.object({
  // シラバスへのリンク
  url: z.string(),
  // 授業名
  title: z.string(),
  // 開講元
  origin: z.string(),
  // クラス
  class: z.string().nullable(),
  // 担当教員
  teachers: z.array(LectureTeacherSchema),
  // 曜日・時限 (講義室)
  place: LecturePlaceSchema,
  // 科目コード
  code: z.object({
    grade: z.number(),
    value: z.string(),
  }),
  // 単位
  credit: z.number(),
  // 開講年度
  year: z.string(),
  // 開講クォーター
  quarter: z.string(),
  // 使用言語
  language: z.string(),
});

export type Lecture = z.infer<typeof LectureSchema>;
