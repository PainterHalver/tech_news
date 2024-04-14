export type User = {
  id: number;
  username: string;
  full_name: string;
  avatar: string;
  role: "user" | "admin";
  created_at: Date;
  updated_at: Date;
};

export type Publisher = {
  id: number;
  name: string;
  full_name: string;
  image: string;
  link: string;
  created_at: Date;
  updated_at: Date;
  user_followed?: boolean;
  followers_count?: number;
  posts_count?: number;
};

export type Post = {
  id: number;
  post_id?: number;
  publisher_id: number;
  title: string;
  description: string;
  description_generated: string;
  image: string;
  link: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  publisher: Publisher;
  votes_score: number;
  comments_count: number;
  user_vote?: -1 | 0 | 1;
  user_bookmarked?: boolean;
  // view pivot
  pivot?: {
    updated_at: Date;
  };
};

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  user: User;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string;
    label: string;
    active: boolean;
  }[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
};

export type Stats = {
  views_count: number;
  votes_count: number;
  comments_count: number;
  bookmarks_count: number;
  joined_at: Date;
  followed_publishers_count: number;
  user: User;
};
