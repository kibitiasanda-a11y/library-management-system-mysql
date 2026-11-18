require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function setupDatabase() {
  const databaseName = process.env.DB_NAME || "library_management";
  if (!/^[A-Za-z0-9_$]+$/.test(databaseName)) {
    throw new Error("DB_NAME may contain only letters, numbers, underscores and dollar signs.");
  }

  const schemaPath = path.resolve(__dirname, "../../database/library.sql");
  const schema = fs.readFileSync(schemaPath, "utf8")
    .replace("CREATE DATABASE IF NOT EXISTS library_management", `CREATE DATABASE IF NOT EXISTS \`${databaseName}\``)
    .replace("USE library_management;", `USE \`${databaseName}\`;`);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true
  });

  try {
    await connection.query(schema);
    console.log(`MySQL database "${databaseName}" and its tables are ready.`);
  } finally {
    await connection.end();
  }
}

setupDatabase().catch((error) => {
  console.error("Database setup failed. Check your MySQL service and backend/.env settings.");
  console.error(`MySQL error: ${error.code || error.message}`);
  process.exitCode = 1;
});
