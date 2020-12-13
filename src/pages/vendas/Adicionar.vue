<template>
    <md-card class="container">
        <h1>Adicionar venda</h1>

        <div v-if="customer && customer.id">
            <h2>Cliente</h2>
            <p>{{ customer.name }}</p>
            <p>{{ customer.cpf }}</p>
            <p>{{ customer.email }}</p>

            <h2>Produtos</h2>

            <q-select
                class="autocomplete-product"
                filled
                v-model="selectedProduct"
                use-input
                input-debounce="0"
                hide-selected
                label="Busque pelo código ou descrição do produto"
                :options="products"
                @filter="getProducts"
                @input="handleSelectChange"
                :display-value="`${selectedProduct ? selectedProduct.descricao : ''}`"
                emit-value
            >
                <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                    Sem resultados
                    </q-item-section>
                </q-item>
                </template>
            </q-select>

            <q-table
                class="table-product"
                title="Carrinho de compras"
                :data="shoppingCart"
                :columns="columns"
                row-key="name"
            >
                <template v-slot:body="props">
                    <q-tr :props="props">
                    <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        <q-input
                            v-if="col.name === 'quantidadeCarrinho'"
                            v-model.number="props.row.quantidadeCarrinho"
                            type="number"
                            min="1"
                            filled
                            @input="handleQuantity(props)"
                            style="max-width: 80px"
                        />

                        <div v-if="col.name === 'precoTotalItem'">
                            <b>{{ col.value | currency }}</b><br>
                            <div
                                class="table-info-label"
                                v-show="props.row.quantidadeCarrinho > 1"
                            >preço unitário: {{ props.row.precoVenda | currency }}
                            </div>
                        </div>

                        <div v-if="col.name === 'acao'">
                            <q-btn class="action-button" @click="removeItem(props.row)" color="red">
                                <q-icon name="clear" />
                            </q-btn>
                            
                        </div>
                        
                        <div
                            v-if="col.name !== 'quantidadeCarrinho' && col.name !== 'precoTotalItem'"
                        >
                            {{ col.value }}
                        </div>
                    </q-td>
                    </q-tr>
                </template>
            </q-table>
            <q-btn class="action-button btn-discount" color="secondary" @click="handleDiscountDialogOpen">
                <q-icon name="attach_money" />
                Adicionar desconto no total da compra
            </q-btn>

            <p>Total: {{ shoppingCartTotal }}</p>
            <div v-show="descontoGeral">
                <p><b>Desconto: {{ descontoGeral }}%</b></p>
            </div>
            <p>Quantidade de itens: {{ shoppingCartTotaItems }}</p>
            <p><b>Total a pagar: {{ descontoGeral ? shoppingCartTotalWithDiscount : shoppingCartTotal }}</b></p>

            <br>
            <br>
            <p>Selecione a forma de pagamento: </p>
            <div class="q-gutter-sm">
                <q-radio v-model="formaPagamento" val="dinheiro" label="Dinheiro" />
                <q-radio v-model="formaPagamento" val="debito" label="Cartão de Débito" />
                <q-radio v-model="formaPagamento" val="credito" label="Cartão de Crédito" />
                <q-radio v-model="formaPagamento" val="naoPago" label="Não pago" />
            </div>
        </div>

        <div class="action-box">
            <q-btn color="green" @click="handleValorPagoModal" :disable="!shoppingCart.length">
                Finalizar venda
            </q-btn>
        </div>

        <q-dialog v-model="openDiscountDialog" persistent transition-show="scale" transition-hide="scale">
            <q-card style="min-width: 300px; max-width: 600px; width: 100%;">
                <q-card-section>
                <div class="text-h6"></div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <h6>Aplicar desconto geral</h6>
                    <p>Valor total: {{ shoppingCartTotal }}</p>
                    <p>Quantidade total de itens: {{ shoppingCartTotaItems }}</p>
                    <br>
                    <b>Insira o desconto</b>
                    <q-input filled type="number" min="0" max="100" v-model.number="descontoGeral" dense autofocus />
                    <br>
                    <p><b>Valor total com desconto: {{ shoppingCartTotalWithDiscount }}</b></p>

                    
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Remover desconto" @click="voltarModalDescontoGeral" />
                    <q-btn flat label="Aplicar desconto" @click="confirmarDescontoGeral" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="openTotalPaidDialog">
            <q-card style="min-width: 300px">
                <q-card-section>
                <div class="text-h6"></div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <p>Valor total: {{ shoppingCartTotal }}</p>
                    <p>Quantidade total de itens: {{ shoppingCartTotaItems }}</p>
                    
                    <b>Valor pago:</b>
                    <q-input dense v-model="totalPaid" autofocus v-money="money" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Voltar" v-close-popup />
                    <q-btn flat label="Finalizar venda" @click="finalizarVenda" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </md-card>
</template> 

<script>
import { getCustomerById } from '../../services/clientes'
import { getProductByCodeOrDescription } from '../../services/produtos'
import { finalizarVenda } from '../../services/venda'
import getNumberCurrency from '../../utils/currency'

export default {
    name: 'AdicionarVenda',
    data: () => ({
        terms: '',
        customer: {},
        products: [],
        selectedProduct: null,
        shoppingCart: [],
        columns: [
        {
          name: 'quantidadeCarrinho',
          label: 'Quantidade',
          align: 'left',
          field: 'quantidadeCarrinho',
          sortable: true
        },
        {
          name: 'codigo',
          label: 'Cód.',
          align: 'left',
          field: 'codigo',
          sortable: true
        },
        {
          name: 'descricao',
          label: 'Produto',
          align: 'left',
          field: 'descricao',
          sortable: true
        },
        {
          name: 'tamanho',
          label: 'Tam.',
          align: 'left',
          field: 'tamanho',
          sortable: true
        },
        {
          name: 'tipoProduto',
          label: 'Tipo',
          align: 'left',
          field: 'tipoProduto',
          sortable: true
        },
        {
          name: 'quantidade',
          label: 'Estoque',
          align: 'left',
          field: 'quantidade',
          sortable: true
        },
        {
          name: 'precoTotalItem',
          label: 'Valor',
          align: 'left',
          field: 'precoTotalItem',
          sortable: true
        },
        {
          name: 'acao',
          align: 'left',
          sortable: true
        },
      ],
        openTotalPaidDialog: false,
        totalPaid: 0,
        money: {
            decimal: ',',
            thousands: '.',
            prefix: 'R$ ',
            precision: 2,
        },
        openDiscountDialog: false,
        descontoGeral: 0,
        formaPagamento: ''

    }),
    computed: {
        idParam() {
            return this.$route.params.idCustomer
        },
        shoppingCartTotal() {
            let total = 0
            if (this.shoppingCart && this.shoppingCart.length) {
                total = this.shoppingCart.reduce((acc, b) => acc + b.precoTotalItem, 0)
            }
            return this.$options.filters.currency(total)
        },
        shoppingCartTotalWithDiscount() {
            if (!this.descontoGeral) return this.shoppingCartTotal
            let total = 0
            if (this.shoppingCart && this.shoppingCart.length) {
                total = this.shoppingCart.reduce((acc, b) => acc + b.precoTotalItem, 0)
            }
            const totalWithDiscount = total - (total * (Number(this.descontoGeral)/100))
            return this.$options.filters.currency(totalWithDiscount)
        },
        shoppingCartTotaItems() {
            let total = 0
            if (this.shoppingCart && this.shoppingCart.length) {
                return this.shoppingCart.reduce((acc, b) => acc + b.quantidadeCarrinho, 0)
            }
            return total
        }
    },
    created() {
        if (this.idParam) {
            this.getCustomer()
        }
    },
    methods: {
        async getCustomer() {
            try {
                if (this.idParam) {
                    const userDoc = await getCustomerById(this.idParam)
                    if (userDoc.exists) {
                        const customer = userDoc.data();
                        this.customer = {
                            ...customer,
                            id: this.idParam,
                        };
                    }
                }
            } catch {
                // handle error
            }
        },
        async getProducts (searchTerm, done) {
            const mustReturnId = true
            const products = await getProductByCodeOrDescription(searchTerm, mustReturnId)
            this.products = products.map(product => {
                return {
                    label: product.codigo + ' - ' + product.descricao,
                    value: product
                }
            })
            done()
        },
        isProductAlreadyOnCart(product) {
            return this.shoppingCart
                .filter(item => item.id === product.id).length

        },
        handleSelectChange(value) {
            if (this.isProductAlreadyOnCart(value)) return;

            const product = {
                ...value,
                quantidadeCarrinho: 1,
                precoTotalItem: value.precoVenda,
            }

            this.shoppingCart.push(product)
            this.selectedProduct = null
        },
        handleProductQuantity(cartQuantity, product) {
            product.quantidadeCarrinho =  cartQuantity <= product.quantidade ? cartQuantity : product.quantidade
            
            const precoTotalItem = this.getPrecoTotal(product)
            
            return {
                ...product,
                precoTotalItem,
            }
        },
        handleQuantity(props) {
            const productId = props.row.id
            const cartQuantity = props.row.quantidadeCarrinho

            this.shoppingCart = this.shoppingCart.map(product => {
                if (product.id === productId) {
                    return this.handleProductQuantity(cartQuantity, product)
                }
                return product
            })
        },
        removeItem(item) {
            this.shoppingCart = this.shoppingCart.filter(product => product.id !== item.id)
        },
        getPrecoTotal(item) {
            return item.precoVenda * item.quantidadeCarrinho
        },
        async finalizarVenda() {
            try {
                this.openTotalPaidDialog = false
                const valorTotal = getNumberCurrency(this.shoppingCartTotal)
                const valorTotalDesconto = getNumberCurrency(this.shoppingCartTotalWithDiscount)

                const desconto = this.descontoGeral || 0

                const valorTotalAPagar = desconto ? valorTotalDesconto : valorTotal
                const valorTotalPago = getNumberCurrency(this.totalPaid)
                 

                const venda = {
                    cliente: this.customer,
                    produtos: this.shoppingCart,
                    valorTotal,
                    desconto,
                    valorTotalDesconto,
                    quantidadeTotalItens: this.shoppingCartTotaItems,
                    dataVenda: new Date(),
                    historicoPagamento: [{
                        valorTotalPago,
                        dataPagamento: new Date(),
                        saldoDevedor: valorTotalAPagar - valorTotalPago
                    }],
                    situacao: 'ATIVA',
                    formaPagamento: this.formaPagamento
                }

                await finalizarVenda(venda)
                this.shoppingCart = []
                this.descontoGeral = 0
                this.formaPagamento = ''
                this.$q.notify({
                    type: 'positive',
                    message: 'Venda efetuada com sucesso!'
                })
            } catch(error) {
                /* eslint-disable */
                console.log(error)
                this.$q.notify({
                    type: 'negative',
                    message: 'Falha ao efetuar venda.'
                })
            }
        },
        handleDiscountDialogOpen() {
            if (!this.shoppingCart.length) {
                this.$q.notify({
                    type: 'negative',
                    message: 'Sem itens no carrinho.'
                })
            } else {
                this.openDiscountDialog = true
            }
        },
        voltarModalDescontoGeral() {
            this.descontoGeral = 0
            this.openDiscountDialog = false
        },
        confirmarDescontoGeral() {
            if (this.descontoGeral > 100) {
                this.$q.notify({
                    type: 'negative',
                    message: 'Desconto inválido. O valor deve ser de 0 até 100.'
                })
            } else {
                this.openDiscountDialog = false
                this.descontoGeral = this.descontoGeral || 0
            }
        },
        handleValorPagoModal() {
            if (!this.formaPagamento) {
                this.$q.notify({
                    type: 'negative',
                    message: 'Por favor, selecione a forma de pagamento.'
                })
                return
            }
            this.openTotalPaidDialog = true
        }
    }
}
</script>

<style scoped>
    .container {
        padding: 28px;
    }

    .autocomplete-product {
        margin-bottom: 28px;
    }

    .table-product {
        margin-bottom: 28px;
    }

    .table-info-label {
        font-size: 11px;
    }

    .action-button {
        margin-left: 8px;
    }

    .action-box {
        display: flex;
        justify-content: flex-end;
    }

    .btn-discount {
        margin: 0px 0px 24px;
    }
</style>