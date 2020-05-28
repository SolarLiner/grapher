export class Vector2 {
	constructor(public x: number, public y: number) {}

	static fromWidthHeight({width, height}: {width:number, height:number}): Vector2 {
		return new Vector2(width, height);
	}

	dot(other: Vector2): number {
		return this.x * other.x + this.y * other.y;
	}

	get length() {
		return Math.sqrt(this.dot(this));
	}

	static neg(vec: Vector2): Vector2 {
		return new Vector2(-vec.x, -vec.y);
	}

	static add(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x+b.x, a.y+b.y);
	}
	add(other: Vector2) {
		this.x += other.x;
		this.y += other.y;
	}

	static sub(a: Vector2, b: Vector2) {
		return Vector2.add(a, Vector2.neg(b));
	}
	sub(other: Vector2) {
		this.add(Vector2.neg(other));
	}

	static scale(a: Vector2, fac: number): Vector2 {
		return new Vector2(a.x * fac, a.y * fac);
	}
	scale(fac: number) {
		this.x *= fac;
		this.y *= fac;
	}

	static scaleVec(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x*b.x, a.y*b.y);
	}
	scaleVec(other: Vector2) {
		this.x *= other.x;
		this.y *= other.y;
	}

	static inverse(a: Vector2): Vector2 {
		return new Vector2(1/a.x, 1/a.y);
	}
	inverse() {
		this.x = 1/this.x;
		this.y = 1/this.y;
	}

	static flipX(a: Vector2): Vector2 {
		return Vector2.scaleVec(a, new Vector2(-1, 1));
	}
	flipX() {
		this.x *= -1;
	}

	static flipY(a: Vector2): Vector2 {
		return Vector2.scaleVec(a, new Vector2(1, -1));
	}
	flipY() {
		this.y *= -1;
	}

	static normalized(a: Vector2): Vector2 {
		const len = a.length;
		return Vector2.scale(a, 1/len);
	}
	normalize() {
		const len = this.length;
		this.scale(1/len);
	}

	isNormalized(tolerance = 10-6): boolean {
		return Math.abs(this.length - 1) < tolerance;
	}

	static angle(a: Vector2, b: Vector2): number {
		return Math.atan2(b.y-a.y, b.x-a.x);
	}
	angle(): number {
		return Math.atan2(this.y, this.x);
	}
}
