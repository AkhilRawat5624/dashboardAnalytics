const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["viewer", "admin", "analyst"], default: "viewer" },
  mfaEnabled: { type: Boolean, default: false },
  recoveryEmail: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(uri, {
      dbName: 'dashboardAnalytics',
    });

    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@example.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Email:', adminEmail);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: adminEmail,
      username: 'admin',
      passwordHash,
      role: 'admin',
      mfaEnabled: false,
      recoveryEmail: adminEmail,
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Username:', admin.username);
    console.log('🎭 Role:', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🚀 You can now sign in at: http://localhost:3000/auth/signin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();
