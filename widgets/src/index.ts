// Example small widget: theme token reader and simple greeting
export function getThemeTokens() {
  const styles = getComputedStyle(document.documentElement);
  return {
    background: styles.getPropertyValue('--background').trim(),
    foreground: styles.getPropertyValue('--foreground').trim(),
    accent1: styles.getPropertyValue('--accent-1').trim(),
    accent2: styles.getPropertyValue('--accent-2').trim(),
  };
}

export function mountGreeting(el: HTMLElement, name = 'Visitor') {
  const tokens = getThemeTokens();
  el.innerHTML = '';
  const box = document.createElement('div');
  box.style.padding = '12px 16px';
  box.style.borderRadius = '12px';
  box.style.border = '1px solid color-mix(in srgb, var(--foreground), transparent 85%)';
  box.style.background = 'linear-gradient(180deg, color-mix(in srgb, var(--foreground), transparent 92%), color-mix(in srgb, var(--foreground), transparent 97%))';
  box.style.color = 'var(--foreground)';
  box.textContent = `Hello ${name}!`;
  el.appendChild(box);
}

// Auto-mount if a placeholder exists
if (typeof window !== 'undefined') {
  const target = document.querySelector('[data-widget="greeting"]') as HTMLElement | null;
  if (target) mountGreeting(target);
}
