// class to recognise if sketchapp shape is a rectangle, a line, a circle(TODO) or something else

class Point {
    x: number;
    y: number;

    constructor(str_or_x, y = null) {
        // a string containing the coords is input
        if (y === null) {
            const coords: any = this.string_to_coords(str_or_x);
            if (coords) {
                this.x = this.dec_round(coords.x);
                this.y = this.dec_round(coords.y);
            }
            // the coords are input
        } else {
            this.x = this.dec_round(str_or_x);
            this.y = this.dec_round(y);
        }
    }

    // 2 decimals rounding
    dec_round(number): number {
        return Math.round(number * 100 + 0.001) / 100;
    }

    distance(point: Point): number {
        return this.dec_round(this.dist(point));
    }
    dist(point: Point): number {
        return Math.sqrt(this.dist2(point));
    }
    distance2(point: Point): number {
        return this.dec_round(this.dist2(point));
    }
    dist2(point: Point): number {
        return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2);
    }

    string_to_coords(string): {} {
        const regex = /{(?<x>\-?\d(?:\.\d+)?(?:e\-?\d+)?),\s?(?<y>\-?\d(?:\.\d+)?(?:e\-?\d+)?)}/;
        const match = string.match(regex);
        if (!!match) {
            return match.groups;
        }
        return false;
    }
}

class Cluster {
    points: Point[] = [];
    barycenter: Point;

    constructor(point: Point = null) {
        if (point !== null) {
            this.addPoint(point);
        }
    }

    updateBarycenter(): void {
        let avg_x = 0;
        let avg_y = 0;
        this.points.forEach(point => {
            avg_x += point.x;
            avg_y += point.y;
        });
        avg_x /= this.points.length;
        avg_y /= this.points.length;
        this.barycenter = new Point(avg_x, avg_y);
    }

    addPoint(point: Point): void {
        this.points.push(point);
        this.updateBarycenter();
    }
}

export class Shape {
    Points: Point[];
    Top_left: Point;
    Top_right: Point;
    Bottom_left: Point;
    Bottom_right: Point;

    static get error(): number {
        return 0.05;
    }

    // check if ABC is orthogonal on B
    static is_orthogonal(A, B, C): boolean {
        return Math.abs(A.distance2(B) + B.distance2(C) - A.distance2(C)) < Shape.error;
    }

    constructor(points) {
        this.Points = [];
        points.forEach(point => {
            this.Points.push(new Point(point.point));

            if (point.hasCurveFrom === true) {
                this.Points.push(new Point(point.curveFrom));
            }
            if (point.hasCurveTo === true) {
                this.Points.push(new Point(point.curveTo));
            }
        });
    }

    // divide the points in 4 clusters
    cluster_points4(): any {
        let center_of_mass_x = 0,
            center_of_mass_y = 0;
        this.Points.forEach(point => {
            center_of_mass_x += point.x;
            center_of_mass_y += point.y;
        });
        const Center_of_mass = new Point(center_of_mass_x / this.Points.length, center_of_mass_y / this.Points.length);

        const Clusters: any = {};
        Clusters.Top_left = new Cluster();
        Clusters.Top_right = new Cluster();
        Clusters.Bottom_left = new Cluster();
        Clusters.Bottom_right = new Cluster();

        this.Points.forEach(point => {
            if (point.y < Center_of_mass.y) {
                // TOP
                if (point.x < Center_of_mass.x) {
                    // LEFT
                    Clusters.Top_left.addPoint(point);
                } else {
                    // RIGHT
                    Clusters.Top_right.addPoint(point);
                }
                // BOTTOM
            } else {
                if (point.x < Center_of_mass.x) {
                    // LEFT
                    Clusters.Bottom_left.addPoint(point);
                } else {
                    // RIGHT
                    Clusters.Bottom_right.addPoint(point);
                }
            }
        });

        return Clusters;
    }

    is_rectangle(): boolean {
        if (this.Points.length < 4) {
            return false;
        }

        const Clusters: any = this.cluster_points4();

        for (const corner in Clusters) {
            if (Clusters[corner].points.length === 0) {
                return false;
            }
        }

        const top_length = Clusters.Top_left.barycenter.distance(Clusters.Top_right.barycenter);
        const bottom_length = Clusters.Bottom_left.barycenter.distance(Clusters.Bottom_right.barycenter);
        const left_length = Clusters.Top_left.barycenter.distance(Clusters.Bottom_left.barycenter);
        const right_length = Clusters.Top_right.barycenter.distance(Clusters.Bottom_right.barycenter);

        return Math.abs(top_length - bottom_length) < Shape.error
            && Math.abs(left_length - right_length) < Shape.error
            && Shape.is_orthogonal(Clusters.Bottom_left.barycenter, Clusters.Top_left.barycenter, Clusters.Top_right.barycenter);
    }

    is_line(): boolean {
        return this.Points.length === 2
            && Math.abs(this.Points[0].y - this.Points[1].y) < Shape.error;
    }

    is_round(): boolean {
        if (this.is_rectangle() || this.is_line()) {
            return false;
        }

        const circle = new Cluster();
        this.Points.forEach(point => {
            circle.addPoint(point);
        });

        const radius2 = circle.points[0].distance2(circle.barycenter);
        let is_circle = true;
        circle.points.some(point => {
            if (Math.abs(point.distance2(circle.barycenter) - radius2) > Shape.error) {
                is_circle = false;
                return false;
            }
        });
        return is_circle;
    }
}
