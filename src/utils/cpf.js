import { cpf } from 'cpf-cnpj-validator';

const isCpfValid = cpfNumber => cpf.isValid(cpfNumber)

export default isCpfValid