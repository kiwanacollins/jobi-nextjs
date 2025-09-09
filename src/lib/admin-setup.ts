import { connectToDatabase } from './mongoose';
import User from '@/database/user.model';

/**
 * Check if an email is in the admin list from environment variables
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Automatically promote users to admin if their email is in the admin list
 */
export async function ensureAdminPrivileges(clerkId: string, email: string) {
  try {
    if (!isAdminEmail(email)) {
      return { success: false, message: 'Email not in admin list' };
    }

    await connectToDatabase();
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // If user is already admin, no need to update
    if (user.isAdmin) {
      return { success: true, message: 'User is already admin', wasAlreadyAdmin: true };
    }

    // Promote user to admin
    await User.findByIdAndUpdate(user._id, { 
      isAdmin: true,
      role: user.role || 'employee' // Keep existing role or default to employee
    });

    return { 
      success: true, 
      message: `${email} has been promoted to admin`, 
      wasAlreadyAdmin: false 
    };
  } catch (error) {
    console.error('Error ensuring admin privileges:', error);
    return { 
      success: false, 
      message: 'Failed to set admin privileges', 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Initialize admin users on app startup
 */
export async function initializeAdmins() {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    
    if (adminEmails.length === 0) {
      console.log('No admin emails configured');
      return;
    }

    await connectToDatabase();
    
    console.log(`Checking ${adminEmails.length} admin email(s)...`);
    
    for (const email of adminEmails) {
      // Find user by email and promote to admin if exists
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (user && !user.isAdmin) {
        await User.findByIdAndUpdate(user._id, { isAdmin: true });
        console.log(`✅ Promoted ${email} to admin`);
      } else if (user && user.isAdmin) {
        console.log(`✅ ${email} is already admin`);
      } else {
        console.log(`⏳ ${email} not found (will be promoted when they sign up)`);
      }
    }
  } catch (error) {
    console.error('Error initializing admins:', error);
  }
}