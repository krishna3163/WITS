package com.message.chat.WITS.service;

import com.message.chat.WITS.model.MiniApp;
import com.message.chat.WITS.model.SplitBill;
import com.message.chat.WITS.model.Transaction;
import com.message.chat.WITS.model.Wallet;
import com.message.chat.WITS.repository.MiniAppRepository;
import com.message.chat.WITS.repository.SplitBillRepository;
import com.message.chat.WITS.repository.TransactionRepository;
import com.message.chat.WITS.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SuperAppService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final MiniAppRepository miniAppRepository;
    private final SplitBillRepository splitBillRepository;

    public Wallet createWallet(String userId) {
        Wallet wallet = Wallet.builder()
                .userId(userId)
                .balance(BigDecimal.valueOf(100.0)) // Give users some initial balance for demo
                .qrCodeToken(UUID.randomUUID().toString())
                .build();
        return walletRepository.save(wallet);
    }

    public Transaction sendMoney(String senderId, String receiverId, double amount, String description) {
        Wallet senderWallet = walletRepository.findByUserId(senderId)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));
        Wallet receiverWallet = walletRepository.findByUserId(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        if (senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // Processing payment
        senderWallet.setBalance(senderWallet.getBalance().subtract(BigDecimal.valueOf(amount)));
        receiverWallet.setBalance(receiverWallet.getBalance().add(BigDecimal.valueOf(amount)));

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Transaction transaction = Transaction.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .amount(amount)
                .currency(senderWallet.getCurrency())
                .type(Transaction.TransactionType.SEND_MONEY)
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(description)
                .timestamp(LocalDateTime.now())
                .build();

        return transactionRepository.save(transaction);
    }

    public Transaction scanAndPay(String senderId, String qrCodeToken, double amount) {
        Wallet receiverWallet = walletRepository.findByQrCodeToken(qrCodeToken)
                .orElseThrow(() -> new RuntimeException("Invalid QR Code Token"));

        return sendMoney(senderId, receiverWallet.getUserId(), amount, "Payment via QR Code Scan");
    }

    public Transaction payBill(String userId, String billerId, double amount, String description) {
        Wallet userWallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (userWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new RuntimeException("Insufficient funds to pay bill");
        }

        userWallet.setBalance(userWallet.getBalance().subtract(BigDecimal.valueOf(amount)));
        walletRepository.save(userWallet);

        Transaction transaction = Transaction.builder()
                .senderId(userId)
                .receiverId(billerId)
                .amount(amount)
                .currency(userWallet.getCurrency())
                .type(Transaction.TransactionType.PAY_BILL)
                .status(Transaction.TransactionStatus.COMPLETED)
                .description("Bill Payment: " + description)
                .timestamp(LocalDateTime.now())
                .build();

        return transactionRepository.save(transaction);
    }

    public Transaction payAtStore(String userId, String storeId, double amount) {
        return payBill(userId, storeId, amount, "Store Purchase");
    }

    // --- Split Bills / Group Payments ---

    public SplitBill createSplitBill(String creatorId, String groupId, double totalAmount, String description,
            List<String> participants) {
        SplitBill bill = SplitBill.builder()
                .creatorId(creatorId)
                .groupId(groupId)
                .description(description)
                .totalAmount(totalAmount)
                .currency("USD")
                .createdAt(LocalDateTime.now())
                .build();

        double amountPerPerson = totalAmount / participants.size();
        for (String participantId : participants) {
            bill.getParticipants().put(participantId, amountPerPerson);
            bill.getPaymentStatus().put(participantId, false);
        }

        return splitBillRepository.save(bill);
    }

    public Transaction paySplitBillShare(String userId, String splitBillId) {
        SplitBill bill = splitBillRepository.findById(splitBillId)
                .orElseThrow(() -> new RuntimeException("Split Bill not found"));

        if (!bill.getPaymentStatus().containsKey(userId)) {
            throw new RuntimeException("User is not a participant in this bill");
        }
        if (bill.getPaymentStatus().get(userId)) {
            throw new RuntimeException("User has already paid their share");
        }

        double amountOwed = bill.getParticipants().get(userId);

        // Execute the payment from the participant to the creator
        Transaction payment = sendMoney(userId, bill.getCreatorId(), amountOwed,
                "Split Bill Payment: " + bill.getDescription());

        // Update status
        bill.getPaymentStatus().put(userId, true);
        splitBillRepository.save(bill);

        return payment;
    }

    // --- Mini Apps Management ---

    public MiniApp registerMiniApp(String name, String description, String url, String iconUrl,
            MiniApp.AppCategory category) {
        MiniApp app = MiniApp.builder()
                .name(name)
                .description(description)
                .appUrl(url)
                .iconUrl(iconUrl)
                .category(category)
                .build();
        return miniAppRepository.save(app);
    }

    public List<MiniApp> getAllMiniApps() {
        return miniAppRepository.findAll();
    }

    public List<MiniApp> getTaxiServices() {
        return miniAppRepository.findByCategory(MiniApp.AppCategory.TAXI);
    }

    public List<MiniApp> getShoppingApps() {
        return miniAppRepository.findByCategory(MiniApp.AppCategory.SHOPPING);
    }

    public Optional<Wallet> getWalletBalance(String userId) {
        return walletRepository.findByUserId(userId);
    }

    public List<Transaction> getTransactionHistory(String userId) {
        return transactionRepository.findBySenderIdOrderByTimestampDesc(userId);
    }
}
