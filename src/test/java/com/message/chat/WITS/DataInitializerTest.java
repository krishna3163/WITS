package com.message.chat.WITS;

import com.message.chat.WITS.model.*;
import com.message.chat.WITS.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@SpringBootTest
@ActiveProfiles("test")
@Import(MockMongoConfig.class)
public class DataInitializerTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Test
    public void generateData() {
        // Clearing existing data is often handled by RDBMS settings in tests,
        // but since we want to populate the 'test' profile DB:

        for (int i = 1; i <= 50; i++) {
            User user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setUsername("user_" + i);
            user.setEmail("user" + i + "@wits.app");
            user.setPassword("password123");
            // userRepository.save(user); // Mocked

            // Create Wallet for user
            Wallet wallet = new Wallet();
            wallet.setId(UUID.randomUUID());
            wallet.setUserId(user.getId());
            wallet.setBalance(new BigDecimal("1000.00"));
            wallet.setCurrency("WITS");
            wallet.setQrCodeToken(UUID.randomUUID().toString());
            wallet.setCreatedAt(Instant.now());
            walletRepository.save(wallet);

            // Create 2 Posts per user
            for (int p = 1; p <= 2; p++) {
                Post post = new Post();
                post.setId(UUID.randomUUID());
                post.setUserId(UUID.fromString(user.getId()));
                post.setAuthorId(user.getId());
                post.setContent("This is an automated post #" + p + " from " + user.getUsername()
                        + ". WITS is the future of Super Apps! #Release #SuperApp");
                post.setCreatedAt(Instant.now());
                post.setTimestamp(LocalDateTime.now());
                post.setType(Post.PostType.TEXT);
                post.setAuthorType(Post.PostAuthorType.USER);
                post.setMediaUrls(new ArrayList<>());
                post.setLikerIds(new ArrayList<>());
                postRepository.save(post);
            }

            // Create a welcome message
            Message msg = new Message();
            msg.setId(UUID.randomUUID());
            msg.setSenderId(UUID.fromString(user.getId()));
            msg.setConversationId(UUID.randomUUID()); // Simple placeholder
            msg.setContent("Hello! I am " + user.getUsername() + ", just joined the WITS network.");
            msg.setTimestamp(LocalDateTime.now());
            msg.setCreatedAt(Instant.now());
            msg.setStatus(Message.MessageStatus.SENT);
            msg.setMessageType(Message.MessageType.TEXT);
            messageRepository.save(msg);
        }

        System.out.println("Successfully generated 50 users with 100 posts and 50 messages.");
    }
}
