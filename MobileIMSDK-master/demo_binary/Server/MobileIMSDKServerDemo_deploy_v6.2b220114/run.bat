@echo off

@echo ��ӭʹ�� MobileIMSDK v6.2beta ����� (build220114)
@echo.
@echo ����MobileIMSDK��IM���������������� ...
@echo.

"%JAVA_HOME%/bin/java" -cp lib/gson-2.8.6.jar;lib/log4j-api-2.17.0.jar;lib/log4j-core-2.17.0.jar;lib/log4j-slf4j-impl-2.17.0.jar;lib/slf4j-api-1.7.30.jar;lib/MobileIMSDKServer.jar;lib/rabbitmq-client.jar;"%JAVA_HOME%/lib/tools.jar;classes/.;lib/netty-all-4.1.50.Final.jar;" net.x52im.mobileimsdk.server.demo.ServerLauncherImpl %1

@echo.
pause