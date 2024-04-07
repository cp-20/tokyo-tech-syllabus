import { z } from 'zod';

export const periods = [
  '月1-2',
  '火1-2',
  '水1-2',
  '木1-2',
  '金1-2',
  '土1-2',
  '日1-2',
  '月3-4',
  '火3-4',
  '水3-4',
  '木3-4',
  '金3-4',
  '土3-4',
  '日3-4',
  '月5-6',
  '火5-6',
  '水5-6',
  '木5-6',
  '金5-6',
  '土5-6',
  '日5-6',
  '月7-8',
  '火7-8',
  '水7-8',
  '木7-8',
  '金7-8',
  '土7-8',
  '日7-8',
  '月9-10',
  '火9-10',
  '水9-10',
  '木9-10',
  '金9-10',
  '土9-10',
  '日9-10',
  '月11-12',
  '火11-12',
  '水11-12',
  '木11-12',
  '金11-12',
  '土11-12',
  '日11-12',
] as const;

export type Period = (typeof periods)[number];

export const expandPeriodQuery = (periods: Period[]) => {
  const periodQueries = periods.flatMap((period) => {
    const day = period[0];
    const [start, end] = period.slice(1).split('-');
    return [`${day}${start}`, `${day}${end}`];
  });
  return periodQueries;
};

export const grades = ['100', '200', '300', '400', '500', '600'] as const;

export type Grade = (typeof grades)[number];

export const quarters = [
  '1Q',
  '2Q',
  '3Q',
  '4Q',
  '1-2Q',
  '2-3Q',
  '3-4Q',
  '1-4Q',
] as const;

export type Quarter = (typeof quarters)[number];

export const searchQuerySchema = z
  .object({
    title: z.string(),
    teacher: z.string(),
    periods: z.array(z.enum(periods)).min(1),
    codeGrades: z.array(z.enum(grades)).min(1),
    code: z.string(),
    quarters: z.array(z.enum(quarters)).min(1),
    origin: z.string(),
  })
  .partial();

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const limitSchema = z.number().int().positive().max(100).default(20);
export const offsetSchema = z
  .number()
  .int()
  .nonnegative()
  .max(10000)
  .default(0);

export const validateQuery = (query: unknown) => {
  if (typeof query !== 'string') return { success: false } as const;
  try {
    const jsonQuery = JSON.parse(query);
    const parsedQuery = searchQuerySchema.safeParse(jsonQuery);
    return parsedQuery;
  } catch (err) {
    return { success: false } as const;
  }
};
