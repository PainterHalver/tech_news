import { Post } from "../lib/type";
import Crawler from "./Crawler";
import { XMLParser } from "fast-xml-parser";
import jsdom from "jsdom";

const parser = new XMLParser();
const { JSDOM } = jsdom;

export default class DevTo extends Crawler {
  readonly publisher_name = "devto";
  readonly publisher_link = "https://dev.to";
  readonly publisher_fullname = "Dev.to Community";

  async crawlData(): Promise<void> {
    const res = await fetch("https://dev.to/feed");
    const xml = await res.text();
    const data = parser.parse(xml);

    await Promise.all(
      data.rss.channel.item.map(async (item: any, index: number) => {
        if (index >= this.MAX_ITEMS) return;

        const res1 = await fetch(item.link);
        const dom = new JSDOM(await res1.text());
        const image_link =
          dom.window.document.querySelector("#main-title > a > img")?.getAttribute("src") ||
          "https://camo.githubusercontent.com/583a3488209bd62b2ee7985cd8b55a27b44c79d66a2109782d280a31976851a9/68747470733a2f2f74686570726163746963616c6465762e73332e616d617a6f6e6177732e636f6d2f692f726f3335333862793362326675706273363373722e706e67";

        const descriptionNodes = new JSDOM(item.description).window.document.querySelectorAll("p");
        let description = "";
        descriptionNodes.forEach((node) => {
          description += node.textContent + "\n";
        });

        const post: Post = {
          publisher_id: this.publisher_id,
          title: item.title,
          content: description,
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
