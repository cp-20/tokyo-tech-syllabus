import { deleteAll, initialize, registerDatabase } from './registerer';
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
    ctx: ExecutionContext,
  ): Promise<Response> {
    const path = new URL(req.url).pathname;

    const db = getDB(env.DB);
    if (req.method === 'GET' && path === '/') {
      return Response.json({ lecture: await db.query.lectures.findFirst() });
    }

    if (req.method === 'POST' && path === '/') {
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

    if (req.method === 'DELETE' && path === '/') {
      try {
        await deleteAll(db);
        return Response.json({ success: true });
      } catch (err) {
        console.error(err);
        return Response.json({ success: false });
      }
    }

    if (req.method === 'POST' && path === '/initialize') {
      try {
        await initialize(db);
        return Response.json({ success: true });
      } catch (err) {
        console.error(err);
        return Response.json({ success: false });
      }
    }

    return Response.json('Not found', { status: 404 });
  },
};
