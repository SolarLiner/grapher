import { System } from "ecsy";
import { Context, Extents, Plot, Style, Viewport } from "./components";
import { Vector2 } from "./algebra";
import { bind } from "./decorators";

export class ViewportUpdateSystem extends System {
	static queries = {
		ctx: { components: [Context] },
		viewport: { components: [Viewport] }
	};

	execute(delta: number, time: number): void {
		const ctx = this.queries.ctx.results[0].getComponent(Context).value;
		const viewport = this.queries.viewport.results[0].getMutableComponent(Viewport);
		viewport.size = Vector2.fromWidthHeight(ctx.canvas);
	}
}

export class ExtentsDragSystem extends System {
	static queries = {
		viewport: { components: [Viewport] },
		extents: { components: [Extents] }
	};
	ctx?: CanvasRenderingContext2D;
	combinedDelta?: Vector2;
	mouseDown = false;

	setContext(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.combinedDelta = new Vector2(0, 0);
		this.ctx!.canvas.addEventListener("mousemove", this.handleMouseEvent);
		this.ctx!.canvas.addEventListener("mousedown", this.handleMouseDown);
		this.ctx!.canvas.addEventListener("mouseup", this.handleMouseUp);
	}

	play() {
		this.combinedDelta = new Vector2(0, 0);
		super.play();
	}

	stop() {
		this.ctx!.canvas.removeEventListener("mousemove", this.handleMouseEvent);
		this.ctx!.canvas.removeEventListener("mousedown", this.handleMouseDown);
		this.ctx!.canvas.removeEventListener("mouseup", this.handleMouseUp);
		super.stop();
	}

	execute(delta: number, time: number) {
		if (typeof this.ctx === "undefined" || typeof this.combinedDelta === "undefined") return;
		if (!this.mouseDown) return;
		const viewport = this.queries.viewport.results[0].getComponent(Viewport);
		const extents = this.queries.extents.results[0].getMutableComponent(Extents);

		const extentsDelta = Vector2.scaleVec(viewport.mapToLocal(this.combinedDelta), extents.size);
		extents.pos.add(extentsDelta);

		this.combinedDelta.scale(0);
	}

	@bind
	private handleMouseEvent(e: MouseEvent) {
		if (typeof this.combinedDelta === "undefined") return;
		if (!this.mouseDown) return;

		const delta = new Vector2(-e.movementX, -e.movementY);
		this.combinedDelta.add(delta);
	}

	private handleMouseDown = this.handleMouseChange(true);
	private handleMouseUp = this.handleMouseChange(false);

	@bind
	private handleMouseChange(active: boolean): () => void {
		return () => this.mouseDown = active;
	}
}

export class GraphRenderingSystem extends System {
	static queries = {
		ctx: { components: [Context] },
		viewport: { components: [Viewport] },
		extents: { components: [Extents] }
	};

	execute(delta: number, time: number): void {
		const ctx = this.queries.ctx.results[0].getComponent(Context).value;
		const viewport = this.queries.viewport.results[0].getComponent(Viewport);
		const extents = this.queries.extents.results[0].getComponent(Extents);

		const zero = viewport.mapToGlobal(extents.mapToLocal(new Vector2(0, 0)));

		ctx.clearRect(0, 0, viewport.size.x, viewport.size.y);
		ctx.fillStyle = "black";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.font = "16px Ubuntu";

		ctx.strokeStyle = "grey";
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (const x of extents.iterX()) {
			const pt = viewport.mapToGlobal(extents.mapToLocal(new Vector2(x, 0)));
			ctx.moveTo(pt.x, 0);
			ctx.lineTo(pt.x, viewport.size.y);

			if (x !== 0)
				ctx.fillText(String(x), pt.x + 4, zero.y + 4);
		}
		for (const y of extents.iterY()) {
			const ny = viewport.mapToGlobal(extents.mapToLocal(new Vector2(0, y))).y;
			ctx.moveTo(0, ny);
			ctx.lineTo(viewport.size.x, ny);

			if (y !== 0)
				ctx.fillText(String(y), zero.x + 4, ny + 4);
		}
		ctx.stroke();

		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		ctx.beginPath();
		// X axis
		ctx.moveTo(0, zero.y);
		ctx.lineTo(viewport.size.x, zero.y);

		// Y axis
		ctx.moveTo(zero.x, 0);
		ctx.lineTo(zero.x, viewport.size.y);

		ctx.stroke();

		ctx.fillText("0", zero.x + 4, zero.y + 4);
	}
}

export class PlotRenderingSystem extends System {
	static queries = {
		ctx: { components: [Context] },
		viewport: { components: [Viewport] },
		extents: { components: [Extents] },
		plots: { components: [Plot, Style] }
	}

	execute(delta: number, time: number) {
		const ctx = this.queries.ctx.results[0].getComponent(Context).value;
		const viewport = this.queries.viewport.results[0].getComponent(Viewport);
		const extents = this.queries.extents.results[0].getComponent(Extents);

		this.queries.plots.results.map<[Plot, Style]>(entity => [entity.getComponent(Plot), entity.getComponent(Style)]).forEach(([plot, style]) => {
			let moved = false;
			ctx.strokeStyle = style.style;
			ctx.lineWidth = 2;
			ctx.beginPath();
			for(const x of range(0, viewport.size.x)) {
				const extentsX = extents.mapToGlobal(viewport.mapToLocal(new Vector2(x, 0))).x;
				const extentsY = plot.plot(extentsX);
				const canvasPt = viewport.mapToGlobal(extents.mapToLocal(new Vector2(extentsX, extentsY)));
				if(!moved) {
					moved = true;
					ctx.moveTo(canvasPt.x, canvasPt.y);
				}
				else ctx.lineTo(canvasPt.x, canvasPt.y);
			}
			ctx.stroke();
		});
	}
}

function* range(min: number, max: number, step = 1): Generator<number, void, void> {
	for (let i = min; i < max; i += step) {
		yield i;
	}
}
