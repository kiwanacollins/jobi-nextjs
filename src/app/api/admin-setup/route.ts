import { NextRequest, NextResponse } from 'next/server';
import { initializeAdmins, ensureAdminPrivileges } from '@/lib/admin-setup';
import { auth } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, email, clerkId } = body;

    switch (action) {
      case 'initialize':
        await initializeAdmins();
        return NextResponse.json({ 
          success: true, 
          message: 'Admin initialization completed' 
        });

      case 'promote':
        if (!email || !clerkId) {
          return NextResponse.json({ 
            error: 'Email and clerkId are required for promotion' 
          }, { status: 400 });
        }
        
        const result = await ensureAdminPrivileges(clerkId, email);
        return NextResponse.json(result);

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use "initialize" or "promote"' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin setup API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initializeAdmins();
    return NextResponse.json({ 
      success: true, 
      message: 'Admin initialization completed via GET request' 
    });
  } catch (error) {
    console.error('Admin setup API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}