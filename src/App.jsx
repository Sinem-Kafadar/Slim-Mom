import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Background from './components/Background/Background';
import Header from './components/Header/Header';
import AppRouter from './router/AppRouter';

import store from './redux/ui/store';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Background>
          <div className="headerOffset">
            <Header />
          </div>

          <AppRouter />
        </Background>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
