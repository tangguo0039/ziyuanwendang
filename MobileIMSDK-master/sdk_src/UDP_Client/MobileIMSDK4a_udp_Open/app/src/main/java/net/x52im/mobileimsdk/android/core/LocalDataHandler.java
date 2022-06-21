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
 * LocalDataHandler.java at 2021-7-2 22:38:44, code by Jack Jiang.
 */
package net.x52im.mobileimsdk.android.core;

import android.os.Handler;
import android.os.Message;
import android.util.Log;

import net.x52im.mobileimsdk.android.ClientCoreSDK;
import net.x52im.mobileimsdk.server.protocal.ErrorCode;
import net.x52im.mobileimsdk.server.protocal.Protocal;
import net.x52im.mobileimsdk.server.protocal.ProtocalFactory;
import net.x52im.mobileimsdk.server.protocal.ProtocalType;
import net.x52im.mobileimsdk.server.protocal.s.PErrorResponse;
import net.x52im.mobileimsdk.server.protocal.s.PKickoutInfo;
import net.x52im.mobileimsdk.server.protocal.s.PLoginInfoResponse;

import java.net.DatagramPacket;

class LocalDataHandler extends Handler {

    private final static String TAG = LocalDataHandler.class.getSimpleName();

    public LocalDataHandler() {
    }

    @Override
    public void handleMessage(Message msg) {
        DatagramPacket packet = (DatagramPacket) msg.obj;
        if (packet == null)
            return;

        try {
            final Protocal pFromServer = ProtocalFactory.parse(packet.getData(), packet.getLength());

            if (pFromServer.isQoS()) {
                // # Bug FIX 20170620_001 START 【1/2】
                if (pFromServer.getType() == ProtocalType.S.FROM_SERVER_TYPE_OF_RESPONSE$LOGIN
                        && ProtocalFactory.parsePLoginInfoResponse(pFromServer.getDataContent()).getCode() != 0) {
                    if (ClientCoreSDK.DEBUG)
                        Log.d(TAG, "【IMCORE-UDP】【BugFIX】这是服务端的登陆返回响应包，" + "且服务端判定登陆失败(即code!=0)，本次无需发送ACK应答包！");
                }
                // # Bug FIX 20170620 END 【1/2】
                else {
                    if (QoS4ReciveDaemon.getInstance().hasRecieved(pFromServer.getFp())) {
                        if (ClientCoreSDK.DEBUG)
                            Log.d(TAG, "【IMCORE-UDP】【QoS机制】" + pFromServer.getFp() + "已经存在于发送列表中，这是重复包，通知应用层收到该包罗！");

                        QoS4ReciveDaemon.getInstance().addRecieved(pFromServer);
                        sendRecievedBack(pFromServer);

                        return;
                    }

                    QoS4ReciveDaemon.getInstance().addRecieved(pFromServer);
                    sendRecievedBack(pFromServer);
                }
            }

            switch (pFromServer.getType()) {
                case ProtocalType.C.FROM_CLIENT_TYPE_OF_COMMON$DATA: {
                    onRecievedCommonData(pFromServer);
                    break;
                }
                case ProtocalType.S.FROM_SERVER_TYPE_OF_RESPONSE$KEEP$ALIVE: {
                    onServerResponseKeepAlive();
                    break;
                }
                case ProtocalType.C.FROM_CLIENT_TYPE_OF_RECIVED: {
                    onMessageRecievedACK(pFromServer);
                    break;
                }
                case ProtocalType.S.FROM_SERVER_TYPE_OF_RESPONSE$LOGIN: {
                    onServerResponseLogined(pFromServer);
                    break;
                }
                case ProtocalType.S.FROM_SERVER_TYPE_OF_RESPONSE$FOR$ERROR: {
                    onServerResponseError(pFromServer);
                    break;
                }
				case ProtocalType.S.FROM_SERVER_TYPE_OF_KICKOUT: {
					onKickout(pFromServer);
					break;
				}
                default:
                    Log.w(TAG, "【IMCORE-UDP】收到的服务端消息类型：" + pFromServer.getType() + "，但目前该类型客户端不支持解析和处理！");
                    break;
            }
        } catch (Exception e) {
            Log.w(TAG, "【IMCORE-UDP】处理消息的过程中发生了错误.", e);
        }
    }

    private void onRecievedCommonData(Protocal pFromServer) {
        if (ClientCoreSDK.getInstance().getChatMessageEvent() != null) {
            ClientCoreSDK.getInstance().getChatMessageEvent().onRecieveMessage(
                    pFromServer.getFp(), pFromServer.getFrom(), pFromServer.getDataContent(), pFromServer.getTypeu());
        }
    }

    protected void onServerResponseKeepAlive() {
        if (ClientCoreSDK.DEBUG)
            Log.d(TAG, "【IMCORE-UDP】收到服务端回过来的Keep Alive心跳响应包.");
        KeepAliveDaemon.getInstance().updateGetKeepAliveResponseFromServerTimstamp();
    }

    private void onMessageRecievedACK(Protocal pFromServer) {
        String theFingerPrint = pFromServer.getDataContent();
        if (ClientCoreSDK.DEBUG)
            Log.d(TAG, "【IMCORE-UDP】【QoS】收到" + pFromServer.getFrom() + "发过来的指纹为" + theFingerPrint + "的应答包.");

        if (ClientCoreSDK.getInstance().getMessageQoSEvent() != null)
            ClientCoreSDK.getInstance().getMessageQoSEvent().messagesBeReceived(theFingerPrint);

        QoS4SendDaemon.getInstance().remove(theFingerPrint);
    }

    private void onServerResponseLogined(Protocal pFromServer) {
        PLoginInfoResponse loginInfoRes = ProtocalFactory.parsePLoginInfoResponse(pFromServer.getDataContent());
        if (loginInfoRes.getCode() == 0) {
			if(!ClientCoreSDK.getInstance().isLoginHasInit()) {
				ClientCoreSDK.getInstance().saveFirstLoginTime(loginInfoRes.getFirstLoginTime());
			}
            fireConnectedToServer();
        } else {
//			Log.d(TAG, "登陆验证失败，错误码="+loginInfoRes.getCode()+"！");

            // # Bug FIX B20170620_001 START 【2/2】
            LocalDataReciever.getInstance().stop();
            // # Bug FIX B20170620_001 END 【2/2】

            ClientCoreSDK.getInstance().setConnectedToServer(false);
        }

        // 用户登陆认证情况通知回调
        if (ClientCoreSDK.getInstance().getChatBaseEvent() != null) {
            ClientCoreSDK.getInstance().getChatBaseEvent().onLoginResponse(loginInfoRes.getCode());
        }
    }

    private void onServerResponseError(Protocal pFromServer) {
        PErrorResponse errorRes = ProtocalFactory.parsePErrorResponse(pFromServer.getDataContent());
        if (errorRes.getErrorCode() == ErrorCode.ForS.RESPONSE_FOR_UNLOGIN) {
            ClientCoreSDK.getInstance().setLoginHasInit(false);
            Log.e(TAG, "【IMCORE-UDP】收到服务端的“尚未登陆”的错误消息，心跳线程将停止，请应用层重新登陆.");
            KeepAliveDaemon.getInstance().stop();
            AutoReLoginDaemon.getInstance().start(false);
        }

        if (ClientCoreSDK.getInstance().getChatMessageEvent() != null) {
            ClientCoreSDK.getInstance().getChatMessageEvent().onErrorResponse(errorRes.getErrorCode(), errorRes.getErrorMsg());
        }
    }
	
	protected void onKickout(Protocal pFromServer)
	{
		if (ClientCoreSDK.DEBUG)
			Log.d(TAG, "【IMCORE-TCP】收到服务端发过来的“被踢”指令.");

		ClientCoreSDK.getInstance().release();
		PKickoutInfo kickoutInfo = ProtocalFactory.parsePKickoutInfo(pFromServer.getDataContent());

		if(ClientCoreSDK.getInstance().getChatBaseEvent() != null)
			ClientCoreSDK.getInstance().getChatBaseEvent().onKickout(kickoutInfo);

		if(ClientCoreSDK.getInstance().getChatBaseEvent() != null)
			ClientCoreSDK.getInstance().getChatBaseEvent().onLinkClose(-1);
	}
    private void fireConnectedToServer() {
        ClientCoreSDK.getInstance().setLoginHasInit(true);
        AutoReLoginDaemon.getInstance().stop();
        KeepAliveDaemon.getInstance().setNetworkConnectionLostObserver((observable, data) -> {
            fireDisconnectedToServer();
        });
        KeepAliveDaemon.getInstance().start(false);

        QoS4SendDaemon.getInstance().startup(true);
        QoS4ReciveDaemon.getInstance().startup(true);
        ClientCoreSDK.getInstance().setConnectedToServer(true);
    }

    private void fireDisconnectedToServer() {
//		QoS4SendDaemon.getInstance(context).stop();

        /** ## Bug FIX 20190326 [Bug 1] - STAT
        LocalSocketProvider.getInstance().closeLocalSocket();
        /** ## Bug FIX 20190326 [Bug 1] - END */

        QoS4ReciveDaemon.getInstance().stop();

        ClientCoreSDK.getInstance().setConnectedToServer(false);
		if(ClientCoreSDK.getInstance().getChatBaseEvent() != null)
        	ClientCoreSDK.getInstance().getChatBaseEvent().onLinkClose(-1);
        AutoReLoginDaemon.getInstance().start(true);
    }

    private void sendRecievedBack(final Protocal pFromServer) {
        if (pFromServer.getFp() != null) {
            new LocalDataSender.SendCommonDataAsync(
                    ProtocalFactory.createRecivedBack(
                            pFromServer.getTo()
                            , pFromServer.getFrom()
                            , pFromServer.getFp()
                            , pFromServer.isBridge())) {
                @Override
                protected void onPostExecute(Integer code) {
                    if (ClientCoreSDK.DEBUG)
                        Log.d(TAG, "【IMCORE-UDP】【QoS】向" + pFromServer.getFrom() + "发送" + pFromServer.getFp() + "包的应答包成功,from=" + pFromServer.getTo() + "！");
                }
            }.execute();
        } else {
            Log.w(TAG, "【IMCORE-UDP】【QoS】收到" + pFromServer.getFrom() + "发过来需要QoS的包，但它的指纹码却为null！无法发应答包！");
        }
    }
}