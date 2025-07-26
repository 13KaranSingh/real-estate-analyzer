"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<null | any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const capRate =
    result?.rent && result?.price
      ? (((result.rent * 12) / result.price) * 100).toFixed(2)
      : null;

  return (
    <main className="min-h-screen bg-green text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Real Estate Analyzer</h1>

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter a property address"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !address}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Property"}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {result && (
          <div className="bg-gray-900 p-4 rounded space-y-2 border border-gray-700">
            {result.price && (
              <p>
                💰 <strong>Price:</strong> ${result.price.toLocaleString()}
              </p>
            )}
            {result.rent && (
              <p>
                🏠 <strong>Rent:</strong> ${result.rent.toLocaleString()}
              </p>
            )}
            {capRate && (
              <p>
                📈 <strong>Cap Rate:</strong> {capRate}%
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
