import React from 'react'
import { useMyStore } from '../store/myStore'

const ExpenseSummary = () => {
    const {income,expenses,balance}=useMyStore().getSummary()
    return (
        <section className="flex">
            <div className='card'>
                <h1>Total Income</h1>
                <p className="income">$ {income}</p>
            </div>
            <div className='card'>
                <h1>Total Expenses</h1>
                <p className='expense'>$ {expenses}</p>
            </div>
            <div className='card'>
                <h1>Balanace</h1>
                <p>$ {balance}</p>
            </div>
        </section>
    )
}

export default ExpenseSummary;