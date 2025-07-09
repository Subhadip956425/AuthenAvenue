package com.AuthenAvenue.service;

import com.AuthenAvenue.domain.VerificationType;
import com.AuthenAvenue.modal.ForgotPasswordToken;
import com.AuthenAvenue.modal.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user, String id, String otp, VerificationType verificationType, String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(ForgotPasswordToken token);
}
