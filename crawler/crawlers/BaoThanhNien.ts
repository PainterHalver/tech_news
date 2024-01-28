import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class BaoThanhNien extends Crawler {
  readonly publisher_name = "baothanhnien";
  readonly publisher_link = "https://thanhnien.vn/cong-nghe-game/tin-tuc-cong-nghe.htm";
  readonly publisher_fullname = "Báo thanh niên";

  async crawlData(): Promise<void> {
    const res = await fetch("https://thanhnien.vn/rss/cong-nghe-game/tin-tuc-cong-nghe.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
          <title>
            <![CDATA[ Đầu năm 2024 đ&atilde; c&oacute; 5.000 nh&acirc;n vi&ecirc;n ng&agrave;nh game mất việc ]]>
          </title>
          <link>https://thanhnien.vn/dau-nam-2024-da-co-5000-nhan-vien-nganh-game-mat-viec-185240127092524316.htm</link>
          <description>
            <![CDATA[ <a href="https://thanhnien.vn/dau-nam-2024-da-co-5000-nhan-vien-nganh-game-mat-viec-185240127092524316.htm"><img src="https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/1/27/game-developer-1-768x433-1-1024x577-1706322368756-1706322369089578719352-0-15-577-938-crop-17063224246011779053922.jpg"></a> L&agrave;n s&oacute;ng sa thải trong ng&agrave;nh game tiếp tục d&acirc;ng cao, khi c&oacute; 5.000 người mất việc chỉ trong th&aacute;ng 1.2024. ]]>
          </description>
          <pubDate>Sat, 27 Jan 24 14:15:00 +0700</pubDate>
          <guid>https://thanhnien.vn/dau-nam-2024-da-co-5000-nhan-vien-nganh-game-mat-viec-185240127092524316.htm</guid>
        </item>
        */
        if (index >= this.MAX_ITEMS) return;

        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link = JSDOM.fragment(item.description).querySelector("img")?.getAttribute("src") || "";

        const title = JSDOM.fragment(item.title).textContent || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());
        const descriptionNodes = dom.window.document.querySelectorAll("div[data-role=content] p");
        const content = Array.from(descriptionNodes)
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
