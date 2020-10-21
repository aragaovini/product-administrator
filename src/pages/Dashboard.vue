<template>
  <div>
    <h1 class="section-title">Dashboard</h1>

    <div class="container">

      <div class="container__column">
        <md-card @click.native="addVenda" class="container__item card-option card-option--row">
          Adicionar venda
        </md-card>
        <md-card class="container__item card-option card-option--row">
          <h2>Clientes</h2>
          <div class="action-container">
            <md-button @click="$router.push('/clientes/cadastrar')" class="md-primary">cadastrar</md-button>
            <md-button @click="$router.push('/clientes/consultar')" class="md-primary md-raised">buscar</md-button>
          </div>
        </md-card>
        <md-card class="container__item card-option card-option--row">
          <h2>Produtos</h2>
          <div class="action-container">
            <md-button @click="$router.push('/produtos/cadastrar')" class="md-primary">cadastrar</md-button>
            <md-button @click="$router.push('/produtos/consultar')" class="md-primary md-raised">buscar</md-button>
          </div>
        </md-card>
      </div>

      <div class="container__column">
        <md-card class="container__item card-option card-option--column">
          <h2>Vendas</h2>
          <div>
            <p>no mês: 4</p>
            <p>total: 234</p>
          </div>
          
        </md-card>
        <md-card class="container__item card-option card-option--column">
          <h2>Lucro</h2>
          <div>
            <p>no mês: R$ 20,00</p>
            <p>total: R$ 20.234,39</p>
          </div>
        </md-card>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    addVenda() {
      this.$router.push('/vendas/adicionar')
    }
  }
}
</script>

<style scoped>
  .section-title {
    margin: 28px 0px 28px 0px;
  }

  .card-option {
    display: flex;
    flex: 1;
    padding: 8px;
    margin-bottom: 28px;
  }

  .card-option--row {
    flex-direction: row;
    justify-content: space-between;
  }

  .card-option--column {
    flex-direction: column;
  }

  .card-option--column p {
    font-size: 16px;
    font-weight: bold;
  }

  .card-option h2 {
    margin-top: 0px;
  }

  .action-container {
    display: flex;
  }

  .action-container button {
    margin-left: 18px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .container__column {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
  }

  .container__item {
    margin: 9px;
  }
</style>