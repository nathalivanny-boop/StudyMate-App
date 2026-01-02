
/**
 * PRODUCTION EMAIL SERVICE (REFERENCE)
 * In a real production environment, you would use a service like Resend, SendGrid, or Postmark.
 * Below is the logic for a Resend integration (Recommended for "Direct to Inbox").
 */

export interface EmailData {
  to: string;
  subject: string;
  nickname: string;
  token: string;
}

export async function triggerRecoveryEmail(data: EmailData): Promise<boolean> {
  console.log(`[EMAIL SERVICE] Initializing secure transfer to: ${data.to}`);

  // HTML Template that matches the App's UI
  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; background-color: #f0d9eb; padding: 40px; border-radius: 40px;">
      <div style="background-color: white; padding: 40px; border-radius: 30px; border: 2px solid black; max-width: 400px; margin: auto; text-align: center;">
        <h1 style="font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 10px;">Study Mate</h1>
        <p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px;">Security Verification</p>
        
        <p style="font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.6;">Hello ${data.nickname},</p>
        <p style="font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.6; margin-bottom: 30px;">
          You requested a password reset. Use the secure code below to access your account. This code expires in <b>60 minutes</b>.
        </p>
        
        <div style="background-color: #000; color: #fff; padding: 20px; font-size: 32px; font-weight: 900; letter-spacing: 10px; border-radius: 20px; margin-bottom: 30px;">
          ${data.token}
        </div>
        
        <p style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    </div>
  `;

  try {
    /** 
     * MOCK IMPLEMENTATION FOR BROWSER
     * In Production, you would call:
     * await fetch('https://api.resend.com/emails', { ...apiKey, body: { to, subject, html } });
     */
    
    // For this prototype, we'll use the mailto link to simulate the "Trigger"
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(`Your Study Mate Recovery Code: ${data.token}\n\nThis code expires in 1 hour.`);
    
    // Open system mailer (Fall-back for browser prototypes)
    window.location.href = `mailto:${data.to}?subject=${subject}&body=${body}`;
    
    return true;
  } catch (error) {
    console.error("Email trigger failed:", error);
    return false;
  }
}
