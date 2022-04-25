import axios from 'axios';

const transactionApi = axios.create();

export const postTransaction = async (payload) => {
    const { type, value } = payload;
    const body = {
        transactionType: type,
        transactionValue: value
    }
    try {
        await transactionApi.post('/api/transactions/new', body);
    } catch (error) {
        console.log(error)
    }
};

const getTransactions = async () => {
    try {
        const response = await transactionApi.get('/api/transactions/all');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getSalesStatus = async () => {
    const sales = await getTransactions();
    const { transactions } = sales.data;
    const status = transactions.reduce((total, atual) => {
        if(atual.transactionType === 'SALE'){
            total.vendas += 1
            total.saldo += atual.transactionValue
            return total
        }
        total.viagens += 1
        total.saldo -= atual.transactionValue
        return total
    }, {vendas: 0, viagens: 0, saldo: 0})
    return status
}