package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Wallet;
import com.message.chat.WITS.model.Transaction;
import com.message.chat.WITS.repository.WalletRepository;
import com.message.chat.WITS.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(WalletRepository walletRepository, TransactionRepository transactionRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void transfer(UUID senderWalletId, UUID receiverWalletId, BigDecimal amount) {

        Wallet sender = walletRepository.findById(senderWalletId)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet receiver = walletRepository.findById(receiverWalletId)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        walletRepository.save(sender);
        walletRepository.save(receiver);

        Transaction tx = new Transaction();
        tx.setId(UUID.randomUUID());
        tx.setSenderId(senderWalletId.toString());
        tx.setReceiverId(receiverWalletId.toString());
        tx.setAmount(amount.doubleValue());
        tx.setType(Transaction.TransactionType.TRANSFER);
        tx.setStatus(Transaction.TransactionStatus.COMPLETED);
        tx.setCreatedAt(Instant.now());

        transactionRepository.save(tx);
    }
}
