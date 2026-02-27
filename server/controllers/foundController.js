const FoundItem = require('../models/FoundItem');

/**
 * @desc   Report a found item
 * @route  POST /api/found
 * @access Public
 */
const reportFoundItem = async (req, res) => {
  try {
    const {
      itemName, category, color, brand, height, width, size,
      distinctiveFeatures, dateFoundOrFound, timeFound,
      lat, lng, locationName, radius,
      finderEmail, finderPhone, handedToPolice, policeStation,
    } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location coordinates are required.' });
    }
    if (!finderEmail) {
      return res.status(400).json({ message: 'Finder email is required.' });
    }

    const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

    const item = await FoundItem.create({
      itemName,
      category,
      color,
      brand,
      height,
      width,
      size,
      distinctiveFeatures,
      dateFoundOrFound: dateFoundOrFound || new Date(),
      dateLostOrFound: dateFoundOrFound || new Date(),
      timeFound,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      locationName,
      radius: parseInt(radius) || 5,
      finderEmail,
      finderPhone,
      handedToPolice: handedToPolice === 'true' || handedToPolice === true,
      policeStation,
      imageUrl,
      reportedBy: req.user?._id || null,
    });

    res.status(201).json({
      message: 'Found item reported successfully. Thank you for helping!',
      item: {
        _id: item._id,
        itemName: item.itemName,
        category: item.category,
        status: item.status,
        createdAt: item.createdAt,
      },
    });
  } catch (err) {
    console.error('reportFoundItem error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Get all found items
 * @route  GET /api/found
 * @access Public
 */
const getFoundItems = async (req, res) => {
  try {
    const { category, search, status = 'active', lat, lng, radius, page = 1, limit = 20 } = req.query;

    const query = { status };
    if (category && category !== 'All') query.category = category;

    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { distinctiveFeatures: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    if (lat && lng) {
      const maxDist = (parseInt(radius) || 20) * 1000;
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: maxDist,
        },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FoundItem.countDocuments(query);
    const items = await FoundItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-finderEmail -finderPhone'); // hide contact info publicly

    res.json({
      items,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getFoundItems error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Get single found item
 * @route  GET /api/found/:id
 */
const getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id).select('-finderEmail -finderPhone');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    item.incrementViews().catch(() => {});
    res.json(item);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Item not found.' });
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Update found item status
 * @route  PATCH /api/found/:id
 */
const updateFoundItem = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await FoundItem.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'resolved' ? { resolvedAt: new Date() } : {}) },
      { new: true }
    ).select('-finderEmail -finderPhone');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Updated.', item });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Delete found item
 * @route  DELETE /api/found/:id
 */
const deleteFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Deleted.' });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  reportFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
};
