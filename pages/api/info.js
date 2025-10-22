import axios from "axios";

// /api/info?videoId=xxxx
export default async function handler(req, res) {
  const { videoId } = req.query;
  const apiKey = process.env.YT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing YT_API_KEY environment variable" });
  }

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId query parameter" });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
    const response = await axios.get(url);
    const item = response.data.items?.[0];

    if (!item) return res.status(404).json({ error: "Video not found" });

    // duration convert PT#H#M#S → HH:MM:SS
    const dur = item.contentDetails.duration;
    const match = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const h = parseInt(match?.[1] || 0);
    const m = parseInt(match?.[2] || 0);
    const s = parseInt(match?.[3] || 0);
    const duration =
      (h ? h.toString().padStart(2, "0") + ":" : "") +
      m.toString().padStart(2, "0") +
      ":" +
      s.toString().padStart(2, "0");

    const data = {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.default?.url,
      duration,
      views: item.statistics.viewCount,
      likes: item.statistics.likeCount || 0,
    };

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}.
