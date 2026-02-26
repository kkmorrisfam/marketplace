import "dotenv/config";
import * as mariadb from "mariadb";

async function main() {
  const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT ?? "3306"),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    connectionLimit: 1,
    connectTimeout: 20000,
    acquireTimeout: 20000,

     // ✅ Fix MySQL 8 auth handshake issue
    allowPublicKeyRetrieval: true,

    // ✅ Often needed on hosted DBs (try with and without)
    // ssl: { rejectUnauthorized: false },
  });

  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT 1 AS ok");
  conn.release();
  await pool.end();

  console.log(rows);
}

main().catch((e) => {
  console.error("CONNECT FAILED:", e);
  process.exit(1);
});