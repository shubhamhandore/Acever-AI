/** @type {import("drizzle-kit").Config} */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_UzOtND1md3uK@ep-divine-rice-a8owt14x-pooler.eastus2.azure.neon.tech/acever-ai?sslmode=require",
  },
};
