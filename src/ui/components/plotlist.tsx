import {h} from "preact";
import { useContext } from "preact/hooks";
import ecsyContext from "../context";
import Heading from "./heading";

export default function PlotList() {
	const world = useContext(ecsyContext);
	if(world === null) return null;
	return <div>
		<Heading component={"div"}>Graphs</Heading>
		<p>Empty...</p>
	</div>
}
