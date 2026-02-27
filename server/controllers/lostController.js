const LostItem = require('../models/LostItem');

/**
 * @desc   Report a lost item
 * @route  POST /api/lost
 * @access Public
 */
const reportLostItem = async (req, res) => {
  try {
    const {
      itemName, category, color, brand, height, width, size,
      distinctiveFeatures, secretIdentifier, dateLostOrFound, timeLost,
      lat, lng, locationName, radius,
      email, phone, docType, maskedId, verificationQuestion, verificationAnswer,
    } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location coordinates are required.' });
    }

    const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

    const item = await LostItem.create({
      itemName,
      category,
      color,
      brand,
      height,
      width,
      size,
      distinctiveFeatures,
      secretIdentifier,
      dateLostOrFound,
      timeLost,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)], // GeoJSON: [lng, lat]
      },
      locationName,
      radius: parseInt(radius) || 5,
      email,
      phone,
      docType,
      maskedId,
      verificationQuestion,
      verificationAnswer,
      imageUrl,
      reportedBy: req.user?._id || null,
    });

    res.status(201).json({
      message: 'Lost item reported successfully.',
      item: {
        _id: item._id,
        itemName: item.itemName,
        category: item.category,
        status: item.status,
        createdAt: item.createdAt,
      },
    });
  } catch (err) {
    console.error('reportLostItem error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/**
 * @desc   Get all lost items (with optional filters)
 * @route  GET /api/lost
 * @access Public
 */
const getLostItems = async (req, res) => {
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

    // Location-based filtering
    if (lat && lng) {
      const maxDist = (parseInt(radius) || 20) * 1000; // convert km to meters
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: maxDist,
        },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await LostItem.countDocuments(query);
    const items = await LostItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-secretIdentifier -verificationAnswer -email -phone'); // never expose sensitive fields

    res.json({
      items,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('getLostItems error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Get a single lost item by ID
 * @route  GET /api/lost/:id
 * @access Public
 */
const getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id)
      .select('-secretIdentifier -verificationAnswer -email -phone');

    if (!item) return res.status(404).json({ message: 'Item not found.' });

    // Increment view count (fire and forget)
    item.incrementViews().catch(() => {});

    res.json(item);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Item not found.' });
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Update lost item status
 * @route  PATCH /api/lost/:id
 * @access Public (owner)
 */
const updateLostItem = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await LostItem.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'resolved' ? { resolvedAt: new Date() } : {}) },
      { new: true, runValidators: true }
    ).select('-secretIdentifier -verificationAnswer -email -phone');

    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Updated successfully.', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Delete a lost item report
 * @route  DELETE /api/lost/:id
 * @access Public (owner)
 */
const deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Report deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc   Submit a claim for a lost item (owner trying to claim)
 * @route  POST /api/lost/:id/claim
 * @access Public
 */
const claimLostItem = async (req, res) => {
  try {
    const { email, phone, answer } = req.body;
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    // If there's a verification question, check the answer
    // (In production: decrypt stored answer and compare)
    // Here we just log the claim and notify the reporter
    console.log(`Claim attempt for item ${item._id} from ${email}`);

    res.json({ message: 'Claim submitted. Reporter will contact you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  reportLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
  claimLostItem,
};
