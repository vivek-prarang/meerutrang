import Link from "next/link";
import "../globals.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Posts | Meerut Range - प्रारंग ज्ञान के रंग",
  description: "Explore posts on Meerut Range. Discover stories about culture, nature, and heritage of Meerut in Hindi.",
  openGraph: {
    title: "Posts | Meerut Range",
    description: "Explore posts on Meerut Range. Discover stories about culture, nature, and heritage.",
    url: "https://meerutrang.in/posts",
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
    description: "Explore posts on Meerut Range. Discover stories about culture, nature, and heritage.",
    images: ["https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="min-h-screen flex flex-col bg-gradient-to-r from-gray-100 via-gray-100 to-purple-50 ">

        <NavBar />


        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
