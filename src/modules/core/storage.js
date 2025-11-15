export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
