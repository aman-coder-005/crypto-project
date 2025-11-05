import React from "react";

const Leaderboard = ({ data }) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Rank</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Profit %</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data
                .sort((a, b) => b.profitPercentage - a.profitPercentage)
                .map((user, index) => (
                  <tr key={index} className="text-center">
                    <td
                      className={`border p-2 ${
                        index === 0
                          ? "text-yellow-600 font-bold"
                          : index === 1
                          ? "text-gray-600"
                          : index === 2
                          ? "text-orange-600"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </td>
                    <td className="border p-2">{user.username}</td>
                    <td className="border p-2">{user.profitPercentage}%</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td className="border p-2" colSpan="3">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
