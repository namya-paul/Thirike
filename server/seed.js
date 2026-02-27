/**
 * THIRIKE — Database Seed Script
 * Run with: node seed.js
 * Seeds the database with sample lost & found items for testing.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');

const SAMPLE_LOST = [
  {
    itemName: 'Black Leather Wallet',
    category: 'Accessories',
    color: 'Black',
    brand: 'Leather Works',
    distinctiveFeatures: 'Has a small scratch on front, contains ID cards',
    dateLostOrFound: new Date('2024-02-10'),
    location: { type: 'Point', coordinates: [75.7804, 11.2588] },
    locationName: 'SM Street, Kozhikode',
    radius: 5,
    status: 'active',
  },
  {
    itemName: 'iPhone 14 Pro',
    category: 'Electronics',
    color: 'Deep Purple',
    brand: 'Apple',
    distinctiveFeatures: 'Cracked back glass, blue case',
    dateLostOrFound: new Date('2024-02-12'),
    location: { type: 'Point', coordinates: [75.7804, 11.2600] },
    locationName: 'Calicut Beach Road',
    radius: 3,
    status: 'active',
  },
  {
    itemName: 'Aadhar Card',
    category: 'Important Documents',
    color: 'White',
    distinctiveFeatures: 'Name: Rahul K, Issued 2019',
    dateLostOrFound: new Date('2024-02-14'),
    location: { type: 'Point', coordinates: [75.7804, 11.2550] },
    locationName: 'Palayam Bus Stand, Kozhikode',
    radius: 2,
    docType: 'Aadhar Card',
    maskedId: '5678',
    status: 'active',
  },
  {
    itemName: 'Blue Backpack',
    category: 'General Items',
    color: 'Blue',
    brand: 'Wildcraft',
    distinctiveFeatures: 'Contains textbooks, has a keychain of Eiffel Tower',
    dateLostOrFound: new Date('2024-02-15'),
    location: { type: 'Point', coordinates: [75.7804, 11.2570] },
    locationName: 'Kozhikode Railway Station',
    radius: 8,
    status: 'active',
  },
];

const SAMPLE_FOUND = [
  {
    itemName: 'Brown Leather Wallet',
    category: 'Accessories',
    color: 'Brown',
    distinctiveFeatures: 'Contains some cash and a photo, no ID cards',
    dateFoundOrFound: new Date('2024-02-11'),
    dateLostOrFound: new Date('2024-02-11'),
    location: { type: 'Point', coordinates: [75.7810, 11.2590] },
    locationName: 'Near SM Street, Kozhikode',
    radius: 5,
    finderEmail: 'encrypted_email_here',
    imageUrl: 'uploads/sample-wallet.jpg',
    status: 'active',
  },
  {
    itemName: 'Samsung Galaxy Phone',
    category: 'Electronics',
    color: 'Black',
    brand: 'Samsung',
    distinctiveFeatures: 'Screen cracked slightly, has a sticker on the back',
    dateFoundOrFound: new Date('2024-02-13'),
    dateLostOrFound: new Date('2024-02-13'),
    location: { type: 'Point', coordinates: [75.7800, 11.2605] },
    locationName: 'Beach Road, Kozhikode',
    radius: 3,
    finderEmail: 'encrypted_email_here',
    imageUrl: 'uploads/sample-phone.jpg',
    status: 'active',
  },
  {
    itemName: 'Student ID Card',
    category: 'Important Documents',
    distinctiveFeatures: 'ID card from NIT Calicut, photo visible',
    dateFoundOrFound: new Date('2024-02-14'),
    dateLostOrFound: new Date('2024-02-14'),
    location: { type: 'Point', coordinates: [75.7804, 11.2555] },
    locationName: 'Near Palayam, Kozhikode',
    radius: 2,
    handedToPolice: true,
    policeStation: 'Kozhikode Town Police Station',
    finderEmail: 'encrypted_email_here',
    imageUrl: 'uploads/sample-id.jpg',
    status: 'active',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await LostItem.deleteMany({});
    await FoundItem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert seed data
    await LostItem.insertMany(SAMPLE_LOST);
    await FoundItem.insertMany(SAMPLE_FOUND);

    console.log(`✅ Seeded ${SAMPLE_LOST.length} lost items`);
    console.log(`✅ Seeded ${SAMPLE_FOUND.length} found items`);
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
