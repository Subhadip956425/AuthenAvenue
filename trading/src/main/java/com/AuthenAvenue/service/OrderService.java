package com.AuthenAvenue.service;

import com.AuthenAvenue.domain.OrderType;
import com.AuthenAvenue.modal.Coin;
import com.AuthenAvenue.modal.Order;
import com.AuthenAvenue.modal.OrderItem;
import com.AuthenAvenue.modal.User;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId) throws Exception;

    List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol);

    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;
}
