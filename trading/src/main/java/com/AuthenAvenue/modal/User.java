package com.AuthenAvenue.modal;

import com.AuthenAvenue.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "\"user\"")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)  // Auto genarate id
    private Long id;

    private String fullName;
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // No suggestion will be in password field and it is only writable manually
    private String password;

    @Embedded
    private TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

    private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;

    private String nationality;
    private String address;
    private String city;
    private String postcode;
    private String country;

    // Establish relationship with Wallet
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)           /////////////////////////////
    @JsonBackReference // Prevents circular references during serialization
    private Wallet wallet;



}
