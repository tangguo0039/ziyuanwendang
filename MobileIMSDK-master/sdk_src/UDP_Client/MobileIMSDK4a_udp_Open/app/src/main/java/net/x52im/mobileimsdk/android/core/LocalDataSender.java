/*
 * Copyright (C) 2021  即时通讯网(52im.net) & Jack Jiang.
 * The MobileIMSDK_UDP (MobileIMSDK v6.x UDP版) Project. 
 * All rights reserved.
 * 
 * > Github地址：https://github.com/JackJiang2011/MobileIMSDK
 * > 文档地址：  http://www.52im.net/forum-89-1.html
 * > 技术社区：  http://www.52im.net/
 * > 技术交流群：215477170 (http://www.52im.net/topic-qqgroup.html)
 * > 作者公众号：“即时通讯技术圈】”，欢迎关注！
 * > 联系作者：  http://www.52im.net/thread-2792-1-1.html
 *  
 * "即时通讯网(52im.net) - 即时通讯开发者社区!" 推荐开源工程。
 * 
 * LocalDataSender.java at 2021-7-2 22:38:44, code by Jack Jiang.
 */
package net.x52im.mobileimsdk.android.core;

import java.net.DatagramSocket;
import java.net.InetAddress;

import net.x52im.mobileimsdk.android.ClientCoreSDK;
import net.x52im.mobileimsdk.android.conf.ConfigEntity;
import net.x52im.mobileimsdk.android.utils.MBAsyncTask;
import net.x52im.mobileimsdk.android.utils.UDPUtils;
import net.x52im.mobileimsdk.server.protocal.ErrorCode;
import net.x52im.mobileimsdk.server.protocal.Protocal;
import net.x52im.mobileimsdk.server.protocal.ProtocalFactory;
import net.x52im.mobileimsdk.server.protocal.c.PLoginInfo;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

public class LocalDataSender {
    private final static String TAG = LocalDataSender.class.getSimpleName();
    private static LocalDataSender instance = null;

    public static LocalDataSender getInstance() {
        if (instance == null)
            instance = new LocalDataSender();
        return instance;
    }

    private LocalDataSender() {
    }

    int sendLogin(PLoginInfo loginInfo){
        byte[] b = ProtocalFactory.createPLoginInfo(loginInfo).toBytes();
        int code = send(b, b.length);
        if (code == 0) {
            ClientCoreSDK.getInstance().setCurrentLoginInfo(loginInfo);
        }

        return code;
    }

    public int sendLoginout() {
        int code = ErrorCode.COMMON_CODE_OK;
        if (ClientCoreSDK.getInstance().isLoginHasInit()) {
            byte[] b = ProtocalFactory.createPLoginoutInfo(ClientCoreSDK.getInstance().getCurrentLoginUserId()).toBytes();
            code = send(b, b.length);
            if (code == 0) {
                // do nothing
            }
        }
        ClientCoreSDK.getInstance().release();
        return code;
    }

    int sendKeepAlive() {
        byte[] b = ProtocalFactory.createPKeepAlive(ClientCoreSDK.getInstance().getCurrentLoginUserId()).toBytes();
        return send(b, b.length);
    }

    public int sendCommonData(String dataContentWidthStr, String to_user_id) {
        return sendCommonData(dataContentWidthStr, to_user_id, -1);
    }

    public int sendCommonData(String dataContentWidthStr, String to_user_id, int typeu) {
        return sendCommonData(dataContentWidthStr, to_user_id, null, typeu);
    }

    public int sendCommonData(String dataContentWidthStr, String to_user_id, String fingerPrint, int typeu) {
        return sendCommonData(dataContentWidthStr, to_user_id, true, fingerPrint, typeu);
    }

    public int sendCommonData(String dataContentWidthStr, String to_user_id, boolean QoS, String fingerPrint, int typeu) {
        return sendCommonData(ProtocalFactory.createCommonData(dataContentWidthStr
                , ClientCoreSDK.getInstance().getCurrentLoginUserId(), to_user_id, QoS, fingerPrint, typeu));
    }

    public int sendCommonData(Protocal p) {
        if (p != null) {
            byte[] b = p.toBytes();
            int code = send(b, b.length);
            if (code == 0) {
                if (p.isQoS() && !QoS4SendDaemon.getInstance().exist(p.getFp()))
                    QoS4SendDaemon.getInstance().put(p);
            }
            return code;
        } else
            return ErrorCode.COMMON_INVALID_PROTOCAL;
    }

    private int send(byte[] fullProtocalBytes, int dataLen) {
        if (!ClientCoreSDK.getInstance().isInitialed())
            return ErrorCode.ForC.CLIENT_SDK_NO_INITIALED;

        DatagramSocket ds = LocalSocketProvider.getInstance().getLocalSocket();
        if (ds != null && !ds.isConnected()) {
            try {
                if (ConfigEntity.serverIP == null) {
                    Log.w(TAG, "【IMCORE-UDP】send数据没有继续，原因是ConfigEntity.server_ip==null!");
                    return ErrorCode.ForC.TO_SERVER_NET_INFO_NOT_SETUP;
                }

                ds.connect(InetAddress.getByName(ConfigEntity.serverIP), ConfigEntity.serverPort);
                // FIXME: 因为connect是异步的，为了在尽可能保证在send前就已connect，所以最好在socketProvider里Bind后就connect!
            } catch (Exception e) {
                Log.w(TAG, "【IMCORE-UDP】send时出错，原因是：" + e.getMessage(), e);
                return ErrorCode.ForC.BAD_CONNECT_TO_SERVER;
            }
        }
        return UDPUtils.send(ds, fullProtocalBytes, dataLen) ? ErrorCode.COMMON_CODE_OK : ErrorCode.COMMON_DATA_SEND_FAILD;
    }

    //------------------------------------------------------------------------------------------ utilities class

    public static abstract class SendCommonDataAsync extends MBAsyncTask {
        protected Protocal p = null;

        public SendCommonDataAsync(String dataContentWidthStr, String to_user_id) {
            this(dataContentWidthStr, to_user_id, null, -1);
        }

        public SendCommonDataAsync(String dataContentWidthStr, String to_user_id, int typeu) {
            this(dataContentWidthStr, to_user_id, null, typeu);
        }

        public SendCommonDataAsync(String dataContentWidthStr, String to_user_id, String fingerPrint, int typeu) {
            this(ProtocalFactory.createCommonData(dataContentWidthStr
                    , ClientCoreSDK.getInstance().getCurrentLoginUserId(), to_user_id, true, fingerPrint, typeu));
        }

        public SendCommonDataAsync(Protocal p) {
            if (p == null) {
                Log.w(TAG, "【IMCORE-UDP】无效的参数p==null!");
                return;
            }
            this.p = p;
        }

        @Override
        protected Integer doInBackground(Object... params) {
            if (p != null)
                return LocalDataSender.getInstance().sendCommonData(p);
            return -1;
        }

        @Override
        protected abstract void onPostExecute(Integer code);
    }

    public static abstract class SendLoginDataAsync extends MBAsyncTask{
        protected PLoginInfo loginInfo = null;

        public SendLoginDataAsync(PLoginInfo loginInfo) {
			this.loginInfo = loginInfo;
        }

        @Override
        protected Integer doInBackground(Object... params) {
            return LocalDataSender.getInstance().sendLogin(this.loginInfo);
        }

        @Override
        protected void onPostExecute(Integer code) {
            if (code == 0) {
                LocalDataReciever.getInstance().startup();
            } else {
                Log.d(TAG, "【IMCORE-UDP】数据发送失败, 错误码是：" + code + "！");
            }

            fireAfterSendLogin(code);
        }

        protected void fireAfterSendLogin(int code) {
            // default do nothing
        }
    }
}
