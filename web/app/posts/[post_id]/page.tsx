import { trimString } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import { Post } from "@/lib/types";
import { redirect } from "next/navigation";
import { TbShare3 } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
import PostDescription from "./PostDescription";
import moment from "moment";

type Props = {
  params: { post_id: string };
};

const getPost = async (post_id: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/posts/" + post_id, { next: { revalidate: 2 } });
  const post = await res.json();
  return post as Post;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const post = await getPost(params.post_id);

    return {
      title: "Tech News | " + post.title,
      description: trimString(post.description, 100),
      openGraph: {
        images: [post.image],
        type: "article",
      },
      metadataBase: new URL("http://localhost:3000/posts/" + post.id),
    };
  } catch (error) {
    console.log("POST METADATA ERROR:", error);
    redirect("/404");
  }
}

export default async function Post({ params }: Props) {
  const post = await getPost(params.post_id);

  return (
    <main className="flex lg:px-16 min-h-full justify-center">
      <main className="border-[0.5px] border-border flex-1 flex flex-col max-w-4xl">
        <div className="w-full h-fit">
          <Image
            src={post.image}
            alt={`Cover image for ${post.title}`}
            sizes="100vw"
            width={0}
            height={0}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="flex flex-col px-5 py-7">
          <h1 className="text-3xl font-bold text-text-primary">{post.title}</h1>
          <p className="text-sm py-2">{moment(post.published_at).fromNow()}</p>
          <PostDescription post={post} />
        </div>
      </main>

      <aside className="border-[0.5px] border-border w-72 flex flex-col px-3 py-5 gap-5">
        <Link target="_blank" href={post.link} className="btn btn-outline font-bold text-base text-text-primary">
          <TbShare3 className="text-xl" /> Read post
        </Link>
        <div className="border border-border rounded-2xl flex">
          <div className="h-fit pl-2 py-2 flex items-center mr-2">
            <Image
              src={post.publisher.image}
              alt={`Icon image for publisher ${post.title}`}
              sizes="100vw"
              width={0}
              height={0}
              style={{ width: "45px", height: "auto", borderRadius: "50%" }}
            />
          </div>
          <div className="flex flex-col justify-center gap-[2px]">
            <span className="text-sm text-text-primary font-bold">{trimString(post.publisher.full_name, 23)}</span>
            <span className="text-xs text-text-secondary">@{post.publisher.name}</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
