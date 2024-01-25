import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class VnExpress extends Crawler {
  readonly publisher_name = "vnexpress";
  readonly publisher_link = "https://vnexpress.net/so-hoa";
  readonly publisher_fullname = "VnExpress";

  async crawlData(): Promise<void> {
    const res = await fetch("https://vnexpress.net/rss/so-hoa.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any) => {
        /*
        <item>
          <title>Musk bị 'bóc mẽ' khi khoe robot gấp quần áo</title>
          <description>
          <![CDATA[ <a href="https://vnexpress.net/musk-bi-boc-me-khi-khoe-robot-gap-quan-ao-4701271.html"><img src="https://i1-sohoa.vnecdn.net/2024/01/16/s-1705376239-2723-1705376324.gif?w=1200&h=0&q=100&dpr=1&fit=crop&s=LteBd1dvrapOizattm5n_A&t=image" ></a></br>Elon Musk đăng video phô diễn sự khéo léo của robot hình người Optimus khi gấp quần áo, nhưng bị phát hiện có người điều khiển. ]]>
          </description>
          <pubDate>Tue, 16 Jan 2024 14:00:00 +0700</pubDate>
          <link>https://vnexpress.net/musk-bi-boc-me-khi-khoe-robot-gap-quan-ao-4701271.html</link>
          <guid>https://vnexpress.net/musk-bi-boc-me-khi-khoe-robot-gap-quan-ao-4701271.html</guid>
        </item>
        */
        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link = JSDOM.fragment(item.description).querySelector("img")?.getAttribute("src") || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());
        const descriptionNodes = dom.window.document.querySelectorAll("article p.Normal");
        const content = Array.from(descriptionNodes)
          .map((node) => node.textContent)
          .join("\n");

        const post: Post = {
          publisher_id: this.publisher_id,
          title: item.title,
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
