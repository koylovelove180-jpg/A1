import { sanitizeAnnouncementHtml, isAnnouncementEmpty } from '../utils/announcementHtml';

function AnnouncementContent({ content, htmlEnabled, className = '' }) {
  if (isAnnouncementEmpty(content)) return null;

  if (htmlEnabled) {
    const safeHtml = sanitizeAnnouncementHtml(content);
    if (!safeHtml.trim()) return null;

    return (
      <div
        className={`announcement-html mt-3 text-lg leading-8 text-orange-950 ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return (
    <p className={`mt-3 whitespace-pre-line text-lg leading-8 text-orange-950 ${className}`.trim()}>
      {content}
    </p>
  );
}

export default AnnouncementContent;
