package com.message.chat.WITS.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class MediaService {

    private final S3Client s3Client;

    @Value("${s3.bucketName:wits-media}")
    private String bucketName;

    @Value("${s3.publicUrlPrefix:}")
    private String publicUrlPrefix;

    public MediaService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = UUID.randomUUID().toString() + "-"
                + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
        String objectKey = folder + "/" + fileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Return the full public URL to this specific object inside the InsForge bucket
        return publicUrlPrefix + "/" + bucketName + "/" + objectKey;
    }
}
