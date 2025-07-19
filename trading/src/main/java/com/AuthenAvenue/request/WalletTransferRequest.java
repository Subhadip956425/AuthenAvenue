package com.AuthenAvenue.request;

import lombok.Data;

@Data
public class WalletTransferRequest {
    private Long amount;
    private String purpose;

}
