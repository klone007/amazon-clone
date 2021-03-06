import React , {useState, useEffect} from 'react'
import './Payment.css'
import {useStateValue} from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import CurrencyFormat from "react-currency-format";
import {getBasketTotal} from './reducer';
import {Link, useHistory} from 'react-router-dom';
import axios from './axios';
import {db} from "./firebase";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";

function Payment() {
    const [{basket, user}, dispatch] = useStateValue();
    const history = useHistory();
    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        // generate the special secret which allows us to charge a customer
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                // Stripe expects the total in a currencies subunits
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });  // fetching request library "axios"
            setClientSecret(response.data.clientSecret)
        }   
        getClientSecret();
    }, [basket])


    console.log('The Secret IS >>>', clientSecret)

    const handleSubmit = async (event) =>{
        // do all fancy stripe stuff...
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            // paymentIntent = payment confirmation
            
            db
            .collection('users')
            .doc( user?.uid)
            .collection('orders')
            .doc (paymentIntent.id)
            .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
            });

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/orders') // don't use .push cause we don't wanna come back
        })
    }

    const handleChange = event => {
        //Listen for changes in the cardElement
        // and display any errors a sthe customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

  return (
    <div className='payment'>
        <div className = 'payment__container'>
            <h1>
                Checkout (
                    <Link to="/checkout">{basket?.length} items</Link>
                    )
            </h1>


            {/* Payment section - delivery address*/}
            <div className="payment__section">
                <div className="payment__title">
                    <h3>Delivery Address</h3>
                </div>
                <div className="payment__address">
                    <p>{user ?.email}</p>
                    <p>123 React Lane</p>
                    <p>Los Angeles, CA</p>
                </div>
            </div>

            {/* Payment section - review */}
            <div className="payment__section">
                <div className="payment__title">
                    <h3>Review items and delivery</h3>
                </div>
                <div className='payment__items'>
                    {/* Review Product */}
                    {basket.map(item =>(
                        <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                        />
                    ))}
                </div>
            </div>

            {/* Payment section - payment */}
            <div className="payment__section">
                <div className="payment__title">
                    <h3>Payment Method</h3>
                </div>
                <div className="payment__details">
                    {/* Strip Magic */}

                    <form onSubmit = {handleSubmit}>
                        <CardElement onChange={handleChange}/>

                        <div className="payement__priceContainer">
                            <CurrencyFormat renderText={(value) => (
                                <>
                                <h3> Order Total: {value}</h3>
                                </>
                            )}
                            decimalScale={2}
                            value={getBasketTotal(basket)}
                            displayType={"text"}
                            thousandSepearator={true}
                            prefix={"$"}
                            />
                            <button disabled={processing || disabled ||
                           succeeded }>
                                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                           </button>
                        </div>
                        {/* displaying errors when card invalid*/} 
                        {error && <div>{error}</div>}
                    </form>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Payment




