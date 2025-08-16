import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Login failed' 
    }, { status: 500 });
  }
}
