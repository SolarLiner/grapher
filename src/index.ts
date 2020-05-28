import { World } from "ecsy";
import { Context, Extents, Plot, Style, Viewport } from "./components";
import { ExtentsDragSystem, GraphRenderingSystem, PlotRenderingSystem, ViewportUpdateSystem } from "./systems";
import { Vector2 } from "./algebra";
import { h, render } from "preact";
import App from "./ui";

import "./global.sass?module=false";

const assert = (expr: boolean, message?: string) => {
	if (!expr) throw new Error("Assertion error" + (!!message ? `: ${message}` : ""));
};

function runGame(world: World): void {
	console.log("Running game with " + String(world));

	const start = performance.now();
	let last = start;

	world.play();
	const run = () => {
		const now = performance.now();
		const dt = now - last;
		const time = now - start;
		last = now;
		world.execute(dt, time);
		requestAnimationFrame(run);
	};
	requestAnimationFrame(run);
}

function createGame(ctx: CanvasRenderingContext2D): World {
	const world = new World();
	const ratio = ctx.canvas.width / ctx.canvas.height;
	const ratioScale = new Vector2(ratio, 1);
	world.createEntity("ctx").addComponent(Context, { value: ctx });
	world.createEntity("viewport").addComponent(Viewport, { size: Vector2.fromWidthHeight(ctx.canvas) });
	world.createEntity("extents").addComponent(Extents, {
		pos: Vector2.scaleVec(new Vector2(-10, -10), ratioScale),
		size: Vector2.scaleVec(new Vector2(20, 20), ratioScale)
	});

	world.createEntity("square")
		.addComponent(Plot, { plot: (x: number) => x ** 2 })
		.addComponent(Style, { style: "blue" });
	world.createEntity("otherplot")
		.addComponent(Plot, { plot: (x: number) => 1 - Math.exp(-x) })
		.addComponent(Style, { style: "red" });

	world.registerSystem(ViewportUpdateSystem)
		.registerSystem(ExtentsDragSystem)
		.registerSystem(GraphRenderingSystem)
		.registerSystem(PlotRenderingSystem);

	const sys = world.getSystem(ExtentsDragSystem) as ExtentsDragSystem;
	sys.setContext(ctx);

	return world;
}

function setupUi(root: HTMLElement, world: World) {
	render(h(App, {world}), root);
}

(function(root: HTMLElement) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	assert(ctx !== null, "Couldn't load context");

	function onResize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	window.addEventListener("resize", onResize);
	onResize();
	canvas.innerText = "The canvas feature isn't supported by your browser.";
	root.appendChild(canvas);
	/*root.style.margin = "0";
	root.style.overflow = "hidden";*/

	const world = createGame(ctx!);
	setupUi(root, world);
	runGame(world);
})(document.body);
