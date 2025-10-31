
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://meerut-range.com"),
  title: "Meerut Range - प्रारंग ज्ञान के रंग",
  description: "Meerut Range: Discover the rich culture, nature, and heritage of Meerut through engaging stories and insights. Explore संस्कृति, प्रकृति, and more in Hindi.",
  keywords: "Meerut, Culture, Nature, Heritage, Hindi, Stories, India",
  authors: [{ name: "Prarang" }],
  viewport: "width=device-width, initial-scale=1",
  charset: "utf-8",
  openGraph: {
    title: "Meerut Range - प्रारंग ज्ञान के रंग",
    description: "Discover the rich culture, nature, and heritage of Meerut through engaging stories and insights.",
    url: "https://meerut-range.com",
    siteName: "Meerut Range",
    images: [
      {
        url: "https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png",
        width: 800,
        height: 600,
        alt: "Meerut Range Logo",
      },
    ],
    locale: "hi_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meerut Range - प्रारंग ज्ञान के रंग",
    description: "Discover the rich culture, nature, and heritage of Meerut through engaging stories and insights.",
    images: ["https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body
        className="min-h-screen flex flex-col  bg-gradient-to-r from-gray-100 via-gray-100 to-purple-50" >
        {children}
      </body>
    </html>
  );
}
