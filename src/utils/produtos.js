const deveMostrarCampoTamanho = (tipoProduto) => {
    if (tipoProduto !== 'natura' && tipoProduto !== 'boticário') {
        return !!tipoProduto
    } else {
        return true
    }
}

export default deveMostrarCampoTamanho