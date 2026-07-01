// Enterprise Mall - Format Utility Functions
// Provides formatting for points, dates, and order numbers

import dayjs from 'dayjs';

/** Format points with comma separation */
export function formatPoints(points: number): string {
  return points.toLocaleString('zh-CN');
}

/** Format date string to readable format */
export function formatDate(dateStr: string, format: string = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(dateStr).format(format);
}

/** Format order number for display */
export function formatOrderNo(orderNo: string): string {
  return orderNo;
}

/** Format relative time (e.g., "3 minutes ago") */
export function formatRelativeTime(dateStr: string): string {
  const now = dayjs();
  const date = dayjs(dateStr);
  const diffMinutes = now.diff(date, 'minute');

  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  const diffHours = now.diff(date, 'hour');
  if (diffHours < 24) return `${diffHours}小时前`;
  const diffDays = now.diff(date, 'day');
  if (diffDays < 7) return `${diffDays}天前`;
  return date.format('YYYY-MM-DD');
}

/** Truncate text with ellipsis */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
