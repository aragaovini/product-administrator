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
      :data="source"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.index}`">

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
          <q-td>
            <q-btn color="negative" class="btn-remover" @click="() => handleRemoverVenda(props.row)">remover</q-btn>
            <q-btn color="primary" @click="() => handleDetalhesVenda(props.row)">detalhes</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog
      v-if="detalhesVenda"
      v-model="openDetalhesVenda"
    >
      <q-card style="width: 100%; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5">Detalhes da venda</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>Cliente: <b>{{ detalhesVenda.cliente.name }}</b></div>
          <div>Data da venda: <b>{{ detalhesVenda.dataVenda.toDate() | formatDateHour }}</b></div>
          <div>Quantidade de itens: <b>{{ detalhesVenda.quantidadeTotalItens }}</b></div>
          <div>Valor total: <b>{{ detalhesVenda.valorTotal | currency }}</b></div>
          <div>Desconto: <b>{{ detalhesVenda.desconto }}%</b></div>
          <br>
          <div>Valor total com desconto: <b>{{ detalhesVenda.valorTotalDesconto | currency }}</b></div>
          <br>

          <div class="text-h5">Itens</div>
          <p>Os preços abaixo não possuem desconto:</p>

          <q-list bordered separator>
            <q-item v-for="(produto, index) in detalhesVenda.produtos" :key="index">
              <q-item-section>{{ produto.descricao }}</q-item-section>
              <q-item-section>Qtd: {{ produto.quantidadeCarrinho }}</q-item-section>
              <q-item-section>Tipo: {{ produto.tipoProduto }}</q-item-section>
              <q-item-section>Preço total: {{ produto.precoTotalItem | currency }}</q-item-section>
            </q-item>
          </q-list>
          <br>
          <div class="text-h5">Histórico de pagamento</div>
          <br>
          <q-list bordered separator>
            <q-item v-for="(pagamento, index) in detalhesVenda.historicoPagamento" :key="index">
              <q-item-section>Data do pagamento: {{ pagamento.dataPagamento.toDate() | formatDateHour }}</q-item-section>
              <q-item-section>Valor pago: {{ pagamento.valorTotalPago | currency }}</q-item-section>
              <q-item-section>Valor restante: {{ pagamento.saldoDevedor | currency }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" label="Fechar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-if="vendaParaRemover"
      v-model="openRemoverVenda"
    >
      <q-card class="negative" style="width: 100%; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 negative">Você tem certeza que deseja remover a venda abaixo?</div>
          <p>Todos os itens dessa venda terão os estoques restaurados.</p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>Cliente: <b>{{ vendaParaRemover.cliente.name }}</b></div>
          <div>Data da venda: <b>{{ vendaParaRemover.dataVenda.toDate() | formatDateHour }}</b></div>
          <div>Quantidade de itens: <b>{{ vendaParaRemover.quantidadeTotalItens }}</b></div>
          <div>Valor total: <b>{{ vendaParaRemover.valorTotal | currency }}</b></div>
          <div>Desconto: <b>{{ vendaParaRemover.desconto }}%</b></div>
          <br>
          <div>Valor total com desconto: <b>{{ vendaParaRemover.valorTotalDesconto | currency }}</b></div>
          <br>

          <div class="text-h5">Itens</div>
          <p>Os preços abaixo não possuem desconto:</p>

          <q-list bordered separator>
            <q-item v-for="(produto, index) in vendaParaRemover.produtos" :key="index">
              <q-item-section>{{ produto.descricao }}</q-item-section>
              <q-item-section>Qtd: {{ produto.quantidadeCarrinho }}</q-item-section>
              <q-item-section>Tipo: {{ produto.tipoProduto }}</q-item-section>
              <q-item-section>Preço total: {{ produto.precoTotalItem | currency }}</q-item-section>
            </q-item>
          </q-list>
          <br>
          <div class="text-h5">Histórico de pagamento</div>
          <br>
          <q-list bordered separator>
            <q-item v-for="(pagamento, index) in vendaParaRemover.historicoPagamento" :key="index">
              <q-item-section>Data do pagamento: {{ pagamento.dataPagamento.toDate() | formatDateHour }}</q-item-section>
              <q-item-section>Valor pago: {{ pagamento.valorTotalPago | currency }}</q-item-section>
              <q-item-section>Valor restante: {{ pagamento.saldoDevedor | currency }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" label="Voltar" v-close-popup />
          <q-btn color="negative" label="Remover" @click="removerVenda" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </md-card>
</template>

<script>
import { meses } from '../../utils/month'
import { anos } from '../../utils/year'

import { buscarVendasByMesAno, atualizarVenda } from '../../services/venda'
import { updateProduct, getProductById } from '../../services/produtos'

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
    ],
    source: [],
    detalhesVenda: null,
    openDetalhesVenda: false,

    idVendaParaRemover: null,
    vendaParaRemover: null,
    openRemoverVenda: false,
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
        this.source = []
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
            valorTotalDesconto: formatCurrency(venda.valorTotalDesconto),
            detalhes: venda
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
    handleDetalhesVenda(venda) {
      this.detalhesVenda = venda.detalhes
      this.openDetalhesVenda = true
    },
    handleRemoverVenda(venda) {
      this.idVendaParaRemover = venda.id
      this.vendaParaRemover = venda.detalhes
      this.openRemoverVenda = true
    },
    async removerVenda() {
      try {
        await atualizarVenda({
          ...this.vendaParaRemover,
          situacao: 'CANCELADA',
        }, this.idVendaParaRemover)
        this.vendaParaRemover.produtos.forEach(async produto => {
          const productDoc = await getProductById(produto.id)
          if (productDoc.exists) {
            const product = productDoc.data()
            await updateProduct({
              ...product,
              quantidade: product.quantidade + produto.quantidadeCarrinho
            }, produto.id)
          }
        })
        this.getVendas()
        this.$q.notify({
          type: 'positive',
          message: 'Venda removida com sucesso!'
        })
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Falha ao remover a venda'
        })
      } finally {
        this.idVendaParaRemover = null
        this.vendaParaRemover = null
        this.openRemoverVenda = false
      }
    }
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

  .btn-remover {
    margin-right: 18px;
  }

  .negative {
    color: red;
    font-weight: 700;;
  }
</style>