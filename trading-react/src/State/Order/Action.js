import api from "@/Config/api";
import * as types from "./ActionType";

export const payOrder =
  ({ jwt, orderData, amount }) =>
  async (dispatch) => {
    dispatch({ type: types.PAY_ORDER_REQUEST });

    try {
      const response = await api.post(`/api/orders/pay`, orderData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: types.PAY_ORDER_SUCCESS,
        payload: response.data,
        amount,
      });
      console.log("Order success", response.data);
    } catch (error) {
      console.log("error", error);
      dispatch({
        type: types.PAY_ORDER_FAILURE,
        error: error.message,
      });
    }
  };

export const getAllOrderForUser =
  ({ jwt, orderType, assetSymbol }) =>
  async (dispatch) => {
    dispatch({ type: types.GET_ALL_ORDERS_REQUEST });

    try {
      const response = await api.get(`/api/orders`, {
        headers:{
            Authorization: `Bearer ${jwt}`
        },
        params: {
          order_type: orderType,
          asset_symbol: assetSymbol,
        },
      });

      dispatch({
        type: types.GET_ALL_ORDERS_SUCCESS,
        payload: response.data,
      });
      console.log("Order success", response.data);
    } catch (error) {
      console.log("error", error);
      dispatch({
        type: types.GET_ALL_ORDERS_FAILURE,
        error: error.message,
      });
    }
  };
