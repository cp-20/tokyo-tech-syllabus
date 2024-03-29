import { JSDOM } from 'jsdom';
import KV from 'bun-kv';
import { Database } from 'bun:sqlite';
import { minify } from 'html-minifier';

const database = new Database('scraper/assets/response-cache.sqlite');
const kvWriter = new KV(database);

const query = database.query('SELECT * FROM kv;');
query.run();
const result = query.values() as [string, string][];
const kvReader = new Map(result);

export const fetchContent = async (url: string): Promise<string | null> => {
  const cache = kvReader.get(url);
  if (cache) return cache;

  const res = await fetch(url);
  if (!res.ok) return null;
  const textRes = await res.text();

  const content = new JSDOM(textRes).window.document.querySelector(
    '#right-contents'
  )?.innerHTML;

  const minifiedRes = minify(content ?? textRes, {
    caseSensitive: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
  });

  if (!minifiedRes) return null;

  kvWriter.set(url, minifiedRes);

  return minifiedRes;
};

export const parseHTML = (html: string) => {
  const dom = new JSDOM(html);

  return dom.window.document;
};

// ref: https://zenn.dev/sora_kumo/articles/539d7f6e7f3c63
export const Parallels = <T>(ps = new Set<Promise<T>>()) => ({
  add: (p: Promise<T>) => ps.add(!!p.finally(() => ps.delete(p)) && p),
  wait: (limit: number) => ps.size >= limit && Promise.race(ps),
  all: () => Promise.all(ps),
});
