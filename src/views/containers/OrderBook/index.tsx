import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';

import OrderBook, { type InstanceMethods } from '../../components/OrderBook';

import { useViewModels } from '../../hooks/useViewModels';

interface Props {
  symbol: string;
}

function OrderBookContainer({ symbol }: Props) {
  const { orderBookViewModel } = useViewModels();
  const orderBookRef = useRef<InstanceMethods>(null);

  useEffect(() => autorun(() => {
    orderBookRef.current?.updateAsks(orderBookViewModel.asks);
  }), [orderBookViewModel]);

  useEffect(() => autorun(() => {
    orderBookRef.current?.updateBids(orderBookViewModel.bids);
  }), [orderBookViewModel]);

  useEffect(() => {
    orderBookViewModel.init(symbol)
  }, [orderBookViewModel, symbol]);

  return <OrderBook
    ref={orderBookRef}
    spread={orderBookViewModel.spread}
    priceStep={orderBookViewModel.priceStep}
    minPriceStep={orderBookViewModel.minPriceStep}
    maxPriceStep={orderBookViewModel.maxPriceStep}
    onDecreasePriceStep={orderBookViewModel.decreasePriceStep}
    onIncreasePriceStep={orderBookViewModel.increasePriceStep}
    onRowClick={(side, row) => alert(JSON.stringify({ side, row }, undefined, 4))}
  />;
}

export default observer(OrderBookContainer);
