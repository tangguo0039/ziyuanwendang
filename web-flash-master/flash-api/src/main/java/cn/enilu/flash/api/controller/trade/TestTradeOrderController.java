package cn.enilu.flash.api.controller.trade;//package cn.enilu.flash.api.controller.trade;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.service.trade.TradeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tron.trident.core.ApiWrapper;
import org.tron.trident.core.key.KeyPair;

@Api(tags={"Trx转账"})
@RestController
@RequestMapping("/tesTrxTransfer")
public class TestTradeOrderController extends BaseController {
	private  Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private TradeService tradeService;


	@ApiOperation(value = "Trx转账:详细参数")
	@GetMapping("/trxTransfer")
	public Object totransfer(
			@ApiParam(value = "from", required = false)
            @RequestParam(value = "from", required = false)
                    String from,
			@ApiParam(value = "privateKey", required = false)
            @RequestParam(value = "privateKey", required = false)
                    String privateKey,
			@ApiParam(value = "to", required = false)
            @RequestParam(value = "to", required = true)
                    String to,
			@ApiParam(value = "tran_num", required = false)
			@RequestParam(value = "tran_num", required = true)
                    String tran_num,
			@ApiParam(value = "remark", required = false)
            @RequestParam(value = "remark", required = false)
                    String remark
	) {
//	    tradeService.trxTransfer(from,privateKey,tran_num,to,remark);

		KeyPair keyPair = new KeyPair("06c0304ac0fe63acf6a1dae9658f47edf41b554cd4620a3e98db70ef1fbd2187");

		String privateKeyString = keyPair.toPrivateKey(); //String private key

		String publicKey = keyPair.toPublicKey(); //String public key

		String hexAddress = keyPair.toHexAddress();

		System.out.printf("\nhexAddress="+hexAddress+"\n privateKeyString= "+privateKeyString+"\npublicKey=  "+publicKey);

		long feeLimit=1000000L;
		ApiWrapper wrapper = ApiWrapper.ofMainnet(hexAddress, "1e5fc191-6381-47e3-b298-f1a9343be146");
		long lo =  Long.valueOf(1000000L);
//		String from = "TTT5bsKEQiRQEhVBrBeyphWPvGKhYUeJDt";
//		String to = "TLgRLbN66n5q3yTv9SfwsTrb8KPQJFZYjZ";
		return Rets.success();
	}

}