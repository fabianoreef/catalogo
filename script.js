// Inicializar o carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função para rolar até o topo da página
function scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth' // A rolagem será suave
  });
}

// Função para remover acentos e normalizar texto
function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Referenciar elementos
const barraDePesquisa = document.getElementById('pesquisa');
const produtos = document.querySelectorAll('.coluna');

// Adicionar evento de entrada
barraDePesquisa.addEventListener('input', () => {
  const termo = removerAcentos(barraDePesquisa.value);

  produtos.forEach(produto => {
      // Obter texto de h4 e h5 dentro de cada produto
      const nomeProduto = removerAcentos(
          [...produto.querySelectorAll('h4, h5')]
              .map(elemento => elemento.innerText)
              .join(' ') // Combina o texto de h4 e h5, se ambos existirem
      );

      // Verificar se o nome do produto inclui o termo pesquisado
      if (nomeProduto.includes(termo)) {
          produto.style.display = 'block'; // Exibe o produto
      } else {
          produto.style.display = 'none'; // Oculta o produto
      }
    });
});

// Função para limpar o carrinho
function clearCart() {
  cart = []; // Esvazia o carrinho
  localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza o localStorage
  updateCartModal(); // Atualiza o modal para refletir o estado vazio
  updateCartCounter(); // Atualiza o contador do carrinho
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
// Função para abrir o modal do carrinho
function openCartModal() {
  const modal = document.getElementById('cartModal');
  modal.style.display = 'flex'; // Altere para 'flex' para abrir o modal
  displayCartItems(); // Exibe os itens do carrinho no modal


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
