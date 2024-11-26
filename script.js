// Inicializar o carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função para limpar o carrinho
function clearCart() {
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      cart = []; // Esvazia o carrinho
      localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza o localStorage
      updateCartModal(); // Atualiza o modal para refletir o estado vazio
      updateCartCounter(); // Atualiza o contador do carrinho
  }
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = ''; // Limpa os itens do modal
  document.getElementById('totalPrice').textContent = 'Total: R$ 0.00'; // Zera o total
}

// Função para mostrar os itens do carrinho no modal
function displayCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = ''; // Limpar a lista do modal

  let total = 0;
  let totalWithDiscount = 0;
  let coralCount = 0;

  // Adicionar os itens do carrinho
  cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      coralCount += item.quantity;
      const li = document.createElement('li');
      li.textContent = `${item.quantity}x ${item.product} - R$ ${itemTotal.toFixed(2)}`;
      cartItemsContainer.appendChild(li);
  });

  // Calcular o valor com desconto
  if (coralCount >= 4) {
      const discountBundles = Math.floor(coralCount / 4); // Número de pacotes de 4 corais
      const discountedPrice = discountBundles * 100; // Cada pacote custa R$100
      const remainingCorals = coralCount % 4; // Corais fora dos pacotes
      const remainingPrice = remainingCorals * (total / coralCount); // Preço proporcional dos corais restantes
      totalWithDiscount = discountedPrice + remainingPrice;
  } else {
      totalWithDiscount = total; // Sem desconto se menos de 4 corais
  }

  // Exibir o total e valor com desconto
  document.getElementById('totalPrice').textContent = `Total: R$ ${total.toFixed(2)}`;
  document.getElementById('discountedPrice').textContent = `Valor com desconto: R$ ${totalWithDiscount.toFixed(2)}`;
}

// Adicionar produto ao carrinho
function addToCart(product, price) {
  const itemIndex = cart.findIndex(item => item.product === product);
  if (itemIndex >= 0) {
      cart[itemIndex].quantity++;
  } else {
      cart.push({ product, price, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));

  // Reproduzir o som de popup
  const popupSound = document.getElementById('popupSound');
  popupSound.play(); // Reproduzir som
  updateCartCounter(); // Atualizar contador de itens no carrinho
}

// Função para abrir o modal do carrinho
function openCartModal() {
  const modal = document.getElementById('cartModal');
  modal.style.display = 'block';
  displayCartItems();

  // Adicionar evento para fechar o modal ao clicar fora dele
  window.onclick = function(event) {
      const modalContent = document.querySelector('.cart-modal-content');
      if (event.target === modal) {
          closeCartModal(); // Fecha o modal se clicar fora da área interna
      }
  };
}

// Função para fechar o modal
function closeCartModal() {
  const modal = document.getElementById('cartModal');
  modal.style.display = 'none';

  // Remove o evento de clique fora do modal quando ele for fechado
  window.onclick = null;
}

// Função para enviar o pedido via WhatsApp
function sendOrder() {
  const customerName = document.getElementById('customerName').value;
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (!customerName || cart.length === 0) {
      alert('Por favor, preencha o nome e adicione itens ao carrinho.');
      return;
  }

  let message = 'Oi Fabiano, esse é meu pedido:\n';
  let total = 0;
  let totalWithDiscount = 0;
  let coralCount = 0;

  // Montar a mensagem com os itens do pedido
  cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      coralCount += item.quantity;
      message += `${item.quantity}x ${item.product} - R$ ${itemTotal.toFixed(2)}\n`;
  });

  // Calcular o desconto
  if (coralCount >= 4) {
      const discountBundles = Math.floor(coralCount / 4); // Número de pacotes de 4 corais
      const discountedPrice = discountBundles * 100; // Cada pacote custa R$100
      const remainingCorals = coralCount % 4; // Corais fora dos pacotes
      const remainingPrice = remainingCorals * (total / coralCount); // Preço proporcional dos corais restantes
      totalWithDiscount = discountedPrice + remainingPrice;
  } else {
      totalWithDiscount = total; // Sem desconto se menos de 4 corais
  }

  // Adicionar total e descontos à mensagem
  message += `\nTotal: R$ ${total.toFixed(2)}`;
  message += `\nValor com desconto: R$ ${totalWithDiscount.toFixed(2)}`;
  message += `\nForma de pagamento: ${paymentMethod}`;
  message += `\nNome do cliente: ${customerName}`;

  // Enviar para o WhatsApp
  const whatsappUrl = `https://wa.me/5585991291645?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Atualizar contador do carrinho
function updateCartCounter() {
  const cartCounter = document.getElementById('cartCounter');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.textContent = totalItems;
}

// Ao carregar a página, atualizar o contador com o valor do LocalStorage
window.onload = () => {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartCounter();
};
