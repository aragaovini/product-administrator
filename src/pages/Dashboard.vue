<template>
  <div>
    <h1 class="section-title">Dashboard</h1>

    <div class="container">

      <div class="container__column">
        <q-card class="container__item">
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">Clientes</div>
            <div class="text-subtitle2">cadastre e busque</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat @click="$router.push('/clientes/cadastrar')">cadastrar</q-btn>
            <q-btn flat @click="$router.push('/clientes/consultar')">buscar</q-btn>
          </q-card-actions>
      </q-card>

      <q-card class="container__item">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Produtos</div>
            <div class="text-subtitle2">cadastre e busque</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat @click="$router.push('/produtos/cadastrar')">cadastrar</q-btn>
            <q-btn flat @click="$router.push('/produtos/consultar')">buscar</q-btn>
          </q-card-actions>
      </q-card>
      </div>

      <div class="container__column">
        <q-card class="container__item">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Vendas</div>
            <div class="text-subtitle2">busque suas vendas</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat @click="$router.push('/vendas/consultar')">buscar</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="container__item">
          <q-card-section class="bg-grey-4 text-white">
            <div class="text-h6">Lucro</div>
            <div class="text-subtitle2">Em construção</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat @click="$router.push('/produtos/consultar')" disabled>ver relatório</q-btn>
          </q-card-actions>
        </q-card>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
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
    flex-direction: column;
  }

  .container__column {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .container__item {
    margin: 9px;
    flex: 1;
  }
</style>