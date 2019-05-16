import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './Home';
import Magic from './Magic'
const MainNavigator = createStackNavigator({
  Home: { screen: Home },
  Magic: { screen: Magic }
});

const App = createAppContainer(MainNavigator);

export default App;
