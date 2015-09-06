jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore X:\Dropbox\Encrypted\Keys\my-release-key.keystore C:\Users\Matthew\workspace_jbds\ThreeLittleThings\platforms\android\ant-build\ThreeDailyThings-release-unsigned.apk alias_name

zipalign -f -v 4 C:\Users\Matthew\workspace_jbds\ThreeLittleThings\platforms\android\ant-build\ThreeDailyThings-release-unsigned.apk C:\Users\Matthew\workspace_jbds\ThreeLittleThings\platforms\android\ant-build\ThreeDailyThings-release.apk

copy C:\Users\Matthew\workspace_jbds\ThreeLittleThings\platforms\android\ant-build\ThreeDailyThings-release.apk C:\Users\Matthew\Dropbox\ThreeDailyThings.apk