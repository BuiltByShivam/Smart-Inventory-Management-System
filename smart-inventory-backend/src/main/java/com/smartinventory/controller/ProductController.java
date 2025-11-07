package com.smartinventory.controller;

import com.smartinventory.model.Product;
import com.smartinventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // allow all for testing
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // 🟢 Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 🟢 Get products with pagination & sorting
    @GetMapping("/page")
    public Page<Product> getProductsByPage(
            @RequestParam(defaultValue = "0") int page,        // page number, starts at 0
            @RequestParam(defaultValue = "5") int size,       // page size
            @RequestParam(defaultValue = "id") String sortBy, // field to sort by
            @RequestParam(defaultValue = "asc") String order  // asc or desc
    ) {
        Sort sort = order.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(pageable);
    }

    // 🟡 Add new product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        product.setLastUpdated(LocalDateTime.now()); // auto-update timestamp
        return productRepository.save(product);
    }

    // 🟡 Update product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Product not found with id " + id)
        );

        // update fields
        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setSku(productDetails.getSku());
        product.setQuantity(productDetails.getQuantity());
        product.setLastUpdated(LocalDateTime.now()); // auto-update timestamp

        return productRepository.save(product);
    }

    // 🟣 Get products by category
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    // 🟣 Get products by name search
    @GetMapping("/search/{name}")
    public List<Product> getProductsByName(@PathVariable String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // 🟣 Get products by price range
    @GetMapping("/price/less-than/{price}")
    public List<Product> getProductsByMaxPrice(@PathVariable Double price) {
        return productRepository.findByPriceLessThanEqual(price);
    }

    @GetMapping("/price/greater-than/{price}")
    public List<Product> getProductsByMinPrice(@PathVariable Double price) {
        return productRepository.findByPriceGreaterThanEqual(price);
    }

    // 🔴 Delete a product
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}
