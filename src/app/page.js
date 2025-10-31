import HomeClient from "./HomeClient";

export const metadata = {
  title: "Meerut Range - Home | प्रारंग ज्ञान के रंग",
  description: "Welcome to Meerut Range. Explore the culture, nature, and stories of Meerut in Hindi. Discover local insights, weather, and more.",
  openGraph: {
    title: "Meerut Range - Home",
    description: "Explore the culture, nature, and stories of Meerut in Hindi.",
    url: "https://meerut-range.com",
    images: [
      {
        url: "https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png",
        alt: "Meerut Range Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meerut Range - Home",
    description: "Explore the culture, nature, and stories of Meerut in Hindi.",
    images: ["https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png"],
  },
};

export default function Home() {
  return <HomeClient />;
}
