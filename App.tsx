import React, {useEffect, useState} from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  StatusBar,
  Text,
  useColorScheme,
  View,
  AppState,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import hotUpdate from 'react-native-ota-hot-update';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [percent, setPercent] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    hotUpdate.git.checkForGitUpdate({
      branch: 'main',
      bundlePath: './android/output/index.android.bundle',
      url: 'https://github.com/JuhilGajera12/OTA_Updates.git',
      onCloneFailed(msg: string) {
        setIsUpdating(false);
        Alert.alert('Update Failed', msg, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      },
      onCloneSuccess() {
        Alert.alert(
          'Update Available',
          'A new version is ready. Would you like to restart now?',
          [
            {
              text: 'Restart Now',
              onPress: () => {
                try {
                  hotUpdate?.resetApp();
                } catch (error) {
                  console.error('Reset failed:', error);
                  Alert.alert('Error', 'Failed to restart. Please restart the app manually.');
                }
              },
            },
            {
              text: 'Later',
              onPress: () => setIsUpdating(false),
              style: 'cancel',
            },
          ],
        );
      },
      onPullFailed(msg: string) {
        setIsUpdating(false);
        Alert.alert('Update Failed', msg, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      },
      onPullSuccess() {
        Alert.alert(
          'Update Available',
          'A new version is ready. Would you like to restart now?',
          [
            {
              text: 'Restart Now',
              onPress: () => {
                try {
                  hotUpdate?.resetApp();
                } catch (error) {
                  console.error('Reset failed:', error);
                  Alert.alert('Error', 'Failed to restart. Please restart the app manually.');
                }
              },
            },
            {
              text: 'Later',
              onPress: () => setIsUpdating(false),
              style: 'cancel',
            },
          ],
        );
      },
      onProgress(received: number, total: number) {
        const getpercent = (+received / +total) * 100;
        setPercent(getpercent);
      },
      onFinishProgress() {
        console.log('Update download completed');
      },
    });
  };

  useEffect(() => {
    handleUpdate();

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isUpdating) {
        // Retry update check when app comes to foreground
        handleUpdate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View
      style={[
        backgroundStyle,
        {flex: 1, justifyContent: 'center', alignItems: 'center'},
      ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text style={{fontSize: 22, color: isDarkMode ? 'white' : 'black'}}>Karshan</Text>
      {isUpdating && (
        <Text style={{fontSize: 16, color: isDarkMode ? 'white' : 'black'}}>
          Downloading update: {Math.round(percent)}%
        </Text>
      )}
    </View>
  );
}

export default App;
