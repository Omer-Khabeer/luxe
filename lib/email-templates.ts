// lib/email-templates.ts

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

interface OrderData {
  orderNumber: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  createdAt: string;
}

export const orderConfirmationTemplate = (orderData: OrderData): string => {
  const itemsHtml = orderData.items.map(item => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 0; font-family: Arial, sans-serif;">
        <div style="font-weight: 600; color: #111827;">${item.name}</div>
        ${item.size ? `<div style="font-size: 14px; color: #6b7280;">Größe: ${item.size}</div>` : ''}
        <div style="font-size: 14px; color: #6b7280;">Menge: ${item.quantity}</div>
      </td>
      <td style="padding: 12px 0; text-align: right; font-family: Arial, sans-serif; font-weight: 600;">
        €${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bestellbestätigung</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fef7ed;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background-color: #d97706; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
            Luxe Digital Cards
          </h1>
        </div>
        
        <!-- Success Icon & Message -->
        <div style="padding: 40px 20px; text-align: center; background-color: #f0fdf4;">
          <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px;">✓</span>
          </div>
          <h2 style="color: #059669; margin: 0 0 10px; font-size: 28px;">
            Vielen Dank für Ihre Bestellung!
          </h2>
          <p style="color: #065f46; margin: 0; font-size: 16px;">
            Ihre Bestellung wurde erfolgreich verarbeitet.
          </p>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px 20px;">
          <h3 style="color: #92400e; margin: 0 0 20px; font-size: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            Bestelldetails
          </h3>
          
          <div style="margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif;">Bestellnummer:</td>
                <td style="padding: 8px 0; font-weight: 600; text-align: right; font-family: Arial, sans-serif;">${orderData.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif;">Bestelldatum:</td>
                <td style="padding: 8px 0; font-weight: 600; text-align: right; font-family: Arial, sans-serif;">
                  ${new Date(orderData.createdAt).toLocaleDateString('de-DE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif;">Status:</td>
                <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #10b981; font-family: Arial, sans-serif;">
                  ${orderData.paymentStatus === 'paid' ? 'Bezahlt' : 'Ausstehend'}
                </td>
              </tr>
            </table>
          </div>

          <!-- Items -->
          <h3 style="color: #92400e; margin: 0 0 20px; font-size: 18px;">
            Bestellte Artikel
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            ${itemsHtml}
          </table>

          <!-- Totals -->
          <div style="border-top: 2px solid #f59e0b; padding-top: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif;">Zwischensumme:</td>
                <td style="padding: 8px 0; text-align: right; font-family: Arial, sans-serif;">€${orderData.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-family: Arial, sans-serif;">Versandkosten:</td>
                <td style="padding: 8px 0; text-align: right; font-family: Arial, sans-serif;">
                  €${orderData.shipping.toFixed(2)}
                </td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px; color: #92400e; font-family: Arial, sans-serif;">
                  Gesamtbetrag:
                </td>
                <td style="padding: 12px 0; font-weight: bold; font-size: 18px; text-align: right; color: #92400e; font-family: Arial, sans-serif;">
                  €${orderData.total.toFixed(2)}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Shipping Address -->
        <div style="padding: 0 20px 30px;">
          <h3 style="color: #92400e; margin: 0 0 15px; font-size: 18px;">
            Lieferadresse
          </h3>
          <div style="background-color: #fef7ed; padding: 15px; border-radius: 8px; font-family: Arial, sans-serif; color: #92400e;">
            <strong>${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}</strong><br>
            ${orderData.customerInfo.address}<br>
            ${orderData.customerInfo.postalCode} ${orderData.customerInfo.city}<br>
            ${orderData.customerInfo.country}
            ${orderData.customerInfo.phone ? `<br>Tel: ${orderData.customerInfo.phone}` : ''}
          </div>
        </div>

        <!-- Next Steps -->
        <div style="padding: 0 20px 30px;">
          <h3 style="color: #92400e; margin: 0 0 15px; font-size: 18px;">
            Wie geht es weiter?
          </h3>
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 10px; color: #1e40af; font-family: Arial, sans-serif;">
              <strong>📦 Versand:</strong> Ihre Bestellung wird innerhalb von 1-2 Werktagen versendet.
            </p>
            <p style="margin: 0; color: #1e40af; font-family: Arial, sans-serif;">
              <strong>📧 Tracking:</strong> Sie erhalten eine separate E-Mail mit der Sendungsverfolgung.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #92400e; color: white; padding: 30px 20px; text-align: center;">
          <p style="margin: 0 0 15px; font-size: 16px; font-family: Arial, sans-serif;">
            Vielen Dank für Ihr Vertrauen!
          </p>
          <p style="margin: 0; font-size: 14px; color: #fed7aa; font-family: Arial, sans-serif;">
            Bei Fragen erreichen Sie uns unter: support@luxedigitalcards.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderNotificationTemplate = (orderData: OrderData): string => {
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Neue Bestellung erhalten</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Neue Bestellung erhalten</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Bestelldetails</h2>
          
          <p><strong>Bestellnummer:</strong> ${orderData.orderNumber}</p>
          <p><strong>Kunde:</strong> ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}</p>
          <p><strong>E-Mail:</strong> ${orderData.customerInfo.email}</p>
          <p><strong>Gesamtbetrag:</strong> €${orderData.total.toFixed(2)}</p>
          <p><strong>Status:</strong> ${orderData.paymentStatus === 'paid' ? 'Bezahlt' : 'Ausstehend'}</p>
          
          <h3 style="color: #1f2937; margin-top: 30px;">Bestellte Artikel:</h3>
          <ul>
            ${orderData.items.map(item => `
              <li>${item.name} ${item.size ? `(${item.size})` : ''} - Menge: ${item.quantity} - €${(item.price * item.quantity).toFixed(2)}</li>
            `).join('')}
          </ul>
          
          <h3 style="color: #1f2937; margin-top: 30px;">Lieferadresse:</h3>
          <p>
            ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}<br>
            ${orderData.customerInfo.address}<br>
            ${orderData.customerInfo.postalCode} ${orderData.customerInfo.city}<br>
            ${orderData.customerInfo.country}
            ${orderData.customerInfo.phone ? `<br>Tel: ${orderData.customerInfo.phone}` : ''}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};