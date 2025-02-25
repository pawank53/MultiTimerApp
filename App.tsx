import React from 'react';
import type { PropsWithChildren } from 'react';
import store  from './src/redux/store';
// import { PersistGate } from 'redux-persist/integration/react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux'



const App = () => {


  return (

    <Provider store={store}>
      {/* <PersistGate persistor={persistor}> */}
        <AppNavigator />
      {/* </PersistGate> */}
    </Provider>

  );
}

const styles = StyleSheet.create({

});

export default App;
