import firebase from 'firebase'


const saveCustomer = async (customer) => {
    return await firebase.firestore().collection('companies')
    .doc().set(customer);
}

export default saveCustomer