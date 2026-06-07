import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'h3',
  'h4',
  'div',
  'span',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'width', 'height', 'class', 'target', 'rel'];

export function sanitizeAnnouncementHtml(html) {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|data:image\/):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}

export function isAnnouncementEmpty(content) {
  if (!content) return true;
  const stripped = content.replace(/<[^>]*>/g, '').trim();
  return stripped.length === 0;
}

export function buildQrAnnouncementHtml(dataUrl, label = 'สแกน QR Code ด้านล่าง') {
  return `<p>${label}</p>\n<img src="${dataUrl}" alt="QR Code" width="200" height="200" />`;
}
