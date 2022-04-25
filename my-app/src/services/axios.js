import axios from 'axios';

const transactionApi = axios.create();

export const postTransaction = async (payload) => {
    const { value } = payload;
    const body = {
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

export const postTravel = async (payload) => {
    const { 
        travelOrigin,
        travelDestiny,
        travelSuccess
    } = payload;

    const body = {
        travelOrigin,
        travelDestiny,
        travelSuccess
    }

    try {
        await transactionApi.post('/api/travel/new', body);
    } catch (error) {
        console.log(error)
    }
}

const getTravel = async () => {
    try {
        const response = await transactionApi.get('/api/travel/all');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getSalesStatus = async () => {
    const sales = await getTransactions();
    const travels = await getTravel();
    const { transactions } = sales.data;
    const { travel } = travels.data
    const status = transactions.reduce((total, atual) => {
        total.vendas += 1
        total.saldo += atual.transactionValue
        return total
    }, { vendas: 0, saldo: 0 });
    return { status, travel };
};