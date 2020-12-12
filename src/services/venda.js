import firebase from 'firebase'
import { updateProduct } from './produtos'

const atualizarVenda = (venda, docId) => {
    return firebase.firestore().collection('sales')
    .doc(docId).set(venda, { merge: true })
}

const finalizarVenda = async (venda) => {
    let historicoVenda = []

    await firebase.firestore().collection('sales')
        .doc().set(venda)
    
    const promises = venda.produtos.map(produto => {
        if (produto.historicoVenda && produto.historicoVenda.length) {
            historicoVenda = produto.historicoVenda.push(venda)
        } else {
            historicoVenda = [ venda ]
        }

        /*
            if (isEdicao) {
                pega o produto pelo codigo,
                soma a quantidade do produto com a da venda para restaurar o valor anterior
                e depois subtraia tudo do novo
            }
        */
        return updateProduct({
            quantidade: produto.quantidade - produto.quantidadeCarrinho,
            historicoVenda,
        }, produto.id)
    })

    await Promise.all(promises)
}

export {
    finalizarVenda,
    atualizarVenda,
}