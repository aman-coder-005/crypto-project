import { useEffect, useState } from "react";
import axios from "axios";

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/news");
        setNews(data.data); // Mediastack returns { data: [...] }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Crypto News</h2>
      {news.length === 0 ? (
        <p className="text-gray-500">Loading news...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col"
            >
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(article.published_at).toLocaleString()}
              </p>
              <p className="mt-3 text-gray-600 line-clamp-3">
                {article.description || "No description available."}
              </p>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-blue-600 font-medium hover:underline"
                >
                  Read more →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
