import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db, sqlite } from '.';

migrate(db, { migrationsFolder: './migrations' });
sqlite.close();
