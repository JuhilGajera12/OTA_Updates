import React, {useEffect, useState} from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import hotUpdate from 'react-native-ota-hot-update';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    const onCheckGitVersion = () => {
      hotUpdate.git.checkForGitUpdate({
        branch: Platform.OS === 'ios' ? 'main' : 'main',
        bundlePath:
          Platform.OS === 'ios'
            ? 'output/main.jsbundle'
            : 'output/index.android.bundle',
        url: 'https://github.com/JuhilGajera12/OTA_Updates.git',
        onCloneFailed(msg: string) {
          Alert.alert('Clone project failed!', msg, [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ]);
        },
        onCloneSuccess() {
          Alert.alert(
            'Clone project success!',
            'Restart to apply the changes',
            [
              {
                text: 'OK',
                onPress: () => hotUpdate?.resetApp(),
              },
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
            ],
          );
        },
        onPullFailed(msg: string) {
          Alert.alert('Pull project failed!', msg, [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ]);
        },
        onPullSuccess() {
          Alert.alert('Pull project success!', 'Restart to apply the changes', [
            {
              text: 'OK',
              onPress: () => hotUpdate?.resetApp(),
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ]);
        },
        onProgress(received: number, total: number) {
          const getpercent = (+received / +total) * 100;
          setPercent(getpercent);
        },
        onFinishProgress() {
          Alert.alert('onFinishProgress');
        },
      });
    };
    onCheckGitVersion();
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
      <Text style={{fontSize: 22, color: 'white'}}>Karshan</Text>
      <Text style={{fontSize: 22, color: 'white'}}>{percent}</Text>
    </View>
  );
}

export default App;
