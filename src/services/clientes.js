import firebase from 'firebase'

const saveCustomer = (customer) => {
    return firebase.firestore().collection('customer')
    .doc().set(customer)
}

const updateCustomer = (customer, docId) => {
    return firebase.firestore().collection('customer')
    .doc(docId).set(customer, { merge: true })
}

const getCustomerById = (customerId) => {
    return firebase.firestore().collection('customer')
    .doc(customerId).get()
}

const getCustomers = () => {
    return firebase.firestore().collection('customer')
    .get()
}

export { 
    saveCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
}