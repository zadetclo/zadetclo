// ===== КОРЗИНА =====
const CART_KEY = 'zadet_cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: id, name: name, price: price, image: image, qty: 1 });
    }
    saveCart(cart);
    openCart();
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
}

function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    saveCart(cart);
}

function getCartTotal() {
    return getCart().reduce(function(sum, item) {
        return sum + item.price * item.qty;
    }, 0);
}

function getCartCount() {
    return getCart().reduce(function(sum, item) {
        return sum + item.qty;
    }, 0);
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const count = getCartCount();
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

function renderCart() {
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!list) return;

    const cart = getCart();

    if (cart.length === 0) {
        list.innerHTML = '<p class="cart-empty">Корзина пуста.<br>Добавь что-нибудь мрачное.</p>';
        if (totalEl) totalEl.textContent = '0 ₽';
        return;
    }

    let html = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        html += '<div class="cart-item">' +
            '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
            '<div class="cart-item-info">' +
                '<span class="cart-item-name">' + item.name + '</span>' +
                '<span class="cart-item-price">' + item.price + ' ₽</span>' +
                '<div class="cart-item-qty">' +
                    '<button onclick="changeQty(\'' + item.id + '\', -1)">−</button>' +
                    '<span>' + item.qty + '</span>' +
                    '<button onclick="changeQty(\'' + item.id + '\', 1)">+</button>' +
                '</div>' +
            '</div>' +
            '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')">✕</button>' +
        '</div>';
    }
    list.innerHTML = html;

    if (totalEl) totalEl.textContent = getCartTotal() + ' ₽';
}

function openCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
}

function closeCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCart();

    const cartBtn = document.getElementById('cart-btn');
    const closeBtn = document.getElementById('cart-close');
    const overlay = document.getElementById('cart-overlay');

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    // ===== КНОПКА «ОФОРМИТЬ ЗАКАЗ» =====
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (getCart().length === 0) {
                alert('Корзина пуста — добавь что-нибудь 🖤');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
});