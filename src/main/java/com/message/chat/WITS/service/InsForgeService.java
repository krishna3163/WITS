package com.message.chat.WITS.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import java.net.URI;
import java.io.InputStream;

@Service
public class InsForgeService {

    // Using InsForge S3-compatible storage
    // Endpoint: something.insforge.dev

    private final S3Client s3;
    private final String bucketName = "wits-assets";

    public InsForgeService(@Value("${insforge.s3.endpoint:https://s3.insforge.dev}") String endpoint,
            @Value("${insforge.s3.accessKey:defaultAccessKey}") String accessKey,
            @Value("${insforge.s3.secretKey:defaultSecretKey}") String secretKey) {

        this.s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .region(Region.US_EAST_1) // Region usually ignored for custom S3
                .build();
    }

    public String uploadFile(String key, InputStream is, long size) {
        s3.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build(), RequestBody.fromInputStream(is, size));

        return "https://s3.insforge.dev/" + bucketName + "/" + key;
    }
}
