import Layout from './views/containers/Layout';
import OrderBook from './views/containers/OrderBook';

function App() {
  return (
    <Layout>
      <OrderBook symbol='BTC-USD' />
    </Layout>
  );
}

export default App;
