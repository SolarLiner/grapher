import { createContext } from "preact";
import { World } from "ecsy";

const ecsyContext = createContext<World|null>(null);
export default ecsyContext;
