import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilter } from '../store/menuSlice';

const Filter = () => {
    const dispatch=useDispatch();
    return (
        <div className="btn-group pt-5" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-primary" onClick={()=> dispatch(setFilter('All'))}>All</button>
            <button type="button" className="btn btn-primary" onClick={()=> dispatch(setFilter('Snacks'))}>Snacks</button>
            <button type="button" className="btn btn-primary" onClick={()=> dispatch(setFilter('Beverages'))}>Beverages</button>
            <button type="button" className="btn btn-primary" onClick={()=> dispatch(setFilter('Meals'))}>Meals</button>
        </div>
    )
}

export default Filter