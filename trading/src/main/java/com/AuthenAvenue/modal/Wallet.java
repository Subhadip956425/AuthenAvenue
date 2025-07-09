package com.AuthenAvenue.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JsonBackReference // Prevents infinite recursion when serializing the User object
    private User user;

    private BigDecimal balance=BigDecimal.ZERO;
}
