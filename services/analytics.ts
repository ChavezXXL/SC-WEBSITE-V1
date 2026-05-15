/**
 * Google Ads conversion tracking helpers.
 *
 * Setup: the gtag.js loader is in index.html. This module just emits
 * conversion events into window.gtag (already initialized at page load).
 *
 * To activate: replace AW_CONVERSION_ID + the label placeholders with the
 * real values from Google Ads → Tools → Conversions → [conversion action].
 * Each conversion action in Google Ads gives you a `send_to` value that
 * looks like `AW-1234567890/AbC-123xyz`.
 */

// TODO: replace with real Google Ads conversion ID once Santiago grabs it
// from Google Ads → Tools → Conversions → Google tag setup.
export const AW_CONVERSION_ID = 'AW-CONVERSION_ID_PLACEHOLDER';

// TODO: replace these with real `send_to` values once conversion actions
// are created in Google Ads for Phone Click + Form Submit.
const SEND_TO = {
  phoneClick: `${AW_CONVERSION_ID}/PHONE_CLICK_LABEL`,
  formSubmit: `${AW_CONVERSION_ID}/FORM_SUBMIT_LABEL`,
} as const;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function isGtagReady(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

function isPlaceholder(): boolean {
  return AW_CONVERSION_ID.includes('PLACEHOLDER');
}

/**
 * Fire a Google Ads conversion event for phone-click on the "Call Us" link.
 * Safe to call even if gtag is not loaded or the ID is still a placeholder —
 * it will just be a no-op (and log a warning in dev).
 */
export function trackPhoneClick(): void {
  if (!isGtagReady()) return;
  if (isPlaceholder()) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'scprecisiondeburring.com') {
      console.info('[analytics] trackPhoneClick (placeholder — no real conversion fired)');
    }
    return;
  }
  window.gtag!('event', 'conversion', {
    send_to: SEND_TO.phoneClick,
    value: 0,
    currency: 'USD',
  });
}

/**
 * Fire a Google Ads conversion event when the contact form is submitted
 * successfully (after Netlify accepts the POST).
 */
export function trackFormSubmit(): void {
  if (!isGtagReady()) return;
  if (isPlaceholder()) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'scprecisiondeburring.com') {
      console.info('[analytics] trackFormSubmit (placeholder — no real conversion fired)');
    }
    return;
  }
  window.gtag!('event', 'conversion', {
    send_to: SEND_TO.formSubmit,
    value: 0,
    currency: 'USD',
  });
}
