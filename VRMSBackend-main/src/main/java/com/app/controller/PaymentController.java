package com.app.controller; 

import javax.validation.Valid;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dao.BookingRepository;
import com.app.dao.VehicleRepository;
import com.app.dto.AddBookingDto;
import com.app.dto.AddPaymentDto;
import com.app.dto.ApiResponse;
import com.app.dto.Updatebookingdto;
import com.app.entities.BookingDetailsEntity;
import com.app.entities.Vehicle;
import com.app.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController 
@RequestMapping("/payment")
public class PaymentController {


	@Autowired
	private VehicleRepository vehiclerepo;
	
	@Autowired
	private BookingRepository bookingRepo;

	
	@PostMapping
	public String addPayment(@RequestBody AddBookingDto bookingdto) throws RazorpayException {
		var client=new RazorpayClient("rzp_test_MdJrsWRY4I29iM","bbIuOKiptKYEk64b7KI9YS9V");
		JSONObject object=new JSONObject();
		object.put("amount", bookingdto.getAmount()*100);
		object.put("currency", "INR");
		object.put("receipt","txn_1234");
		
		Order order=client.orders.create(object);
		System.out.println(order);
		
		return order.toString();
	}
	
	@PostMapping("/updatebooking")
	public String updatePayment(@RequestBody Updatebookingdto pay)
	{
		BookingDetailsEntity bookingentity=bookingRepo.findById((long) pay.getId()).orElseThrow(()->new RuntimeException("user not found"));
		if(pay.getPayid().equals("Success"))
		{
			Vehicle vehicleentity=bookingentity.getVehicle();
			bookingentity.setStatus("Successful");
			vehicleentity.setStatus("Not Available");
			bookingRepo.save(bookingentity);
			vehiclerepo.save(vehicleentity);
			
			

		}
		else
		{
			Vehicle vehicleentity=bookingentity.getVehicle();
			bookingentity.setStatus("UnSuccessful");
			vehicleentity.setStatus("Available");
			vehiclerepo.save(vehicleentity);
			bookingRepo.save(bookingentity);

		}
	  	System.out.println("in payment"+pay);
	  return pay.toString();	
	}
	
}