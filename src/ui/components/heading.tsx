import { FunctionalComponent, h } from "preact";

import * as styles from "./heading.sass";

const Heading: FunctionalComponent<{component: string}> = ({component, children}) => h(component, { class: styles.heading }, children);
export default Heading;
