const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_PATTERN.test(value.trim());
}

export function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
