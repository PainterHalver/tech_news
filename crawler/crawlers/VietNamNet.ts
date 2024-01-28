import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class VietNamNet extends Crawler {
  readonly publisher_name = "vietnamnet";
  readonly publisher_link = "https://vietnamnet.vn/thong-tin-truyen-thong";
  readonly publisher_fullname = "Báo VietNamNet";

  async crawlData(): Promise<void> {
    const res = await fetch("https://vietnamnet.vn/thong-tin-truyen-thong.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
        <title>
          <![CDATA[ Nga sẽ được phủ sóng 5G hầu hết các khu vực trong năm 2024 ]]>
        </title>
        <description>
          <![CDATA[ <a href="https://vietnamnet.vn/nga-se-duoc-phu-song-5g-hau-het-cac-khu-vuc-trong-nam-2024-2244563.html"><img alt="Nga sẽ được phủ sóng 5G hầu hết các khu vực trong năm 2024" src="https://static-images.vnncdn.net/files/publish/2024/1/28/nga-se-duoc-phu-song-5g-hau-het-cac-khu-vuc-trong-nam-2024-259.jpg" ></a></br>Năm 2024, Nga có kế hoạch phủ sóng 5G ở hầu hết các khu vực, bắt đầu triển khai khai thác thương mại và dự kiến sẽ có 46 triệu kết nối vào cuối năm 2025. ]]>
        </description>
        <pubDate>Sun, 28 Jan 2024 11:30:00 +0700</pubDate>
        <link>https://vietnamnet.vn/nga-se-duoc-phu-song-5g-hau-het-cac-khu-vuc-trong-nam-2024-2244563.html</link>
        <guid>https://vietnamnet.vn/nga-se-duoc-phu-song-5g-hau-het-cac-khu-vuc-trong-nam-2024-2244563.html</guid>
        <slash:comments>0</slash:comments>
        </item>
        */
        if (index >= this.MAX_ITEMS) return;

        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link = JSDOM.fragment(item.description).querySelector("img")?.getAttribute("src") || "";

        const title = JSDOM.fragment(item.title).textContent || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());
        const contentNodes = dom.window.document.querySelectorAll("div.maincontent > p");
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
