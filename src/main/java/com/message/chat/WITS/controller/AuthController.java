package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody String user) {
        // TODO: Implement phone signup, email signup, social login
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String credentials) {
        // TODO: Implement login logic
        return ResponseEntity.ok("User logged in successfully.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody String otp) {
        // TODO: Implement OTP verification
        return ResponseEntity.ok("OTP verified successfully.");
    }
}
