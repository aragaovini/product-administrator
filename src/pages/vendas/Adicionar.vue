<template>
    <md-card class="container">
        <h1>Adicionar venda</h1>

        <div v-show="customer && customer.id">
            <h3>Cliente</h3>
            <p>{{ customer.name }}</p>
            <p>{{ customer.cpf }}</p>
            <p>{{ customer.email }}</p>

            <md-autocomplete v-model="selectedProduct" :md-options="products">
                <label>Pesquise pelo produto (código, descrição)</label>

                <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item.codigo }} - {{ item.descricao }}</template>
            </md-autocomplete>


        </div>

        

    </md-card>
</template> 

<script>
import { getCustomerById } from '../../services/clientes'
import { getProductByCodeOrDescription } from '../../services/produtos'

export default {
    name: 'AdicionarVenda',
    data: () => ({
        customer: {},
        products: [],
        selectedProduct: null,
    }),
    computed: {
        idParam() {
            return this.$route.params.idCustomer
        }
    },
    created() {
        if (this.idParam) {
            this.getCustomer()
            this.getProducts('Camis')
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
        async getProducts (searchTerm) {
            this.products = await getProductByCodeOrDescription(searchTerm)            
        }
    }
}
</script>

<style scoped>
    .container {
        padding: 28px;
    }
</style>
