package com.AuthenAvenue.repository;

import com.AuthenAvenue.modal.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinRepository extends JpaRepository<Coin, String> {
}
