package com.message.chat.WITS.controller;

import com.message.chat.WITS.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(
            @RequestParam UUID senderWallet,
            @RequestParam UUID receiverWallet,
            @RequestParam BigDecimal amount) {

        walletService.transfer(senderWallet, receiverWallet, amount);
        return ResponseEntity.ok("Transfer successful");
    }
}
