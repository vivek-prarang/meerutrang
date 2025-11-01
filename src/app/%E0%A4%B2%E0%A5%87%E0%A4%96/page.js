import PostsClient from "./PostsClient";

export const metadata = {
  title: "Posts | Meerut Range - प्रारंग ज्ञान के रंग",
  description: "Browse all posts on Meerut Range. Discover stories about culture, nature, and heritage of Meerut in Hindi.",
  openGraph: {
    title: "Posts | Meerut Range",
    description: "Browse all posts on Meerut Range. Discover stories about culture, nature, and heritage.",
    url: "https://meerut-range.com/posts",
    images: [
      {
        url: "https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png",
        alt: "Meerut Range Posts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Posts | Meerut Range",
    description: "Browse all posts on Meerut Range. Discover stories about culture, nature, and heritage.",
    images: ["https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png"],
  },
};

export default function AllPostsPage() {
  return <PostsClient />;
}
