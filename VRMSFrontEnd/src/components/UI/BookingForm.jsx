import React, { useState } from "react";
import "../../styles/booking-form.css";
import { Form, FormGroup } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { createUrl, log } from '../../utils/utils'
import useRazorpay from 'react-razorpay';
const BookingForm = (props) => {

    const [Razorpay] = useRazorpay();
    const { id } = useParams();
    console.log(id);
    const [pay, setPay] = useState("Success");

   const [bookingState, setBookingState] = 
   useState({Amount: 0.0,startdate: sessionStorage.getItem("startDate"),enddate: sessionStorage.getItem("endDate")});

  
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("uid");
    
    const addBookingHandler = (e)=>{
      e.preventDefault();

      if(userId== undefined){
            toast.error("Please log in before booking the vehicle")
            navigate("/login")
      }
      else{
        const bookingData = {
            amount: parseInt(props.bookingAmount),
            startDate: bookingState.startdate,
            endDate: bookingState.enddate,
            extraCharge: 0.0,
            totalAmount: bookingState.Amount,
            vehicleId : parseInt(id)
          };
          console.log(userId);
    
          axios.post(createUrl('/booking/addbooking/'+userId),bookingData)
          .then(async response => {
              // Handle successful response
              console.log('Response data:', response.data);
    
              sessionStorage.setItem("bookingId",response.data.id)
    
              const url = createUrl('/payment')
            try {
                  const response = await axios.post(url,bookingData)
                   if(response.data.status="created")
                   {
                      let options={
                        key:"rzp_test_MdJrsWRY4I29iM",
                        amount:response.data.amount,
                        currency:"INR",
                        name:"Vehicle Rental Services",
                        description:"pay",
                        order:response.data.id,
                        prefill:{
                          email:"tejas@gmail.com",
                          contqact:"9078526310",
                          name:"Tejas Shinde"
                        },
                        handler: function(response) {
                          // Handle successful payment here
                          alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);
                          setPay("Success")
                          console.log(pay);
                          const updatebooking={
                            id:parseInt(sessionStorage.getItem("bookingId")),
                            payid:pay
                          }
                          const customConfig = {
                            headers: {
                            'Content-Type': 'application/json'
                            }
                        };
                          axios.post(createUrl('/payment/updatebooking'),updatebooking,customConfig).then(response=>{
                            console.log(response.data);
                            navigate("/home")
                            toast.success('Payment successful!');
                          }).catch(error=>{
                            console.log(error);
                          })


                        }
                        ,
                        theme:{color:"#53a20e"}
                      }

                      
                      const razorpay=new Razorpay(options);
                      razorpay.on("payment.failed",function(response)
                      {
                        alert(response.error.code)
                        const updatebooking={
                          id:parseInt(sessionStorage.getItem("bookingId")),
                          payid:"Fail"
                        }

                        const customConfig = {
                          headers: {
                          'Content-Type': 'application/json'
                          }
                      };

                      
                      axios.post(createUrl('/payment/updatebooking'),updatebooking,customConfig).then(response=>{
                        console.log(response.data);
                      }).catch(error=>{
                        console.log(error);
                      })

                      });

                      razorpay.open()
                   }
                } catch (ex) {
                  log(ex)
                return null
              }

              
          })
          .catch(error => {
              // Handle error
              console.error('An error occurred:', error);
          });
      }
    }

 
  return (
    <Form onSubmit={addBookingHandler}>
     
      <div className="row">
      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input type="number" placeholder="Amount" value={props.bookingAmount} readOnly />
      </FormGroup>
      </div>

     
      
      <FormGroup className="booking__form d-inline-block me-4 mb-4">
        <input type="date" placeholder="Journey Date" readOnly value={bookingState.startdate}/> 
      </FormGroup>
     

      <FormGroup className="booking__form d-inline-block ms-1 mb-4">
        <input type="date" placeholder="Journey Date" readOnly value={bookingState.enddate}/>
      </FormGroup>

    
        <FormGroup>
        <button className="booking-button text-white btn-lg mb-3" onClick={addBookingHandler}>Pay Now</button>
        </FormGroup>


    </Form>

    
  );
};

export default BookingForm;