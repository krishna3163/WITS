package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @GetMapping("/balance")
    public ResponseEntity<String> getBalance() {
        // TODO: Implement get balance logic
        return ResponseEntity.ok("Wallet balance.");
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMoney(@RequestBody String transaction) {
        // TODO: Implement send money logic
        return ResponseEntity.ok("Money sent.");
    }
}
