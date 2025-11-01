import HomeClient from "./HomeClient";

export const metadata = {
  title: "Meerut Rang - Home | प्रारंग ज्ञान के रंग",
  description: "Welcome to Meerut Rang. Explore the culture, nature, and stories of Meerut in Hindi. Discover local insights, weather, and more.",
  openGraph: {
    title: "Meerut Rang - Home",
    description: "Explore the culture, nature, and stories of Meerut in Hindi.",
    url: "https://meerut-Rang.com",
    images: [
      {
        url: "https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png",
        alt: "Meerut Rang Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meerut Rang - Home",
    description: "Explore the culture, nature, and stories of Meerut in Hindi.",
    images: ["https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png"],
  },
};

export default function Home() {
  return <HomeClient />;
}
