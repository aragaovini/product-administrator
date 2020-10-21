import firebase from 'firebase'

const getProductById = (productId) => {
    return firebase.firestore().collection('product')
    .doc(productId).get()
}
const saveProduct = (product) => {
    return firebase.firestore().collection('product')
    .doc().set(product)
}

const updateProduct = (product, docId) => {
    return firebase.firestore().collection('product')
    .doc(docId).set(product, { merge: true })
}

const getProducts = () => {
    return firebase.firestore().collection('product')
    .get()
}

export {
    getProductById,
    saveProduct,
    updateProduct,
    getProducts,
}