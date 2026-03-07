package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    Optional<Wallet> findByUserId(String userId);
    Optional<Wallet> findByQrCodeToken(String qrCodeToken);
}
