import mysql from "mysql2/promise";
import Crawler from "./crawlers/Crawler";
import { log, log_error, log_success } from "./lib/utils";
import DevTo from "./crawlers/DevTo";
import VnExpress from "./crawlers/VnExpress";
import BaoThanhNien from "./crawlers/BaoThanhNien";
import VTCNews from "./crawlers/VTCNews";
import DanTri from "./crawlers/DanTri";
import ZingNews from "./crawlers/ZingNews";
import TuoiTre from "./crawlers/TuoiTre";
import TinhTe from "./crawlers/TinhTe";
import VietNamNet from "./crawlers/VietNamNet";
import Viblo from "./crawlers/Viblo";

const main = async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "tech_news",
  });

  const crawlers: Crawler[] = [
    new DevTo(db),
    new VnExpress(db),
    new BaoThanhNien(db),
    new VTCNews(db),
    new DanTri(db),
    new ZingNews(db),
    new TuoiTre(db),
    new TinhTe(db),
    new VietNamNet(db),
    new Viblo(db),
  ];

  for (const crawler of crawlers) {
    log(`[+] Crawling ${crawler.publisher_name}... `);
    try {
      await crawler.loadId();
      await crawler.crawlData();
      await crawler.saveData();
      log_success("OK\n");
    } catch (error) {
      log_error("ERROR\n");
      console.error(error);
    }
  }

  await db.end();
};

main();
