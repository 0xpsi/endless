// Project Endless
// by Jonny Bursa
// April 15, 2020

var hash;

const MAPID_SIZE = 4294967296;
const HASH_SIZE = 32;

function inttobytes(a){
	buffer = new ArrayBuffer(4);
	view = new Int8Array(buffer);
	view[3] = a && (255);
	view[2] = a && (255);
	view[1] = a && (255);
	view[0] = a && (255);
	return buffer;
}

function genMapKey(){
	mapid = Math.floor(MAPID_SIZE*Math.random());
	var temp = mapid.toString(16);
	while(temp.length < 8){
		temp = "0" + temp;
	}
	return temp;
}

function hashtile(mapkey, ta, tb){
	var a, b, x, p;
	if(ta < 0){
		p = "F";
	}else{
		p = "0";
	}
	x = Math.abs(ta);
	a = x.toString(16);
	while(a.length < 7){
		a = "0" + a;
	}
	a = p + a;
	if(tb < 0){
		p = "F";
	}else{
		p = "0";
	}
	x = Math.abs(tb);
	b = x.toString(16);
	while(b.length < 7){
		b = "0" + b;
	}
	b = p + b;
	// Now, a and b each 8-char long hex strings.
	var input = mapkey + a + b;
	return md5(input);
}

// hashgen generates unique coordinate within tile
// mapkey = map id
// a,b = tile corner cords
// returns x,y coordinates
function old_hashgen(mapkey, ta, tb){	

	//digest = crypto.subtle.digest("SHA-1", inttobytes(a));
	//digest.then(goodhash, badhash);

	var a, xa, b, xb;

	if(ta < 0){
		xa = Math.abs(ta);
		a = "F" + xa.toString(16);
	}else{
		a = "0" + ta.toString(16);
	}
	if(tb < 0){
		xb = Math.abs(tb);
		b = "F" + xb.toString(16);
	}else{
		b = "0" + tb.toString(16);
	}

	var raw = mapkey + a + b;
	var rlen = raw.length;

	var input = parseInt(raw, 16) - Math.pow(16,rlen) / 2;

	var raw_out = (Math.sin(input) + 1) / 2;
	if(raw_out == 1){
		raw_out = 0;
	}

	var temp = Math.floor(raw_out*MAPID_SIZE);
	var out = temp.toString(16);
	while(out.length < 8){
		out = "0" + out;
	}

	return [out, raw, input, raw_out];
}
