import {StyleSheet, Text, View} from "react-native"
import {PortalHost, PortalProvider, Portal} from "conjointment"

export default function App() {
  return (
    <PortalProvider>
      <PortalHost>
        <View style={styles.container}>
          <Text>Normal hello world</Text>
          <Portal>
            <Text>
              Hello world from portal
            </Text>
          </Portal>
        </View>
      </PortalHost>
    </PortalProvider>
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
