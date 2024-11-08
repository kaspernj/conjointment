import { StyleSheet, Text, View } from 'react-native';

import * as Conjointment from 'conjointment';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{Conjointment.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
