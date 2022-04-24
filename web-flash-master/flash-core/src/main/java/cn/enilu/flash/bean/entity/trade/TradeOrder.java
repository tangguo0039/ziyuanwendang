package cn.enilu.flash.bean.entity.trade;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.validation.constraints.NotBlank;

/**
 * Created  on 2018/4/2 0002.
 *
 * @author enilu
 */
@Entity(name = "u_trade")
@Table(appliesTo = "u_trade", comment = "u交易订单实体")
@Data
@EntityListeners(AuditingEntityListener.class)
public class TradeOrder extends BaseEntity {
    @Column(name = "hash", columnDefinition = "VARCHAR(128) COMMENT 'hash订单id'")
    private String hash;
    @Column(name = "result", columnDefinition = "VARCHAR(64) COMMENT '订单结果'")
    private String result;
    @Column(name = "trade_status", columnDefinition = "VARCHAR(12) COMMENT '订单提交状态'")
    private String trade_status;
    @Column(name = "confirmed_srs", columnDefinition = "VARCHAR(12) COMMENT '确认的SRs'")
    private String confirmed_srs;
    @Column(name = "block", columnDefinition = "VARCHAR(12) COMMENT '块段'")
    private String block;
    @Column(name = "trade_time", columnDefinition = "VARCHAR(12) COMMENT '块段'")
    private String trade_time;
    @Column(name = "resources_consumed_fees", columnDefinition = "VARCHAR(64) COMMENT '订单消耗的资源'")
    private String resources_consumed_fees;

    @Column(name = "owner_address", columnDefinition = "VARCHAR(64) COMMENT 'from'")
    private String owner_address;
    @Column(name = "receiving_address", columnDefinition = "VARCHAR(64) COMMENT 'to'")
    private String receiving_address;
    @Column(name = "value", columnDefinition = "VARCHAR(128) COMMENT '资源值'")
    private String value;
    @Column(name = "method_calling", columnDefinition = "VARCHAR(256) COMMENT '交易方法值'")
    private String method_calling;

    @Column(name = "block_hash", columnDefinition = "VARCHAR(64) COMMENT '区块哈希'")
    private String block_hash;



}
