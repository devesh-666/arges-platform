import nodemailer from 'nodemailer';

/**
 * Automated Email Service
 * Uses Gmail SMTP (set EMAIL_USER + EMAIL_PASS env vars).
 * EMAIL_PASS must be a Gmail App Password (not your normal password).
 * Get one at: https://myaccount.google.com/apppasswords
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

const FROM = `"ARGES Vision" <${process.env.EMAIL_USER || 'noreply@argesvision.com'}>`;
const BRAND = '#FF6B1A';

function wrap(title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string): string {
  const cta = ctaLabel && ctaUrl
    ? `<div style="text-align:center;margin-top:28px;"><a href="${ctaUrl}" style="display:inline-block;background:${BRAND};color:#000;font-weight:600;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;">${ctaLabel}</a></div>`
    : '';
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#000008;font-family:Segoe UI,Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
<div style="text-align:center;margin-bottom:24px;">
<div style="display:inline-block;padding:12px 28px;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);">
<span style="color:${BRAND};font-weight:700;font-size:20px;letter-spacing:2px;">ARGES VISION</span>
</div></div>
<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:32px;">
<h1 style="color:#fff;font-size:22px;margin:0 0 16px;">${title}</h1>
<div style="color:#bbb;font-size:14px;line-height:1.7;">${bodyHtml}</div>
${cta}
</div>
<div style="text-align:center;color:#555;font-size:11px;margin-top:24px;">
ARGES Vision &mdash; Forging Light. Empowering Sight.<br>
This is an automated message. Do not reply.
</div></div></body></html>`;
}

async function send(to: string, subject: string, html: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[MAIL SKIPPED - no credentials] To: ${to} | Subject: ${subject}`);
    return false;
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    console.log(`[MAIL SENT] To: ${to} | Subject: ${subject}`);
    return true;
  } catch (err) {
    console.error(`[MAIL FAILED] To: ${to}:`, (err as Error).message);
    return false;
  }
}

// ============ EMAIL TEMPLATES ============

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const roleText: Record<string, string> = {
    family_head: 'You are the Family Head. You manage the family tree, add members, and control device access.',
    family_member: 'You can now see the location of your loved one and request consent-based video access.',
    helper: 'Welcome to the Echo Network. You can now help blind users who need vision assistance.',
    admin: 'You now have full access to the ARGES Vision control panel.',
    blind: 'Your ARGES Vision account is ready. Your glasses will be paired by your Family Head.',
  };
  return send(to, 'Welcome to ARGES Vision', wrap(
    `Welcome, ${name}!`,
    `<p>Your ARGES Vision account has been created.</p>
     <p>${roleText[role] || 'You can now sign in to your dashboard.'}</p>`,
    'Open Dashboard', 'https://arges-vision.netlify.app/login'
  ));
}

export async function sendSosAlertEmail(to: string, userName: string, location: string, lat: number, lng: number) {
  return send(to, `EMERGENCY: ${userName} triggered SOS`, wrap(
    `SOS Alert: ${userName}`,
    `<p><b style="color:#EF5350;">Emergency alert triggered.</b></p>
     <p><b>${userName}</b> has triggered an SOS from the ARGES glasses.</p>
     <p><b>Location:</b> ${location}<br>
     <b>Coordinates:</b> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
     <p>Emergency access has been auto-granted. Click below to view live video and audio.</p>`,
    'View Live Now', 'https://arges-vision.netlify.app/family'
  ));
}

export async function sendConsentRequestEmail(to: string, requesterName: string, requesterRelation: string, blindUserName: string, durationMinutes: number) {
  return send(to, `${requesterName} requested video access to ${blindUserName}`, wrap(
    'Consent Request Sent',
    `<p><b>${requesterName}</b> (${requesterRelation}) has requested video/audio access to <b>${blindUserName}</b> for ${durationMinutes} minutes.</p>
     <p>${blindUserName} will hear a voice prompt and must say "accept" or "decline".</p>
     <p>You will be notified when they respond.</p>`,
    'View Status', 'https://arges-vision.netlify.app/family'
  ));
}

export async function sendConsentResponseEmail(to: string, blindUserName: string, accepted: boolean, durationMinutes: number) {
  const status = accepted
    ? '<b style="color:#4CAF50;">ACCEPTED</b>'
    : '<b style="color:#EF5350;">DECLINED</b>';
  const extra = accepted
    ? `<p>Your ${durationMinutes}-minute viewing session is now active.</p>`
    : '<p>You can send a new request at any time.</p>';
  return send(
    to,
    `${blindUserName} ${accepted ? 'accepted' : 'declined'} your request`,
    wrap(`Request ${accepted ? 'Accepted' : 'Declined'}`,
      `<p><b>${blindUserName}</b> has responded to your access request: ${status}</p>${extra}`,
      accepted ? 'Start Viewing' : 'Try Again',
      'https://arges-vision.netlify.app/family'
    )
  );
}

export async function sendFallAlertEmail(to: string, userName: string, location: string) {
  return send(to, `FALL DETECTED: ${userName}`, wrap(
    `Fall Detected: ${userName}`,
    `<p><b style="color:#F9A825;">A fall has been detected.</b></p>
     <p>The ARGES glasses of <b>${userName}</b> detected a possible fall at <b>${location}</b>.</p>
     <p>Emergency access has been auto-granted. Please check immediately.</p>`,
    'View Live', 'https://arges-vision.netlify.app/family'
  ));
}

export async function sendFaceMismatchEmail(to: string, deviceName: string, userName: string) {
  return send(to, `UNVERIFIED WEARER: ${deviceName}`, wrap(
    'Face Verification Failed',
    `<p><b style="color:#EF5350;">Unverified wearer detected.</b></p>
     <p>Device <b>${deviceName}</b> (registered to <b>${userName}</b>) has failed face verification multiple times.</p>
     <p>The glasses may be worn by someone else. The device will auto-lock after 3 failed checks.</p>`,
    'Review Device', 'https://arges-vision.netlify.app/family'
  ));
}

export async function sendPasswordChangedEmail(to: string, name: string) {
  return send(to, 'Your ARGES Vision password was changed', wrap(
    'Password Changed',
    `<p>Hi <b>${name}</b>,</p>
     <p>Your ARGES Vision account password was just changed.</p>
     <p>If this was not you, contact support immediately.</p>`
  ));
}

export async function sendLowBatteryEmail(to: string, userName: string, battery: number) {
  return send(to, `Low Battery: ARGES glasses of ${userName}`, wrap(
    'Low Battery Warning',
    `<p>The ARGES glasses of <b>${userName}</b> are at <b style="color:#F9A825;">${battery}%</b> battery.</p>
     <p>Please remind them to charge the glasses soon.</p>`
  ));
}
