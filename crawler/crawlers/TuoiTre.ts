import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class TuoiTre extends Crawler {
  readonly publisher_name = "tuoitre";
  readonly publisher_link = "https://tuoitre.vn/cong-nghe.htm";
  readonly publisher_fullname = "Báo Tuổi Trẻ";

  async crawlData(): Promise<void> {
    const res = await fetch("https://tuoitre.vn/rss/cong-nghe.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
          <title>
            <![CDATA[ Tết rảnh bà con alô, livestream mọi lúc, nhà mạng hứa không để rớt sóng ]]>
          </title>
          <link>
            <![CDATA[ https://tuoitre.vn/tet-ranh-ba-con-alo-livestream-moi-luc-nha-mang-hua-khong-de-rot-song-2024012722313741.htm ]]>
          </link>
          <guid isPermaLink="false">
            <![CDATA[ 55d41482-693d-4f5b-9607-675d2f11ef1c ]]>
          </guid>
          <description>
            <![CDATA[ <a href="https://tuoitre.vn/tet-ranh-ba-con-alo-livestream-moi-luc-nha-mang-hua-khong-de-rot-song-2024012722313741.htm"><img src="https://cdn1.tuoitre.vn/zoom/80_50/471584752817336320/2024/1/27/su-dung-dien-thoai-di-dong-5read-only-17063692998012075318221-39-0-1289-2000-crop-17063693531531620803605.jpg" /></a>Với sự bùng nổ của các xu hướng công nghệ mới, nhu cầu sử dụng Internet và dịch vụ dữ liệu di động được dự đoán sẽ tăng rất mạnh trong dịp Tết 2024 này. ]]>
          </description>
          <pubDate>
            <![CDATA[ Sun, 28 Jan 2024 06:15:28 GMT+7 ]]>
          </pubDate>
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
