package com.AuthenAvenue.service;

import com.AuthenAvenue.modal.PaymentDetails;
import com.AuthenAvenue.modal.User;
import com.AuthenAvenue.repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;

    @Override
    public PaymentDetails addPaymentDetails(String accountNumber, String accountHolderName, String ifsc, String bankName, User user) {
        PaymentDetails paymentDetails = new PaymentDetails();

        paymentDetails.setAccountNumber(accountNumber);
        paymentDetails.setAccountHolderName(accountHolderName);
        paymentDetails.setIfsc(ifsc);
        paymentDetails.setBankName(bankName);
        paymentDetails.setUser(user);

        return paymentDetailsRepository.save(paymentDetails);
    }

    public PaymentDetails updatePaymentDetails(Long id, PaymentDetails updatedDetails, User user) throws Exception {
        PaymentDetails existing = paymentDetailsRepository.findById(id)
                .orElseThrow(() -> new Exception("Payment details not found for ID: " + id));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new Exception("Unauthorized to update this payment detail.");
        }

        existing.setAccountNumber(updatedDetails.getAccountNumber());
        existing.setAccountHolderName(updatedDetails.getAccountHolderName());
        existing.setIfsc(updatedDetails.getIfsc());
        existing.setBankName(updatedDetails.getBankName());

        return paymentDetailsRepository.save(existing);
    }


    @Override
    public PaymentDetails getUsersPaymentDetails(User user) {
        return paymentDetailsRepository.findByUserId(user.getId());
    }
}
