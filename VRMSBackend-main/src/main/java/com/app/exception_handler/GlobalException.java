package com.app.exception_handler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		System.out.println("method arg invalid " + e);
		// API : List<FieldError> getFieldErrors()
		// convert list of field errs -->Map<Field name , Error mesg>
		Map<String, String> errMap = new HashMap<>();
		// simply converting LIst of errs ---> Map of errs --> for better readability
		// for the front end
		
		System.out.println(e);
		
		for (FieldError field : e.getFieldErrors())
			errMap.put(field.getField(), field.getDefaultMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMap);
	}
	
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntimeException(RuntimeException e){
		
	     System.out.println("in metbod checking");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}
	
	@ExceptionHandler(IOException.class)
	public ResponseEntity<?> handleIoException(IOException e){
		
	
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}

}