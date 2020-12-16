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

    <br>
    <br>
    <h1>Vendas com pagamentos pendentes</h1>
    

    <q-table
      title="Vendas com pagamento pendente"
      :data="sourcePagtoPendentes"
      :columns="columnsPagtoPendentes"
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
            <q-select emit-value style="width: 100%; min-width: 150px; max-width: 150px;" @input="() => handleSelectChange(props.row)" filled v-model="actionPendenteSelecionada" :options="actionsPendentes" label="ações" />
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
          <div>Valor total bruto: <b>{{ detalhesVenda.valorTotal | currency }}</b></div>
          <div>Desconto: <b>{{ detalhesVenda.desconto }}%</b></div>
          <br>
          <div>Valor total: <b>{{ detalhesVenda.valorTotalAPagar | currency }}</b></div>
          <div>Valor pago: <b>{{ detalhesVenda.valorTotalPago | currency }}</b></div>
          <div>A receber: <b>{{ detalhesVenda.saldoDevedor | currency }}</b></div>
          <br>

          <div class="text-h5">Itens</div>
          <p>Os preços abaixo não possuem desconto:</p>

          <q-list bordered separator>
            <q-item v-for="(produto, index) in detalhesVenda.produtos" :key="index">
              <q-item-section>{{ produto.descricao }}</q-item-section>
              <q-item-section>Qtd: {{ produto.quantidadeCarrinho }}</q-item-section>
              <q-item-section>Tipo: {{ produto.tipoProduto }}</q-item-section>
              <q-item-section>Preço unit.: {{ produto.precoVenda | currency }}</q-item-section>
              <q-item-section>Preço total: {{ produto.precoTotalItem | currency }}</q-item-section>
            </q-item>
          </q-list>
          <br>
          <div class="text-h5">Histórico de pagamento</div>
          <br>
          <q-list bordered separator>
            <q-item v-for="(pagamento, index) in detalhesVenda.historicoPagamento" :key="index">
              <q-item-section>Data do pagamento: {{ pagamento.dataPagamento.toDate() | formatDateHour }}</q-item-section>
              <q-item-section>Valor pago: {{ pagamento.valorPago | currency }}</q-item-section>
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
          <div>Valor total bruto: <b>{{ vendaParaRemover.valorTotal | currency }}</b></div>
          <div>Desconto: <b>{{ vendaParaRemover.desconto }}%</b></div>
          <br>
          <div>Valor total: <b>{{ vendaParaRemover.valorTotalAPagar | currency }}</b></div>
          <div>Valor pago: <b>{{ detalhesVenda.valorTotalPago | currency }}</b></div>
          <div>A receber: <b>{{ detalhesVenda.saldoDevedor | currency }}</b></div>
          <br>

          <div class="text-h5">Itens</div>
          <p>Os preços abaixo não possuem desconto:</p>

          <q-list bordered separator>
            <q-item v-for="(produto, index) in vendaParaRemover.produtos" :key="index">
              <q-item-section>{{ produto.descricao }}</q-item-section>
              <q-item-section>Qtd: {{ produto.quantidadeCarrinho }}</q-item-section>
              <q-item-section>Tipo: {{ produto.tipoProduto }}</q-item-section>
              <q-item-section>Preço unit.: {{ produto.precoVenda | currency }}</q-item-section>
              <q-item-section>Preço total: {{ produto.precoTotalItem | currency }}</q-item-section>
            </q-item>
          </q-list>
          <br>
          <div class="text-h5">Histórico de pagamento</div>
          <br>
          <q-list bordered separator>
            <q-item v-for="(pagamento, index) in vendaParaRemover.historicoPagamento" :key="index">
              <q-item-section>Data do pagamento: {{ pagamento.dataPagamento | formatDateHour }}</q-item-section>
              <q-item-section>Valor pago: {{ pagamento.valorPago | currency }}</q-item-section>
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

    <q-dialog
      v-if="detalhesVendaAdicionarPagamento"
      v-model="openDetalhesVendaAdicionarPagamento"
    >
      <q-card style="width: 100%; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5">Adicionar pagamento</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>Cliente: <b>{{ detalhesVendaAdicionarPagamento.cliente.name }}</b></div>
          <div>Data da venda: <b>{{ detalhesVendaAdicionarPagamento.dataVenda.toDate() | formatDateHour }}</b></div>
          <div>Quantidade de itens: <b>{{ detalhesVendaAdicionarPagamento.quantidadeTotalItens }}</b></div>
          <div>Valor total bruto: <b>{{ detalhesVendaAdicionarPagamento.valorTotal | currency }}</b></div>
          <div>Desconto: <b>{{ detalhesVendaAdicionarPagamento.desconto }}%</b></div>
          <br>
          <div>Valor total: <b>{{ detalhesVendaAdicionarPagamento.valorTotalAPagar | currency }}</b></div>
          <div>Valor pago: <b>{{ detalhesVendaAdicionarPagamento.valorTotalPago | currency }}</b></div>
          <div>A receber: <b>{{ detalhesVendaAdicionarPagamento.saldoDevedor | currency }}</b></div>
          <br>

          <div class="text-h5">Histórico de pagamento</div>
          <br>
          <q-list bordered separator>
            <q-item v-for="(pagamento, index) in detalhesVendaAdicionarPagamento.historicoPagamento" :key="index">
              <q-item-section>Data do pagamento: {{ pagamento.dataPagamento.toDate() | formatDateHour }}</q-item-section>
              <q-item-section>Valor pago: {{ pagamento.valorPago | currency }}</q-item-section>
              <q-item-section>Valor restante: {{ pagamento.saldoDevedor | currency }}</q-item-section>
            </q-item>
          </q-list>
          <br>
          <br>
          <p><b>Selecione a forma de pagamento: </b></p>
            <div class="q-gutter-sm">
                <q-radio v-model="formaPagamento" val="dinheiro" label="Dinheiro" />
                <q-radio v-model="formaPagamento" val="debito" label="Cartão de Débito" />
                <q-radio v-model="formaPagamento" val="credito" label="Cartão de Crédito" />
            </div>
            <br>

            <b>Valor pago:</b>
            <q-input dense v-model="totalPaid" :disable="formaPagamento === 'credito'" autofocus v-money="money" />
            <br>

            <div v-if="formaPagamento === 'credito'">
              <p><b>Número de parcelas</b></p>
              <q-input
                  v-model.number="numeroParcelas"
                  type="number"
                  min="1"
                  filled
                  style="max-width: 90px"
              />
              <br>
              <p><b>parcelas: </b></p>
              <div>1 - {{ valoresParcela.valorPrimeiraParcela | currency }}</div>
              <div v-for="(parcela, index) in (numeroParcelas - 1)" :key="index">{{index + 2}} - {{ valoresParcela.valorParcela | currency }}</div>
            </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" label="Fechar" v-close-popup />
          <q-btn color="positive" label="Salvar pagamento" @click="salvarPagamento" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </md-card>
</template>

<script>
import { meses } from '../../utils/month'
import { anos } from '../../utils/year'

import { buscarVendasByMesAno, atualizarVenda, buscarVendasPagtoPendente } from '../../services/venda'
import { updateProduct, getProductById } from '../../services/produtos'
import getNumberCurrency from '../../utils/currency'

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
      { name: 'name', label: 'Cliente', align: 'left', field: 'name', format: val => `${val}`, sortable: true },
      { name: 'dataVenda', align: 'left', label: 'Data venda', field: 'dataVenda', sortable: true },
      { name: 'statusPagamento', align: 'left', label: 'Situação', field: 'statusPagamento', sortable: true },
      { name: 'quantidade', label: 'Qtd. itens', field: 'quantidade', sortable: true },
      { name: 'valorTotal', label: 'Valor total bruto', field: 'valorTotal' },
      { name: 'desconto', label: 'Desconto', field: 'desconto' },
      { name: 'valorTotalAPagar', label: 'Valor Total', field: 'valorTotalAPagar' },
      { name: 'valorTotalPago', label: 'Valor Pago', field: 'valorTotalPago' },
      { name: 'saldoDevedor', label: 'A receber', field: 'saldoDevedor' },
    ],
    columnsPagtoPendentes: [
      { name: 'name', label: 'Cliente', align: 'left', field: 'name', format: val => `${val}`, sortable: true },
      { name: 'dataVenda', align: 'left', label: 'Data venda', field: 'dataVenda', sortable: true },
      { name: 'statusPagamento', align: 'left', label: 'Situação', field: 'statusPagamento', sortable: true },
      { name: 'quantidade', label: 'Qtd. itens', field: 'quantidade', sortable: true },
      { name: 'valorTotal', label: 'Valor total bruto', field: 'valorTotal' },
      { name: 'desconto', label: 'Desconto', field: 'desconto' },
      { name: 'valorTotalAPagar', label: 'Valor Total', field: 'valorTotalAPagar' },
      { name: 'valorTotalPago', label: 'Valor Pago', field: 'valorTotalPago' },
      { name: 'saldoDevedor', label: 'A receber', field: 'saldoDevedor' },
    ],
    source: [],
    sourcePagtoPendentes: [],
    detalhesVenda: null,
    openDetalhesVenda: false,

    idVendaParaRemover: null,
    vendaParaRemover: null,
    openRemoverVenda: false,
    actionsPendentes: [
      {
        label: 'Detalhes',
        value: 'detalhes'
      },
      {
        label: 'Adicionar Pagamento',
        value: 'pagamento'
      },
      {
        label: 'Remover',
        value: 'remover'
      }
    ],
    money: {
      decimal: ',',
      thousands: '.',
      prefix: 'R$ ',
      precision: 2,
    },
    actionPendenteSelecionada: null,
    detalhesVendaAdicionarPagamento: null,
    openDetalhesVendaAdicionarPagamento: false,
    formaPagamento: null,
    numeroParcelas: 1,
    totalPaid: 0,
  }),

  computed: {
    valoresParcela() {
      if (!this.numeroParcelas) return 0
      const valorTotal = this.detalhesVendaAdicionarPagamento.saldoDevedor
      return this.getValorParcelas(valorTotal, this.numeroParcelas)
    },
  },

  created() {
    const hoje = new Date()
    this.meses = meses.map((mes, index) => {
      return { value: index, label: mes }
    })
    this.mesAtual = this.meses[hoje.getMonth()]
    this.anoAtual = hoje.getFullYear()
    
    this.getVendas()
    this.getVendasPagtoPendente()
  },

  methods: {
    getValorParcelas(precoTotal, numeroParcelas) {
      const valorParcela = parseFloat((precoTotal / numeroParcelas).toFixed(2));
      const valorPrimeiraParcela = parseFloat((precoTotal - (valorParcela * (numeroParcelas - 1))).toFixed(2));

      return { valorPrimeiraParcela , valorParcela };
    },
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
            statusPagamento: venda.statusPagamento,
            quantidade: venda.quantidadeTotalItens,
            valorTotal: formatCurrency(venda.valorTotal),
            desconto: `${venda.desconto}%`,
            valorTotalAPagar: formatCurrency(venda.valorTotalAPagar),
            saldoDevedor: formatCurrency(venda.saldoDevedor),
            valorTotalPago: formatCurrency(venda.valorTotalPago),
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
    async getVendasPagtoPendente() {
      try {
        this.sourcePagtoPendentes = []
        const data = await buscarVendasPagtoPendente()
        const formatDate = this.$options.filters.formatDateHour
        const formatCurrency = this.$options.filters.currency
        this.vendas = data.docs.map(item => {
          const venda = item.data()
          const dataVenda = formatDate(venda.dataVenda.toDate())
          this.sourcePagtoPendentes.push({
            id: item.id,
            name: venda.cliente.name,
            dataVenda,
            statusPagamento: venda.statusPagamento,
            quantidade: venda.quantidadeTotalItens,
            valorTotal: formatCurrency(venda.valorTotal),
            desconto: `${venda.desconto}%`,
            valorTotalAPagar: formatCurrency(venda.valorTotalAPagar),
            saldoDevedor: formatCurrency(venda.saldoDevedor),
            valorTotalPago: formatCurrency(venda.valorTotalPago),
            detalhes: venda,
          })
          return venda
        })
      } catch {
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
    handleAdicionarPagamento(venda) {
      this.idVendaAddPagamento = venda.id
      this.detalhesVendaAdicionarPagamento = venda.detalhes
      this.totalPaid = this.$options.filters.currency(venda.detalhes.saldoDevedor)
      this.openDetalhesVendaAdicionarPagamento = true
    },
    handleSelectChange(venda) {
      const opcaoSelecionada = this.actionPendenteSelecionada
      this.actionPendenteSelecionada = null
      switch(opcaoSelecionada) {
        case 'detalhes':
          this.handleDetalhesVenda(venda)
          return
        case 'pagamento':
          this.handleAdicionarPagamento(venda)
          return
        case 'remover':
          this.handleRemoverVenda(venda)
          return
        default:
          return
      }
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
        this.getVendasPagtoPendente()
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
    },
    async salvarPagamento() {
      try {
        const venda = {
          historicoPagamento: [...this.detalhesVendaAdicionarPagamento.historicoPagamento]
        }

        const valorPago = getNumberCurrency(this.totalPaid)

        if (!this.formaPagamento) {
          this.$q.notify({
            type: 'negative',
            message: 'Por favor, selecione uma forma de pagamento.'
          })
          return
        }

        if (valorPago > this.detalhesVendaAdicionarPagamento.saldoDevedor) {
          this.$q.notify({
            type: 'negative',
            message: 'Valor pago é maior que o saldo devedor.'
          })
          return
        }

        let pagamentoAtual = {
          valorPago,
          dataPagamento: new Date(),
          saldoDevedor: this.detalhesVendaAdicionarPagamento.saldoDevedor - valorPago,
          formaPagamento: this.formaPagamento,
        }

        if (this.formaPagamento === 'credito') {
          if (!this.numeroParcelas) {
            this.$q.notify({
              type: 'negative',
              message: 'Falha ao efetuar venda.'
            })
              return
          }

          pagamentoAtual = {
            ...pagamentoAtual,
            numeroParcelas: this.numeroParcelas,
            valorPrimeiraParcela: this.valoresParcela.valorPrimeiraParcela,
            valorParcelasRestantes: this.valoresParcela.valorParcela
          }
        }

        venda.historicoPagamento.push(pagamentoAtual)
        venda.saldoDevedor = pagamentoAtual.saldoDevedor
        venda.valorTotalPago = this.detalhesVendaAdicionarPagamento.valorTotalPago + pagamentoAtual.valorPago
        venda.statusPagamento = pagamentoAtual.saldoDevedor ? 'PENDENTE' : 'PAGO'

        await atualizarVenda(venda, this.idVendaAddPagamento)
        this.$q.notify({
          type: 'positive',
          message: 'Pagamento adicionado com sucesso.'
        })
        this.openDetalhesVendaAdicionarPagamento = false
        this.detalhesVendaAdicionarPagamento = null
        this.getVendas()
        this.getVendasPagtoPendente()
      } catch {
        this.$q.notify({
          type: 'negative',
          message: 'Falha ao adicionar pagamento.'
        })
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