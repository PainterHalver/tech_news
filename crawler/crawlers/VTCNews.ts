import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class VTCNews extends Crawler {
  readonly publisher_name = "vtcnews";
  readonly publisher_link = "https://vtcnews.vn/khoa-hoc-cong-nghe-82.html";
  readonly publisher_fullname = "VTC News";

  async crawlData(): Promise<void> {
    const res = await fetch("https://vtcnews.vn/rss/khoa-hoc-cong-nghe.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
          <title>VinUni hợp tác với Đại học Quốc gia Singapore về đổi mới sáng tạo</title>
          <description><![CDATA[ <a title="VinUni hợp tác với Đại học Quốc gia Singapore về đổi mới sáng tạo" href="https://vtc.vn/vinuni-hop-tac-voi-dai-hoc-quoc-gia-singapore-ve-doi-moi-sang-tao-ar850105.html"> <img alt="VinUni hợp tác với Đại học Quốc gia Singapore về đổi mới sáng tạo" src="https://cdn-i.vtcnews.vn/resize-v1/mKdhVtUEDh42iXZC2hrJRmMOLi9H_6DslYoHlZ1b2eA/upload/2024/01/27/anh-2-2-13290757.png" ></a></br>Ngày 25/1, trường Đại học VinUni và Đại học Quốc gia Singapore (NUS) ký kết Thỏa thuận hợp tác nhằm thúc đẩy đổi mới sáng tạo. ]]></description>
          <link>https://vtc.vn/vinuni-hop-tac-voi-dai-hoc-quoc-gia-singapore-ve-doi-moi-sang-tao-ar850105.html</link>
          <guid>https://vtc.vn/vinuni-hop-tac-voi-dai-hoc-quoc-gia-singapore-ve-doi-moi-sang-tao-ar850105.html</guid>
          <pubDate>Sat, 27 Jan 2024 14:28:56 +0700</pubDate>
        </item>
        */
        if (index >= this.MAX_ITEMS) return;

        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link = JSDOM.fragment(item.description).querySelector("img")?.getAttribute("src") || "";

        const title = JSDOM.fragment(item.title).textContent || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());
        const contentNodes = dom.window.document.querySelectorAll("div[itemprop=articleBody] p");
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
