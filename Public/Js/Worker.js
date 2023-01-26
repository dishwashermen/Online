function setCursorPosition(pos, elem) {
	
  elem.focus();
  
  if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
  
  else if (elem.createTextRange) {
	  
    let range = elem.createTextRange();
	
    range.collapse(true);
	
    range.moveEnd('character', pos);
	
    range.moveStart('character', pos);
	
    range.select();
	
  }
  
}

function mask(el) {
	
	if (el.value) {
		
		let i = 0;
		
		if (el.value.length > 1) {
  
			let matrix = '+7(___)___-__-__';

			let def = matrix.replace(/\D/g, '');
	  
			let val = el.value.replace(/\D/g, '');
	  
			def.length >= val.length && (val = def);
	  
			matrix = matrix.replace(/[_\d]/g, function(a) {
			  
				return val.charAt(i++) || '_';
			
			});
	  
			el.value = matrix;
			
			i = matrix.lastIndexOf(val.substr(-1));
	  
			i < matrix.length && matrix != '+7(___)___-__-__' ? i ++ : i = matrix.indexOf('_');
			
		} else {
			
			el.value = '+7(' + el.value + '__)___-__-__';
	  
			i = 4;
			
		}
	  
		setCursorPosition(i, el);
	
	}
  
}

function shuffle(arr){
	
	var j, temp;
	
	for(var i = arr.length - 1; i > 0; i--){
		
		j = Math.floor(Math.random()*(i + 1));
		
		temp = arr[j];
		
		arr[j] = arr[i];
		
		arr[i] = temp;
		
	}
	
	return arr;
	
}

function ImgAdd(ImgObj, Parent) {
	
	let ImgNames = ImgObj[1].split(',');
			
	let ImgAttr = ImgObj[2].split(',');
	
	let ImgEvent = /data-action/.test(ImgAttr[0]) ? ['click', 'load'] : null;
	
	let Signature = ImgObj[3] != null ? ImgObj[3] : '';
	
	if (/data-random/.test(ImgAttr[0])) shuffle(ImgNames);
	
	let TI = new elem('table', {classname: 'image-table', attr: 'data-display-error=bottom'});
	
	let TRI = new elem('tr', {});
	
	let TRS = new elem('tr', {});
	
	let CurrentAttr;

	[].forEach.call(ImgNames, function(x, i) {
		
		CurrentAttr = ImgAttr.length > 1 ? ImgAttr[i] : ImgAttr[0];
		
		TDI = new elem('td', {});
		
		TDS = new elem('td', {});
		
		if (/track/.test(CurrentAttr)) TRACKER.push(x);
		
		TDI.append(new elem('img', {id: 'Img', alt: 'img' + x, src: 'ImgData/' + PROJECT.id + '/' + x + '.jpg', attr: CurrentAttr + '*data-track-number=' + x, addevent: ImgEvent}));
		
		TDS.append(new elem('div', {classname: 'img-sign' + (/hidden/.test(ImgAttr[0]) ? ' hidden' : ''), attr: 'data-img-index=' + x, textcontent: Signature + ' ' + x}));
		
		TRI.append(TDI);
		
		TRS.append(TDS);
		
	});
	
	TI.append(TRI, TRS);
	
	Parent.append(TI);
	
}

function Cleaner(a, rem = true) {
	
	if (a.nodeName == null) {
		
		[].forEach.call(a, function(x) {
		
			if (! rem) {
				
				if (x.type == 'select-one' || x.type == 'select') x.selectedIndex = 0;
				
				else x.value = '';
				
			} else x.remove();

		});
		
	} else while (a.firstChild) a.removeChild(a.firstChild);
	
}

function Pre(obj) {

	let Svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	
	let Circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	
	Svg.classList.add('svg');
	
	Svg.classList.add('svg-login')
	
	Svg.setAttributeNS(null, 'viewBox', '0 0 50 50');

	Circle.classList.add('path');
	
	Circle.classList.add('path-' + obj.id);
	
	Circle.setAttributeNS(null, 'cx', '25');
	
	Circle.setAttributeNS(null, 'cy', '25');
	
	Circle.setAttributeNS(null, 'r', '20');
	
	Circle.setAttributeNS(null, 'fill', 'none');
	
	Circle.setAttributeNS(null, 'stroke-width', '3');
	
	Svg.append(Circle);
	
	obj.append(Svg);

}

function getOffset(el) {
	
    let Result = {
		
		Left: 0,
	
		Top: 0,
	
		Width: el.offsetWidth,
	
		Height: el.offsetHeight
		
	}
	
    do if (! isNaN(el.offsetLeft)) {
		
		Result.Left += el.offsetLeft;
		
		Result.Top += el.offsetTop;
		
	}

	while(el = el.offsetParent);
	
    return Result;
	
}