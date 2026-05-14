/**
 * Social & Contact URLs Configuration
 * Set VITE_* values in your .env file
 * Example: VITE_GITHUB_URL=https://github.com/yourusername
 */

// Helper function to safely get env variables
const getEnvVar = (key, defaultValue = '') => {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : defaultValue;
};

// Helper to validate URLs
const isValidUrl = (url) => {
  if (!url || url === '#') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Contact Email
export const CONTACT_EMAIL = getEnvVar('VITE_CONTACT_EMAIL', 'mdmuzammil5457@gmail.com');
export const mailtoHref = `mailto:${CONTACT_EMAIL}`;

// Social Media URLs with validation
export const githubHref = getEnvVar('VITE_GITHUB_URL');
export const xHref = getEnvVar('VITE_X_URL');
export const linkedinHref = getEnvVar('VITE_LINKEDIN_URL');

// Optional: Add more social links easily
export const instagramHref = getEnvVar('VITE_INSTAGRAM_URL');
export const facebookHref = getEnvVar('VITE_FACEBOOK_URL');

// Centralized social links configuration (easier to manage)
export const socialLinks = [
  {
    name: 'GitHub',
    url: githubHref,
    icon: 'fab fa-github',
    ariaLabel: 'GitHub Profile'
  },
  {
    name: 'LinkedIn',
    url: linkedinHref,
    icon: 'fab fa-linkedin-in',
    ariaLabel: 'LinkedIn Profile'
  },
  {
    name: 'X',
    url: xHref,
    icon: 'fab fa-x-twitter',
    ariaLabel: 'X Profile'
  },
  {
    name: 'Email',
    url: mailtoHref,
    icon: 'fas fa-envelope',
    ariaLabel: 'Send Email'
  }
].filter(link => link.url && link.url !== '#'); // Only show links that are configured

// Helper to get social links that are actually set
export const getActiveSocialLinks = () => {
  return socialLinks.filter(link => isValidUrl(link.url) || link.url === mailtoHref);
};

/**
 * Returns appropriate attributes for external links
 * - Adds target="_blank" and rel attributes for HTTP/HTTPS links
 * - Returns empty object for mailto links or invalid URLs
 */
export function externalAttrs(href) {
  if (!href || href === '#') return {};
  
  // Don't add external attributes to mailto links
  if (href.startsWith('mailto:')) return {};
  
  // Only add external attributes to valid HTTP/HTTPS URLs
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { 
      target: '_blank', 
      rel: 'noopener noreferrer' // Better security: noopener before noreferrer
    };
  }
  
  return {};
}

// Utility to check if a social link is configured
export const isSocialConfigured = (socialName) => {
  const link = socialLinks.find(s => s.name.toLowerCase() === socialName.toLowerCase());
  return link && link.url && link.url !== '#';
};

// Default export for convenience
export default {
  CONTACT_EMAIL,
  mailtoHref,
  githubHref,
  xHref,
  linkedinHref,
  socialLinks,
  externalAttrs,
  getActiveSocialLinks,
  isSocialConfigured
};