'use client';

import { useState, useEffect } from 'react';

export default function InternateData() {
  const [internateData, setInternateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data is cached in localStorage
        const cachedData = localStorage.getItem('internateData_c2');
        if (cachedData) {
          setInternateData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch('https://b2b.prarang.in/api/readers?city_code=c2');
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();

        // Filter city_info for only ids 11, 15, 16, 17, 18
        const filteredCityInfo = result.data.city_info?.filter(city =>
          [11, 15, 16, 17, 18].includes(city.id)
        ) || [];

        // Prepare filtered data with title and value
        const filteredData = {
          city_info: filteredCityInfo.map(city => ({
            id: city.id,
            title: city.title,
            value: city.value,
            sno: city.sno
          })),
          reader_info: result.data.reader_info
        };

        // Cache the data
        localStorage.setItem('internateData_c2', JSON.stringify(filteredData));
        setInternateData(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center text-gray-500">लोड हो रहा है...</div>;
  if (error) return <div className="text-center text-red-500">त्रुटि: {error}</div>;

  const handleClearCache = () => {
    localStorage.removeItem('internateData_c2');
    setInternateData(null);
    setLoading(true);
    window.location.reload();
  };

  return (
    <div className="w-full bg-white shadow-sm p-4 mt-2">
      <style>
        {`
         /* Hover */
.home-bg div .hover\:shadow-md{
 font-size:14px;
}

/* Font semibold */
.home-bg .space-y-2 .font-semibold{
 font-size:15px;
}

/* Font bold */
.home-bg .hover\:shadow-md .font-bold{
 font-size:15px;
}

`}
      </style>
      <div className="flex justify-center items-center mb-1 items-center">
        <h3 className="text-lg font-semibold text-gray-800 text-center">मेरठ का इंटरनेट गणित </h3>
      </div>
      <p className="text-end mb-3">
        <small>
          नवीनतम अपडेट : {new Intl.DateTimeFormat('hi-IN', { month: 'long' }).format(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))} {new Intl.DateTimeFormat('hi-IN', { year: 'numeric' }).format(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))}
        </small>
      </p>
      {internateData ? (
        <div className="space-y-3">
          {/* Data Table */}
          <div className="space-y-2">
            {internateData.city_info?.map((city, index) => {
              let categoryLabel = '';
              let categoryColor = '';
              let icon = '';
              let iconColor = '';

              switch (city.id) {
                case 11:
                  categoryLabel = 'जनसंख्या (2025)';
                  categoryColor = 'bg-purple-50 border-purple-200';
                  icon = 'fas fa-users';
                  iconColor = 'text-purple-600';
                  break;
                case 15:
                  categoryLabel = 'इंटरनेट उपयोगकर्ता';
                  categoryColor = 'bg-blue-50 border-blue-200';
                  icon = 'fas fa-globe';
                  iconColor = 'text-blue-600';
                  break;
                case 16:
                  categoryLabel = 'फेसबुक उपयोगकर्ता';
                  categoryColor = 'bg-blue-50 border-blue-200';
                  icon = 'fab fa-facebook';
                  iconColor = 'text-blue-600';
                  break;
                case 17:
                  categoryLabel = 'लिंक्डइन उपयोगकर्ता';
                  categoryColor = 'bg-blue-50 border-blue-200';
                  icon = 'fab fa-linkedin';
                  iconColor = 'text-blue-700';
                  break;
                case 18:
                  categoryLabel = 'ट्विटर उपयोगकर्ता';
                  categoryColor = 'bg-sky-50 border-sky-200';
                  icon = 'fab fa-twitter';
                  iconColor = 'text-dark';
                  break;
                default:
                  categoryLabel = city.title;
                  categoryColor = 'bg-white border-gray-200';
                  icon = 'fas fa-chart-bar';
                  iconColor = 'text-gray-600';
              }

              return (
                <div key={index} className={`  p-1 flex justify-between items-center `}>
                  <div className="flex items-center gap-3">
                    <i className={`${icon} text-2xl ${iconColor}`}></i>
                    <span className="text-base font-semibold text-gray-800">{categoryLabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{Number(city.value).toLocaleString('en-IN') || '-'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">कोई डेटा उपलब्ध नहीं</div>
      )}
      <div className="p-1 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <i className="fab fa-instagram text-xl text-pink-600"></i>
          <span className="text-base text-sm font-semibold text-gray-800">इंस्टाग्राम उपयोगकर्ता</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-gray-900">{Number(348900).toLocaleString('en-IN') || '-'}</span>
        </div>
      </div>
    </div >
  );
}
