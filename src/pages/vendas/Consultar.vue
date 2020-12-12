<template>
  <md-card class="container">
    <h1>Vendas realizadas em {{ mesAtual.label }} de {{ anoAtual }}</h1>

    <div class="filter-box">
      <q-select style="width: 100%; max-width: 200px;" filled v-model="mesAtual" :options="meses" label="Selecione o mês" />
      <q-select style="width: 100%; max-width: 200px;" filled v-model="anoAtual" :options="anos" label="Selecione o ano" />

      <q-btn color="primary" @click="getVendas">buscar</q-btn>
    </div>
    <br>

    <q-table
      title="Vendas"
      dense
      :data="source"
      :columns="columns"
      row-key="id"
    />
  </md-card>
</template>

<script>
import { meses } from '../../utils/month'
import { anos } from '../../utils/year'

import { buscarVendasByMesAno } from '../../services/venda'

export default {
  name: 'Consultar',

  data: () => ({
    mesAtual: null,
    anoAtual: null,
    meses: [],
    anos,
    vendas: [],
    valorTotal: 0,
    columns: [
      {
        name: 'name',
        label: 'Cliente',
        align: 'left',
        field: 'name',
        format: val => `${val}`,
        sortable: true
      },
      { name: 'dataVenda', align: 'left', label: 'Data venda', field: 'dataVenda', sortable: true },
      { name: 'quantidade', label: 'Qtd. itens', field: 'quantidade', sortable: true },
      { name: 'valorTotal', label: 'Valor total', field: 'valorTotal' },
      { name: 'desconto', label: 'Desconto', field: 'desconto' },
      { name: 'valorTotalDesconto', label: 'Valor total desc.', field: 'valorTotalDesconto' },
      { name: 'acao', label: '', field: 'acao' },
    ],
    source: []
  }),

  created() {
    const hoje = new Date()
    this.meses = meses.map((mes, index) => {
      return { value: index, label: mes }
    })
    this.mesAtual = this.meses[hoje.getMonth()]
    this.anoAtual = hoje.getFullYear()
    
    this.getVendas()
  },

  methods: {
    async getVendas() {
      try {
        const data = await buscarVendasByMesAno(this.mesAtual.value, this.anoAtual)
        const formatDate = this.$options.filters.formatDateHour
        const formatCurrency = this.$options.filters.currency
        let valorTotal = 0
        this.vendas = data.docs.map(item => {
          const venda = item.data()
          valorTotal += venda.valorTotalDesconto || venda.valorTotal
          const dataVenda = formatDate(venda.dataVenda.toDate())
          this.source.push({
            id: item.id,
            name: venda.cliente.name,
            dataVenda,
            quantidade: venda.quantidadeTotalItens,
            valorTotal: formatCurrency(venda.valorTotal),
            desconto: `${venda.desconto}%`,
            valorTotalDesconto: formatCurrency(venda.valorTotalDesconto)
          })
          return venda
        })

        this.valorTotal = valorTotal
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Falha ao buscar vendas'
        })
      }
      
    },
  }
}
</script>

<style scoped>
  .container {
    padding: 28px;
  }

  .filter-box {
    display: flex;
    justify-content: flex-end;
    gap: 18px;
  }
</style>