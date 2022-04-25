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
