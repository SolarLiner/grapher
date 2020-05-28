import { Component } from "ecsy";
import { Vector2 } from "./algebra";

export class Context extends Component {
	value!: CanvasRenderingContext2D;
}

export class Viewport extends Component {
	size!: Vector2;

	contains(pt: Vector2): boolean {
		return inRange(pt.x, 0, this.size.x) && inRange(pt.y, 0, this.size.y);
	}

	mapToGlobal(local: Vector2) {
		return Vector2.scaleVec(Vector2.add(Vector2.flipY(local), new Vector2(0, 1)), this.size);
	}

	mapToLocal(global: Vector2): Vector2 {
		return Vector2.scaleVec(Vector2.add(Vector2.flipY(global), new Vector2(0, -1)), Vector2.inverse(this.size));
	}
}

export class Extents extends Component {
	pos!: Vector2;
	size!: Vector2;

	contains(pt: Vector2): boolean {
		return inRange(pt.x, this.pos.x, this.size.x) && inRange(pt.y, this.pos.y, this.size.y);
	}

	get bottomRight(): Vector2 {
		return Vector2.add(this.pos, this.size);
	}

	mapToLocal(global: Vector2): Vector2 {
		return Vector2.scaleVec(Vector2.sub(global, this.pos), Vector2.inverse(this.size));
	}

	mapToGlobal(local: Vector2): Vector2 {
		return Vector2.add(this.pos, Vector2.scaleVec(local, this.size));
	}

	iterX(step = 1): Iterable<number> {
		return {
			[Symbol.iterator]: () => range(Math.floor(this.pos.x), this.bottomRight.x, step)
		};
	}

	iterY(step = 1): Iterable<number> {
		return {
			[Symbol.iterator]: () => range(Math.floor(this.pos.y), this.bottomRight.y, step)
		};
	}
}

export class Plot extends Component {
	plot!: (x: number) => number;
}

export class Style extends Component {
	style!: string;
}

function inRange(val: number, min: number, max: number): boolean {
	return val > min && val < max;
}

function* range(min: number, max: number, step = 1): Generator<number, void, void> {
	let current = min;
	while (current < max) {
		yield current;
		current += step;
	}
}
