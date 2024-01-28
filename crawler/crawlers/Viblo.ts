import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class Viblo extends Crawler {
  readonly publisher_name = "viblo";
  readonly publisher_link = "https://viblo.asia/newest";
  readonly publisher_fullname = "Viblo Asia";

  async crawlData(): Promise<void> {
    const res = await fetch("https://viblo.asia/rss/posts/newest.rss");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
          <title>
            <![CDATA[ Một vài lời khuyên khi vận hành Kubernetes ]]>
          </title>
          <link>https://viblo.asia/p/mot-vai-loi-khuyen-khi-van-hanh-kubernetes-WR5JRBMYJGv</link>
          <guid isPermaLink="true">https://viblo.asia/p/mot-vai-loi-khuyen-khi-van-hanh-kubernetes-WR5JRBMYJGv</guid>
          <description>
            <![CDATA[ Lời nói đầu Bắt đầu một năm mới mình cũng muốn bản thân bắt đầu lại một số thói quen mà mình cho rằng là tốt đã bị quên mất. Gần đây mình có đọc được... ]]>
          </description>
          <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">Hoàng Việt</dc:creator>
          <pubDate>2024-01-20 18:42:23</pubDate>
        </item>
        */
        if (index >= this.MAX_ITEMS) return;

        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link =
          JSDOM.fragment(item.description).querySelector("img")?.getAttribute("src") ||
          "https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/9e/98/be/9e98be62-3c06-fc14-e96d-de484c7fcc75/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x600wa.png";

        const title = JSDOM.fragment(item.title).textContent || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());

        const content = dom.window.document.querySelector(".article-content__body")?.textContent || "";

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
