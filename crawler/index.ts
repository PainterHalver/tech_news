import mysql from "mysql2/promise";
import Crawler from "./crawlers/Crawler";
import DevTo from "./crawlers/DevTo";
import { log, log_success } from "./lib/utils";
import VnExpress from "./crawlers/VnExpress";

const main = async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "tech_news",
  });

  const crawlers: Crawler[] = [new DevTo(db), new VnExpress(db)];

  for (const crawler of crawlers) {
    log(`[+] Crawling ${crawler.publisher_name}... `);
    await crawler.loadId();
    await crawler.crawlData();
    await crawler.saveData();
    log_success("OK\n");
  }

  await db.end();
};

main();
