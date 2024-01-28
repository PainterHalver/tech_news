import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class DanTri extends Crawler {
  readonly publisher_name = "dantri";
  readonly publisher_link = "https://dantri.com.vn/suc-manh-so.htm";
  readonly publisher_fullname = "Báo Dân Trí";

  async crawlData(): Promise<void> {
    const res = await fetch("https://dantri.com.vn/rss/suc-manh-so.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
          <title>Pixel 8a lộ diện dù chưa ra mắt</title>
          <pubDate>Sat, 27 Jan 2024 13:46:59 +0700</pubDate>
          <link>https://dantri.com.vn/suc-manh-so/pixel-8a-lo-dien-du-chua-ra-mat-20240127002825838.htm</link>
          <guid>https://dantri.com.vn/suc-manh-so/pixel-8a-lo-dien-du-chua-ra-mat-20240127002825838.htm</guid>
          <description><![CDATA[<a href='https://dantri.com.vn/suc-manh-so/pixel-8a-lo-dien-du-chua-ra-mat-20240127002825838.htm'/><img src='https://icdn.dantri.com.vn/2024/01/27/pixel-8a-crop-1706289038765.jpeg'/></a></br>(Dân trí) - Mới đây, trên một hội nhóm Facebook về các thiết bị Pixel tại Việt Nam, một người dùng đã chia sẻ những hình ảnh đầu tiên về hộp của Pixel 8a.]]></description>
          <dc:creator>Thế Anh</dc:creator>
          <category
            domain="https://dantri.com.vn/suc-manh-so.htm">Sức mạnh số</category>
        </item>
        */
        if (index >= this.MAX_ITEMS) return;

        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link = JSDOM.fragment(item.description).querySelector("img")?.getAttribute("src") || "";

        const title = JSDOM.fragment(item.title).textContent || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());
        const contentNodes = dom.window.document.querySelectorAll("div.singular-content p");
        const content = Array.from(contentNodes)
          .map((node) => node.textContent)
          .join("\n");

        const post: Post = {
          publisher_id: this.publisher_id,
          title: title,
          content: content,
          description: description,
          image: image_link,
          link: item.link,
          published_at: new Date(item.pubDate),
        };
        this.data.push(post);
      })
    );
  }
}
