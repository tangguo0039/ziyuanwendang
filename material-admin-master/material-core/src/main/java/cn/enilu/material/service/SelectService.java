package cn.enilu.material.service;

import cn.enilu.material.bean.vo.query.SearchFilter;
import cn.enilu.material.bean.vo.query.Page;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

/**
 *
 * @author ：enilu
 * @date ：Created in 2019/6/29 22:30
 */
public interface SelectService <T, ID> {

    /**
     * 根据主键查询
     * @param id 主键
     * @return 查询结果,无结果时返回{@code null}
     */
    T get(ID id);
    T get(SearchFilter filter);
    T get(List<SearchFilter> filters);
    /**
     * 根据多个主键查询
     * @param ids 主键集合
     * @return 查询结果,如果无结果返回空集合
     */
    List<T> query(Iterable<ID> ids);

    /**
     * 查询所有结果
     * @return 所有结果,如果无结果则返回空集合
     */
    List<T> queryAll();

    /**
     * 查询所有结果
     * @return 获取分页结果
     */
    Page<T> queryPage(Page<T> page);

    /**
     * 根据多个条件查询列表数据
     * @param filters
     * @return
     */
    List<T> queryAll(List<SearchFilter> filters);

    /**
     * 根据多个条件查询列表数据，并排序
     * @param filters
     * @param sort
     * @return
     */
    List<T> queryAll(List<SearchFilter> filters, Sort sort);

    /**
     * 根据的单个条件查询列表数据
     * @param filter
     * @return
     */
    List<T> queryAll(SearchFilter filter);

    /**
     * 根据的单个条件查询列表数据
     * @param filter
     * @param sort
     * @return
     */
    List<T> queryAll(SearchFilter filter,Sort sort);

    /**
     * 根据原生sql查询数据列表，
     * 例：select sum(a.1+a.2) from a where a.c=:c
     * @param sql
     * @return
     */
    List<Map> queryBySql(String sql);

    /**
     * 根据原生sql查询数据列表
     * @param sql
     * @param filter
     * @return
     */
    List<Map> queryBySql(String sql, SearchFilter filter);

    /**
     * 根据原生sql查询数据列表
     * @param sql
     * @param filter
     * @return
     */
    List<Map> queryBySql(String sql, List<SearchFilter> filter);
    /**
     * 查询记录数
     * @param filter
     * @return
     */
    long count(SearchFilter filter);

    /**
     * 查询记录数
     * @param filters
     * @return
     */
    long count(List<SearchFilter> filters);
}
