package com.message.chat.WITS;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
@Profile("test")
public class MongoTestConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "test_db";
    }

    @Override
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017/test");
    }
}
