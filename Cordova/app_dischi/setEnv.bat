@echo off

REM percorso JAVA JDK 
SET JAVA_HOME=C:\Program Files\Java\jdk-11

REM percorso ANDROID SDK
SET ANDROID_HOME=C:\android_30
SET ANDROID_SDK_ROOT=C:\android_30


SET PATH=%PATH%;C:\Program Files\Java\jdk-11\bin
SET PATH=%PATH%;C:\android_30\platform-tools
SET PATH=%PATH%;C:\android_30\build-tools
SET PATH=%PATH%;C:\android_30\gradle-8.5\bin

echo done


