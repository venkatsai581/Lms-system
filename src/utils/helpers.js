export const initials = (name = '') =>
  name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';

export const categorySymbol = category =>
  category === 'Design' ? '✳' : category === 'Data Science' ? '▥' : category === 'Programming' ? '⌘' : '</>';

export const formatPrice = price => (!price ? 'Free' : `$${price}`);

export const slugify = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const todayLabel = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
