const getNumberCurrency = (currency) => {
    const numberCurrency = currency.replace(/[^\d,]/g, '').replace(/,/g, '.')
    return Number(numberCurrency)
} 

export default getNumberCurrency