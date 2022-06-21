//package cn.enilu.flash.api.controller.trade;
//
//import cn.enilu.flash.api.controller.BaseController;
//import cn.enilu.flash.bean.entity.trade.TradeOrder;
//import cn.enilu.flash.service.trade.TradeOrderService;
//
//import cn.enilu.flash.bean.core.BussinessLog;
//import cn.enilu.flash.bean.constant.factory.PageFactory;
//import cn.enilu.flash.bean.enumeration.BizExceptionEnum;
//import cn.enilu.flash.bean.exception.ApplicationException;
//import cn.enilu.flash.bean.vo.front.Ret;
//import cn.enilu.flash.bean.vo.front.Rets;
//
//import cn.enilu.flash.utils.TronUtils;
//import cn.enilu.flash.utils.factory.Page;
//
//
//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiOperation;
//import io.swagger.annotations.ApiParam;
//import org.apache.shiro.authz.annotation.RequiresPermissions;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@Api(tags={"USDT转账"})
//@RestController
//@RequestMapping("/trade")
//public class TradeOrderController extends BaseController {
//	private  Logger logger = LoggerFactory.getLogger(getClass());
//	@Autowired
//	private TradeOrderService tradeOrderService;
//
//
//	@ApiOperation(value = "USDT转账")
//	@GetMapping("/usdttransfer")
//	public Object totransfer(
//			@ApiParam(value = "from", required = true) @RequestParam(value = "from", required = true)String from,
//			@ApiParam(value = "privateKey", required = true) @RequestParam(value = "privateKey", required = true)String privateKey,
//			@ApiParam(value = "to", required = true) @RequestParam(value = "to", required = true)String to,
//			@ApiParam(value = "tran_num", required = true)
//			@RequestParam(value = "tran_num", required = true) String tran_num,
//			@ApiParam(value = "remark", required = false) @RequestParam(value = "remark", required = false)  String remark
//	) {
//		logger.info("to:{},from:{},tran_num:{}",to,from,tran_num);
////		String authAddress= TronUtils.getAddressByPrivateKey(privateKey);
//		logger.info("to:{},tran_num:{},authAddress:{}",to,tran_num,from);
//		String result= tradeOrderService.usdtSendTransaction(from,privateKey,tran_num,to,remark);
//		return Rets.success(result);
//	}
//
//	@GetMapping(value = "/list")
////	@RequiresPermissions(value = "tradeOrder")
//	public Ret list(@RequestParam(required = false) Long id) {
//		Page<TradeOrder> page = new PageFactory<TradeOrder>().defaultPage();
//		page = tradeOrderService.queryPage(page);
//		return Rets.success(page);
//	}
//	@PostMapping
//	@BussinessLog(value = "新增u交易订单实体", key = "name")
////	@RequiresPermissions(value = "tradeOrderAdd")
//	public Ret add(@ModelAttribute TradeOrder tradeOrder){
//		tradeOrderService.insert(tradeOrder);
//		return Rets.success();
//	}
//	@PutMapping
//	@BussinessLog(value = "更新u交易订单实体", key = "name")
////	@RequiresPermissions(value = "tradeOrderUpdate")
//	public Ret update(@ModelAttribute TradeOrder tradeOrder){
//		tradeOrderService.update(tradeOrder);
//		return Rets.success();
//	}
//	@DeleteMapping
//	@BussinessLog(value = "删除u交易订单实体", key = "id")
////	@RequiresPermissions(value = "tradeOrderDelete")
//	public Ret remove(Long id){
//		if (id == null) {
//			throw new ApplicationException(BizExceptionEnum.REQUEST_NULL);
//		}
//		tradeOrderService.delete(id);
//		return Rets.success();
//	}
//}