import dbconnect from '../lib/db';
import User from '../models/User';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    await dbconnect();

    const adminEmail = 'admin@example.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Email:', adminEmail);
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

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
