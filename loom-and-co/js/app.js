/* Loom & Co. — shared store logic, header behaviour, helpers */

const STORAGE_KEYS = {
  cart: 'loomco_cart',
  wishlist: 'loomco_wishlist',
  profile: 'loomco_profile',
  orders: 'loomco_orders',
  outfits: 'loomco_outfits',
};

/* ---------- safe storage helpers ---------- */

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable (private mode, quota) — fail silently, UI still works in-memory */
  }
}

/* ---------- cart ---------- */

function getCart() {
  return readStore(STORAGE_KEYS.cart, []);
}

function setCart(cart) {
  writeStore(STORAGE_KEYS.cart, cart);
  updateHeaderBadges();
}

function addToCart(productId, size, qty) {
  qty = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const existing = cart.find(line => line.productId === Number(productId) && line.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ lineId: `${productId}-${size}-${Date.now()}`, productId: Number(productId), size, qty });
  }
  setCart(cart);
}

function updateCartQty(lineId, qty) {
  qty = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const line = cart.find(l => l.lineId === lineId);
  if (line) line.qty = qty;
  setCart(cart);
}

function removeFromCart(lineId) {
  setCart(getCart().filter(l => l.lineId !== lineId));
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, l) => {
    const product = getProductById(l.productId);
    return product ? sum + product.price * l.qty : sum;
  }, 0);
}

/* ---------- wishlist ---------- */

function getWishlist() {
  return readStore(STORAGE_KEYS.wishlist, []);
}

function setWishlist(ids) {
  writeStore(STORAGE_KEYS.wishlist, ids);
  updateHeaderBadges();
}

function isWishlisted(productId) {
  return getWishlist().includes(Number(productId));
}

function toggleWishlist(productId) {
  productId = Number(productId);
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
    setWishlist(list);
    return true;
  }
  list.splice(idx, 1);
  setWishlist(list);
  return false;
}

function removeFromWishlist(productId) {
  setWishlist(getWishlist().filter(id => id !== Number(productId)));
}

/* ---------- profile / orders / outfits ---------- */

function getProfile() {
  return readStore(STORAGE_KEYS.profile, {
    name: 'Guest Shopper',
    email: '',
    address: { line1: '', city: '', state: '', zip: '', phone: '' },
  });
}

function setProfile(profile) {
  writeStore(STORAGE_KEYS.profile, profile);
}

function getOrders() {
  return readStore(STORAGE_KEYS.orders, []);
}

function addOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  writeStore(STORAGE_KEYS.orders, orders);
}

function getOutfits() {
  return readStore(STORAGE_KEYS.outfits, []);
}

function addOutfit(outfit) {
  const outfits = getOutfits();
  outfits.unshift(outfit);
  writeStore(STORAGE_KEYS.outfits, outfits);
}

function removeOutfit(outfitId) {
  writeStore(STORAGE_KEYS.outfits, getOutfits().filter(o => o.id !== outfitId));
}

/* ---------- formatting ---------- */

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function starString(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

/* ---------- product image placeholder (no external assets needed) ---------- */

function productImageStyle(product) {
  const h = product.hue;
  return `background: linear-gradient(135deg, hsl(${h} 70% 88%), hsl(${(h + 40) % 360} 65% 78%));`;
}

const CATEGORY_ICON = {
  dresses: '👗', tops: '👚', jeans: '👖', 'kurti-set': '🥻',
  jackets: '🧥', shoes: '👟', accessories: '👜',
};

function productImageHtml(product, extraClass) {
  const icon = CATEGORY_ICON[product.category] || '🛍️';
  return `<div class="prod-img ${extraClass || ''}" style="${productImageStyle(product)}" aria-hidden="true">
    <span class="prod-img-icon">${icon}</span>
    ${product.tag ? `<span class="prod-tag">${escapeHtml(product.tag)}</span>` : ''}
  </div>`;
}

/* ---------- product card (reused on home / shop / product / outfit builder) ---------- */

function productCardHtml(product) {
  const wished = isWishlisted(product.id);
  return `
  <article class="product-card" data-id="${product.id}">
    <a class="product-card-link" href="product.html?id=${product.id}">
      ${productImageHtml(product)}
      <div class="product-card-body">
        <h3 class="product-card-name">${escapeHtml(product.name)}</h3>
        <div class="product-card-meta">
          <span class="price">${money(product.price)}</span>
          <span class="rating" title="${product.rating} out of 5">${starString(product.rating)} <span class="rating-num">${product.rating}</span></span>
        </div>
      </div>
    </a>
    <div class="product-card-actions">
      <button type="button" class="btn btn-primary btn-sm js-add-cart" data-id="${product.id}">Add to Cart</button>
      <button type="button" class="icon-btn js-toggle-wish ${wished ? 'is-active' : ''}" data-id="${product.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from wishlist' : 'Add to wishlist'}">${wished ? '♥' : '♡'}</button>
    </div>
  </article>`;
}

/* ---------- toast ---------- */

let toastTimer = null;
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- header: badges, mobile nav, global add-to-cart/wishlist delegation ---------- */

function updateHeaderBadges() {
  document.querySelectorAll('.js-cart-count').forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.classList.toggle('is-hidden', n === 0);
  });
  document.querySelectorAll('.js-wish-count').forEach(el => {
    const n = getWishlist().length;
    el.textContent = n;
    el.classList.toggle('is-hidden', n === 0);
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.js-nav-toggle');
  const nav = document.querySelector('.js-nav-menu');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initHeaderSearch() {
  const form = document.querySelector('.js-search-form');
  if (!form) return;
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === 'shop.html') return; /* shop.html wires up its own live in-page search */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="search"]');
    const q = (input && input.value.trim()) || '';
    window.location.href = `shop.html${q ? `?q=${encodeURIComponent(q)}` : ''}`;
  });
}

/* global delegated handlers for add-to-cart / wishlist buttons rendered via productCardHtml */
function initGlobalProductActions() {
  document.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('.js-add-cart');
    if (cartBtn) {
      const product = getProductById(cartBtn.dataset.id);
      if (product) {
        addToCart(product.id, product.sizes[0], 1);
        toast(`Added "${product.name}" to cart`);
      }
      return;
    }
    const wishBtn = e.target.closest('.js-toggle-wish');
    if (wishBtn) {
      const product = getProductById(wishBtn.dataset.id);
      if (!product) return;
      const nowWished = toggleWishlist(product.id);
      wishBtn.classList.toggle('is-active', nowWished);
      wishBtn.textContent = nowWished ? '♥' : '♡';
      wishBtn.setAttribute('aria-pressed', String(nowWished));
      toast(nowWished ? `Saved "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`);
    }
  });
}

function highlightActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.js-nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderSearch();
  initGlobalProductActions();
  highlightActiveNavLink();
  updateHeaderBadges();
});
