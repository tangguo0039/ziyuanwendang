package cn.enilu.flash.service.trade;


import cn.enilu.flash.bean.dt.TriggerSmartContract;
import cn.enilu.flash.bean.entity.trade.TradeOrder;
import cn.enilu.flash.dao.trade.TradeOrderRepository;

import cn.enilu.flash.service.BaseService;
import cn.enilu.flash.utils.ByteArray;
import cn.enilu.flash.utils.TronUtils;
import cn.enilu.flash.utils.constant.TronConstant;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.google.protobuf.ByteString;
import com.google.protobuf.InvalidProtocolBufferException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.tron.common.crypto.ECKey;
import org.tron.protos.Protocol;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

@Service
public class TradeOrderService extends BaseService<TradeOrder,Long,TradeOrderRepository>  {
    private Logger log = LoggerFactory.getLogger(getClass());
    @Autowired
    private TradeOrderRepository tradeOrderRepository;

    /**
     * TRX主网
     */
    private static final String tronUrl = "https://api.trongrid.io";

// https://api.trongrid.io/v1/accounts/TAmum5uCXmZmYcKLURa2uvo2isFKsfudb5/transactions?only_confirmed=true&only_to=true&min_block_timestamp=1650794038596
    /**
     * trc20合约地址 这个是USDT代币
     */
    private String contract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

    /**
     * 代币精度
     */
    //token的精度  就是小数点后面有多少位小数 然后1后面加多少个0就可以
    private static final BigDecimal decimal = new BigDecimal("1000000");


    private static final long feeLimit=1000000L;


    @Autowired
    private RestTemplate restTemplate;

    /**
     * 获取账户订单
     */

    public Boolean processTronOrders(String address){
        Map<String,String> map = new HashMap<>();
        String jsonObject = restTemplate.getForEntity(TronConstant.TronTradeConstant.tronUrl+TronConstant.TronTradeConstant.accounts,
                String.class, map).getBody();

        log.info("返回的数据集合:" + jsonObject);
        if (jsonObject != null) {
        }
        return false;
    }






    public String castHexAddress(String address) {
        if (address.startsWith("T")) {
            return TronUtils.toHexAddress(address);
        }
        return address;
    }
    public String usdtSendTransaction( String fromAddress, String privateKey, String amount, String toAddress,String remark) {
        return sendTokenTransaction(contract,fromAddress,privateKey,amount,toAddress,remark);
    }


    /**
     * 代币转账  trc20
     *
     * @param contract
     * @param fromAddress
     * @param privateKey  fromAddress的私钥
     * @param amount
     * @param toAddress
     * @param remark
     * @return
     */
    public String sendTokenTransaction(String contract, String fromAddress, String privateKey, String amount, String toAddress, String remark) {
        try {
            String hexFromAddress = castHexAddress(fromAddress);
            String hexToAddress = castHexAddress(toAddress);
            String hexContract = castHexAddress(contract);

            BigInteger a = new BigInteger(amount);
            if (a.compareTo(BigInteger.ZERO) <= 0) {
                log.error("转账失败:额度不符合规则 " + amount);
                return null;
            }
            if (remark == null) {
                remark = "";
            }
            TriggerSmartContract.Param param = new TriggerSmartContract.Param();
            param.setOwner_address(hexFromAddress);
            param.setContract_address(hexContract);
            param.setFee_limit(1000000L);
            param.setFunction_selector("transfer(address,uint256)");
            String addressParam = addZero(hexToAddress, 64);
            String amountParam = addZero(a.toString(16), 64);
            param.setParameter(addressParam + amountParam);
            log.info("创建交易参数:" + JSONObject.toJSONString(param));
            String url=tronUrl + "/wallet/triggersmartcontract";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
            headers.set("TRON-PRO-API-KEY","1e5fc191-6381-47e3-b298-f1a9343be146");
            HttpEntity<String> requetString = new HttpEntity<String>(JSON.toJSONString(param),headers);

//            String json = restTemplate.postForEntity(url,param,String.class).getBody();
            String json = restTemplate.postForEntity(url,requetString,String.class).getBody();

            TriggerSmartContract.Result obj=JSON.parseObject(json,TriggerSmartContract.Result.class);
            if (!obj.isSuccess()) {
                log.error("创建交易失败");
                return null;
            }
            Protocol.Transaction transaction= TronUtils.packTransaction(JSON.toJSONString(obj.getTransaction()));
            byte[] transaction4 = signTransaction2Byte(transaction.toByteArray(), ByteArray.fromHexString(privateKey));;

            com.alibaba.fastjson.JSONObject transactionObj =  org.tron.common.utils.Utils.printTransactionToJSON(Protocol.Transaction.parseFrom(transaction4), false);
            JSONObject jsonObject = restTemplate.postForEntity(tronUrl+"/wallet/broadcasttransaction",transactionObj, JSONObject.class).getBody();
            // JSONObject rea = restTemplate.postForEntity(tronUrl+"/wallet/broadcasttransaction",signParam, JSONObject.class).getBody();
            log.info("广播交易结果:" + jsonObject.toJSONString());
            if (jsonObject != null) {
                Object result = jsonObject.get("result");
                if (result instanceof Boolean) {
                    if ((boolean) result) {
                        return (String) jsonObject.get("txid");
                    }
                }
            }

        } catch (Throwable t) {
            log.error(t.getMessage(), t);
        }
        return null;
    }



    /**
     * 签名
     * @param transaction
     * @param privateKey
     * @return
     * @throws InvalidProtocolBufferException
     */
    private static byte[] signTransaction2Byte(byte[] transaction, byte[] privateKey)
            throws InvalidProtocolBufferException {
        ECKey ecKey = ECKey.fromPrivate(privateKey);
        Protocol.Transaction transaction1 = Protocol.Transaction.parseFrom(transaction);
        byte[] rawdata = transaction1.getRawData().toByteArray();//Sha256Hash
        byte[] hash = org.tron.common.crypto.Sha256Sm3Hash.hash(rawdata);
        byte[] sign = ecKey.sign(hash).toByteArray();
        return transaction1.toBuilder().addSignature(ByteString.copyFrom(sign)).build().toByteArray();
    }

    /**
     * 补充0到64个字节
     * @param dt
     * @return
     */
    private String addZero(String dt, int length) {
        StringBuilder builder = new StringBuilder();
        final int count = length;
        int zeroAmount = count - dt.length();
        for (int i = 0; i < zeroAmount; i++) {
            builder.append("0");
        }
        builder.append(dt);
        return builder.toString();
    }
}

