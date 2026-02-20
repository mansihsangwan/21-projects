import React from 'react'
import Header from './components/header'
import ExpenseSummary from './components/ExpenseSummary'
import TransactionForm from './components/TransactionForm'
import TransactionsList from './components/TransactionsList'

const App = () => {
  return (
    <main className='container'>
      <Header />
      <ExpenseSummary />
      <TransactionForm />
      <TransactionsList />
    </main>
  )
}

export default App