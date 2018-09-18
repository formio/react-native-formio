
import {StyleSheet} from  'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.flatten({
  button: {
    width: DeviceInfo.isTablet() ? 250 : 150,
    alignSelf: 'center',
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10
  },
});

export default styles;
