(function(b, c) {    
    'object' == typeof exports && 'object' == typeof module ? module.exports = c() : 'function' == typeof define && define.amd ? define([], c) : 'object' == typeof exports ? exports.netcdfjs = c() : b.netcdfjs = c()
})(this, function() {   
    return function(a) {
        function b(d) {
            if (c[d]) return c[d].exports;
            var e = c[d] = {
                exports: {},
                id: d,
                loaded: !1
            };
            return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports
        }
        var c = {};        
        return b.m = a, b.c = c, b.p = '', b(0)
    }
    //FN 1
    ([function(a, b, c) { //index.js        
        'use strict'; //strict mode, you can not, for example, use undeclared variables       

        const d = c(1),
            e = c(2),
            f = c(3),
            g = c(5);   
        class j {
            constructor(k) {
                const l = new d(k);
                l.setBigEndian(),
                e.notNetcdf('CDF' !== l.readChars(3), 'should start with CDF');

                const m = l.readByte();
                e.notNetcdf(2 === m, '64-bit offset format not supported yet'),
                e.notNetcdf(1 !== m, 'unknown version'), 

                this.header = g(l), this.header.version = m, this.buffer = l
            }
            get version() {
                return 1 === this.header.version ? 'classic format' : '64-bit offset format'
            }
            get recordDimension() {
                return this.header.recordDimension
            }
            get dimensions() {
                return this.header.dimensions
            }
            get globalAttributes() {
                return this.header.globalAttributes
            }
            get variables() {
                return this.header.variables
            }      
            getDataVariable(k) {
                console.log("TRACE 2")

                var l, numpts;               

                // numpts = this.header.dimensions.find(function (val) {return val.name === "lat";}).size *
                //         this.header.dimensions.find(function (val) {return val.name === "lon";}).size - 1; //ORIG
                numpts = this.header.dimensions.find(function (val) {return val.name === "lat";}).size *
                        this.header.dimensions.find(function (val) {return val.name === "lon";}).size;
                console.log("numpts: ", numpts)

                // return l = 'string' == typeof k ? 
                //     this.header.variables.find(function(m) { return m.name === k }) : k, 
                //     e.notNetcdf(void 0 == l, 'variable not found'), 
                //     this.buffer.seek(l.offset), l.record ? f.record(this.buffer, l, this.header.recordDimension, numpts) : f.nonRecord(this.buffer, l);

                //LONG FORM (copied from src/index.js)
                var data=f; //CN
                var variable;
                if (typeof k === 'string') {
                    // search for the variable
                    variable = this.header.variables.find(function (val) {
                        return val.name === k;
                    });
                } else {
                    variable = k;
                }
                // search for lat and lon size
                var numpts; //total number of points = lat*long-1
                
                // numpts = this.header.dimensions.find(function (val) {return val.name === "lat";}).size *
                //         this.header.dimensions.find(function (val) {return val.name === "lon";}).size - 1; //ORIG
                numpts = this.header.dimensions.find(function (val) {return val.name === "lat";}).size *
                        this.header.dimensions.find(function (val) {return val.name === "lon";}).size;
                    
                    // throws if variable not found
                    // utils.notNetcdf((variable === undefined), 'variable not found');

                    // go to the offset position
                    this.buffer.seek(variable.offset);
                   
                    if (variable.record) { //records are for netCDF variable data
                        // record variable case                      
                        // return data.record(this.buffer, variable, this.header.recordDimension); //ORIG
                        return data.record(this.buffer, variable, this.header.recordDimension, numpts);
                    } else { //nonRecords are for lat, lon data                      
                        var nx = this.header.dimensions.find(function (val) {return val.name === "lon";}).size,
                            ny = this.header.dimensions.find(function (val) {return val.name === "lat";}).size,
                            dx = 360/nx, dy = 180/ny;
                        // non-record variable case
                        // return data.nonRecord(this.buffer, variable); //ORIG
                        return data.nonRecord(this.buffer, variable, dx, dy);
                    }
            }
        }        
        a.exports = j        
    }, 
    //FN 2
    function(a, b) {
        'use strict';
        const c = 8192,
            d = [];
        console.log("TRACE 0")
        a.exports = class {
            constructor(f, g) {
                g = g || {}, f === void 0 && (f = c), 'number' == typeof f && (f = new ArrayBuffer(f));
                let h = f.byteLength;
                const j = g.offset ? g.offset >>> 0 : 0;
                f.buffer && (h = f.byteLength - j, f = f.byteLength === f.buffer.byteLength ? j ? f.buffer.slice(j) : f.buffer : f.buffer.slice(f.byteOffset + j, f.byteOffset + f.byteLength)), this.buffer = f, this.length = h, this.byteLength = h, this.byteOffset = 0, this.offset = 0, this.littleEndian = !0, this._data = new DataView(this.buffer), this._increment = h || c, this._mark = 0
            }
            available(f) {
                return void 0 === f && (f = 1), this.offset + f <= this.length
            }
            isLittleEndian() {
                return this.littleEndian
            }
            setLittleEndian() {
                this.littleEndian = !0
            }
            isBigEndian() {
                return !this.littleEndian
            }
            setBigEndian() {
                this.littleEndian = !1
            }
            skip(f) {
                f === void 0 && (f = 1), this.offset += f
            }
            seek(f) {
                this.offset = f
            }
            mark() {
                this._mark = this.offset
            }
            reset() {
                this.offset = this._mark
            }
            rewind() {
                this.offset = 0
            }
            ensureAvailable(f) {
                if (void 0 === f && (f = 1), !this.available(f)) {
                    const g = this._increment + this._increment;
                    this._increment = g;
                    const h = this.length + g,
                        j = new Uint8Array(h);
                    j.set(new Uint8Array(this.buffer)), this.buffer = j.buffer, this.length = h, this._data = new DataView(this.buffer)
                }
            }
            readBoolean() {
                return 0 !== this.readUint8()
            }
            readInt8() {
                return this._data.getInt8(this.offset++)
            }
            readUint8() {
                return this._data.getUint8(this.offset++)
            }
            readByte() {
                return this.readUint8()
            }
            readBytes(f) {
                f === void 0 && (f = 1);
                var g = new Uint8Array(f);
                for (var h = 0; h < f; h++) g[h] = this.readByte();
                return g
            }
            readInt16() {
                var f = this._data.getInt16(this.offset, this.littleEndian);
                return this.offset += 2, f
            }
            readUint16() {
                var f = this._data.getUint16(this.offset, this.littleEndian);
                return this.offset += 2, f
            }
            readInt32() {
                var f = this._data.getInt32(this.offset, this.littleEndian);
                return this.offset += 4, f
            }
            readUint32() {
                if (v3Flag) {//CN
                    console.log("header.js v3Flag: ", v3Flag)
                    var f = this._data.getUint32(this.offset, this.littleEndian);
                    return this.offset += 4, f
                }
            }
            readFloat32() {
                var f = this._data.getFloat32(this.offset, this.littleEndian);
                return this.offset += 4, f
            }
            readFloat64() {
                var f = this._data.getFloat64(this.offset, this.littleEndian);
                return this.offset += 8, f
            }
            readChar() {
                return String.fromCharCode(this.readInt8())
            }
            readChars(f) {
                f === void 0 && (f = 1), d.length = f;
                for (var g = 0; g < f; g++) d[g] = this.readChar();
                return d.join('')
            }
            writeBoolean(f) {
                this.writeUint8(f ? 255 : 0)
            }
            writeInt8(f) {
                this.ensureAvailable(1), this._data.setInt8(this.offset++, f)
            }
            writeUint8(f) {
                this.ensureAvailable(1), this._data.setUint8(this.offset++, f)
            }
            writeByte(f) {
                this.writeUint8(f)
            }
            writeBytes(f) {
                this.ensureAvailable(f.length);
                for (var g = 0; g < f.length; g++) this._data.setUint8(this.offset++, f[g])
            }
            writeInt16(f) {
                this.ensureAvailable(2), this._data.setInt16(this.offset, f, this.littleEndian), this.offset += 2
            }
            writeUint16(f) {
                this.ensureAvailable(2), this._data.setUint16(this.offset, f, this.littleEndian), this.offset += 2
            }
            writeInt32(f) {
                this.ensureAvailable(4), this._data.setInt32(this.offset, f, this.littleEndian), this.offset += 4
            }
            writeUint32(f) {
                this.ensureAvailable(4), this._data.setUint32(this.offset, f, this.littleEndian), this.offset += 4
            }
            writeFloat32(f) {
                this.ensureAvailable(4), this._data.setFloat32(this.offset, f, this.littleEndian), this.offset += 4
            }
            writeFloat64(f) {
                this.ensureAvailable(8), this._data.setFloat64(this.offset, f, this.littleEndian), this.offset += 8
            }
            writeChar(f) {
                this.writeUint8(f.charCodeAt(0))
            }
            writeChars(f) {
                for (var g = 0; g < f.length; g++) this.writeUint8(f.charCodeAt(g))
            }
            toArray() {
                return new Uint8Array(this.buffer, 0, this.offset)
            }
        }
    }, 
    //FN 3 utils.js
    function(a, b) {  //utils.js
        'use strict';

        function c(d) {
            0 != d.offset % 4 && d.skip(4 - d.offset % 4)
        }
        a.exports.notNetcdf = function(e, f) {
            console.log("TRACE a.exports.notNetcdf");
            console.log("*****************************************")
            console.log("e in notNetcdf: ", e)
            console.log("f in notNetcdf: ", f)            

            if (e) v3Flag = false;
            else if (e === "64-bit offset format not supported yet") v3Flag = false;
            console.log("v3Flag in .notNetcdf: ", v3Flag)
        },
        a.exports.padding = c, 


        a.exports.readName = function(e) {
            
            if (v3Flag) {
                console.log("TRACE a.exports.readName: ", a);
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                var f = e.readUint32(),
                    g = e.readChars(f);
                console.log("e: ", e)
                console.log("f: ", f)
                if (g === 't2m') console.log("g: ", g)



                console.log("c(e): ", c(e))
                return c(e), g
            }
        }
    }, 
    //FN 4 data.js (supports 2-D variables)
    function(a, b, c) {  //data.js (supports 2-D variables)
        'use strict';
        const d = c(4);
        a.exports.nonRecord = function(f, g, dx, dy) {
            const h = d.str2num(g.type);
            var j = g.size / d.num2bytes(h),
                k = Array(j);           
            for (var l = 0; l < j; l++) {
                //k[l] = d.readType(f, h, 1); //ORIG. What are these numbers?
                k[l] =  (g.name==="lat" ? 90 - (l)* dy : -180 + (l)* dx) //actual lat and lon in degrees
            }
            return k
        }, a.exports.record = function(f, g, h, numpts) { //f = ?? (contains offset value), g = "variable", h = header.recordDimension ("timecounter", length 12)
            const j = d.str2num(g.type);
            // console.log("f in exports.record: ", f) //f = ?? (contains offset value)
            // console.log("g in exports.record: ", g) //g = "variable"
            // console.log("g.dimensions in exports.record: ", g.dimensions) //h = header.recordDimension ("timecounter", length 12)
            var k = h.length, //12
                l = Array(k);
            // console.log("h in exports.record: ", h) //timecounter, length=12
            const m = h.recordStep; //36912
            for (var o = 0; o < k; o++) {
                var p = f.offset; //454692 ORIG         
                // l[o] = d.readType(f, j, 1), f.seek(p + m) //orig
                l[o] = d.readType(f, j, numpts), f.seek(p + m) //NB: NECESSARY TO SEEK!! OTHERWISE FILE NOT POSITIONED PROPERLY FOR NEXT MONTH
            }
            return l
        }
    }, 
    //FN 5 types.js
    function(a, b, c) { //types.js
        'use strict';

        function d(h, j) {
            if (1 !== h) {
                var k = Array(h);
                for (var l = 0; l < h; l++) k[l] = j();
                return k
            }
            return j()
        }

        function e(h) {
            return 0 === h.charCodeAt(h.length - 1) ? h.substring(0, h.length - 1) : h
        }
        const f = c(2).notNetcdf,
            g = {
                BYTE: 1,
                CHAR: 2,
                SHORT: 3,
                INT: 4,
                FLOAT: 5,
                DOUBLE: 6
            };
        a.exports = g, a.exports.num2str = function(j) {
            switch (+j) {
                case g.BYTE:
                    return 'byte';
                case g.CHAR:
                    return 'char';
                case g.SHORT:
                    return 'short';
                case g.INT:
                    return 'int';
                case g.FLOAT:
                    return 'float';
                case g.DOUBLE:
                    return 'double';
                default:
                    return 'undefined';
            }
        }, a.exports.num2bytes = function(j) {
            switch (+j) {
                case g.BYTE:
                    return 1;
                case g.CHAR:
                    return 1;
                case g.SHORT:
                    return 2;
                case g.INT:
                    return 4;
                case g.FLOAT:
                    return 4;
                case g.DOUBLE:
                    return 8;
                default:
                    return -1;
            }
        }, a.exports.str2num = function(j) {
            switch (j + '') {
                case 'byte':
                    return g.BYTE;
                case 'char':
                    return g.CHAR;
                case 'short':
                    return g.SHORT;
                case 'int':
                    return g.INT;
                case 'float':
                    return g.FLOAT;
                case 'double':
                    return g.DOUBLE;
                default:
                    return -1;
            }
        }, a.exports.readType = function(j, k, l) {
            return k === g.BYTE ? j.readBytes(l) : k === g.CHAR ? e(j.readChars(l)) : k === g.SHORT ? d(l, j.readInt16.bind(j)) : k === g.INT ? d(l, j.readInt32.bind(j)) : k === g.FLOAT ? d(l, j.readFloat32.bind(j)) : k === g.DOUBLE ? d(l, j.readFloat64.bind(j)) : (f(!0, 'non valid type ' + k), void 0)
        }
    }, 
    //FN 6 header.js
    function(a, b, c) {  //header.js
        'use strict';    

        function d(k) {
            var l, m;
            const o = k.readUint32();
            if (o === j) return g.notNetcdf(k.readUint32() !== j, 'wrong empty tag for list of dimensions'), [];
            g.notNetcdf(10 !== o, 'wrong tag for list of dimensions');
            const s = k.readUint32();
            var p = Array(s);
            for (var q = 0; q < s; q++) {
                var r = g.readName(k);
                const t = k.readUint32();
                0 === t && (l = q, m = r), p[q] = {
                    name: r,
                    size: t
                }
            }
            return {
                dimensions: p,
                recordId: l,
                recordName: m
            }
        }

        function e(k) {
            const l = k.readUint32();
            if (l === j) return g.notNetcdf(k.readUint32() !== j, 'wrong empty tag for list of attributes'), [];
            g.notNetcdf(12 !== l, 'wrong tag for list of attributes');
            const t = k.readUint32();
            var m = Array(t);
            for (var o = 0; o < t; o++) {
                var p = g.readName(k),
                    q = k.readUint32();
                g.notNetcdf(1 > q || 6 < q, 'non valid type ' + q);
                var r = k.readUint32(),
                    s = h.readType(k, q, r);
                g.padding(k), m[o] = {
                    name: p,
                    type: h.num2str(q),
                    value: s
                }
            }
            return m
        }

        function f(k, l) {
            const m = k.readUint32();
            var o = 0;
            if (m === j) return g.notNetcdf(k.readUint32() !== j, 'wrong empty tag for list of variables'), [];
            g.notNetcdf(11 !== m, 'wrong tag for list of variables');
            const x = k.readUint32();
            var p = Array(x);
            for (var q = 0; q < x; q++) {
                var r = g.readName(k);
                const y = k.readUint32();
                var s = Array(y);
                for (var t = 0; t < y; t++) s[t] = k.readUint32();
                var u = e(k),
                    w = k.readUint32();
                g.notNetcdf(1 > w && 6 < w, 'non valid type ' + w);
                const z = k.readUint32(),
                    A = k.readUint32();
                s[0] === l && (o += z), p[q] = {
                    name: r,
                    dimensions: s,
                    attributes: u,
                    type: h.num2str(w),
                    size: z,
                    offset: A,
                    record: s[0] === l
                }
            }
            return {
                variables: p,
                recordStep: o
            }
        }
        const g = c(2),
            h = c(4),
            j = 0;
        a.exports = function(l) {
            var k = {
                    recordDimension: {
                        length: l.readUint32()
                    }
                },
                m = d(l);
            k.recordDimension.id = m.recordId, k.recordDimension.name = m.recordName, k.dimensions = m.dimensions, k.globalAttributes = e(l);
            var o = f(l, m.recordId);
            return k.variables = o.variables, k.recordDimension.recordStep = o.recordStep, k
        }
    }])
});;
//# sourceMappingURL=netcdfjs.min.js.map