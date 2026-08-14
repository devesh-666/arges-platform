import nodemailer from 'nodemailer';

/**
 * ARGES Vision — Automated Email Service
 * All emails use the site's dark spatial theme with the eye+lightning logo.
 * Gmail SMTP via App Password (EMAIL_USER + EMAIL_PASS env vars).
 */

const LOGO_B64 = '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';

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
      tls: { rejectUnauthorized: false },
    });
  }
  return _transporter;
}

type Tone = 'info' | 'danger' | 'warning' | 'success';

function wrap(opts: {
  title: string;
  body: string;
  tone?: Tone;
  ctaLabel?: string;
  ctaUrl?: string;
  meta?: Array<[string, string]>;
}): string {
  const { title, body, tone = 'info', ctaLabel, ctaUrl, meta } = opts;

  const toneColor =
    tone === 'danger' ? '#EF5350' :
    tone === 'warning' ? '#F9A825' :
    tone === 'success' ? '#4CAF50' : '#FF6B1A';

  const metaHtml = meta ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;">
        ${meta.map(([k, v]) => `
        <tr>
          <td style="padding:10px 18px;color:#8B8B9A;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:130px;">${k}</td>
          <td style="padding:10px 18px;color:#ffffff;font-size:14px;font-weight:600;">${v}</td>
        </tr>`).join('')}
      </table>` : '';

  const cta = ctaLabel && ctaUrl ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
        <tr><td align="center">
          <a href="${ctaUrl}" style="display:inline-block;background:${tone === 'info' ? '#FF6B1A' : toneColor};color:#000000;font-weight:700;padding:15px 42px;border-radius:999px;text-decoration:none;font-size:14px;letter-spacing:0.5px;">${ctaLabel}</a>
        </td></tr>
      </table>` : '';

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#000008;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;">ARGES Vision — Forging Light. Empowering Sight.</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000008;min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">

  <!-- ambient glow -->
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr><td style="background:linear-gradient(180deg,rgba(255,107,26,0.10) 0%,rgba(255,107,26,0) 60%);border-radius:32px;padding:4px;">

  <!-- glass card -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:28px;">

    <!-- header with logo -->
    <tr><td align="center" style="padding:40px 40px 8px;">
      <img src="data:image/png;base64,${LOGO_B64}" width="64" height="64" alt="ARGES Vision" style="display:block;margin:0 auto;" />
      <div style="margin-top:14px;font-size:22px;font-weight:800;letter-spacing:4px;color:#FF6B1A;">ARGES&nbsp;VISION</div>
      <div style="margin-top:4px;font-size:10px;letter-spacing:2px;color:#8B8B9A;text-transform:uppercase;">Forging Light &middot; Empowering Sight</div>
    </td></tr>

    <!-- tone strip -->
    <tr><td style="padding:20px 40px 0;">
      <div style="height:2px;background:linear-gradient(90deg,transparent,${toneColor},transparent);border-radius:2px;"></div>
    </td></tr>

    <!-- body -->
    <tr><td style="padding:28px 40px 8px;">
      <h1 style="margin:0 0 16px;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:-0.3px;">${title}</h1>
      <div style="color:#B9B9C6;font-size:14px;line-height:1.75;">${body}</div>
      ${metaHtml}
      ${cta}
    </td></tr>

    <!-- footer -->
    <tr><td style="padding:30px 40px 34px;">
      <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:22px;text-align:center;">
        <div style="color:#55555F;font-size:11px;line-height:1.8;">
          <span style="color:#FF6B1A;font-weight:600;">ARGES Vision</span> &mdash; AI Vision Ecosystem for the Visually Impaired<br>
          This is an automated message from the ARGES Vision safety system. Do not reply.<br>
          &copy; 2026 ARGES Vision &middot; Made in India
        </div>
      </div>
    </td></tr>

  </table>
  </td></tr>
  </table>

</td></tr>
</table>
</body></html>`;
}

async function send(to: string, subject: string, html: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[MAIL SKIPPED - no credentials] To: ${to} | Subject: ${subject}`);
    return false;
  }
  try {
    const from = `"ARGES Vision" <${process.env.EMAIL_USER}>`;
    await getTransporter().sendMail({ from, to, subject, html });
    console.log(`[MAIL SENT] To: ${to} | Subject: ${subject}`);
    return true;
  } catch (err) {
    console.error(`[MAIL FAILED] To: ${to}:`, (err as Error).message);
    return false;
  }
}

// ============ 1. WELCOME ============
export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const roleText: Record<string, string> = {
    family_head: 'You are the <b style="color:#4CAF50;">Family Head</b> — you manage the family tree, add members, and control device access.',
    family_member: 'You can now see the location of your loved one and request <b style="color:#FF6B1A;">consent-based</b> video access.',
    helper: 'Welcome to the <b style="color:#AB47BC;">Echo Network</b>. You can now help blind users who need vision assistance.',
    admin: 'You now have full access to the <b>ARGES Vision</b> control panel.',
    blind: 'Your ARGES Vision account is ready. Your glasses will be paired by your Family Head.',
  };
  return send(to, 'Welcome to ARGES Vision', wrap({
    title: `Welcome, ${name}!`,
    tone: 'info',
    body: `<p>Your ARGES Vision account has been created successfully.</p>
           <p>${roleText[role] || 'You can now sign in to your dashboard.'}</p>`,
    ctaLabel: 'Open Dashboard',
    ctaUrl: 'https://arges-vision.netlify.app/login',
  }));
}

// ============ 2. SOS ALERT ============
export async function sendSosAlertEmail(to: string, userName: string, location: string, lat: number, lng: number) {
  return send(to, `EMERGENCY: ${userName} triggered SOS`, wrap({
    title: `SOS Alert — ${userName}`,
    tone: 'danger',
    body: `<p style="color:#EF5350;font-weight:700;font-size:15px;">Emergency alert triggered.</p>
           <p><b style="color:#fff;">${userName}</b> has triggered an SOS from the ARGES glasses.</p>
           <p>Emergency access has been <b style="color:#4CAF50;">auto-granted</b>. Tap below to view live video and audio right now.</p>`,
    meta: [
      ['Location', location],
      ['Coordinates', `${lat.toFixed(4)}, ${lng.toFixed(4)}`],
      ['Access', 'AUTO-GRANTED'],
    ],
    ctaLabel: 'View Live Now',
    ctaUrl: 'https://arges-vision.netlify.app/family',
  }));
}

// ============ 3. FALL DETECTED ============
export async function sendFallAlertEmail(to: string, userName: string, location: string) {
  return send(to, `FALL DETECTED: ${userName}`, wrap({
    title: `Fall Detected — ${userName}`,
    tone: 'warning',
    body: `<p style="color:#F9A825;font-weight:700;font-size:15px;">A fall has been detected.</p>
           <p>The ARGES glasses of <b style="color:#fff;">${userName}</b> detected a possible fall.</p>
           <p>Emergency access has been <b style="color:#4CAF50;">auto-granted</b>. Please check on them immediately.</p>`,
    meta: [
      ['Location', location],
      ['Sensor', 'ADXL345 · 99.4% accuracy'],
    ],
    ctaLabel: 'View Live',
    ctaUrl: 'https://arges-vision.netlify.app/family',
  }));
}

// ============ 4. FACE MISMATCH ============
export async function sendFaceMismatchEmail(to: string, deviceName: string, userName: string) {
  return send(to, `UNVERIFIED WEARER: ${deviceName}`, wrap({
    title: 'Face Verification Failed',
    tone: 'danger',
    body: `<p style="color:#EF5350;font-weight:700;font-size:15px;">Unverified wearer detected.</p>
           <p>Device <b style="color:#fff;">${deviceName}</b> (registered to <b style="color:#fff;">${userName}</b>) has failed face verification multiple times.</p>
           <p>The glasses may be worn by someone else. The device will <b>auto-lock after 3 failed checks</b>.</p>`,
    meta: [
      ['Device', deviceName],
      ['Registered to', userName],
      ['Model', 'MobileFaceNet · 99.7%'],
    ],
    ctaLabel: 'Review Device',
    ctaUrl: 'https://arges-vision.netlify.app/family',
  }));
}

// ============ 5. CONSENT REQUEST ============
export async function sendConsentRequestEmail(to: string, requesterName: string, requesterRelation: string, blindUserName: string, durationMinutes: number) {
  return send(to, `${requesterName} requested video access to ${blindUserName}`, wrap({
    title: 'Consent Request Sent',
    tone: 'info',
    body: `<p><b style="color:#fff;">${requesterName}</b> (${requesterRelation}) has requested video/audio access to <b style="color:#fff;">${blindUserName}</b>.</p>
           <p>${blindUserName} will hear a voice prompt:</p>
           <p style="background:rgba(255,107,26,0.07);border:1px solid rgba(255,107,26,0.18);border-radius:12px;padding:14px 18px;color:#FFB266;font-style:italic;">"Your ${requesterRelation} ${requesterName} is requesting access to your camera and microphone for ${durationMinutes} minutes. Say accept or decline."</p>
           <p>You will be notified when they respond.</p>`,
    meta: [
      ['Requested by', `${requesterName} (${requesterRelation})`],
      ['Duration', `${durationMinutes} minutes`],
    ],
    ctaLabel: 'View Status',
    ctaUrl: 'https://arges-vision.netlify.app/family',
  }));
}

// ============ 6. CONSENT RESPONSE ============
export async function sendConsentResponseEmail(to: string, blindUserName: string, accepted: boolean, durationMinutes: number) {
  const extra = accepted
    ? `<p>Your <b style="color:#fff;">${durationMinutes}-minute</b> viewing session is now active. A reminder chime will play every 5 minutes.</p>`
    : '<p>You can send a new request at any time.</p>';
  return send(
    to,
    `${blindUserName} ${accepted ? 'accepted' : 'declined'} your request`,
    wrap({
      title: `Request ${accepted ? 'Accepted' : 'Declined'}`,
      tone: accepted ? 'success' : 'danger',
      body: `<p><b style="color:#fff;">${blindUserName}</b> has responded to your access request:</p>
             <p style="font-size:20px;font-weight:800;color:${accepted ? '#4CAF50' : '#EF5350'};">${accepted ? 'ACCEPTED' : 'DECLINED'}</p>
             ${extra}`,
      ctaLabel: accepted ? 'Start Viewing' : 'Try Again',
      ctaUrl: 'https://arges-vision.netlify.app/family',
    })
  );
}

// ============ 7. PASSWORD CHANGED ============
export async function sendPasswordChangedEmail(to: string, name: string) {
  return send(to, 'Your ARGES Vision password was changed', wrap({
    title: 'Password Changed',
    tone: 'info',
    body: `<p>Hi <b style="color:#fff;">${name}</b>,</p>
           <p>Your ARGES Vision account password was just changed.</p>
           <p style="color:#F9A825;">If this was not you, contact support immediately.</p>`,
    meta: [['Time', new Date().toLocaleString('en-IN')]],
  }));
}

// ============ 8. LOW BATTERY ============
export async function sendLowBatteryEmail(to: string, userName: string, battery: number) {
  return send(to, `Low Battery: ARGES glasses of ${userName}`, wrap({
    title: 'Low Battery Warning',
    tone: 'warning',
    body: `<p>The ARGES glasses of <b style="color:#fff;">${userName}</b> are running low on battery.</p>
           <p style="font-size:32px;font-weight:800;color:#F9A825;margin:12px 0;">${battery}%</p>
           <p>Please remind them to charge the glasses soon.</p>`,
    meta: [['Battery', `${battery}% remaining`]],
  }));
}
