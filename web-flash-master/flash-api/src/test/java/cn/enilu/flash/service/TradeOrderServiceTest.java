package cn.enilu.flash.service;

import cn.enilu.flash.BaseApplicationStartTest;
import cn.enilu.flash.bean.entity.test.Boy;
import cn.enilu.flash.bean.vo.query.SearchFilter;
import cn.enilu.flash.service.test.BoyService;
import cn.enilu.flash.service.trade.TradeOrderService;
import cn.enilu.flash.utils.Lists;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * 测试基础服务类
 *
 * @author ：enilu
 * @date ：Created in 2020/5/4 23:38
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class TradeOrderServiceTest extends BaseApplicationStartTest {
    @Autowired
    private TradeOrderService tradeOrderService;

    @Test
    public void test_01_insert() {
        for (int i = 0; i < 19; i++) {
            Boy boy = new Boy();
            boy.setName("李四");
            boy.setAge(18 + i);
            boy.setHasGirFriend(i % 3 == 0);
        }
    }


}
