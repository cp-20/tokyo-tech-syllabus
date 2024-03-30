import { z } from 'zod';
import { LectureSchema } from '../scraper/schema';
import { chunkArray } from '../utils/chunkArray';
import { enumerate } from '../utils/enumerate';

const main = async () => {
  await fetch('http://localhost:33576', { method: 'DELETE' });
  await Bun.sleep(1000);
  await fetch('http://localhost:33576/initialize', { method: 'POST' });

  const textLectures = await Bun.file('scraper/assets/lectures.json').text();
  const rawLectures = JSON.parse(textLectures);
  const lectures = z.array(LectureSchema).parse(rawLectures);
  const chunks = chunkArray(lectures, 100);

  for (const [i, chunk] of enumerate(chunks)) {
    const res = await fetch('http://localhost:33576', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chunk),
    });
    if (res.ok) {
      // console.log(`Chunk ${i + 1} / ${chunks.length} is uploaded`);
    } else {
      console.error(`Chunk ${i + 1} / ${chunks.length} is failed`);
    }
  }
};

main();
