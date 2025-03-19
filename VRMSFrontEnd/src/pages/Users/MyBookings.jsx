
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import '../../styles/mybooking.css'
import { getAllMyBookings } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { createUrl } from "../../utils/utils";
import useRazorpay from "react-razorpay";
import { toast } from 'react-toastify';

import axios from "axios"
function MyBookings() {

    
    const [Razorpay] = useRazorpay();
    const [bookings,setBookings] = useState([])
    const [pay, setPay] = useState("Success");

    const uid = sessionStorage.getItem("uid")
    const navigate = useNavigate();

    useEffect(()=>{
        getMyBookings();
    },[])

    const getMyBookings = async ()=>{

        const response = await getAllMyBookings(uid)

        if(response!=null){
            setBookings(response)
        }

    }

    const handleAddFeedback = (bookingId)=>{
        sessionStorage.setItem('bookingId',bookingId);
        navigate('/bookingFeedback');
    }

    const handleCancelBooking = (bookingId)=>{
        sessionStorage.setItem('bookingId',bookingId);
        navigate('/cancelBooking');
    }

    const handlePayBooking = (bookingId,bookingAmount)=>{
        sessionStorage.setItem('bookingId',bookingId);
        sessionStorage.setItem("bookingAmount",bookingAmount)
        const myBooking = {id:parseInt(sessionStorage.getItem('bookingId')),
        amount:parseInt(sessionStorage.getItem('bookingAmount'))};

        axios.post(createUrl('/myBooking'),myBooking).then((response)=>{
            console.log("response is here",response.data)

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

                      axios.post(createUrl('/payment/updatebooking'),updatebooking).then(response=>{
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

                          axios.post(createUrl('/payment/updatebooking'),updatebooking).then(response=>{
                            console.log(response.data);
                          }).catch(error=>{
                            console.log(error);
                          })
                              
                      });

                    razorpay.open()

            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    return (
        <MDBContainer fluid>

            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>

                    <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '90%' }}>
                        <MDBCardBody className='p-5 w-100 d-flex flex-column'>
                        
                        <h3 className="fw-bold mb-5 text-center">My Bookings</h3>
                        
                        <table className="table table-hover" >
                   
                        <tr>
                        <td scope="col">Booking Id</td>
                        <td scope="col">Book Date</td>
                        <td scope="col">Start Date</td>
                        <td scope="col">End Date</td>
                        <td scope="col">Amount</td>
                        
                        <td scope="col">Booking Status</td>
                        <td scope="col"></td>
                        </tr>
                   
                        {bookings.map(booking =>
                        <tr key={booking.id}>

                      <td>{booking.id}</td>
                        <td>{booking.bookDate}</td>
                        <td>{booking.startDate}</td>
                        <td>{booking.endDate}</td>
                        <td>{booking.amount}</td>
                        
                        <td>{booking.status}</td>
                        {booking.status=="Successful"
                        ?
                        <>
                        <td><button className="btn btn-danger" style={{color:"red"}} onClick={()=>{handleCancelBooking(booking.id)}}>Cancel Booking</button></td>
                        <td><button className="btn btn-primary" style={{color:"blue"}} onClick={()=>{ handleAddFeedback(booking.id)}}>FeedBack</button></td>
                        </>
                        :
                        <>
                        <td><button className="btn btn-primary" style={{color:"blue"}} onClick={()=>{handlePayBooking(booking.id,booking.amount)}} >Pay Now Here</button></td>
                        <td></td>
                        </>
                        
                    
                    }
                        
                        </tr>
                        )}
                 
                    </table>
                           
                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>
            </MDBRow>

        </MDBContainer>
       


    );
}

export default MyBookings;