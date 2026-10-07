export const gameURL = new URL(import.meta.env.BASE_URL, location.origin).href;
const apiRoot = new URL('__studio_api/', gameURL);
export const clone = value => structuredClone(value);
export function readView(key, fallback) {
  try { return sessionStorage.getItem(`princess-studio:${key}`) || fallback; }
  catch { return fallback; }
}
export function rememberView(key, value) {
  try { sessionStorage.setItem(`princess-studio:${key}`, value); }
  catch { /* View persistence is optional; authoring saves still use the API. */ }
}
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const label = value => String(value).replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');

export async function request(path, options = {}) {
  const response = await fetch(new URL(path, apiRoot), options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Studio request failed (${response.status}).`);
  return data;
}

export function element(tag, attributes = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key in node) node[key] = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

export function field(title, control) {
  return element('label', { className: 'studio-field' }, [
    element('span', { text: label(title) }), control,
  ]);
}
