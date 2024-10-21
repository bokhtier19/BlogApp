import pg from "pg";

export const db = new pg.Client({
  user: "postgres",
  password: "Baabu@19",
  host: "localhost",
  port: 5432,
  database: "blog"
});
