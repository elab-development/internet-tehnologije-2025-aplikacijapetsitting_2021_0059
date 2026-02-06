import 'dotenv/config';
import { Config } from 'drizzle-kit';
export default {
   out: "./src/db/migrations",
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}satisfies Config;;