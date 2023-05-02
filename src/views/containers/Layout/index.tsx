import { useEffect, type PropsWithChildren } from "react";
import { observer } from "mobx-react-lite";

import { useViewModels } from "../../hooks/useViewModels";

import st from "./Layout.module.css";
import logo from "./imgs/rabbit-x-logo.svg";

function Layout({ children }: PropsWithChildren) {
  const { appViewModel } = useViewModels();

  useEffect(() => {
    if (appViewModel.isAuth) {
      appViewModel.init();
    }
  }, [appViewModel, appViewModel.isAuth]);

  return (
    <div className={st.wrapper}>
      <img className={st.logo} src={logo} alt="RabbitX" />

      <div className={st.container}>
        {children}

        {!appViewModel.isAuth && (
          <div className={st.auth}>
            <button
              className={st.button}
              disabled={appViewModel.isAuth}
              onClick={() => appViewModel.authenticate()}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(Layout);
