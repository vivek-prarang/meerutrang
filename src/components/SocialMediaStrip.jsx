'use client';

export default function SocialMediaStrip() {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: 'https://www.facebook.com/prarang.in',
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50',
    },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      url: 'https://chat.whatsapp.com/HpjFX0qe7Du7q9fi3DQR7P',
      color: 'text-green-500 hover:text-green-600',
      bgColor: 'hover:bg-green-50',
    },
    {
      name: 'Google Play',
      icon: 'fab fa-google-play',
      url: 'https://www.indusappstore.com/apps/news-and-magazines/prarang/com.riversanskiriti.prarang?page=details&id=com.riversanskiriti.prarang',
      color: 'text-red-600 hover:text-red-700',
      bgColor: 'hover:bg-red-50',
    },

  ];

  return (
    <div className="w-full bg-white border-t border-b border-gray-200 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-8 md:gap-12">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
              className={`flex items-center justify-center transition-all duration-300 p-2 rounded-lg ${social.color} ${social.bgColor}`}
            >
              <i className={`${social.icon} text-2xl md:text-3xl`}></i>
              {/* <span className="hidden sm:inline ml-2 text-sm font-semibold text-gray-700">
                {social.name}
              </span> */}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
