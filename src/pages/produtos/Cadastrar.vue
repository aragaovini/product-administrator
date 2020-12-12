<template>
  <div>
    <form v-if="this.isLoaded" novalidate class="md-layout" @submit.prevent="validateProduct">
      <md-card class="md-layout-item cliente-container">
        <md-card-header>
          <div class="md-title">{{idParam ? 'Atualizar' : 'Cadastrar'}} produto</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('codigo')">
                <label for="codigo">Código produto</label>
                <md-input name="codigo" id="codigo" v-model="form.codigo" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.codigo.required">Campo obrigatório</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getValidationClass('descricao')">
            <label for="descricao">Descrição</label>
            <md-input type="text" name="descricao" id="descricao" v-model="form.descricao" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.descricao.required">Campo obrigatório</span>
          </md-field>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('tipoProduto')">
                <label for="tipoProduto">Tipo do produto</label>
                <md-select name="tipoProduto" id="tipoProduto" v-model="form.tipoProduto" md-dense :disabled="sending">
                  <md-option></md-option>
                  <md-option value="camisa">Camisa</md-option>
                  <md-option value="camiseta">Camiseta</md-option>
                  <md-option value="calça">Calça</md-option>
                  <md-option value="bermuda">Bermuda</md-option>
                  <md-option value="cueca">Cueca</md-option>
                  <md-option value="natura">Natura</md-option>
                  <md-option value="boticário">Boticário</md-option>
                  <md-option value="outros">Outros</md-option>
                </md-select>
                <span class="md-error">Campo obrigatório</span>
              </md-field>
            </div>
          </div>

          <md-field v-show="form.tipoProduto !== 'boticário' && form.tipoProduto !== 'natura' && form.tipoProduto" :class="getValidationClass('tamanho')">
            <label for="tamanho">Tamanho</label>
            <md-input type="text" name="tamanho" id="tamanho" v-model="form.tamanho" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.tipoProduto.deveMostrarCampoTamanho">Campo obrigatório</span>
          </md-field>

          <md-field :class="getValidationClass('precoCusto')">
            <label for="precoCusto">Preço de custo</label>
            <md-input type="text" v-money="money" name="precoCusto" id="precoCusto" v-model="form.precoCusto" :disabled="sending" />
          </md-field>

          <md-field :class="getValidationClass('precoVenda')">
            <label for="precoVenda">Preço de venda</label>
            <md-input type="text" v-money="money" name="precoVenda" id="precoVenda" v-model="form.precoVenda" :disabled="sending" />
          </md-field>

          <md-field :class="getValidationClass('quantidade')">
            <label for="quantidade">Quantidade em estoque</label>
            <md-input min="0" type="number" name="quantidade" id="quantidade" v-model.number="form.quantidade" :disabled="sending" />
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary md-raised" :disabled="sending">{{idParam ? 'Atualizar' : 'Cadastrar'}}</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import {
    required,
  } from 'vuelidate/lib/validators'
  import { saveProduct, getProductById, updateProduct } from '../../services/produtos'
  import getNumberCurrency from '../../utils/currency'
  import deveMostrarCampoTamanho from '../../utils/produtos'
   import { normalizeString } from '../../utils/stringNormalizer'

  export default {
    name: 'FormValidation',
    mixins: [validationMixin],
    data: () => ({
        isLoaded: false,
        form: {
            codigo: null,
            descricao: '',
            tipoProduto: null,
            tamanho: null,
            precoCusto: null,
            precoVenda: null,
            quantidade: 1,
        },
        money: {
            decimal: ',',
            thousands: '.',
            prefix: 'R$ ',
            precision: 2,
        },
        sending: false,
    }),
    validations: {
      form: {
        codigo: { required },
        descricao: { required },
        tipoProduto: { required, deveMostrarCampoTamanho },
        precoCusto: { required },
        precoVenda: { required },
        quantidade: { required },
      }
    },
    computed: {
      idParam() {
        return this.$route.params.id
      },
    },
    async created() {        
        if (this.idParam) {
            const productDoc = await getProductById(this.idParam)

            if (productDoc.exists) {
                const product = productDoc.data()
                this.form = product
            }
        }
        this.isLoaded = true
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      async handleProduct () {        
        const precoCusto = getNumberCurrency(this.form.precoCusto)
        const precoVenda = getNumberCurrency(this.form.precoVenda)
        const quantidade = Number(this.form.quantidade)

        const product = { 
            ...this.form,
            normalizedDescricao: normalizeString(this.form.descricao),
            precoVenda,
            precoCusto,
            quantidade,
        }

        this.sending = true

        if (this.idParam) {
            await updateProduct(product, this.idParam)
        } else {
            await saveProduct(product)
        }        
        this.sending = false
      },
      validateProduct () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.handleProduct()
        }
      },
    }
  }
</script>

<style>
  .cliente-container {
    padding: 28px;
  }
</style>