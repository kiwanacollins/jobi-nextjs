import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { isAdminEmail } from '@/lib/admin-setup';

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        signedIn: false
      });
    }

    const user = await getUserById({ userId });
    
    if (!user || user.error) {
      return NextResponse.json({
        error: 'User not found in database',
        userId,
        userFound: false,
        details: user
      });
    }

    const shouldBeAdmin = isAdminEmail(user.email);

    return NextResponse.json({
      signedIn: true,
      userId,
      userFound: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        role: user.role,
        clerkId: user.clerkId
      },
      shouldBeAdmin,
      adminEmails: process.env.ADMIN_EMAILS,
      canAccessAdminDashboard: !!user.isAdmin
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}