<template>
  <div>
    <h1 class="section-title">Dashboard</h1>

    <md-card class="card-option">
      <h2>Clientes</h2>
      <div class="action-container">
        <md-button @click="$router.push('/clientes/cadastrar')" class="md-primary">cadastrar</md-button>
        <md-button class="md-primary md-raised">buscar</md-button>
      </div>
    </md-card>

    <md-card class="card-option">
      <h2>Produtos</h2>
      <div class="action-container">
        <md-button class="md-primary">cadastrar</md-button>
        <md-button class="md-primary md-raised">buscar</md-button>
      </div>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
  .section-title {
    margin: 28px 0px 28px 0px;
  }

  .card-option {
    display: flex;
    flex: 1;
    padding: 18px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .action-container {
    display: flex;
  }

  .action-container button {
    margin-left: 18px;
  }
</style>