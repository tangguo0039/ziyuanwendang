package cn.enilu.material.service.system;


import cn.enilu.material.bean.entity.system.Relation;
import cn.enilu.material.bean.entity.system.Role;
import cn.enilu.material.bean.entity.system.User;
import cn.enilu.material.bean.enumeration.BizExceptionEnum;
import cn.enilu.material.bean.exception.ApplicationException;
import cn.enilu.material.bean.exception.ExceptionEnum;
import cn.enilu.material.bean.vo.node.Node;
import cn.enilu.material.bean.vo.node.ZTreeNode;
import cn.enilu.material.dao.system.RelationRepository;
import cn.enilu.material.dao.system.RoleRepository;
import cn.enilu.material.dao.system.UserRepository;
import cn.enilu.material.service.BaseService;
import cn.enilu.material.utils.Convert;
import com.fasterxml.jackson.annotation.JacksonAnnotationsInside;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Created  on 2018/3/25 0025.
 *
 * @author enilu
 */
@Service
public class RoleService extends BaseService<Role,Long,RoleRepository> {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private RelationRepository relationRepository;
    @Autowired
    private UserRepository userRepository;

    public List<ZTreeNode> roleTreeList() {
        List list = roleRepository.roleTreeList();
        List<ZTreeNode> treeNodes = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Object[] arr = (Object[]) list.get(i);
            ZTreeNode node = new ZTreeNode();
            node.setId(Long.valueOf(arr[0].toString()));
            node.setpId(Long.valueOf(arr[1].toString()));
            node.setName(arr[2].toString());
            node.setOpen(Boolean.valueOf(arr[3].toString()));
            treeNodes.add(node);
        }
        return treeNodes;
    }


    public List<ZTreeNode> roleTreeListByRoleId(Long[] ids) {
        List list = roleRepository.roleTreeListByRoleId(ids);
        List<ZTreeNode> treeNodes = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Object[] arr = (Object[]) list.get(i);
            ZTreeNode node = new ZTreeNode();
            node.setId(Long.valueOf(arr[0].toString()));
            node.setpId(Long.valueOf(arr[1].toString()));
            node.setName(arr[2].toString());
            node.setOpen(Boolean.valueOf(arr[3].toString()));
            node.setChecked(Boolean.valueOf(arr[4].toString()));
            treeNodes.add(node);
        }
        return treeNodes;
    }


    public void setAuthority(Long roleId, String ids) {
        // ??????????????????????????????
        relationRepository.deleteByRoleId(roleId);

        // ??????????????????
        for (Long id : Convert.toLongArray(true, Convert.toStrArray(",", ids))) {
            Relation relation = new Relation();
            relation.setRoleid(roleId);
            relation.setMenuid(id);
            relationRepository.save(relation);
        }
    }

    public void delRoleById(Long roleId) { List<User> list = userRepository.findByRoleid(String.valueOf(roleId));
        if(!list.isEmpty()){
            throw  new ApplicationException(BizExceptionEnum.NOT_ALLOW);
        }

        //????????????
        roleRepository.deleteById(roleId);

        // ??????????????????????????????
        relationRepository.deleteByRoleId(roleId);
    }


    public List<Node> generateRoleTree(List<ZTreeNode> list) {
        List<Node> nodes = new ArrayList<>();
        for (ZTreeNode role : list) {
            Node roleNode = new Node();
            roleNode.setId(role.getId());
            roleNode.setName(role.getName());
            roleNode.setPid(role.getpId());
            roleNode.setChecked(role.getChecked());
            nodes.add(roleNode);
        }
        return nodes;
    }

    public Role get(Long id) {
        Optional<Role> optional = roleRepository.findById(id);
        if (optional.isPresent()) {
            return optional.get();
        }
        return null;
    }

    public List findByName(String roleName) {
        return roleRepository.findByName(roleName);
    }
}
