import { useRef } from 'react';

import appViewModel from "../../viewmodels/app.viewmodel";
import orderBookViewModel from "../../viewmodels/orderBook.viewmodel";

export function useViewModels() {
  const ref = useRef({
    appViewModel,
    orderBookViewModel
  })

  return ref.current;
}