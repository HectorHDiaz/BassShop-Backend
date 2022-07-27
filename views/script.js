const socket = io.connect()

// Websockets - Chat

const chatText = document.getElementById('chat-text'),
sendButton = document.getElementById('send-button'),
chatBox = document.getElementById('chat-box')

async function sendMessage(email){
  const text = chatText.value
  socket.emit('newUserMessage', text,email)
  chatText.value = ''
}

socket.on('allMessages', (allMessages) => {
  renderMessages(allMessages)
})

function renderMessages(messages) {
  chatBox.innerHTML = ''
  messages.forEach(msg => {
    const div = document.createElement('div')
    let html = `
      <span style="color: blue"><b>${msg.author}</b></span>
      <span style="color: orange">[${msg.createdAt}]</span>
      <span style="color: green">${msg.text}</span>`
    div.innerHTML = html
    chatBox.appendChild(div)
  })
}

const productsTable = document.getElementById('productTable'),
  productsDiv = document.getElementById('productsTab')

async function makeHtmlTable(products) {
  return fetch('./partials/products.hbs')
    .then(respuesta => respuesta.text())
    .then(plantilla => {
      const template = Handlebars.compile(plantilla);
      const html = template({ products })
      return html
    })
}
function renderProduct(item) {
  const productTable = document.getElementById('productTable')
  const tr = document.createElement('tr')
  let html = `
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td><img style="width: 100px;" src=${item.image} alt=${item.name}> </td>`
  tr.innerHTML = html
  if (productTable) {
    productTable.appendChild(tr)
  } else {
    location.reload(true)
  }
}

function addToCart(productId, cartId) {
  fetch(`http://localhost:8080/carts/${cartId}/products/${productId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
  ).then(res => res.json())
    .then((res) => {
      location.reload()
    }).catch(error => console.error('Error:', error))
}

function deleteFromCart(productId, cartId) {
  fetch(`http://localhost:8080/carts/${cartId}/products/${productId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    },
  ).then(res => res.json())
    .then((res) => {
      location.reload()
    })
    .catch(error => console.error('Error:', error))
}
function purchaseCart(cartId) {
  fetch(`http://localhost:8080/carts/${cartId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
  ).then(res => res.json())
    .then((res) => {
      location.reload()

    })
    .catch(error => console.error('Error:', error))
}

function deleteAllProducts(cartId){
  fetch(`http://localhost:8080/carts/${cartId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    },
  ).then(res => res.json())
    .then((res) => {
      location.reload()
    })
    .catch(error => console.error('Error:', error))
}