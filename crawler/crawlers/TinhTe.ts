import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class TinhTe extends Crawler {
  readonly publisher_name = "tinhte";
  readonly publisher_link = "https://tinhte.vn/";
  readonly publisher_fullname = "Tinh Tế";

  async crawlData(): Promise<void> {
    const res = await fetch("https://tinhte.vn/rss/");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        /*
        <item>
        <title>Unbox Samsung Galaxy S24 Ultra: đừng làm nó phức tạp</title>
        <description><![CDATA[Mình dùng cái Galaxy S24 Ultra để quay unbox một chiếc Galaxy S24 Ultra cho nó không phức tạp. Bài này cũng cho anh em biết sơ sơ mặt mũi cái máy bán chính hãng nó như thế nào thôi. Các bài thông...]]></description>
        <pubDate>Sun, 28 Jan 2024 04:48:27 +0000</pubDate>
        <link>https://tinhte.vn/thread/unbox-samsung-galaxy-s24-ultra-dung-lam-no-phuc-tap.3759641/</link>
        <guid>https://tinhte.vn/thread/3759641/</guid>
        <author>no-reply@tinhte.vn (cuhiep)</author>
        <dc:creator>cuhiep</dc:creator>
        <content:encoded><![CDATA[<span class="xf-body-paragraph">Mình dùng cái Galaxy S24 Ultra để quay unbox một chiếc Galaxy S24 Ultra cho nó không phức tạp. Bài này cũng cho anh em biết sơ sơ mặt mũi cái máy bán chính hãng nó như thế nào thôi. Các bài thông tin sơ sơ thì đã có rồi. Mình sẽ dùng thêm ít hôm rồi mình sẽ chia sẻ tiếp coi sao… chứ mình đã xài S24 Ultra do Samsung cho mượn từ hồi còn ở Mỹ cách đây hơn 1 tuần. Máy này mình mua của cửa hàng nhỏ, quen chuyên bán điện thoại độc, lạ cho mình.<br />
  <br />
  </span><span data-s9e-mediaembed="youtube"><span style="display:block;overflow:hidden;position:relative;padding-bottom:56.25%"><iframe allowfullscreen="" loading="lazy" scrolling="no" style="background:url(https://i.ytimg.com/vi/PV6dBxobYcc/hqdefault.jpg) 50% 50% / cover;border:0;height:100%;left:0;position:absolute;width:100%" src="https://www.youtube.com/embed/PV6dBxobYcc"></iframe></span></span><span class="xf-body-paragraph"><br />
  <br />
  Mình đã chia...<br />
  <br />
  <a href="https://tinhte.vn/thread/unbox-samsung-galaxy-s24-ultra-dung-lam-no-phuc-tap.3759641/" class="internalLink">Unbox Samsung Galaxy S24 Ultra: đừng làm nó phức tạp</a></span>]]></content:encoded>
        <slash:comments>171</slash:comments>
        <thr:total>171</thr:total>
        <image>https://photo2.tinhte.vn/data/attachment-files/2024/01/8250838_unbox-s24-ultra.jpg</image>
      </item>
        */
        if (index >= this.MAX_ITEMS) return;

        const description = JSDOM.fragment(item.description).textContent || "";
        const image_link = item.image || "";

        const title = JSDOM.fragment(item.title).textContent || "";
        const res = await fetch(item.link);
        const dom = new JSDOM(await res.text());
        const content = dom.window.document.querySelector("article.content")?.textContent || "";

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
