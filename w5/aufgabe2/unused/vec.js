"use strict"



class Vec {
    static add(v, w) {
        return [
            v[0] + w[0],
            v[1] + w[1],
            v[2] + w[2]
        ]
    }


    static sub(v, w) {
        return [
            v[0] - w[0],
            v[1] - w[1],
            v[2] - w[2]
        ]
    }


    static mul(v, s) {
        return [
            v[0] * s,
            v[1] * s,
            v[2] * s
        ]
    }


    static div(v, s) {
        return [
            v[0] / s,
            v[1] / s,
            v[2] / s
        ]
    }


    static dot(v, w) {
        return v[0] * w[0] + v[1] * w[1] + v[2] * w[2]
    }


    static norm2(v) {
        return this.dot(v, v)
    }


    static norm(v) {
        return Math.sqrt(this.norm2(v))
    }


    static normalize(v) {
        const rr = this.norm2(v)
        if (rr === 0.0)
            return v
        const r = Math.sqrt(rr)
        return [v[0] / r, v[1] / r, v[2] / r]
    }


    static cross(v, w) {
        return [
            v[1] * w[2] - v[2] * w[1],
            v[2] * w[0] - v[0] * w[2],
            v[0] * w[1] - v[1] * w[0]
        ]
    }


    static normCross(v, w) {
        return this.normalize(this.cross(v, w))
    }


    static unitNormal(a, b, c) {
        const u = this.sub(b, a)
        const v = this.sub(c, a)
        return this.normCross(u, v)
    }
}
