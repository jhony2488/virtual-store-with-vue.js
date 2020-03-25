const vm = new Vue({
  el: '#app',
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    alerta: 'item adcionado no carrinho',
    alertaAtivo: false,
    ativoCart: false
  },
  methods: {
    puxarProdutos() {
      fetch('../produtos.json')
        .then(response => response.json())
        .then(r => {
          this.produtos = r
        })
    },
    viewProdutos(id) {
      fetch(`../api/produtos/${id}/dados.json`)
        .then(response => response.json())
        .then(r => {
          this.produto = r
        })
    },
    fecharModal(event) {
      if (event.target === event.currentTarget) this.produto = false
    },
    clickFora(event) {
      if (event.target === event.currentTarget) this.ativoCart = false
    },
    addCart() {
      this.produto.estoque--
      const { id, nome, preco } = this.produto
      this.carrinho.push({ id, nome, preco })
      this.alertaSetar()
    },
    removeItem(index) {
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
    },
    alertaSetar() {
      this.alertaAtivo = true
      setInterval(() => {
        this.alertaAtivo = false
      }, 4000)
    },
    router() {
      const hash = document.location.hash
      if (hash) {
        this.viewProdutos(hash.replace('#', ''))
        console.log(hash)
      }
    },
    compararEstoque() {
      const items = this.carrinho.filter(id => {
        if (id === this.produto.id) {
          return true
        }
      })
      this.produto.estoque -= items.length
    }
  },
  filters: {
    numeroPreço(valor) {
      return valor.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  },
  computed: {
    carrinhoTotal() {
      let total = 0
      if (this.carrinho.length > 0) {
        this.carrinho.forEach(item => {
          total += item.preco
          console.log(total)
        })
      }
      return total
    }
  },
  watch: {
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    },
    produto() {
      document.title = this.produto.nome || 'Techno'
      const hash = this.produto.id || ''
      history.pushState(null, null, `#${hash}`)
      this.compararEstoque()
    }
  },
  created() {
    this.puxarProdutos()
    this.checarLocalStorage()
    this.router()
  }
})
