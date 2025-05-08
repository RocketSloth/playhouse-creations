import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true,
      debug: process.env.NODE_ENV === 'development',
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

    const storeEmailAddress = process.env.STORE_EMAIL || 'Designs@playhousecreations.com';

    // Email to store about new subscription
    const storeEmail = {
      from: `"PLAyhouse Creations" <${process.env.EMAIL_FROM || 'noreply@playcreations.com'}>`,
      to: storeEmailAddress,
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p>A new user has subscribed to the newsletter:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    // Confirmation email to subscriber
    const subscriberEmail = {
      from: `"PLAyhouse Creations" <${process.env.EMAIL_FROM || 'noreply@playcreations.com'}>`,
      to: email,
      subject: 'Welcome to PLAyhouse Creations Newsletter!',
      html: `
        <h2>Welcome to PLAyhouse Creations!</h2>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates about:</p>
        <ul>
          <li>New product releases</li>
          <li>Special offers and discounts</li>
          <li>Custom design opportunities</li>
          <li>3D printing tips and tricks</li>
        </ul>
        <p>If you have any questions, please contact us at ${storeEmailAddress}.</p>
        <p>Thank you for choosing PLAyhouse Creations!</p>
      `,
    };

    // Send emails
    try {
      const storeResult = await transporter.sendMail(storeEmail);
      console.log(`Store notification email sent: ${storeResult.messageId}`);
      
      const subscriberResult = await transporter.sendMail(subscriberEmail);
      console.log(`Subscriber confirmation email sent: ${subscriberResult.messageId}`);
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
} 