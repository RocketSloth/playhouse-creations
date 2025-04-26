import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { CartItem } from '@/components/cart-provider';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address, city, state, zip, message, preferredContact, cartItems, subtotal } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !cartItems) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`Processing request for ${firstName} ${lastName} (${email})`);

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true, // Enable logging
      debug: process.env.NODE_ENV === 'development', // Show debug output when in development
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Email transport verified successfully');
    } catch (verifyError) {
      console.error('Email transport verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Email service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Generate request number
    const requestNumber = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    console.log(`Generated request number: ${requestNumber}`);

    // Format cart items for email
    const cartItemsList = cartItems.map((item: CartItem) => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    const storeEmailAddress = process.env.STORE_EMAIL || 'Designs@playhousecreations.com';
    console.log(`Sending order details to store email: ${storeEmailAddress}`);

    // Email to store
    const storeEmail = {
      from: `"PLAyhouse Creations" <${process.env.EMAIL_FROM || 'noreply@playcreations.com'}>`,
      to: storeEmailAddress,
      subject: `New Order Request: ${requestNumber}`,
      html: `
        <h2>New Order Request: ${requestNumber}</h2>
        <p><strong>From:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Contact Method:</strong> ${preferredContact}</p>
        <p><strong>Address:</strong> ${address}, ${city}, ${state} ${zip}</p>
        
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
          </tr>
          ${cartItemsList}
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="padding: 8px;"><strong>$${subtotal.toFixed(2)}</strong></td>
          </tr>
        </table>
        
        <h3>Additional Message:</h3>
        <p>${message || 'No additional message provided.'}</p>
      `,
    };

    // Confirmation email to customer
    const customerEmail = {
      from: `"PLAyhouse Creations" <${process.env.EMAIL_FROM || 'noreply@playcreations.com'}>`,
      to: email,
      subject: `Your Order Request Confirmation: ${requestNumber}`,
      html: `
        <h2>Thank you for your order request!</h2>
        <p>We have received your request (${requestNumber}) and will get back to you within 1-2 business days with pricing and availability.</p>
        
        <h3>Your Request Details:</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}, ${city}, ${state} ${zip}</p>
        
        <h3>Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
          </tr>
          ${cartItemsList}
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="padding: 8px;"><strong>$${subtotal.toFixed(2)}</strong></td>
          </tr>
        </table>
        
        <p>Please note: This is a request only. We will contact you with final pricing, shipping costs, and payment options after reviewing your request.</p>
        
        <p>If you have any questions, please reply to this email or contact us at ${storeEmailAddress}.</p>
        
        <p>Thank you for choosing PLAyhouse Creations!</p>
      `,
    };

    // Send emails
    try {
      const storeResult = await transporter.sendMail(storeEmail);
      console.log(`Store email sent: ${storeResult.messageId}`);
      
      const customerResult = await transporter.sendMail(customerEmail);
      console.log(`Customer confirmation email sent: ${customerResult.messageId}`);
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      return NextResponse.json(
        { error: 'Failed to send emails. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`Request ${requestNumber} processed successfully`);
    return NextResponse.json({ 
      success: true,
      message: 'Request submitted successfully',
      requestNumber
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
} 