import PostClient from "./PostClient";
import api from "../../../../lib/api"; // Adjust based on folder depth

export async function generateMetadata({ params }) {
  const  { id: postId, slug } = await params || {};

  if (!postId) {
    console.error("❌ No postId found in params");
    return {
      title: "Post Not Found | Meerut Range",
      description: "The requested post could not be found.",
    };
  }

  try {
    const { data, error } = await api.get("/post", {
      client: "prarang",
      params: { language: "hi", id: postId },
    });

    if (error || !data?.success) {
      return {
        title: "Error | Meerut Range",
        description: "There was an error loading the post.",
      };
    }

    const post = data.data;
    const title = `${post.title} | Meerut Range`;
    const description = post.short_description || post.title;
    const imageUrl =
      post.image_url ||
      "https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png";
    const generatedSlug =
      post.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      "post";
    const url = `https://meerut-range.com/लेख/${postId}/${generatedSlug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [{ url: imageUrl, alt: post.title }],
        type: "article",
        publishedTime: post.createDate,
        authors: ["Prarang"],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    console.error("Metadata fetch error:", err);
    return {
      title: "Post | Meerut Range",
      description: "Read the latest post on Meerut Range.",
    };
  }
}

export default function PostDetailPage() {
  return <PostClient />;
}
