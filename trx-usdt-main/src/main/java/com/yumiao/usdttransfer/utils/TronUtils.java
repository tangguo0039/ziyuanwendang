package com.yumiao.usdttransfer.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.protobuf.Any;
import com.google.protobuf.ByteString;
import com.google.protobuf.InvalidProtocolBufferException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spongycastle.crypto.digests.SM3Digest;
import org.spongycastle.util.encoders.DecoderException;
import org.spongycastle.util.encoders.Hex;
import org.tron.protos.Protocol;
import org.tron.protos.Protocol.*;
import org.tron.protos.contract.*;
import org.tron.common.crypto.*;
import sun.misc.BASE64Decoder;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class TronUtils {
	static int ADDRESS_SIZE = 21;
	private static byte addressPreFixByte = (byte) 0x41; // 41 + address (byte) 0xa0; //a0 + address

	public static String toHexAddress(String tAddress) {
		return ByteArray.toHexString(decodeFromBase58Check(tAddress));
	}


	private static byte[] decodeFromBase58Check(String addressBase58) {
		if (StringUtils.isEmpty(addressBase58)) {
			return null;
		}
		byte[] address = decode58Check(addressBase58);
		if (!addressValid(address)) {
			return null;
		}
		return address;
	}

	public static byte[] decode58Check(String input) {
		byte[] decodeCheck = Base58.decode(input);
		if (decodeCheck.length <= 4) {
			return null;
		}
		byte[] decodeData = new byte[decodeCheck.length - 4];
		System.arraycopy(decodeCheck, 0, decodeData, 0, decodeData.length);
		byte[] hash0 = Sha256Hash.hash(true, decodeData);
		byte[] hash1 = Sha256Hash.hash(true, hash0);
		if (hash1[0] == decodeCheck[decodeData.length] && hash1[1] == decodeCheck[decodeData.length + 1]
				&& hash1[2] == decodeCheck[decodeData.length + 2] && hash1[3] == decodeCheck[decodeData.length + 3]) {
			return decodeData;
		}
		return null;
	}

	private static boolean addressValid(byte[] address) {
		if (ArrayUtils.isEmpty(address)) {
			return false;
		}
		if (address.length != ADDRESS_SIZE) {
			return false;
		}
		byte preFixbyte = address[0];
		return preFixbyte == getAddressPreFixByte();
		// Other rule;
	}

	private static byte getAddressPreFixByte() {
		return addressPreFixByte;
	}


	private static final BigDecimal decimal = new BigDecimal("1000000");

	public static void main(String args[]) throws Exception {
	    String priv="0000000000000000000000000000000000000000000000000000000430e1b700";
//	   // priv="909d3f912ab1f816a79e759547bbe33727f03ee7e6e8589d7e49f0092dbb97be";
//		//priv="AjWnDqkKBR3kimNMAzcZfYdhdPh2Nsj2uvYi1nLaoZkZ";
////		String luo="909d3f912ab1f816a79e759547bbe33727f03ee7e6e8589d7e49f0092dbb97be";
//		byte[] ddd=decode58Check(priv);
//        String priv1=Hex.toHexString(ddd);
//		System.out.println(kkkk);

//
//		//String sss = Base58.encode(priv.getBytes());
//
//		//byte[] decodeCheck = Base58.encode(priv.getBytes());
//
//		 priv=Hex.toHexString(priv.getBytes());


////
//		System.out.println(getAddressByPrivateKey(priv1));
//        System.out.println(toHexAddress(getAddressByPrivateKey(priv1)));
        //base58 AjWnDqkKBR3kimNMAzcZfYdhdPh2Nsj2uvYi1nLaoZkZ
//        priv="909d3f912ab1f816a79e759547bbe33727f03ee7e6e8589d7e49f0092dbb97be";
//		try {
////			String s = new BigInteger(priv.substring(2), 16).toString();
//
//			final int accuracy = 6;//六位小数
//			BigDecimal bigDecimal =  new BigDecimal(priv).divide(decimal, accuracy, RoundingMode.FLOOR);
//			System.out.println("  === "+bigDecimal);
//		}catch (Exception e){
//			e.printStackTrace();
//		}

//		byte[] v = Hex.decode(priv);
//		System.out.printf("v.  "+v.toString());
//        String base58=  Base58.encode(v);
//        System.out.println(base58);
//        byte[] eee= Base58.decode(base58);
//        priv=Hex.toHexString(eee);

//		Hex.decode();


//        System.out.println(priv);
//		System.out.println(getAddressByPrivateKey(priv));
//		System.out.println(toHexAddress(getAddressByPrivateKey(priv)));



        //自己地址转换
//		priv="";
//		System.out.println(getAddressByPrivateKey(priv));
//		System.out.println(toHexAddress(getAddressByPrivateKey(priv)));
        //密钥解压成地址
        String privateKey = "06c0304ac0fe63acf6a1dae9658f47edf41b554cd4620a3e98db70ef1fbd2187";
        String authAddress= TronUtils.getAddressByPrivateKey(privateKey);
        System.out.printf("authAddress: "+authAddress);
//        地址


	}
    /**
     * BASE64解密
     * @throws Exception
     */
    public static byte[] decryptBASE64(String key) throws Exception {
        return (new BASE64Decoder()).decodeBuffer(key);
    }


    public static String getAddressByPrivateKey( byte[] privateBytes) {
        ECKey ecKey = ECKey.fromPrivate(privateBytes);
        byte[] from = ecKey.getAddress();
        return toViewAddress(Hex.toHexString(from));
    }

    	/**
	 * 根据私钥获取地址
	 *
	 * @param privateKey
	 * @return
	 */
	public static String getAddressByPrivateKey(String privateKey) {
		byte[] privateBytes = decode(privateKey);

		ECKey ecKey = ECKey.fromPrivate(privateBytes);
		byte[] from = ecKey.getAddress();
		return toViewAddress(Hex.toHexString(from));
	}
    public static byte[] decode(String data) {
        ByteArrayOutputStream bOut = new ByteArrayOutputStream();
        try {
            decode(data, bOut);
        } catch (Exception var3) {
            System.out.println("exception decoding Hex string: " + var3.getMessage()+"   "+ var3);
        }
        return bOut.toByteArray();
    }


    public static int decode(String data, OutputStream out) throws IOException {
        int length = 0;

        int end;
        for(end = data.length(); end > 0 && ignore(data.charAt(end - 1)); --end) {
        }

        for(int i = 0; i < end; ++length) {
            while(i < end && ignore(data.charAt(i))) {
                ++i;
            }

            byte b1;
            for(b1 = decodingTable[data.charAt(i++)]; i < end && ignore(data.charAt(i)); ++i) {
            }

            byte b2 = decodingTable[data.charAt(i++)];
            if ((b1 | b2) < 0) {
                throw new IOException("invalid characters encountered in Hex string");
            }

            out.write(b1 << 4 | b2);
        }

        return length;
    }
    private static boolean ignore(char c) {
        return c == '\n' || c == '\r' || c == '\t' || c == ' ';
    }

    public static int encode(byte[] data, int off, int length, OutputStream out) throws IOException {
        for(int i = off; i < off + length; ++i) {
            int v = data[i] & 255;
            out.write(encodingTable[v >>> 4]);
            out.write(encodingTable[v & 15]);
        }
        return length * 2;
    }
    protected static final byte[] encodingTable = new byte[]{48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102};
    protected static final byte[] decodingTable = new byte[128];



    /**
     * 转换成T开头的地址
     * @param hexAddress
     * @return
     */
    public static String toViewAddress(String hexAddress) {
        return encode58Check(org.tron.common.utils.ByteArray.fromHexString(hexAddress));
    }

    public static String encode58Check(byte[] input) {
        try {
            byte[] hash0 = hash(true, input);
            byte[] hash1 = hash(true, hash0);
            byte[] inputCheck = new byte[input.length + 4];
            System.arraycopy(input, 0, inputCheck, 0, input.length);
            System.arraycopy(hash1, 0, inputCheck, input.length, 4);
            return Base58.encode(inputCheck);
        } catch (Throwable t) {
            log.error(String.format("data error:%s", Hex.toHexString(input)), t);
        }
        return null;
    }
    /**
     * Calculates the SHA-256 hash of the given bytes.
     *
     * @param input the bytes to hash
     * @return the hash (in big-endian order)
     */
    public static byte[] hash(boolean isSha256, byte[] input) throws NoSuchAlgorithmException {
        return hash(isSha256, input, 0, input.length);
    }

    /**
     * Calculates the SHA-256 hash of the given byte range.
     *
     * @param input  the array containing the bytes to hash
     * @param offset the offset within the array of the bytes to hash
     * @param length the number of bytes to hash
     * @return the hash (in big-endian order)
     */
    public static byte[] hash(boolean isSha256, byte[] input, int offset, int length) throws NoSuchAlgorithmException {
        if (isSha256) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(input, offset, length);
            return digest.digest();
        } else {
            SM3Digest digest = new SM3Digest();
            digest.update(input, offset, length);
            byte[] eHash = new byte[digest.getDigestSize()];
            digest.doFinal(eHash, 0);
            return eHash;
        }
    }



	/**
	 * 报装成transaction
	 *
	 * @param strTransaction
	 * @return
	 */
	public static Protocol.Transaction packTransaction(String strTransaction) {
		JSONObject jsonTransaction = JSONObject.parseObject(strTransaction);
		JSONObject rawData = jsonTransaction.getJSONObject("raw_data");
		JSONArray contracts = new JSONArray();
		JSONArray rawContractArray = rawData.getJSONArray("contract");
		for (int i = 0; i < rawContractArray.size(); i++) {
			try {
				JSONObject contract = rawContractArray.getJSONObject(i);
				JSONObject parameter = contract.getJSONObject("parameter");
				String contractType = contract.getString("type");
				Any any = null;
				switch (contractType) {
					case "AccountCreateContract":
						AccountContract.AccountCreateContract.Builder accountCreateContractBuilder = AccountContract.AccountCreateContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								accountCreateContractBuilder);
						any = Any.pack(accountCreateContractBuilder.build());
						break;
					case "TransferContract":
						BalanceContract.TransferContract.Builder transferContractBuilder = BalanceContract.TransferContract.newBuilder();
						JsonFormat
								.merge(parameter.getJSONObject("value").toString(), transferContractBuilder);
						any = Any.pack(transferContractBuilder.build());
						break;
					case "TransferAssetContract":
						AssetIssueContractOuterClass.TransferAssetContract.Builder transferAssetContractBuilder = AssetIssueContractOuterClass.TransferAssetContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								transferAssetContractBuilder);
						any = Any.pack(transferAssetContractBuilder.build());
						break;
					case "VoteAssetContract":
						VoteAssetContractOuterClass.VoteAssetContract.Builder voteAssetContractBuilder = VoteAssetContractOuterClass.VoteAssetContract.newBuilder();
						JsonFormat
								.merge(parameter.getJSONObject("value").toString(), voteAssetContractBuilder);
						any = Any.pack(voteAssetContractBuilder.build());
						break;
					case "VoteWitnessContract":
						WitnessContract.VoteWitnessContract.Builder voteWitnessContractBuilder = WitnessContract.VoteWitnessContract
								.newBuilder();
						JsonFormat
								.merge(parameter.getJSONObject("value").toString(), voteWitnessContractBuilder);
						any = Any.pack(voteWitnessContractBuilder.build());
						break;
					case "WitnessCreateContract":
						WitnessContract.WitnessCreateContract.Builder witnessCreateContractBuilder = WitnessContract.WitnessCreateContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								witnessCreateContractBuilder);
						any = Any.pack(witnessCreateContractBuilder.build());
						break;
					case "AssetIssueContract":
						AssetIssueContractOuterClass.AssetIssueContract.Builder assetIssueContractBuilder = AssetIssueContractOuterClass.AssetIssueContract.newBuilder();
						JsonFormat
								.merge(parameter.getJSONObject("value").toString(), assetIssueContractBuilder);
						any = Any.pack(assetIssueContractBuilder.build());
						break;
					case "WitnessUpdateContract":
						WitnessContract.WitnessUpdateContract.Builder witnessUpdateContractBuilder = WitnessContract.WitnessUpdateContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								witnessUpdateContractBuilder);
						any = Any.pack(witnessUpdateContractBuilder.build());
						break;
					case "ParticipateAssetIssueContract":
						AssetIssueContractOuterClass.ParticipateAssetIssueContract.Builder participateAssetIssueContractBuilder =
								AssetIssueContractOuterClass.ParticipateAssetIssueContract.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								participateAssetIssueContractBuilder);
						any = Any.pack(participateAssetIssueContractBuilder.build());
						break;
					case "AccountUpdateContract":
						AccountContract.AccountUpdateContract.Builder accountUpdateContractBuilder = AccountContract.AccountUpdateContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								accountUpdateContractBuilder);
						any = Any.pack(accountUpdateContractBuilder.build());
						break;
					case "FreezeBalanceContract":
						BalanceContract.FreezeBalanceContract.Builder freezeBalanceContractBuilder = BalanceContract.FreezeBalanceContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								freezeBalanceContractBuilder);
						any = Any.pack(freezeBalanceContractBuilder.build());
						break;
					case "UnfreezeBalanceContract":
						BalanceContract.UnfreezeBalanceContract.Builder unfreezeBalanceContractBuilder = BalanceContract.UnfreezeBalanceContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								unfreezeBalanceContractBuilder);
						any = Any.pack(unfreezeBalanceContractBuilder.build());
						break;
					case "UnfreezeAssetContract":
						AssetIssueContractOuterClass.UnfreezeAssetContract.Builder unfreezeAssetContractBuilder = AssetIssueContractOuterClass.UnfreezeAssetContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								unfreezeAssetContractBuilder);
						any = Any.pack(unfreezeAssetContractBuilder.build());
						break;
					case "WithdrawBalanceContract":
						BalanceContract.WithdrawBalanceContract.Builder withdrawBalanceContractBuilder = BalanceContract.WithdrawBalanceContract
								.newBuilder();
						JsonFormat.merge(parameter.getJSONObject("value").toString(),
								withdrawBalanceContractBuilder);
						any = Any.pack(withdrawBalanceContractBuilder.build());
						break;
					case "UpdateAssetContract":
						AssetIssueContractOuterClass.UpdateAssetContract.Builder updateAssetContractBuilder = AssetIssueContractOuterClass.UpdateAssetContract
								.newBuilder();
						JsonFormat
								.merge(parameter.getJSONObject("value").toString(), updateAssetContractBuilder);
						any = Any.pack(updateAssetContractBuilder.build());
						break;
					case "SmartContract":
						SmartContractOuterClass.SmartContract.Builder smartContractBuilder = SmartContractOuterClass.SmartContract.newBuilder();
						JsonFormat
								.merge(parameter.getJSONObject("value").toString(), smartContractBuilder);
						any = Any.pack(smartContractBuilder.build());
						break;
					case "TriggerSmartContract":
						SmartContractOuterClass.TriggerSmartContract.Builder triggerSmartContractBuilder = SmartContractOuterClass.TriggerSmartContract
								.newBuilder();
						JsonFormat
								.merge(parameter.getJSONObject("value").toString(),
										triggerSmartContractBuilder);
						any = Any.pack(triggerSmartContractBuilder.build());
						break;
					// todo add other contract
					default:
				}
				if (any != null) {
					String value = Hex.toHexString(any.getValue().toByteArray());
					parameter.put("value", value);
					contract.put("parameter", parameter);
					contracts.add(contract);
				}
			} catch (Exception e) {
				e.printStackTrace();
				;
			}
		}
		rawData.put("contract", contracts);
		jsonTransaction.put("raw_data", rawData);
		Protocol.Transaction.Builder transactionBuilder = Protocol.Transaction.newBuilder();
		try {
			JsonFormat.merge(jsonTransaction.toString(), transactionBuilder);
			return transactionBuilder.build();
		} catch (Exception e) {
			return null;
		}

	}

}
