import React, { useEffect } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import {auth} from "./firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useStateValue } from './StateProvider';
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";

const promise = loadStripe(
  "pk_test_51LHZclLnsuV4LvqNhY96k8lBpVTjRoJwYf4OqU9DZD0frWCIvOUqeV98D7mUdAnbar7BmToDyiY1hlVj9OLQgLzW00C3madjMn"
)

function App() {
  const [{}, dispatch] = useStateValue();

  // if condition for react
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      console.log('The USER IS >>> ', authUser);

      if(authUser) {
          // the user just logged in  or the user was logged in

          dispatch({
            type: 'SET_USER',
            user: authUser
          })
      } else{
        
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])
  
  return (
    // BEM
    <Router>
      <div className="app">
        <Switch>
        <Route path="/orders">    
            <Header />
            <Orders />
          </Route>

          <Route path="/login">    
            <Login />
          </Route>

          <Route path="/checkout">    
            <Header />
            <Checkout />
          </Route>

          <Route path="/payment">    
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>

          <Route path="/">
            <Header />
            <Home />     
          </Route>     
        </Switch>
      </div>
    </Router>    
  );
}

export default App;
