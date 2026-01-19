import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface BookingEmailData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  propertyTitle: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  currency: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    await resend.emails.send({
      from: "STOODIO <noreply@stoodio.com>",
      to: [data.guestEmail],
      subject: `Booking Confirmed - ${data.propertyTitle}`,
      html: getBookingConfirmationTemplate(data),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendHostBookingNotification(data: BookingEmailData) {
  try {
    await resend.emails.send({
      from: "STOODIO <noreply@stoodio.com>",
      to: [data.hostEmail],
      subject: `New Booking - ${data.propertyTitle}`,
      html: getHostBookingNotificationTemplate(data),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending host notification email:", error);
    return { success: false, error };
  }
}

export async function sendBookingCancellationEmail(data: BookingEmailData) {
  try {
    await resend.emails.send({
      from: "STOODIO <noreply@stoodio.com>",
      to: [data.guestEmail],
      subject: `Booking Cancelled - ${data.propertyTitle}`,
      html: getBookingCancellationTemplate(data),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    return { success: false, error };
  }
}

export async function sendBookingReminderEmail(data: BookingEmailData) {
  try {
    await resend.emails.send({
      from: "STOODIO <noreply@stoodio.com>",
      to: [data.guestEmail],
      subject: `Upcoming Booking Reminder - ${data.propertyTitle}`,
      html: getBookingReminderTemplate(data),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return { success: false, error };
  }
}

// Email Templates

function getBookingConfirmationTemplate(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .detail-row { margin: 15px 0; padding: 10px; background: white; border-radius: 6px; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .detail-value { color: #111827; margin-top: 5px; }
          .total { font-size: 24px; font-weight: bold; color: #2563eb; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.guestName},</p>
            <p>Great news! Your booking has been confirmed.</p>

            <div class="detail-row">
              <div class="detail-label">Property</div>
              <div class="detail-value">${data.propertyTitle}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Booking ID</div>
              <div class="detail-value">${data.bookingId}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Check-in</div>
              <div class="detail-value">${new Date(data.startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Check-out</div>
              <div class="detail-value">${new Date(data.endDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Total Price</div>
              <div class="total">${data.currency} ${(data.totalPrice / 100).toLocaleString()}</div>
            </div>

            <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact the host.</p>

            <div class="footer">
              <p>Thank you for choosing STOODIO!</p>
              <p>&copy; ${new Date().getFullYear()} STOODIO. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getHostBookingNotificationTemplate(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .detail-row { margin: 15px 0; padding: 10px; background: white; border-radius: 6px; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .detail-value { color: #111827; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Booking Received!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.hostName},</p>
            <p>You have received a new booking for your property.</p>

            <div class="detail-row">
              <div class="detail-label">Property</div>
              <div class="detail-value">${data.propertyTitle}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Guest</div>
              <div class="detail-value">${data.guestName} (${data.guestEmail})</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Check-in</div>
              <div class="detail-value">${new Date(data.startDate).toLocaleDateString()}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Check-out</div>
              <div class="detail-value">${new Date(data.endDate).toLocaleDateString()}</div>
            </div>

            <p style="margin-top: 30px;">Please review the booking details and prepare for your guest's arrival.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getBookingCancellationTemplate(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <p>Hi ${data.guestName},</p>
            <p>Your booking for ${data.propertyTitle} has been cancelled.</p>
            <p>Booking ID: ${data.bookingId}</p>
            <p>If you have any questions, please contact support.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getBookingReminderTemplate(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${data.guestName},</p>
            <p>This is a reminder about your upcoming booking at ${data.propertyTitle}.</p>
            <p>Check-in: ${new Date(data.startDate).toLocaleDateString()}</p>
            <p>We look forward to seeing you!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
