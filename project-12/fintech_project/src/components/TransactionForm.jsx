import React, { useState } from 'react'
import { useMyStore } from '../store/myStore'

const TransactionForm = () => {
    const [form, setForm] = useState({
        title:"",
        amount:"",
        expenseType:"income",
        category:""
    });
    const addTransaction=useMyStore((state)=> state.addTransaction)

    const formSubmit = (e) => {
        e.preventDefault();
        addTransaction({...form,id:Date.now()})
        setForm({
            title:"",
            amount:"",
            type:"expense",
            category:""
        })
    }

    return (
        <section className='card'>
            <h3>Add Transaction</h3>
            <form onSubmit={formSubmit}>
                <input type="text" placeholder='Title' required value={form.title} onChange={(e) => setForm({...form,title:e.target.value})}/>
                <input type="number" placeholder='Amount' required value={form.amount} onChange={(e) => setForm({...form, amount:e.target.value})}/>
                <select name="expenseType" id="expenseType" value={form.expenseType} onChange={(e) => setForm({...form, expenseType:e.target.value})}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <input type="text" placeholder='Category' required value={form.category} onChange={(e) => setForm({...form, category:e.target.value})}/>
                <button className='btn' type='submit'>Add</button>
            </form>
        </section>
    )
}

export default TransactionForm;