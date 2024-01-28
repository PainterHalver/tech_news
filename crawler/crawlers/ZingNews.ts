import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class ZingNews extends Crawler {
  readonly publisher_name = "zingnews";
  readonly publisher_link = "https://znews.vn/cong-nghe.html";
  readonly publisher_fullname = "Zing News";

  async crawlData(): Promise<void> {
    const res = await fetch("https://znews.vn/rss/cong-nghe.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
          <title>Mất 4,5 tỷ vì tin kẻ giả danh công an</title>
          <description>
            <![CDATA[ <a href="https://znews.vn/mat-4-5-ty-vi-tin-ke-gia-danh-cong-an-post1457440.html"><img src="https://photo.znews.vn/w660/Uploaded/yqdlcqrwq/2024_01_28/22728012024.jpg" /></a><br />Nghe cuộc gọi từ kẻ lừa đảo mạo danh công an, một người phụ nữ tại Hà Nội vừa bị chiếm đoạt hơn 4,5 tỷ đồng. ]]>
          </description>
          <pubDate>Sun, 28 Jan 2024 09:47:35 +0700</pubDate>
          <link>https://znews.vn/mat-4-5-ty-vi-tin-ke-gia-danh-cong-an-post1457440.html</link>
          <guid>https://znews.vn/mat-4-5-ty-vi-tin-ke-gia-danh-cong-an-post1457440.html</guid>
          <slash:comments>0</slash:comments>
        </item>
        */
        if (index >= this.MAX_ITEMS) return;

        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link = JSDOM.fragment(item.description).querySelector("img")?.getAttribute("src") || "";

        const title = JSDOM.fragment(item.title).textContent || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());
        const contentNodes = dom.window.document.querySelectorAll("div.the-article-body p");
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
