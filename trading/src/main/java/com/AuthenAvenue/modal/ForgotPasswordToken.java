package com.AuthenAvenue.modal;

import com.AuthenAvenue.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class ForgotPasswordToken {

    @Id
    private String id;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

    @OneToOne
    private User user;

    private String otp;

    private VerificationType verificationType;

    private String sendTo;
}
