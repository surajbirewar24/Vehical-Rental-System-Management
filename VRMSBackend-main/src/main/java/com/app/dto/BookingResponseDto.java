package com.app.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class BookingResponseDto {
	
	private Long id;
	private LocalDate bookDate;
	private LocalDate startDate;
	private LocalDate endDate;
	
	private double amount;
	private double extraCharge;
	
	private double totalAmount;
	
	
	private String status;
	
	private ProfileDto user;
	
}
