'use client';

import { useState } from 'react';

export default function MeerutLinks({ data }) {
  const [activeModal, setActiveModal] = useState(null);

  let e_books = [];
  let books = [];
  try {
    if (typeof data?.books === "string") {
      const parsed = JSON.parse(data.books);
      e_books = parsed.e_books || [];
      books = parsed.books || [];
    } else if (Array.isArray(data?.books)) {
      books = data.books;
    }
  } catch (err) {
    console.error("Books parse error:", err);
  }

  const allBooks = [...e_books, ...books];

  const links = {
    "सरकारी वेबसाइट्स": [
      { "name": "जिला प्रशासन मेरठ (NIC)", "url": "https://meerut.nic.in/" },
      { "name": "मेरठ मंडल (NIC)", "url": "https://meerutdivision.nic.in/" },
      { "name": "मेरठ विकास प्राधिकरण (MDA)", "url": "https://mdameerut.in/" },
      { "name": "मेरठ छावनी परिषद", "url": "https://meerut.cantt.gov.in/" },
      { "name": "मेरठ स्मार्ट सिटी", "url": "https://meerutnagarnigam.com/main/smart-city.aspx" },
      { "name": "एमएसएमई (MSME) टेक्नोलॉजी डेवलपमेंट सेंटर", "url": "https://www.ppdcmeerut.com/" }
    ],
    "सेवाएँ": [
      { "name": "मेरठ STD / PIN कोड", "url": "https://meerut.nic.in/std-pin-codes/" },
      { "name": "मेरठ बैंक IFSC कोड", "url": "https://www.infoqik.com/banks/uttar-pradesh/meerut" }
    ],
    "ब्लॉग / क्रिएटिव स्टूडियो": [
      { "name": "स्टूडियो धर्मा – फेसबुक", "url": "https://www.facebook.com/studiodharma.in" }
    ],
    "रोज़गार / नौकरियाँ": [
      { "name": "Indeed", "url": "https://in.indeed.com/l-meerut%2C-uttar-pradesh-jobs.html" },
      { "name": "Apna", "url": "https://apna.co/jobs/jobs-in-meerut" }
    ],
    "स्थानीय व्यवसाय / सेवाएँ": [
      { "name": "Local18", "url": "https://www.local18.in/meerut/" },
      { "name": "Meerut Online", "url": "https://www.meerutonline.in/" }
    ],
    "समाचार": [
      { "name": "अमर उजाला – मेरठ", "url": "https://www.amarujala.com/uttar-pradesh/meerut" },
      { "name": "लाइव हिन्दुस्तान – मेरठ समाचार", "url": "https://www.livehindustan.com/uttar-pradesh/meerut/news" },
      { "name": "दैनिक जागरण – मेरठ सिटी", "url": "https://www.jagran.com/uttar-pradesh/meerut-city" }
    ],
    "पर्यटन": [
      { "name": "TripAdvisor", "url": "https://www.tripadvisor.in/Attractions-g1162496-Activities-Meerut_Meerut_District_Uttar_Pradesh.html" },
      { "name": "Holidify", "url": "https://www.holidify.com/places/meerut/sightseeing-and-things-to-do.html" }
    ],
    "खान-पान / रेस्टोरेंट्स": [
      { "name": "Zomato – मेरठ रेस्टोरेंट", "url": "https://www.zomato.com/meerut" }
    ],
    "मनोरंजन": [
      { "name": "BookMyShow – मूवीज़ व इवेंट", "url": "https://in.bookmyshow.com/explore/home/meerut" }
    ]
  };
  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="p-2 m-1">
      {/* Background Illustrations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blurred Flowers */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-blue-200 rounded-full blur-xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-purple-200 rounded-full blur-xl opacity-20 animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-green-200 rounded-full blur-xl opacity-35 animate-pulse delay-1500"></div>

        {/* Scratch/Cross Patterns */}
        <div className="absolute top-1/4 left-1/4 w-2 h-16 bg-gray-300 rotate-45 opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-2 bg-gray-300 rotate-45 opacity-20"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-12 bg-gray-300 -rotate-45 opacity-15"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-2 bg-gray-300 -rotate-45 opacity-15"></div>

        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-orange-300 rounded-full opacity-40"></div>
        <div className="absolute top-1/3 right-1/6 w-6 h-6 bg-yellow-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-red-300 rounded-full opacity-50"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 font-size-responsive">
          शहर का ज्ञानकोष
        </h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12">
          {/* Books Button */}
          <button
            onClick={() => openModal('books')}
            className="group relative px-8 py-4 bg-blue-500 font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <i className="fas fa-book text-2xl"></i>
              <span>किताबें</span>
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </div>
          </button>

          {/* Links Button */}
          <button
            onClick={() => openModal('links')}
            className="group relative px-8 py-4 bg-yellow-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <i className="fas fa-link text-2xl"></i>
              <span>वेबसाइट</span>
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </div>
          </button>
        </div>
      </div>

      {/* Books Modal */}
      {activeModal === 'books' && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col transform animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl flex items-center justify-between flex-shrink-0 relative">

              {/* Left Section (Icon + Hidden placeholder to balance center text) */}
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <i className="fas fa-book text-white text-lg"></i>
                </div>
              </div>

              {/* Center Title */}
              <h3 className="text-2xl font-bold text-white drop-shadow-md text-center w-1/3">
                मेरठ की किताबें
              </h3>

              {/* Right Close Button */}
              <div className="flex justify-end w-1/3">
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 hover:rotate-90 flex items-center justify-center backdrop-blur-sm"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

            </div>


            {/* Modal Content */}
            <div className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
              {allBooks.length > 0 ? (
                <div className="space-y-8">
                  {/* E-Books Section */}
                  {e_books.length > 0 && (
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">डिजिटल किताबें</h4>
                      <div className="space-y-3">
                        {e_books.map((book, index) => (
                          <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100 hover:bg-white/80 transition-all duration-200">
                            <h5 className="font-bold text-base text-gray-800 mb-3">{index + 1}. {book.name}</h5>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
                              {book.author && <span><span className="font-semibold">Author:</span> {book.author}</span>}
                              {book.publisher && <span><span className="font-semibold">Publisher:</span> {book.publisher}</span>}
                              {book.year && <span><span className="font-semibold">Year:</span> {book.year}</span>}
                              {book.tag && <span><span className="font-semibold">Tags:</span> <span className="">{book.tag}</span></span>}
                              {book.link && (
                                <a
                                  href={book.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 flex items-center gap-1 hover:translate-x-1"
                                >
                                  <span className="hover:underline">पढ़ें</span>
                                  <i className="fas fa-external-link-alt text-[10px]"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Physical Books Section */}
                  {books.length > 0 && (
                    <div>
                      {/* <h4 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">प्रकाशित किताबें</h4> */}
                      <div className="space-y-3">
                        {books.map((book, index) => (
                          <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100 hover:bg-white/80 transition-all duration-200">
                            <h5 className="font-bold text-base text-gray-800 mb-3">{index + 1}. {book.name}</h5>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
                              {book.author && <span><span className="font-semibold">Writer:</span> {book.author}</span>}
                              {book.publisher && <span><span className="font-semibold">Publisher:</span> {book.publisher}</span>}
                              {book.publishing_year && <span><span className="font-semibold">Year:</span> {book.publishing_year}</span>}
                              {book.tag && <span><span className="font-semibold">Tags:</span> <span className="italic">{book.tag}</span></span>}
                              {book.link && (
                                <a
                                  href={book.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 flex items-center gap-1 hover:translate-x-1"
                                >
                                  <span className="hover:underline">पढ़ें</span>
                                  <i className="fas fa-external-link-alt text-[10px]"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-book text-3xl text-gray-300"></i>
                  </div>
                  <p className="text-lg font-medium">कोई पुस्तक उपलब्ध नहीं है</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Links Modal */}
      {activeModal === "links" && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col transform animate-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl flex items-center justify-between flex-shrink-0 relative">

              {/* Left Section (Icon + Hidden placeholder to balance center text) */}
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <i className="fas fa-book text-white text-lg"></i>
                </div>
              </div>

              {/* Center Title */}
              <h3 className="text-2xl font-bold text-white drop-shadow-md text-center w-1/3">
                मेरठ की वेबसाइट्स
              </h3>

              {/* Right Close Button */}
              <div className="flex justify-end w-1/3">
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-200 hover:rotate-90 flex items-center justify-center backdrop-blur-sm"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

            </div>


            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
              {Object.keys(links).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 ">
                  {Object.entries(links).map(([category, items], catIndex) => (
                    <div key={category} className="group flex flex-col shadow-md hover:shadow-lg p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 transition-all duration-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${catIndex % 4 === 0 ? 'from-blue-500 to-blue-600' :
                          catIndex % 4 === 1 ? 'from-green-500 to-green-600' :
                            catIndex % 4 === 2 ? 'from-purple-500 to-purple-600' :
                              'from-orange-500 to-orange-600'
                          }`}></div>
                        <h4 className={`font-bold text-lg capitalize bg-gradient-to-r ${catIndex % 4 === 0 ? 'from-blue-600 to-blue-700' :
                          catIndex % 4 === 1 ? 'from-green-600 to-green-700' :
                            catIndex % 4 === 2 ? 'from-purple-600 to-purple-700' :
                              'from-orange-600 to-orange-700'
                          } bg-clip-text text-transparent`}>
                          {category.replace(/_/g, " ")}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2  ml-1 bg-white/50 backdrop-blur-sm  flex-1">
                        <div className="col-span-1"></div>
                        <div className="col-span-1"></div>
                        {Array.isArray(items) &&
                          items.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/80 transition-all duration-200 group/item hover:underline-none list-none"
                            >

                              {item.url ? (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 flex items-center gap-2 group-hover/item:hover:underline"
                                >
                                  <span className="hover:underline">⦿ {item.name}</span>
                                  <i className="fas fa-external-link-alt text-xs opacity-0 group-hover/item:opacity-100 transition-opacity"></i>
                                </a>
                              ) : (
                                <span className="text-gray-700 font-medium">• {item.name}</span>
                              )}
                            </li>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-link text-3xl text-gray-300"></i>
                  </div>
                  <p className="text-lg font-medium">कोई वेबसाइट उपलब्ध नहीं है</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
