
# StudyMate Delivery Optimization Guide

To ensure your password reset emails land in the **Primary Inbox** (not Spam), you must configure your domain's DNS records.

## 1. Deliverability Pillars

### SPF (Sender Policy Framework)
Prevents spoofing by listing which servers are allowed to send email on behalf of your domain.
*   **Record Type**: TXT
*   **Example (for Resend)**: `v=spf1 include:amazonses.com ~all`

### DKIM (DomainKeys Identified Mail)
Adds a digital signature to emails so the receiving server can verify the email wasn't tampered with.
*   **Record Type**: CNAME / TXT
*   **Implementation**: Your email provider (Resend/SendGrid) will generate 3 CNAME records. Add these to your DNS (Cloudflare/GoDaddy/Route53).

### DMARC (Domain-based Message Authentication, Reporting, and Conformance)
Tells the receiving server what to do if SPF or DKIM fails.
*   **Record Type**: TXT
*   **Recommended Record**: `v=DMARC1; p=quarantine; adkim=r; aspf=r;`
    *   `p=quarantine`: If it fails, put it in the Spam folder instead of rejecting it entirely.

## 2. Production API Recommendations

For a Node.js backend to support this frontend, use **Resend**:

```javascript
// npm install resend
import { Resend } from 'resend';

const resend = new Resend('re_123456789');

await resend.emails.send({
  from: 'StudyMate <security@yourdomain.com>',
  to: 'user@example.com',
  subject: 'Verify your identity',
  html: '<strong>Your token is 123456</strong>'
});
```

## 3. Top Deliverability Tips
1.  **Warm up your domain**: Don't send 1,000 emails on day one.
2.  **Use a dedicated subdomain**: Use `mail.studymate.com` instead of the root `studymate.com`.
3.  **Monitor Reputation**: Use Google Postmaster Tools to track your spam rate.
