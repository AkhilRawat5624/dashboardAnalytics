// scripts/test-db.ts
import dbconnect from "@/lib/db";
import 'dotenv/config';
(async () => {
  await dbconnect();
  process.exit(0);
})();
