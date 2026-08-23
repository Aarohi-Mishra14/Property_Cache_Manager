// Removes angle brackets so raw HTML/script tags can never be stored in
// component state, even before the backend sanitizes it again.
export function sanitizeText(value) {
    return String(value ?? '').replace(/[<>]/g, '');
}
