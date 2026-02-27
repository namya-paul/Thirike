const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

/**
 * Calculate a match score between two items (0-100)
 */
const calculateScore = (lostItem, foundItem) => {
  let score = 0;

  // Category match (most important)
  if (lostItem.category === foundItem.category) score += 35;

  // Color match
  if (lostItem.color && foundItem.color) {
    if (lostItem.color.toLowerCase() === foundItem.color.toLowerCase()) score += 20;
    else if (lostItem.color.toLowerCase().includes(foundItem.color.toLowerCase()) ||
             foundItem.color.toLowerCase().includes(lostItem.color.toLowerCase())) score += 10;
  }

  // Brand match
  if (lostItem.brand && foundItem.brand) {
    if (lostItem.brand.toLowerCase() === foundItem.brand.toLowerCase()) score += 20;
  }

  // Keyword matching in features
  if (lostItem.distinctiveFeatures && foundItem.distinctiveFeatures) {
    const lostWords = lostItem.distinctiveFeatures.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const foundWords = foundItem.distinctiveFeatures.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const common = lostWords.filter(w => foundWords.includes(w));
    if (common.length > 0) score += Math.min(15, common.length * 5);
  }

  // Item name keyword match
  if (lostItem.itemName && foundItem.itemName) {
    const lostName = lostItem.itemName.toLowerCase();
    const foundName = foundItem.itemName.toLowerCase();
    if (lostName === foundName) score += 10;
    else if (lostName.includes(foundName) || foundName.includes(lostName)) score += 5;
  }

  return Math.min(100, score);
};

/**
 * @desc   Find matches for a lost item
 * @route  GET /api/match/lost/:id
 */
const getMatchesForLost = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem) return res.status(404).json({ message: 'Lost item not found.' });

    const [lng, lat] = lostItem.location.coordinates;
    const radiusMeters = (lostItem.radius || 10) * 1000;

    // Find found items within the radius
    const foundItems = await FoundItem.find({
      status: 'active',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusMeters,
        },
      },
    }).select('-finderEmail -finderPhone').limit(50);

    // Score and sort
    const scored = foundItems
      .map(fi => ({ item: fi, score: calculateScore(lostItem, fi) }))
      .filter(m => m.score >= 30) // only relevant matches
      .sort((a, b) => b.score - a.score);

    res.json({
      lostItem: lostItem.itemName,
      matches: scored,
      totalMatches: scored.length,
    });
  } catch (err) {
    console.error('getMatchesForLost error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Find matches for a found item
 * @route  GET /api/match/found/:id
 */
const getMatchesForFound = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    if (!foundItem) return res.status(404).json({ message: 'Found item not found.' });

    const [lng, lat] = foundItem.location.coordinates;
    const radiusMeters = (foundItem.radius || 10) * 1000;

    const lostItems = await LostItem.find({
      status: 'active',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusMeters,
        },
      },
    }).select('-secretIdentifier -verificationAnswer -email -phone').limit(50);

    const scored = lostItems
      .map(li => ({ item: li, score: calculateScore(li, foundItem) }))
      .filter(m => m.score >= 30)
      .sort((a, b) => b.score - a.score);

    res.json({
      foundItem: foundItem.itemName,
      matches: scored,
      totalMatches: scored.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getMatchesForLost, getMatchesForFound };
