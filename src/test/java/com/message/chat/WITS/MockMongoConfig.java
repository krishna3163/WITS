package com.message.chat.WITS;

import com.mongodb.client.MongoClient;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class MockMongoConfig {

    @Bean
    @Primary
    public MongoClient mongoClient() {
        return Mockito.mock(MongoClient.class);
    }
}
