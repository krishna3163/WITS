package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Product;
import com.message.chat.WITS.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return storeService.getAllProducts();
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return storeService.addProduct(product);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable UUID id, @RequestBody Product product) {
        return storeService.updateProduct(id, product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable UUID id) {
        storeService.deleteProduct(id);
    }
}
