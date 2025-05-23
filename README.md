# PLAyhouse Creations - 3D Prints E-commerce

## Email Functionality Setup

To enable email functionality for order requests, you need to set up environment variables:

1. Create a `.env.local` file in the root directory with the following variables:
```
# Email Configuration
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@playcreations.com
STORE_EMAIL=Designs@playhousecreations.com
```

2. Replace `your-email@gmail.com` with your actual email address
3. Replace `your-app-password` with an app-specific password:
   - For Gmail, set up an app password: https://support.google.com/accounts/answer/185833
   - This is required for security if you have 2FA enabled

4. Set `STORE_EMAIL` to the desired recipient email (`Designs@playhousecreations.com`)

5. Install required dependencies:
```
npm install nodemailer
npm install @types/nodemailer @types/node --save-dev
```

This setup allows the contact form to send actual emails to your specified address, with a copy also sent to the customer for confirmation.
