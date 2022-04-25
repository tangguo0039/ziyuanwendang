package cn.enilu.flash.utils.constant;

import java.math.BigDecimal;

public interface TronConstant {

    /**
     * tron交易常量
     */
    public interface TronTradeConstant {
        String contract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
        final String tronUrl = "https://api.trongrid.io";
        final BigDecimal decimal = new BigDecimal("1000000");

        final String accounts = "/v1/accounts/";

    }
}
