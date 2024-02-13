import { Post } from "@/lib/types";
import { trimString } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

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
      title: post.title + " | Tech News",
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

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
