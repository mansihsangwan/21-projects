import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { fetchMenu } from '../store/menuSlice';
import { addToCart } from '../store/cartSlice';

const MenuList = () => {
    const dispatch=useDispatch();
    const {items,status,filter}=useSelector((state)=> state.menu);
    useEffect(()=>{
        dispatch(fetchMenu())
    },[dispatch])
    const filteredItems=filter === "All" ?items : items.filter((item)=> item.category === filter)
    if(status === "loading") return <h1> Loading....</h1>
    return (
        <div className="row pt-5">
            {filteredItems.map((item)=> 
                <div className="col-sm-2">
                    <div className="card" key={item.id}>
                        <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">Rs. {item.price}</p>
                            <a href="#" className="btn btn-primary" onClick={()=> dispatch(addToCart(item))}>Add to Cart</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MenuList