export type User = {
  id: number;
  username: string;
  full_name: string;
  avatar: string;
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
};

export type Post = {
  id: number;
  publisher_id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  publisher: Publisher;
  votes_count: number;
  comments_count: number;
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
