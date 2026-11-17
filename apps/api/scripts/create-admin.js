require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error(
      'Missing ADMIN_EMAIL or ADMIN_PASSWORD. Set them in your environment before running this script.',
    );
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const existing = await User.findOne({ email });
  const hashedPw = await bcrypt.hash(password, 12);

  if (existing) {
    existing.role = 'admin';
    existing.name = name || existing.name;
    existing.password = hashedPw;
    await existing.save();

    console.log(`Admin updated: ${existing.email} (id=${existing._id})`);
    await mongoose.disconnect();
    return;
  }

  const user = new User({
    email,
    password: hashedPw,
    name,
    role: 'admin',
  });

  await user.save();
  console.log(`Admin created: ${user.email} (id=${user._id})`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
