<template>
    <md-card>
        <md-card-header>
          <div class="md-title">Consultar clientes</div>
        </md-card-header>



        <md-table v-if="customers.length" md-sort="name" md-sort-order="asc">
        <md-table-row>
            <md-table-head>Nome</md-table-head>
            <md-table-head>CPF</md-table-head>
            <md-table-head>E-mail</md-table-head>
            <md-table-head>Ação</md-table-head>
        </md-table-row>

        <md-table-row v-for="(customer) in customers" :key="customer.id">
            <md-table-cell md-sort-by="name">{{ customer.name }}</md-table-cell>
            <md-table-cell>{{ customer.cpf }}</md-table-cell>
            <md-table-cell>{{ customer.email }}</md-table-cell>
            <md-table-cell>
                <md-button class="md-raised" @click="goToCustomerDetails(customer)">
                    <md-icon>edit</md-icon>
                    Editar
                </md-button>
                <md-button class="md-primary md-raised" @click="addVenda(customer)">
                    <md-icon>add</md-icon>
                    Fazer venda
                </md-button>
            </md-table-cell>
        </md-table-row>
        </md-table>
    </md-card>
</template>

<script>
import { getCustomers } from '../../services/clientes'
export default {
    name: 'Consultar',
    data: () => ({
        customers: []
    }),
    created() {
        this.getCustomers()
    },
    methods: {
        async getCustomers() {
            const customersCollection = await getCustomers()

            if (customersCollection && customersCollection.docs.length) {
                this.customers = customersCollection.docs.map(c => {
                    const customer = {
                        ...c.data(),
                        id: c.id,
                    }
                    return customer
                })
            } else {
                this.customers = []
            }
        },
        goToCustomerDetails(customer) {
            this.$router.push(`/clientes/consultar/${customer.id}`)
        },
        addVenda(customer) {
            this.$router.push(`/vendas/adicionar/${customer.id}`)
        }
    }
}
</script>