import { Post } from "../lib/type";
import mysql, { ResultSetHeader } from "mysql2/promise";

export default abstract class Crawler {
  private db: mysql.Connection;
  publisher_id: number = 0;
  abstract readonly publisher_name: string;
  abstract readonly publisher_link: string;
  abstract readonly publisher_fullname: string;

  data: Post[] = [];

  constructor(db: mysql.Connection) {
    this.db = db;
  }

  async loadId(): Promise<void> {
    // Get or create publisher and set publisher_id
    let [rows, _] = await this.db.query<any[]>("SELECT id FROM publishers WHERE name = ? LIMIT 1", [this.publisher_name]);
    if (rows.length === 0) {
      const [result] = await this.db.execute<ResultSetHeader>("INSERT INTO publishers (name, link, full_name, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())", [
        this.publisher_name,
        this.publisher_link,
        this.publisher_fullname,
      ]);
      this.publisher_id = result.insertId;
    } else {
      this.publisher_id = rows[0].id;
    }
  }

  async crawlData(): Promise<void> {}

  async saveData(): Promise<void> {
    await Promise.all(
      this.data.map(async (post) => {
        const [rows, _] = await this.db.query<any[]>("SELECT id FROM posts WHERE publisher_id = ? AND link = ? LIMIT 1", [post.publisher_id, post.link]);
        if (rows.length === 0) {
          await this.db.execute<ResultSetHeader>("INSERT INTO posts (publisher_id, title, description, image, link, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())", [
            post.publisher_id,
            post.title,
            post.description,
            post.image,
            post.link,
            post.published_at,
          ]);
        }
      })
    );
  }
}
