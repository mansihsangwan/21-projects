import { create } from 'zustand'
const loadTransactions=()=>{
    const data=localStorage.getItem('ltransactions');
    return data ? JSON.parse(data):[];
}

export const useMyStore=create((set,get)=>({
    transactions:loadTransactions(),

    addTransaction:(transaction)=>{
        const updated=[...get().transactions,transaction];
        localStorage.setItem('ltransactions',JSON.stringify(updated))
        set({transactions:updated})
    },
    getSummary:()=>{
        const transactions=get().transactions;
        const income=transactions
                .filter((t)=> t.expenseType=="income")
                .reduce((acc,t)=> acc+ Number(t.amount),0)
        const expenses=transactions
                .filter((t)=> t.expenseType=="expense")
                .reduce((acc,t)=> acc+ Number(t.amount),0)
        return {income,expenses,balance:income-expenses}
    },
    deleteTransaction:(id)=>{
        const updated=get().transactions.filter((t)=> t.id !==id)
        localStorage.setItem('ltransactions',JSON.stringify(updated))
        set({transactions:updated})
    }

}))