import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);

    const idMatch = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const videoId = idMatch ? idMatch[1] : input.trim();

    try {
      const res = await fetch(`/api/info?videoId=${videoId}`);
      const json = await res.json();
      if (res.ok) setData(json);
      else setError(json.error);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>🎬 YouTube Video Info</h1>
      <form onSubmit={handleSubmit}>
        <input
          style={{ width: "100%", padding: "10px" }}
          placeholder="Paste YouTube URL or video ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#FF0000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Get Info"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px", background: "#fafafa", padding: "15px", borderRadius: "10px" }}>
          <img
            src={data.thumbnail}
            alt="thumb"
            style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
          />
          <h2>{data.title}</h2>
          <p><strong>Channel:</strong> {data.channel}</p>
          <p><strong>Views:</strong> {data.views}</p>
          <p><strong>Likes:</strong> {data.likes}</p>
          <p><strong>Duration:</strong> {data.duration}</p>
          <p><strong>Published:</strong> {new Date(data.publishedAt).toLocaleDateString()}</p>
          <p style={{ marginTop: "10px", fontSize: "14px" }}>{data.description}</p>
        </div>
      )}
    </main>
  );
            }
