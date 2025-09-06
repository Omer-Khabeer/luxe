// app/api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    // Test data
    const testOrderData = {
      orderNumber: 'TEST123456',
      customerInfo: {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'test@example.com', // Change this to your email for testing
        address: 'Musterstraße 123',
        city: 'München',
        postalCode: '80331',
        country: 'Deutschland',
        phone: '+49 123 456789',
      },
      items: [
        {
          name: 'Elegance Pro Digital Card',
          price: 9.99,
          quantity: 1,
          size: '250 gr',
        },
        {
          name: 'Creative Pulse Digital Card',
          price: 9.99,
          quantity: 2,
          size: '250 gr',
        },
      ],
      subtotal: 29.97,
      shipping: 4.99,
      total: 34.96,
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };

    // Send test emails
    const results = await emailService.sendOrderEmails(testOrderData);

    return NextResponse.json({
      success: true,
      results,
      message: 'Test emails sent',
    });
  } catch (error) {
    console.error('Error sending test emails:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}