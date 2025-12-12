
// Real Email Service Integration
// Strategy: Supabase Edge Function (Primary) -> EmailJS (Client Fallback) -> Dev Mode (Simulation)

import { supabase } from './supabaseClient';

// Helper to access environment variables safely
const getEnv = (key: string) => {
  // @ts-ignore
  if (import.meta.env && import.meta.env[key]) return import.meta.env[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return '';
};

export const emailService = {
  async sendEmail(to: string, subject: string, html: string) {
    
    // --- STRATEGY 1: SUPABASE EDGE FUNCTION (Secure/Backend) ---
    if (supabase) {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: { to, subject, html }
            });

            if (!error) {
                console.log('[Email Service] Email sent successfully via Supabase.');
                return true;
            } else {
                // Log but continue to fallbacks
                const msg = error.message || JSON.stringify(error);
                if (!msg.includes("Failed to send a request") && !msg.includes("404")) {
                    console.warn('[Email Service] Supabase error:', error);
                }
            }
        } catch (err) {
            // Silent catch for network errors to allow fallback
        }
    }

    // --- STRATEGY 2: EMAILJS (Client-Side Real Emails) ---
    // This allows sending emails directly from the browser without a backend.
    // Configure these keys in your .env file or Vercel/Netlify dashboard.
    const serviceId = getEnv('VITE_EMAILJS_SERVICE_ID');
    const templateId = getEnv('VITE_EMAILJS_TEMPLATE_ID');
    const publicKey = getEnv('VITE_EMAILJS_PUBLIC_KEY');

    if (serviceId && templateId && publicKey) {
        try {
            console.log('[Email Service] Attempting to send via EmailJS...');
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: serviceId,
                    template_id: templateId,
                    user_id: publicKey,
                    template_params: {
                        to_email: to,
                        subject: subject,
                        message: html // Ensure your EmailJS template has a {{{message}}} variable
                    }
                })
            });

            if (response.ok) {
                console.log('[Email Service] Email sent via EmailJS');
                return true;
            } else {
                console.warn('[Email Service] EmailJS failed:', await response.text());
            }
        } catch (e) {
            console.warn('[Email Service] EmailJS network error');
        }
    }

    // --- STRATEGY 3: DEV MODE (Simulation) ---
    // If no services are configured, return false.
    // The UI will handle this by showing the verification code directly to the user.
    console.log(`[Dev Mode] Email to ${to} simulated. (Configure VITE_EMAILJS_* keys for real emails)`);
    return false; 
  },

  async sendConfirmationEmail(email: string, code: string) {
    const subject = "Welcome to FlashAI - Verify your account";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Welcome to FlashAI! ⚡</h2>
        <p style="color: #475569; font-size: 16px;">Thanks for joining. Please verify your account to start generating flashcards.</p>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Your Verification Code</p>
            <h1 style="margin: 10px 0 0 0; color: #4f46e5; letter-spacing: 5px; font-size: 32px;">${code}</h1>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">This code will expire in 24 hours.</p>
      </div>
    `;
    
    return this.sendEmail(email, subject, html);
  },

  async sendWarningEmail(email: string, daysLeft: number) {
    const subject = `Action Required: Account deletion in ${daysLeft} days`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b91c1c;">⚠️ Action Required</h2>
        <p style="color: #475569; font-size: 16px;">Your FlashAI account has not been verified yet.</p>
        <p style="color: #475569; font-size: 16px;">It will be permanently deleted in <strong>${daysLeft} days</strong> if no action is taken.</p>
        <p style="margin-top: 20px;">Please log in and verify your email address immediately.</p>
      </div>
    `;
    return this.sendEmail(email, subject, html);
  },

  async sendDeletionNotice(email: string) {
    const subject = "Your FlashAI account has been deleted";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Account Deleted</h2>
        <p style="color: #475569; font-size: 16px;">Your account was not verified within the 7-day period and has been removed for security reasons.</p>
        <p style="color: #475569; font-size: 16px;">You are welcome to create a new account at any time.</p>
      </div>
    `;
    return this.sendEmail(email, subject, html);
  }
};
