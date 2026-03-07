package com.message.chat.WITS.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
public class S3Config {

    @Value("${s3.endpointUrl:}")
    private String endpointUrl;

    @Value("${s3.accessKeyId:defaultAccessKey}")
    private String accessKeyId;

    @Value("${s3.secretAccessKey:defaultSecretKey}")
    private String secretAccessKey;

    @Value("${s3.region:ap-southeast-1}")
    private String region;

    @Bean
    public S3Client s3Client() {
        software.amazon.awssdk.services.s3.S3ClientBuilder builder = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)));

        if (endpointUrl != null && !endpointUrl.isEmpty()) {
            builder.endpointOverride(URI.create(endpointUrl));
        }

        return builder.build();
    }
}
