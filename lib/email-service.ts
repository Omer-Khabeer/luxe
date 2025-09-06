// lib/email-service.ts
import { Resend } from 'resend';
import { orderConfirmationTemplate, orderNotificationTemplate } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface EmailOrderData {
  orderNumber: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  createdAt: string;
}

export class EmailService {
  private fromEmail: string;
  private adminEmail: string;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@luxedigitalcards.com';
  }

  /**
   * Send order confirmation email to customer
   */
  async sendOrderConfirmation(orderData: EmailOrderData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('Attempting to send confirmation email to:', orderData.customerInfo.email);
      console.log('Using FROM email:', this.fromEmail);
      console.log('Order number:', orderData.orderNumber);

      if (!orderData.customerInfo.email) {
        console.error('No customer email provided for confirmation');
        return { success: false, error: 'Customer email is required' };
      }

      const emailData = {
        from: `Luxe Digital Cards <${this.fromEmail}>`,
        to: [orderData.customerInfo.email],
        subject: `Bestellbestätigung #${orderData.orderNumber} - Vielen Dank für Ihre Bestellung`,
        html: orderConfirmationTemplate(orderData),
      };

      console.log('Email payload:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        htmlLength: emailData.html.length
      });

      const { data, error } = await resend.emails.send(emailData);

      if (error) {
        console.error('Resend API error for confirmation email:', error);
        return { success: false, error: JSON.stringify(error) };
      }

      console.log('Order confirmation email sent successfully:', data?.id);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send order notification email to admin/store owner
   */
  async sendOrderNotification(orderData: EmailOrderData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: `Luxe Digital Cards System <${this.fromEmail}>`,
        to: [this.adminEmail],
        subject: `Neue Bestellung #${orderData.orderNumber} - €${orderData.total.toFixed(2)}`,
        html: orderNotificationTemplate(orderData),
      });

      if (error) {
        console.error('Error sending notification email:', error);
        return { success: false, error: error.message };
      }

      console.log('Order notification email sent:', data?.id);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Failed to send notification email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send both confirmation and notification emails
   */
  async sendOrderEmails(orderData: EmailOrderData): Promise<{
    confirmation: { success: boolean; messageId?: string; error?: string };
    notification: { success: boolean; messageId?: string; error?: string };
  }> {
    const [confirmationResult, notificationResult] = await Promise.all([
      this.sendOrderConfirmation(orderData),
      this.sendOrderNotification(orderData),
    ]);

    return {
      confirmation: confirmationResult,
      notification: notificationResult,
    };
  }

  /**
   * Send shipping notification email
   */
  async sendShippingNotification(orderData: {
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    trackingNumber: string;
    carrier: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: `Luxe Digital Cards <${this.fromEmail}>`,
        to: [orderData.customerEmail],
        subject: `Ihre Bestellung #${orderData.orderNumber} ist unterwegs`,
        html: `
          <!DOCTYPE html>
          <html lang="de">
          <head>
            <meta charset="UTF-8">
            <title>Versandbenachrichtigung</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #fef7ed;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #d97706; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Ihre Bestellung ist unterwegs!</h1>
              </div>
              
              <div style="padding: 30px;">
                <p>Hallo ${orderData.customerName},</p>
                
                <p>Gute Nachrichten! Ihre Bestellung #${orderData.orderNumber} wurde versendet und ist jetzt unterwegs zu Ihnen.</p>
                
                <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 10px; color: #1e40af;">Sendungsverfolgung</h3>
                  <p style="margin: 0;"><strong>Versanddienstleister:</strong> ${orderData.carrier}</p>
                  <p style="margin: 5px 0 0;"><strong>Tracking-Nummer:</strong> ${orderData.trackingNumber}</p>
                </div>
                
                <p>Sie können den Status Ihrer Sendung jederzeit online verfolgen.</p>
                
                <p>Vielen Dank für Ihre Bestellung!</p>
                
                <p>Ihr Luxe Digital Cards Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('Error sending shipping notification:', error);
        return { success: false, error: error.message };
      }

      console.log('Shipping notification email sent:', data?.id);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Failed to send shipping notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();