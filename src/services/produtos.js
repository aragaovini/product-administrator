import firebase from 'firebase'
import { normalizeString } from '../utils/stringNormalizer'

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

const getProductByDescription = (searchTerm) => {
    const term = normalizeString(searchTerm)

    const collection = firebase.firestore().collection('product')
    .orderBy("normalizedDescricao")
    .startAt(term)
    .endAt(term + "\uf8ff");

    return collection.get()
}

const getProductByCode = (searchTerm) => {
    const collection = firebase.firestore().collection('product')
    .orderBy("codigo")
    .startAt(searchTerm)
    .endAt(searchTerm + "\uf8ff");

    return collection.get()
}

const getProductByCodeOrDescription = async (searchTerm, returnId = false) => {
    if (!searchTerm) return [];

    const [descriptionDoc, codeDoc] =  await Promise.all([
        getProductByDescription(searchTerm),
        getProductByCode(searchTerm),
    ])

    const descriptionList = descriptionDoc.docs.map(item => {
        if (returnId) {
            return {
                id: item.id,
                ...item.data()
            }
        }
        item.data()
    })
    const codeList = codeDoc.docs.map(item => {
        if (returnId) {
            return {
                id: item.id,
                ...item.data()
            }
        }
        item.data()
    })
    const itemsSet = [
        ...new Set([
            ...descriptionList,
            ...codeList,
        ])
    ]
    return itemsSet.filter(item => item.quantidade > 0)

    
}

export {
    getProductById,
    saveProduct,
    updateProduct,
    getProducts,
    getProductByCodeOrDescription,
}