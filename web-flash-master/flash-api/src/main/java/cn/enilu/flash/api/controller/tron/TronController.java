package cn.enilu.flash.api.controller.tron;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.api.utils.ApiConstants;
import cn.enilu.flash.bean.constant.state.ManagerStatus;
import cn.enilu.flash.bean.core.ShiroUser;
import cn.enilu.flash.bean.entity.system.User;
import cn.enilu.flash.bean.vo.front.Ret;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.bean.vo.node.RouterMenu;
import cn.enilu.flash.cache.TokenCache;
import cn.enilu.flash.core.log.LogManager;
import cn.enilu.flash.core.log.LogTaskFactory;
import cn.enilu.flash.security.ShiroFactroy;
import cn.enilu.flash.service.system.MenuService;
import cn.enilu.flash.service.system.QrcodeService;
import cn.enilu.flash.service.system.UserService;
import cn.enilu.flash.utils.HttpUtil;
import cn.enilu.flash.utils.MD5;
import cn.enilu.flash.utils.Maps;
import cn.enilu.flash.utils.StringUtil;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.nutz.json.Json;
import org.nutz.mapl.Mapl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AccountController
 *
 * @author enilu
 * @version 2018/9/12 0012
 */
@RestController
@RequestMapping("/tron")
public class TronController extends BaseController {
    private Logger logger = LoggerFactory.getLogger(TronController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private TokenCache tokenCache;
    @Autowired
    private MenuService menuService;
    @Autowired
    QrcodeService qrcodeService;

    /**
     * 用户登录<br>
     * 1，验证没有注册<br>
     * 2，验证密码错误<br>
     * 3，登录成功
     * 4，增加谷歌令牌
     * @param userName
     * @param password
     * @return
     */
    @PostMapping(value = "/login")
    public Object login(@RequestParam(required = true,value = "username") String userName,
                        @RequestParam(required = true,value = "password") String password,
                        @RequestParam(required = false,value = "code") String code) {
        try {
            //1,
            User user = userService.findByAccountForLogin(userName);
            if (user == null) {
                return Rets.failure("用户名或密码错误");
            }//status
            if (user.getStatus() == ManagerStatus.FREEZED.getCode()) {
                return Rets.failure("用户已冻结");
            } else if (user.getStatus() == ManagerStatus.DELETED.getCode()) {
                return Rets.failure("用户已删除");
            }
            String passwdMd5 = MD5.md5(password, user.getSalt());
            //2,
            if (!user.getPassword().equals(passwdMd5)) {
                return Rets.failure("用户名或密码错误");
            }
            if (StringUtil.isEmpty(user.getRoleid())) {
                return Rets.failure("该用户未配置权限");
            }
            String token = userService.loginForToken(user);
            ShiroFactroy.me().shiroUser(token, user);
            Map<String, String> result = new HashMap<>(1);
            result.put("token", token);
            LogManager.me().executeLog(LogTaskFactory.loginLog(user.getId(), HttpUtil.getIp()));
            return Rets.success(result);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return Rets.failure("登录时失败");
    }


}
