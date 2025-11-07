package com.smartinventory.repository;

import com.smartinventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by category
    List<Product> findByCategoryIgnoreCase(String category);

    // Find products by name
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products with price less than or equal to
    List<Product> findByPriceLessThanEqual(Double price);

    // Find products with price greater than or equal to
    List<Product> findByPriceGreaterThanEqual(Double price);
}
