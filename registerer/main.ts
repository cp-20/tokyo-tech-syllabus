import { deleteAll, loadTeachers, registerDatabase } from './registerer';
import { getDB } from '../database';
import { LectureSchema } from '../scraper/schema';
import { z } from 'zod';

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const db = getDB(env.DB);
    if (req.method === 'GET') {
      return Response.json({ lecture: await db.query.lectures.findFirst() });
    }

    if (req.method === 'POST') {
      const rawLectures = await req.json();
      const lectures = z.array(LectureSchema).parse(rawLectures);

      console.log(`Received ${lectures.length} lectures`);

      try {
        await registerDatabase(db, lectures);
        return Response.json({ success: true });
      } catch (err) {
        console.error(err);
        return Response.json({ success: false });
      }
    }

    if (req.method === 'DELETE') {
      try {
        // await deleteAll(db);
        await loadTeachers(db);
        return Response.json({ success: true });
      } catch (err) {
        console.error(err);
        return Response.json({ success: false });
      }
    }

    return Response.json('Not found', { status: 404 });
  },
};
