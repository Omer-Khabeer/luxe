// app/api/debug-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { customerEmail } = await request.json();
    
    if (!customerEmail) {
      return NextResponse.json({ 
        error: 'Please provide customerEmail in request body' 
      }, { status: 400 });
    }

    console.log('🔍 Testing email service with:', customerEmail);
    console.log('🔍 Environment check:');
    console.log('  - RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('  - FROM_EMAIL:', process.env.FROM_EMAIL);
    console.log('  - ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    
    // Test data with the provided email
    const testOrderData = {
      orderNumber: 'DEBUG-' + Date.now().toString().slice(-6),
      customerInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        email: customerEmail,
        address: 'Test Address 123',
        city: 'Test City',
        postalCode: '12345',
        country: 'Deutschland',
        phone: '+49 123 456789',
      },
      items: [
        {
          name: 'Test Digital Card',
          price: 9.99,
          quantity: 1,
          size: '250 gr',
        }
      ],
      subtotal: 9.99,
      shipping: 4.99,
      total: 14.98,
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };

    console.log('📧 Sending confirmation email to:', customerEmail);
    const confirmationResult = await emailService.sendOrderConfirmation(testOrderData);
    
    console.log('📧 Confirmation result:', confirmationResult);
    
    console.log('📧 Sending notification email to admin');
    const notificationResult = await emailService.sendOrderNotification(testOrderData);
    
    console.log('📧 Notification result:', notificationResult);

    return NextResponse.json({
      success: true,
      testOrderData,
      results: {
        confirmation: confirmationResult,
        notification: notificationResult,
      },
      environment: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.FROM_EMAIL,
        adminEmail: process.env.ADMIN_EMAIL,
      }
    });
    
  } catch (error) {
    console.error('❌ Debug email error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email debug endpoint. Send POST with { "customerEmail": "your@email.com" }',
    environment: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) + '...',
      fromEmail: process.env.FROM_EMAIL,
      adminEmail: process.env.ADMIN_EMAIL,
    }
  });
}