package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Product;
import com.message.chat.WITS.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        if (product.getId() == null) {
            product.setId(UUID.randomUUID());
        }
        return productRepository.save(product);
    }

    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(UUID id, Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        return productRepository.save(product);
    }
}
