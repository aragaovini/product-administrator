<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item cliente-container">
        <md-card-header>
          <div class="md-title">{{idParam ? 'Atualizar' : 'Cadastrar'}} cliente</div>
        </md-card-header>

        <md-card-content>
          <h3>Dados pessoais</h3>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('name')">
                <label for="name">Nome Completo</label>
                <md-input name="name" id="name" autocomplete="given-name" v-model="form.name" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.name.required">Campo obrigatório</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getValidationClass('cpf')">
            <label for="cpf">CPF</label>
            <md-input type="text" name="cpf" id="cpf" v-mask="'###.###.###-##'" v-model="form.cpf" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.cpf.required">Campo obrigatório</span>
            <span class="md-error" v-else-if="!$v.form.cpf.isCpfValid">CPF inválido</span>
          </md-field>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('gender')">
                <label for="gender">Gênero</label>
                <md-select name="gender" id="gender" v-model="form.gender" md-dense :disabled="sending">
                  <md-option></md-option>
                  <md-option value="M">Masculino</md-option>
                  <md-option value="F">Feminino</md-option>
                  <md-option value="O">Outros</md-option>
                </md-select>
                <span class="md-error">Campo obrigatório</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getValidationClass('birthDate')">
            <label for="birthDate">Data de nascimento</label>
            <md-input type="text" name="birthDate" id="birthDate" v-mask="'##/##/####'" v-model="form.birthDate" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.birthDate.required">Campo obrigatório</span>
          </md-field>

          <md-field :class="getValidationClass('email')">
            <label for="email">E-mail</label>
            <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.email.required">Campo obrigatório</span>
            <span class="md-error" v-else-if="!$v.form.email.email">E-mail inválido</span>
          </md-field>

          <h3>Endereço</h3>
          <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('logradouro')">
                <label for="logradouro">Logradouro</label>
                <md-input name="logradouro" id="logradouro" v-model="form.logradouro" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.logradouro.required">Campo obrigatório</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('numero')">
                <label for="numero">Número</label>
                <md-input name="numero" id="numero" autocomplete="given-name" v-model="form.numero" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.numero.required">Campo obrigatório</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('complemento')">
                <label for="first-name">Complemento</label>
                <md-input name="complemento" id="complemento" v-model="form.complemento" :disabled="sending" />
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('cidade')">
                <label for="cidade">Cidade</label>
                <md-input name="cidade" id="cidade" autocomplete="given-name" v-model="form.cidade" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.cidade.required">Campo obrigatório</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('uf')">
                <label for="uf">UF</label>
                <md-input name="uf" id="uf" v-model="form.uf" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.uf.required">Campo obrigatório</span>
              </md-field>
            </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary md-raised" :disabled="sending">{{ idParam ? 'Atualizar' : 'Cadastrar'}}</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
    </form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import {
    required,
    email
  } from 'vuelidate/lib/validators'
  import { saveCustomer, getCustomerById, updateCustomer } from '../../services/clientes'
  import isCpfValid from '../../utils/cpf'

  export default {
    name: 'FormValidation',
    mixins: [validationMixin],
    data: () => ({
      form: {
        name: null,
        cpf: '',
        gender: null,
        birthDate: null,
        email: null,
        logradouro: null,
        numero: null,
        complemento: null,
        cidade: 'Palmital',
        uf: 'SP'
      },
      userSaved: false,
      sending: false,
      lastUser: null
    }),
    validations: {
      form: {
        name: { required },
        cpf: { required, isCpfValid },
        gender: { required },
        birthDate: { required },
        email: { required, email },
        logradouro: { required },
        numero: { required },
        cidade: { required },
        uf: { required }
      }
    },
    computed: {
      idParam() {
        return this.$route.params.id
      }
    },
    async created() {
      if (this.idParam) {
        const userDoc = await getCustomerById(this.idParam)
        if (userDoc.exists) {
          const user = userDoc.data();
          this.form = {
            ...this.form,
            ...user,
          }
        }
      }
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
      clearForm () {
        this.$v.$reset()
        this.form.firstName = null
        this.form.lastName = null
        this.form.age = null
        this.form.gender = null
        this.form.email = null
      },
      async saveUser () {
        const idCustomer = this.idParam;
        const customer = { ...this.form }
        this.sending = true
        if (idCustomer) {
          await updateCustomer(customer, idCustomer)
        } else {
          await saveCustomer(customer)
        }        
        this.sending = false
      },
      validateUser () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.saveUser()
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