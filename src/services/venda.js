import firebase from 'firebase'
import { updateProduct } from './produtos'

const buscarVendasByMesAno = (mes, ano) => {
    const firstDate = new Date(ano, mes, 1);
    const lastDate = new Date(mes === 11 ? ano + 1 : ano, mes + 1, 1);
    const collection = firebase.firestore().collection('sales')
    .where('dataVenda', '>=', firstDate)
    .where('dataVenda', '<', lastDate)
    .where('situacao', '==', 'ATIVA')

    return collection.get()
}

const atualizarVenda = (venda, docId) => {
    return firebase.firestore().collection('sales')
    .doc(docId).set(venda, { merge: true })
}

const finalizarVenda = async (venda) => {
    const promises = venda.produtos.map(produto => {
        let historicoVenda = produto.historicoVenda ? [ ...produto.historicoVenda ] : []

        if (historicoVenda && historicoVenda.length) {
            historicoVenda.push(venda)
        } else {
            historicoVenda = [ venda ]
        }

        return updateProduct({
            quantidade: produto.quantidade - produto.quantidadeCarrinho,
            historicoVenda,
        }, produto.id)
    })

    venda.produtos.forEach(produto => {
        delete produto.historicoVenda
        return produto
    })

    const salvarVenda = firebase.firestore().collection('sales').doc().set(venda)

    promises.push(salvarVenda)

    await Promise.all(promises)
}

export {
    finalizarVenda,
    atualizarVenda,
    buscarVendasByMesAno,
}