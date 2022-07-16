import React from 'react'
import './CheckoutProduct.css'
import {useStateValue} from "./StateProvider";
function CheckoutProduct({ id, image, title, price, rating, hideButton }) {
  
// call use state to change info
const [{basket}, dispatch] = useStateValue();

  const removeFromBasket = () => {
    //remove item from the basket
      //dispatch action
      dispatch({
        type: 'REMOVE_FROM_BASKET',
        id: id,
      })
  }
  
  return (
    <div className='checkoutProduct'> 
        <img  className='checkoutProduct__image'  src={image} />

        <div className='checkoutProduct__info' >  
            <p className='checkoutProduct__title'>{title}</p>
            <p className="checkout__price">
              <small>$</small>
              <strong>{price}</strong>
            </p>
            <div className="checkoutProduct__rating">
              {Array(rating)
              .fill()
              .map((_, i)=> (
                <p>🌟</p>
              ))
              }

            </div>
            {!hideButton && (<button onClick={removeFromBasket}>Remove from basket</button>)}
            
        </div>
    </div>
  )
}

export default CheckoutProduct