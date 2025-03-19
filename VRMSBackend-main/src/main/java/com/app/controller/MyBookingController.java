package com.app.controller;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.Mybookingdto;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/myBooking")
public class MyBookingController {

	@PostMapping
	public String addBookingPayment(@RequestBody Mybookingdto bookingdto) throws RazorpayException {
		
		//logic should be in service
		var client=new RazorpayClient("rzp_test_MdJrsWRY4I29iM","bbIuOKiptKYEk64b7KI9YS9V");
		JSONObject object=new JSONObject();
      	object.put("amount", bookingdto.getAmount()*100);
		object.put("currency", "INR");
		object.put("receipt","txn_1234");
		
		Order order=client.orders.create(object);
		System.out.println(order);
		
		return order.toString();
	}
	
}
