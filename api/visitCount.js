let visitCounts = {}; // Временное хранилище для данных (вместо базы данных)

export default function handler(req, res) {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Метод GET: возвращает количество визитов
  if (req.method === 'GET') {
    const visitCount = visitCounts[userId] || 0;
    return res.status(200).json({ visitCount });
  }

  // Метод POST: увеличивает количество визитов
  if (req.method === 'POST') {
    visitCounts[userId] = (visitCounts[userId] || 0) + 1;
    return res.status(200).json({ visitCount: visitCounts[userId] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
