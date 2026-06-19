// prisma.config.ts
import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Load environment variables

export default defineConfig({
  schema: 'prisma/schema.prisma', // Path to your schema file

  datasource: {
    url: process.env.DATABASE_URL!, // Your database connection string
    // shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL, // Optional: for migrations
  },

  // Optional: Configure migrations
  migrations: {
    path: 'prisma/migrations',
    // seed: 'npm run seed', // If you have a seed script
  },
});