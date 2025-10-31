import PostClient from "./PostClient";
import api from "../../../../lib/api";

export async function generateMetadata({ params }) {
  // `params` should be an object with `id` and `slug` from the route.
  let parsedParams = params;
  if (typeof params === "string") {
    try {
      parsedParams = JSON.parse(params);
    } catch (e) {
      console.error("Failed to parse params:", params);
      parsedParams = {};
    }
  }

  const { id: postId, slug: routeSlug } = parsedParams || {};
  console.log("Post ID:", postId, "Slug:", routeSlug);
  try {
    const { data, error } = await api.get("/post", {
      client: "prarang",
      params: { language: "hi", id: postId },
    });


    if (error) {
      console.log("API Error details:", error);
      return {
        title: `Error | Meerut Range`,
        description: "There was an error loading the post.",
      };
    }

    if (!data?.success || !data?.data) {
      return {
        title: "Post Not Found | Meerut Range",
        description: "The requested post could not be found.",
      };
    }

    const post = data.data;
    if (!post || !post.title) {
      return {
        title: "Post Not Found | Meerut Range",
        description: "The requested post could not be found.",
      };
    }
    const title = `${post.title} | Meerut Range`;
    const description = post.short_description || post.title || "Read the latest post on Meerut Range.";
    const imageUrl = post.image_url || "https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png";
    const generatedSlug =
      post.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "post";
    const url = `https://meerut-range.com/लेख/${postId}/${generatedSlug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [
          {
            url: imageUrl,
            alt: post.title,
          },
        ],
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
    return {
      title: "Post | Meerut Range",
      description: "Read the latest post on Meerut Range.",
    };
  }
}

export default function PostDetailPage() {
  return <PostClient />;
}
