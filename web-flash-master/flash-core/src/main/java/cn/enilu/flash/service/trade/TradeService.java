package cn.enilu.flash.service.trade;

import cn.enilu.flash.bean.entity.system.Cfg;
import cn.enilu.flash.cache.ConfigCache;
import cn.enilu.flash.dao.system.CfgRepository;
import cn.enilu.flash.service.BaseService;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tron.trident.api.WalletGrpc;
import org.tron.trident.core.ApiWrapper;
import org.tron.trident.core.exceptions.IllegalException;
import org.tron.trident.core.key.KeyPair;
import org.tron.trident.core.transaction.TransactionBuilder;
import org.tron.trident.crypto.SECP256K1;
import org.tron.trident.proto.Chain;
import org.tron.trident.proto.Contract;
import org.tron.trident.proto.Response;

import static org.tron.trident.proto.Response.TransactionReturn.response_code.SUCCESS;

/**
 * CfgService
 *
 * @author enilu
 * @version 2018/11/17 0017
 */

@Service
@Transactional
public class TradeService extends BaseService<Cfg, Long, CfgRepository> {
    @Autowired
    private ConfigCache configCache;




    public Boolean trxTransfer(String from,String privateKey,String tran_num,String to,String remark) throws Exception{
        ApiWrapper wrapper = ApiWrapper.ofMainnet("hex private key", "API key");
        long lo =  Long.valueOf(tran_num);
        Response.TransactionExtention  transactionExtention = wrapper.transfer(from, to, lo);
        return false;
    }

    public static void main(String[] args) throws IllegalException {
//        trident-java有三个包：
//        abi	包含了ABI中使用的各种数据类型，以及编码/解码工具。
//        core	包含了封装的方法，便于使用波场系统合约与智能合约。对常用内容有单独封装（如：TRC-20）。
//        utils	包含了各种常用工具，例如：sha256计算，地址格式转换，等。

        KeyPair keyPair = new KeyPair("06c0304ac0fe63acf6a1dae9658f47edf41b554cd4620a3e98db70ef1fbd2187");

        String privateKey = keyPair.toPrivateKey(); //String private key

        String publicKey = keyPair.toPublicKey(); //String public key

        String hexAddress = keyPair.toHexAddress();

        System.out.printf("\nhexAddress="+hexAddress+"\n privateKey= "+privateKey+"\npublicKey=  "+publicKey);

        long feeLimit=1000000L;
        ApiWrapper wrapper = ApiWrapper.ofMainnet(hexAddress, "1e5fc191-6381-47e3-b298-f1a9343be146");
        long lo =  Long.valueOf(1000000L);
        String from = "TTT5bsKEQiRQEhVBrBeyphWPvGKhYUeJDt";
        String to = "TLgRLbN66n5q3yTv9SfwsTrb8KPQJFZYjZ";
//        Response.TransactionExtention  transactionExtention = wrapper.transfer(from, to, lo);
//        Chain.Transaction transaction = transactionExtention.getTransaction();
//
//
//        TransactionBuilder builder = new TransactionBuilder(transaction);
//        builder.setFeeLimit(100000000L);
//        builder.setMemo("memo");
//        builder.build();
//
//        Chain.Transaction signedTransaction = wrapper.signTransaction(transaction);
//        wrapper.broadcastTransaction(signedTransaction);


        //    Java
//        String toBase58CheckAddress = keyPair.toBase58CheckAddress();
//        String toHexAddress = keyPair.toHexAddress();
//        System.out.printf("\ntoBase58CheckAddress = "+toBase58CheckAddress+"\ntoBase58CheckAddress=  "+toHexAddress);



//        用特定的公钥转换为byte[]，Base58Check或Hex地址 Java
        //the parent function, returns byte[]
//        KeyPair.publicKeyToAddress(SECP256K1.PublicKey pubKey);

//        KeyPair.publicKeyToBase58CheckAddress(SECP256K1.PublicKey pubKey);

//        KeyPair.publicKeyToHexAddress(SECP256K1.PublicKey pubKey);
//        签名Java
        //this function returns the signature message in byte[]
//        KeyPair.signTransaction(byte[] txid, KeyPair keyPair);
    }



}
