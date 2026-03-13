package com.message.chat.WITS.config;

import com.message.chat.WITS.model.*;
import com.message.chat.WITS.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Configuration
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final MessageRepository messageRepository;
    private final WalletRepository walletRepository;

    public DataInitializer(UserRepository userRepository, PostRepository postRepository,
            MessageRepository messageRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.messageRepository = messageRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 5) {
            System.out.println("Database already populated. Skipping initialization.");
            return;
        }

        System.out.println("Initializing database with 50 users, posts, and messages...");

        for (int i = 1; i <= 50; i++) {
            // 1. Create User (MongoDB)
            User user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setUsername("user_" + i);
            user.setFullName("User " + i);
            user.setEmail("user" + i + "@wits.app");
            user.setPassword("password123");
            user.setBio("Excited to be on WITS! User #" + i);
            user = userRepository.save(user);

            // 2. Create Wallet (Postgres)
            Wallet wallet = new Wallet();
            wallet.setId(UUID.randomUUID());
            wallet.setUserId(user.getId());
            wallet.setBalance(new BigDecimal("100.00"));
            wallet.setCurrency("WITS");
            wallet.setQrCodeToken(UUID.randomUUID().toString());
            wallet.setCreatedAt(Instant.now());
            walletRepository.save(wallet);

            // 3. Create 2 Posts (Postgres)
            for (int p = 1; p <= 2; p++) {
                Post post = new Post();
                post.setId(UUID.randomUUID());
                post.setUserId(UUID.fromString(user.getId()));
                post.setAuthorId(user.getId());
                post.setContent(
                        "Hello WITS! This is my post #" + p + ". Loving the interface! #SuperApp #WITS #User" + i);
                post.setCreatedAt(Instant.now());
                post.setTimestamp(LocalDateTime.now());
                post.setType(Post.PostType.TEXT);
                post.setAuthorType(Post.PostAuthorType.USER);
                post.setMediaUrls(new ArrayList<>());
                post.setLikerIds(new ArrayList<>());
                postRepository.save(post);
            }

            // 4. Create Message (Postgres)
            Message msg = new Message();
            msg.setId(UUID.randomUUID());
            msg.setSenderId(UUID.fromString(user.getId()));
            msg.setConversationId(UUID.randomUUID());
            msg.setContent("Hey! I'm user_" + i + ". Anyone wants to chat?");
            msg.setTimestamp(LocalDateTime.now());
            msg.setCreatedAt(Instant.now());
            msg.setStatus(Message.MessageStatus.SENT);
            msg.setMessageType(Message.MessageType.TEXT);
            messageRepository.save(msg);
        }

        System.out.println("Data successfully initialized: 50 Users, 100 Posts, 50 Messages.");
    }
}
