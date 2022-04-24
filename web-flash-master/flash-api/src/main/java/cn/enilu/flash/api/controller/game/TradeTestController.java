package cn.enilu.flash.api.controller.game;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.entity.system.Cfg;
import cn.enilu.flash.bean.entity.system.FileInfo;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.system.CfgService;
import cn.enilu.flash.service.system.FileService;
import cn.enilu.flash.utils.Maps;
import cn.enilu.flash.utils.StringUtil;
import cn.enilu.flash.utils.TronUtils;
import cn.enilu.flash.utils.factory.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * CfgController
 *
 * @author enilu
 * @version 2018/11/17 0017
 */
@Api(tags={"Test转账交易控制"})
@RestController
@RequestMapping("/testTrade")
public class TradeTestController extends BaseController {
    private Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private CfgService cfgService;


    /**
     * 查询转账交易列表
     */
    @ApiOperation(value="转账交易", notes="转账交易查询")
    @PostMapping(value = "/list")
    public Object list(@RequestParam(required = false) String cfgName, @RequestParam(required = false) String cfgValue) {
        Page<Cfg> page = new PageFactory<Cfg>().defaultPage();
        if (StringUtil.isNotEmpty(cfgName)) {
            page.addFilter(SearchFilter.build("cfgName", SearchFilter.Operator.LIKE, cfgName));
        }
        if (StringUtil.isNotEmpty(cfgValue)) {
            page.addFilter(SearchFilter.build("cfgValue", SearchFilter.Operator.LIKE, cfgValue));
        }
        page = cfgService.queryPage(page);
        return Rets.success(page);
    }
    /**
     * 手动审核转账交易
     * @param cfgName
     * @param cfgValue
     * @return
     */
    @ApiOperation(value="转账交易", notes="手动审核转账交易")
    @PostMapping(value = "/audit")
    public Object audit(@RequestParam(required = false) String cfgName, @RequestParam(required = false) String cfgValue) {
        Page<Cfg> page = new PageFactory<Cfg>().defaultPage();
        if (StringUtil.isNotEmpty(cfgName)) {
            page.addFilter(SearchFilter.build("cfgName", SearchFilter.Operator.LIKE, cfgName));
        }
        if (StringUtil.isNotEmpty(cfgValue)) {
            page.addFilter(SearchFilter.build("cfgValue", SearchFilter.Operator.LIKE, cfgValue));
        }
        page = cfgService.queryPage(page);
        return Rets.success();
    }
    /**
     * 异常转账交易
     * @return
     */
    @ApiOperation(value="转账交易", notes="异常转账交易")
    @PostMapping(value = "/abnormalOrder")
    public Object abnormalOrder(@ModelAttribute @Valid Cfg cfg) {
        cfgService.saveOrUpdate(cfg);
        return Rets.success();
    }


    @ApiOperation(value="转账类型", notes="交易类型")
    @PostMapping(value = "/transactionType")
    public Object transactionType(@ModelAttribute @Valid Cfg cfg) {
        cfgService.saveOrUpdate(cfg);
        return Rets.success();
    }

    @ApiOperation(value="拉去TRON交易订单", notes="拉去TRON交易订单")
    @PostMapping(value = "/pullOrder")
    public Object pullOrder(@ModelAttribute @Valid Cfg cfg) {
        cfgService.saveOrUpdate(cfg);
        return Rets.success();
    }

}
