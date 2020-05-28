import { FunctionComponent } from "preact";
import { World } from "ecsy";
import {h} from "preact";

import ecsyContext from "./context";
import * as styles from "./index.sass";
import PlotList from "./components/plotlist";

interface AppProps {
	world: World
}

const App: FunctionComponent<AppProps> = ({world}) => (
	<div id={styles.app}>
		<ecsyContext.Provider value={world}>
			<PlotList />
		</ecsyContext.Provider>
	</div>
);
export default App;
