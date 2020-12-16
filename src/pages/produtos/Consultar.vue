<template>
    <md-card>
        <md-card-header>
          <div class="md-title">Consultar produtos</div>
        </md-card-header>
        
        <md-table>
        <md-table-row>
            <md-table-head>Código</md-table-head>
            <md-table-head>Descrição</md-table-head>
            <md-table-head>Tipo</md-table-head>
            <md-table-head>Valor de custo</md-table-head>
            <md-table-head>Valor de venda</md-table-head>
            <md-table-head>Quantidade</md-table-head>
            <md-table-head>Ação</md-table-head>
        </md-table-row>

        <md-table-row v-for="(product, index) in products" :key="index">
            <md-table-cell>{{ product.codigo }}</md-table-cell>
            <md-table-cell>{{ product.descricao }}</md-table-cell>
            <md-table-cell>{{ product.tipoProduto }}</md-table-cell>
            <md-table-cell data-cell="precoCusto">
               <span class="preco-custo-label" :class="{'show-preco-custo': product.showPrecoCusto}">{{ product.precoCusto | currency }}</span>
               <md-icon @click.native="handleVisibilityPrecoCusto(product)">{{product.showPrecoCusto ? 'visibility' : 'visibility_off'}}</md-icon>
            </md-table-cell>
            <md-table-cell>{{ product.precoVenda | currency }}</md-table-cell>
            <md-table-cell>{{ product.quantidade }}</md-table-cell>
            <md-table-cell>
                <md-button class="md-primary md-raised" @click="goToProductDetails(product)">Editar</md-button>
            </md-table-cell>
        </md-table-row>
        </md-table>
    </md-card>
</template>

<script>
import { getProducts } from '../../services/produtos'
export default {
    name: 'Consultar',
    data: () => ({
        products: [],
        showPrecoCusto: false,
    }),
    created() {
        this.getProducts()
    },
    methods: {
        async getProducts() {
            const productsCollection = await getProducts()

            if (productsCollection && productsCollection.docs.length) {
                this.products = productsCollection.docs.map(p => {
                    const product = {
                        ...p.data(),
                        id: p.id,
                        showPrecoCusto: false
                    }
                    return product
                })
            } else {
                this.products = []
            }
        },
        goToProductDetails(product) {
            this.$router.push(`/produtos/editar/${product.id}`)
        },
        handleVisibilityPrecoCusto(product) {
            product.showPrecoCusto = !product.showPrecoCusto
        }
    }
}
</script>

<style>
    [data-cell="precoCusto"] div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .preco-custo-label {
        flex: 1;
        background: rgba(0, 0, 0);
        border-radius: 10px;
        margin-right: 4px;
        transition: all .2s;
    }

    .show-preco-custo {
        background: none;
    }
</style>