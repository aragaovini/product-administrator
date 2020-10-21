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

// const getProductByCode = (searchTerm) => {
//     if (!searchTerm) return [];
//     const collection = firebase.firestore().collection('product')
//     collection.where('codigo', '>=', searchTerm).where('codigo', '<=', searchTerm + '\uf8ff')
//     return collection.get()
// }

const getProductByDescription = (searchTerm) => {
    const collection = firebase.firestore().collection('product')
    .orderBy("descricao")
    .startAt(searchTerm)
    .endAt(searchTerm + "\uf8ff");

    return collection.get()
}

const getProductByCode = (searchTerm) => {
    const collection = firebase.firestore().collection('product')
    .orderBy("codigo")
    .startAt(searchTerm)
    .endAt(searchTerm + "\uf8ff");

    return collection.get()
}

const getProductByCodeOrDescription = async (searchTerm) => {
    if (!searchTerm) return [];

    const [descriptionDoc, codeDoc] =  await Promise.all([
        getProductByDescription(searchTerm),
        getProductByCode(searchTerm),
    ])

    const descriptionList = descriptionDoc.docs.map(item => item.data())
    const codeList = codeDoc.docs.map(item => item.data())

    return [
        ...new Set([
            ...descriptionList,
            ...codeList,
        ])
    ]

    
}

export {
    getProductById,
    saveProduct,
    updateProduct,
    getProducts,
    getProductByCodeOrDescription,
}