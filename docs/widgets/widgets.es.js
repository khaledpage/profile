function n() {
  const e = getComputedStyle(document.documentElement);
  return {
    background: e.getPropertyValue("--background").trim(),
    foreground: e.getPropertyValue("--foreground").trim(),
    accent1: e.getPropertyValue("--accent-1").trim(),
    accent2: e.getPropertyValue("--accent-2").trim()
  };
}
function o(e, t = "Visitor") {
  n(), e.innerHTML = "";
  const r = document.createElement("div");
  r.style.padding = "12px 16px", r.style.borderRadius = "12px", r.style.border = "1px solid color-mix(in srgb, var(--foreground), transparent 85%)", r.style.background = "linear-gradient(180deg, color-mix(in srgb, var(--foreground), transparent 92%), color-mix(in srgb, var(--foreground), transparent 97%))", r.style.color = "var(--foreground)", r.textContent = `Hello ${t}!`, e.appendChild(r);
}
if (typeof window < "u") {
  const e = document.querySelector('[data-widget="greeting"]');
  e && o(e);
}
export {
  n as getThemeTokens,
  o as mountGreeting
};
