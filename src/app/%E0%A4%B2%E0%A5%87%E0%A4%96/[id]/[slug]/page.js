import PostClient from "./PostClient";
import api from "../../../../lib/api"; // Adjust based on folder depth

export async function generateMetadata({ params }) {
  const  { id: postId, slug } = await params || {};

  if (!postId) {
    console.error("❌ No postId found in params");
    return {
      title: "Post Not Found | Meerut Rang",
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
        title: "Error | Meerut Rang",
        description: "There was an error loading the post.",
      };
    }

    const post = data.data;
    const title = `${post.title} | Meerut Rang`;
    const description = post.short_description || post.title;
    const imageUrl =
      post.image_url ||
      "https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png";
    const generatedSlug = post.title
      ?.replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .trim() || post.title;
    const url = `https://meerutrang.in/लेख/${postId}/${generatedSlug}`;

    return {
    title,
    description,
    metadataBase: new URL("https://meerutrang.in"),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Meerut Rang",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "hi_IN",
      type: "article",
      publishedTime: post.createDate,
      authors: ["Prarang"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@prarang_in",
    },
  };
  } catch (err) {
    console.error("Metadata fetch error:", err);
    return {
      title: "Post | Meerut Rang",
      description: "Read the latest post on Meerut Rang.",
    };
  }
}

export default function PostDetailPage() {
  return <PostClient />;
}
