import { PostCard } from "@/components/PostCard";
import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import { PostModal } from "@/components/PostModal";
import { Paginated, Post } from "@/lib/types";

const getPostsFirstPage = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/posts", { cache: "no-store" });
  const posts = await res.json();
  return posts.posts as Paginated<Post>;
};

export default async function Home() {
  const { data: posts } = await getPostsFirstPage();

  return (
    <main className="flex flex-col py-5 px-16 min-h-full">
      <h1 className="text-xl font-bold">Newly Updated</h1>
      <div className="flex flex-wrap justify-center flex-1 gap-8 mt-8">
        {/* {posts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))} */}
        <PostCard post={posts[0]} key={posts[0].id} />
        <PostCardSkeleton />
      </div>
      <PostModal />
    </main>
  );
}
