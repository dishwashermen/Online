document.addEventListener('DOMContentLoaded', function() {
	
	CANSEND = false;
	
	let Data = window.location.search.match(/(?<action>[hp])=(?<hash>.+)/);
	
	if (Data != null) {

		ImportJS('Vars, md5, Dialog, Valid, Worker');

		let FD = new FormData();
		
		FD.append('Hash', Data.groups.hash);
		
		if (Data.groups.action == 'h') SendRequest('Public/Php/GetProject.php', FD);
		
		else SendRequest('Public/Php/GetPersonal.php', FD);

	}
        
});

ImportJS = function(js) {
	
	[].forEach.call(js.split(','), function(uri) {
	
		let script = document.createElement('script');
	
		script.src  = 'Public/Js/' + uri.trim() + '.js';
	
		document.head.appendChild(script);
		
	});
	
}

function SendRequest(location, param) {
	
	let R = false;
	
	if (window.XMLHttpRequest) {
		
		R = new XMLHttpRequest();

	} else if (window.ActiveXObject) {

		try {
			
			R = new ActiveXObject('Msxml2.XMLHTTP');
			
		} catch (e) {
		
			try {
				
				R = new ActiveXObject('Microsoft.XMLHTTP');
				
			} catch (e) {}
			
		}
	
	}
	
	if (R) {
		
		R.onreadystatechange = function() {
			
			if (R.readyState == XMLHttpRequest.DONE) {

				if (R.status == 200 && R.responseText.length) {
					
					RESP = JSON.parse(R.responseText);

					switch (RESP.Action) {
						
						case 'Separate':
						
							SEPARATEINDEX = RESP.SeparateIndex;
							
							PageManager.Page('MainContainer', RESP.Reload);
							
							//if (RULES.VISUAL && RULES.VISUAL.includes(STATEINDEX)) VisualRuleProcessing();
							
							document.querySelector('#Submit') && document.querySelector('#Submit').classList.remove('submit-preloader');
							
							document.querySelector('#Back') && document.querySelector('#Back').classList.remove('submit-preloader');
						
						break;
						
						case 'StartLimit':
						
							document.querySelector('#LoginSubmit div').classList.remove('hidden');
							
							document.querySelector('#LoginSubmit svg').remove();
						
							CreateDialog('StartLimit');
						
						break;
						
						case 'Resume':
						
							QDATA = RESP.Q;//MOBILE = true;
							
							SEPARATE = QDATA.L2Title ? true : false;
							
							RULESDATA = RESP.RuleData;

							RESP.HistoryState && (HIO = JSON.parse(RESP.HistoryState));
							
							UID = RESP.Uid;
							
							STATEINDEX = RESP.StateIndex.toString();
							
							SEPARATEINDEX = RESP.Ident == 'Write' ? 0 : (RESP.Ident == 'Back' ? 'last' : RESP.SeparateIndex);
							
							RESP.JournalIndex && (JOURNALINDEX = RESP.JournalIndex);
							
							PageManager.Page('MainContainer', RESP.Reload);
							
							//if (RULES.VISUAL && RULES.VISUAL.includes(STATEINDEX)) VisualRuleProcessing();
							
							document.querySelector('#Submit') && document.querySelector('#Submit').classList.remove('submit-preloader');
							
							document.querySelector('#Back') && document.querySelector('#Back').classList.remove('submit-preloader');

							if (RESP.LimitText != null && RESP.LimitText != '') CreateDialog('ModalDialog', RESP.LimitText);
							
						break;		

						case 'Personal':
						
							PROJECT = RESP.Project;

							RULES = RESP.Rules;
							
							if (PROJECT.ViewMap) {
							
								let ViewMap = PROJECT.ViewMap.split(',');
								
								if (PROJECT.ViewData != null) {
									
									let ViewData = PROJECT.ViewData.split(',');
								
									ViewMap = ViewMap.concat(ViewData);
									
								}
								
								[].forEach.call(ViewMap, function(x) {
									
									let Data = x.match(/(?<num>.+)\[(?<name>.+)\]/);
									
									VIEW[Data.groups.num] = Data.groups.name;
									
								});
								
							}
						
							HISTORY = PROJECT.History == '1' ? true : false;
							
							QND = PROJECT.QNHidden == '1' ? true : false;
							
							JOURNALMODE = PROJECT.Version.match(/Journal\[(.*)\]/);

							if (JOURNALMODE != null) {
								
								JOURNALMODE = JOURNALMODE[1].split(',');
								
								JF = JOURNALMODE[0];
								
								JL = JOURNALMODE[1];
								
								JC = JOURNALMODE[2];
								
							}
							
							QDATA = RESP.Q;
							
							RULESDATA = RESP.RuleData;

							RESP.HistoryState && (HIO = JSON.parse(RESP.HistoryState));
							
							UID = RESP.Uid;
							
							STATEINDEX = RESP.StateIndex.toString();
							
							RESP.JournalIndex && (JOURNALINDEX = RESP.JournalIndex);
							
							PageManager.Page('MainContainer', RESP.Reload);
							
							//if (RULES.VISUAL && RULES.VISUAL.includes(STATEINDEX)) VisualRuleProcessing();
							
							document.querySelector('#Submit') && document.querySelector('#Submit').classList.remove('submit-preloader');
							
							document.querySelector('#Back') && document.querySelector('#Back').classList.remove('submit-preloader');

						break;
		                
		                case 'Denied':
						
							document.querySelector('#LoginSubmit div').classList.remove('hidden');
							
							document.querySelector('#LoginSubmit svg').remove();
						
							CreateDialog('LoginError');
		                    
		                break;		                
						
						case 'Welcome':
						
							PROJECT = RESP.Project;

							BASEDATA = RESP.BaseData;
							
							RULES = RESP.Rules;
							
							LIMIT = RESP.Limit;
							
							if (PROJECT.ViewMap) {
							
								let ViewMap = PROJECT.ViewMap.split(',');
								
								if (PROJECT.ViewData != null) {
									
									let ViewData = PROJECT.ViewData.split(',');
								
									ViewMap = ViewMap.concat(ViewData);
									
								}
								
								[].forEach.call(ViewMap, function(x) {
									
									let Data = x.match(/(?<num>.+)\[(?<name>.+)\]/);
									
									VIEW[Data.groups.num] = Data.groups.name;
									
								});
								
							}
						
							HISTORY = PROJECT.History == '1' ? true : false;
							
							QND = PROJECT.QNHidden == '1' ? true : false;

							JOURNALMODE = PROJECT.Version.match(/Journal\[(.*)\]/);

							if (JOURNALMODE != null) {
								
								JOURNALMODE = JOURNALMODE[1].split(',');
								
								JF = JOURNALMODE[0];
								
								JL = JOURNALMODE[1];
								
								JC = JOURNALMODE[2];
								
							}
							
							PageManager.Page('LoginPage');
							
						break;
						
				    }
		
				}
				
				CANSEND = true;
			
			}
			
		}
		
		R.open('POST', location);

		R.send(param);
		
	} else console.log("NOT AJAX");
	
}

PageManager = {
	
	LoginPage: function() {
		
		document.querySelector('.login-box').classList.remove('hidden');
		
		document.querySelector('.project-name').textContent = PROJECT.Name;
		
		switch (PROJECT.AuthType) {
			
			case '0':
			
				switch (PROJECT.AuthData) {
					
					case 'phone':
					
						document.querySelector('#Login input').setAttribute('type', 'tel');
						
						document.querySelector('#Login input').setAttribute('pattern', '.*');
						
						document.querySelector('#Login input').addEventListener('input', listener);
						
						document.querySelector('#Login label').textContent = 'Номер телефона';
					
					break;
					
					case 'random':
					
						document.querySelector('#Login input').setAttribute('type', 'text');
						
						document.querySelector('#Login input').value = md5(new Date());
						
						document.querySelector('#Login label').textContent = 'Случайная строка';
					
					break;
					
					default:
					
						document.querySelector('#Login input').setAttribute('type', 'text');
						
						document.querySelector('#Login label').textContent = PROJECT.AuthData;
					
					break;
					
				}

			break;
			
			case '1':
			
				document.querySelector('#Login').classList.add('hidden');
				
				for (let i = 0; i < + PROJECT.AuthData; i ++) {
					
					let InputBox = new elem('div', {id: 'Login' + (i + 1), classname: 'input-box', value: ''});
					
					let InputList = new elem('datalist', {id: 'List' + (i + 1)});

					for (let d in BASEDATA.FieldData) {
						
						if (i == 0) {

							InputList.append(new elem('option', {value: d}));
							
							BASELOGIN[(i + 1)].Data.push(d);
							
						} else {
							
							[].forEach.call(BASEDATA.FieldData[d], function(y) {

								InputList.append(new elem('option', {value: y}));
								
								BASELOGIN[(i + 1)].Data.push(y);
								
							});
							
						}
	
					}

					InputBox.append(new elem('input', {id: 'BaseInput' + (i + 1), type: 'text', attr: 'name=' + (i + 1) + '*required*list=List' + (i + 1), addevent: (PROJECT.AuthData > 1 ? 'blur' : '')}));
					
					if (InputList.childNodes.length > 0) InputBox.append(InputList);
					
					InputBox.append(new elem('label', {textcontent: BASEDATA.FieldName[i]}));
					
					document.querySelector('#SpecialBox').insertAdjacentElement('beforeBegin', InputBox);
					
				}
				
			break;
			
		}
		
		switch (PROJECT.AuthProtect) {
					
			case 'password':
			
				document.querySelector('#Password').classList.remove('hidden');
			
			break;
			
		}
		
		document.querySelector('#LoginSubmit').addEventListener('click', listener);
		
	},
	
	MainContainer: function(Reload) {
		
		if (Reload) document.querySelector('#MainContainer').remove();
			
		else document.querySelector('.login-box').classList.add('hidden');

		let MC = document.body.appendChild(document.querySelector('#MainContainerTemplate').cloneNode(true));
		
		MC.id = 'MainContainer';
		
		MC.className = 'main-container';
		
		//document.querySelector('#MainContainer').scrollTo(0, -document.querySelector('#MainContainer').scrollTop);																									
		//if (PROJECT.Progress) document.querySelector('.top-progress').textContent = GetProgress(STATEINDEX);
		
		builder();
		
	},
	
	Page: function(PageId, Reload) {

		Result = this[PageId](Reload);
		
		return Result;
		
	}	
	
}

function MakeArray(String) {
	
	let A1 = String.split(',');
	
	let A2;
	
	let Result = [];
	
	for (let i in A1) {
		
		if (A1[i].indexOf('-') !== -1) {
			
			A2 = A1[i].split('-');
			
			for (let j = A2[0]; j <= A2[1]; j ++) Result.push(j.toString());
			
		} else Result.push(A1[i]);
		
	}
	
	return Result;
	
}
	
let elem = function(el, opt) {

	this.type = opt.type || false;
	
	this.id = opt.id || false;
	
	this.classname = opt.classname || false;
	
	this.name = opt.name || false;
	
	this.value = opt.value || false;
	
	this.title = opt.title || false;
	
	this.textcontent = opt.textcontent || false;
	
	this.innerhtml = opt.innerhtml || false;
	
	this.pattern = opt.pattern || false;
	
	this.placeholder = opt.placeholder  || false;
	
	this.attr = opt.attr || false;
	
	this.alt = opt.alt || false;

	this.attr && (this.attrlist = this.attr.split('*'));
	
	this.addevent = opt.addevent || false;
	
	this.src = opt.src || false;
	
	this.entity = document.createElement(el);
	
	this.type && (this.entity.type = this.type);
	
	this.classname && (this.entity.className = this.classname);
	
	this.title && (this.entity.title = this.title);
	
	if (this.addevent) {
		
		let EventData = this.addevent.split(',');
		
		for (let i = 0; i < EventData.length; i ++) { this.entity.addEventListener(EventData[i], listener) }
		
	}
	
	if (this.attr) for (let y in this.attrlist) this.entity.setAttribute(this.attrlist[y].split('=')[0], this.attrlist[y].split('=')[1] || '');
	
	switch (el) {
		
		case 'div': case 'table': case 'tr': case 'td': case 'label': case 'span': case 'option': case 'datalist': case 'button': case 'dialog': case 'textarea': case 'select': case 'img': case 'svg': case 'circle':
		
			this.id && ((el == 'label') ? this.entity.setAttribute('for', this.id) : this.entity.id = this.id);
			
			this.textcontent && (this.entity.textContent = this.textcontent);
			
			this.innerhtml && (this.entity.innerHTML = this.innerhtml);
			
			if (this.src != null) this.entity.src = this.src;
			
			if (this.alt != null) this.entity.alt = this.alt;
			
			this.value && (this.entity.value = this.value);

		break;
		
		case 'input':
		
			this.id && (this.entity.id = this.id);
			
			this.name && (this.entity.name = this.name);
			
			this.value && (this.entity.value = this.value);

			switch (this.type) {
			
				case 'checkbox': case 'radio': case 'button':
				
					
				
				break;
				
				 case 'number': case 'text': case 'tel':
				
					this.textcontent && (this.entity.textContent = this.textcontent);
					
					this.pattern && (this.entity.pattern = this.pattern);
					
					this.placeholder && (this.entity.placeholder = this.placeholder);
				
				break;
			
			}
	
		break;
	
	}
	
	return this.entity;
	
}

function StringControl(i, l) {
	
	let Rule;
	
	let ResponseData = {
		
		Value: [], 
		
		Data: []
		
	};
	
	let Index = (i + 1).toString();
	
	let Result = {
		
		Include: true,
		
		ThrowData: false
	};
	
	let ResponseGroups;

	for (let R in RULESDATA) if (RULESDATA[R].Event == 'L' + l) {
		
		Rule = RULESDATA[R];
		
		if (Rule.TargetData != null && Rule.ResponseData.length > 1) {
			
			let TargetData = MakeArray(Rule.TargetData);
			
			let Success;
			
			let InsertData = false;
			
			[].forEach.call(Rule.ResponseData, function(rdv) {
				
				ResponseGroups = rdv.QResponse.match(/(?<val>\d+)-?(?<data>.+)?/);
				
				switch (Rule.Operation) {
					
					case 'EQUAL': case 'NOT EQUAL':
								
						Success = (Rule.Operation == 'EQUAL' && ResponseGroups.groups.val == TargetData[0]) || (Rule.Operation == 'NOT EQUAL' && ResponseGroups.groups.val != TargetData[0]);
						
					break;
					
					case 'MORE': case 'NOT MORE':
								
						Success = (Rule.Operation == 'MORE' && ResponseGroups.groups.val > TargetData[0]) || (Rule.Operation == 'NOT MORE' && ResponseGroups.groups.val <= TargetData[0]);
						
					break;
					
					case 'LESS': case 'NOT LESS': 
					
						Success = (Rule.Operation == 'LESS' && ResponseGroups.groups.val < TargetData[0]) || (Rule.Operation == 'NOT LESS' && ResponseGroups.groups.val >= TargetData[0]);
						
					break;
					
					case 'CONTAINS': case 'NOT CONTAINS':
					
						let ValData = rdv.QResponse.replace(/-[^,]+/, '').split(',');
						
						let TrueData = rdv.QResponse.split(',');
						
						if ((Rule.Operation == 'CONTAINS' && ValData.includes(TargetData[0])) || (Rule.Operation == 'NOT CONTAINS' && ! ValData.includes(TargetData[0]))) {
							
							Success = true;
							
							InsertData = TrueData[ValData.indexOf(TargetData[0])].match(/-(.+)$/, '')[1];
							
						} else Success = false;
					
					break;
					
					case 'BETWEEN': case 'NOT BETWEEN':
					
						Success = (Rule.Operation == 'BETWEEN' && ResponseGroups.groups.val >= TargetData[0] && ResponseGroups.groups.val <= TargetData[1]) || (Rule.Operation == 'NOT BETWEEN' && (ResponseGroups.groups.val < TargetData[0] || ResponseGroups.groups.val > TargetData[1]));
					
					break;
					
				}
				
				if (Success == true) {
					
					ResponseData.Value.push(rdv.QName.match(/_(\d+)$/, '')[1]);
					
					ResponseData.Data.push(InsertData ? InsertData : '');
					
					Success = false;
							
					InsertData = false;
					
				}
				
			});
			
		} else {
			
			let WorkResponse;
		
			if (Rule.ResponseData.length > 1) {
				
				for (let rd = 0; rd < Rule.ResponseData.length; rd ++) {
					
					let ShiftData = Rule.ResponseData[rd].QName.match(/^[^_]+_(?<data>\d+)/);
					
					if (ShiftData.groups.data != null && ShiftData.groups.data == Index) {
						
						WorkResponse = Rule.ResponseData[rd].QResponse.split(',');

						break;
						
					}
					
				}
				
			} else WorkResponse = Rule.ResponseData[0].QResponse.split(',');
			
			[].forEach.call(WorkResponse, function(wr) {
						
				ResponseGroups = wr.match(/(?<val>\d+)-?(?<data>.+)?/);
				
				ResponseData.Value.push(ResponseGroups.groups.val);
					
				ResponseData.Data.push(ResponseGroups.groups.data != null ? ResponseGroups.groups.data : '');

			});
	
		}
		
		if (/\|/.test(Rule.Target)) {
			
			let TargetData = Rule.Target.split('|');
							
			let TargetComplex;
			
			for(let t = 0; t < TargetData.length; t ++) {
				
				let TDParse = TargetData[t].match(/^(?<str>\d+)\[(?<resp>[\d,]+)\]/);
				
				if (TDParse.groups.str == Index) {
					
					TargetComplex = TDParse.groups.resp.split(',');
					
					break;
					
				}
				
			}
			
			for(let t = 0; t < TargetComplex.length; t ++) {
				
				if (! ResponseData || (Rule.Action == 'DISPLAY' && ! ResponseData.includes(TargetComplex[t])) || (Rule.Action == 'NOT DISPLAY' && ResponseData.includes(TargetComplex[t]))) Result.Include = false;
	
				else {
					
					Result.Include = true;
				
					break;
					
				}
				
			}
			
		} else {
		
			let MatchIndex = ResponseData.Value.indexOf(Index);
			
			if ((Rule.Action == 'DISPLAY' && MatchIndex > -1) || (Rule.Action == 'NOT DISPLAY' && MatchIndex == -1)) {
				
				if (ResponseData.Data[MatchIndex] != '') Result.ThrowData = ResponseData.Data[MatchIndex];
				
			} else Result.Include = false;
			
		}
		
		if (! Result.Include) break;
		
	}
	
	return Result;
	
}

function builder() {

	let L1Data = [];
	
	let L1MixData = [];

	let L2Data = [];
	
	let L2MixData = [];

	let Mix;
	
	let MixData = [];
	
	let Rows;

	let StringBox;

	let HasInput = true;

	let WorkObject;

	let INodeType = QDATA.INodeType != null ? QDATA.INodeType.split('|') : false;

	let IData = QDATA.IData != null ? QDATA.IData.split('|') : false;
	
	let IAttributes = QDATA.IAttributes != null ? QDATA.IAttributes.split('|') : false;
	
	let QProperty = QDATA.QProperty != null ? QDATA.QProperty.split('|') : false;

	let L1Title = QDATA.L1Title != null ? QDATA.L1Title.split('|') : false;

	let L2Title = QDATA.L2Title != null ? QDATA.L2Title.split('|') : false;
	
	let QB = document.querySelector('#MainContainer .content');

	// Получение настроек для ротации -------------------------------------------------------------------------------------------
	
	if (QProperty) {
	
		[].forEach.call(QProperty, function(x) {
			
			let SpecialChar = x.match(/(?<Name>[^=]+)=?(?<Data>.+)?/);
			
			if (SpecialChar != null) {
				
				if (SpecialChar.groups.Name == 'Mix') {
					
					Mix = true;
					
					if (SpecialChar.groups.Data != null) MixData = MakeArray(SpecialChar.groups.Data);
					
				}
	
			}
			
		});

	}
	
	// --------------------------------------------------------------------------------------------------------------------------
	
	if (L1Title) {
		
		let L1Caption = QDATA.L1Caption != null ? QDATA.L1Caption.split('|') : false;

		let L1Property = QDATA.L1Property != null ? QDATA.L1Property.split('|') : false;

		let ResponseData = false;

		[].forEach.call(L1Title, function(x, i) {

			let StringStatus = RULES.L1 && RULES.L1.includes(STATEINDEX) ? StringControl(i, 1) : {'Include': true};

			if (StringStatus.Include) {
			
				WorkObject = {
				
					Name: StringStatus.ThrowData ? StringStatus.ThrowData : x,
					
					Index: i + 1,
					
					Caption: L1Caption ? L1Caption[i] : false,

					Property: L1Property ? L1Property[i] : false,
					
					NodeType: INodeType ? (INodeType.length > 1 ? INodeType[i] : INodeType[0]) : false,
					
					Data: IData ? IData[i] : false,
					
					Attributes: StringStatus.ThrowData ? 'data-throw=' + (IAttributes ? '*' + IAttributes[i] : '') : (IAttributes ? IAttributes[i] : false)
		
				}
				
				if (! SEPARATE && Mix && MixData.length > 0 && MixData.includes((i + 1).toString())) L1MixData.push(WorkObject);
				
				else L1Data.push(WorkObject);
				
			}
			
		});
		
		if (! SEPARATE && Mix) shuffle(L1MixData.length > 0 ? L1MixData : L1Data);
		
		L1Data = L1MixData.concat(L1Data);

	}
	
	if (L2Title) {
		
		let L2Caption = QDATA.L2Caption != null ? QDATA.L2Caption.split('|') : false;

		let L2Property = QDATA.L2Property != null ? QDATA.L2Property.split('|') : false;

		[].forEach.call(L2Title, function(x, i) {
			
			let StringStatus = RULES.L2 && RULES.L2.includes(STATEINDEX) ? StringControl(i, 2) : {'Include': true};
			
			if (StringStatus.Include) {
			
				WorkObject = {
				
					Name: StringStatus.ThrowData ? StringStatus.ThrowData : x,
					
					Index: i + 1,
					
					Caption: L2Caption ? L2Caption[i] : false,

					Property: L2Property ? L2Property[i] : false,
						
					NodeType: INodeType ? (INodeType.length > 1 ? INodeType[i] : INodeType[0]) : false,
						
					Data: IData ? IData[i] : false,
						
					Attributes: StringStatus.ThrowData ? 'data-throw' + (IAttributes ? '*' + IAttributes[i] : '') : (IAttributes ? IAttributes[i] : false)

				}

				if (SEPARATE && Mix && MixData.length > 0 && MixData.includes((i + 1).toString())) L2MixData.push(WorkObject);
				
				else L2Data.push(WorkObject);
				
			}
	
		});
		
		if (SEPARATE && Mix) shuffle(L2MixData.length > 0 ? L2MixData : L2Data);
			
		L2Data = L2MixData.concat(L2Data);

	}
	
	// Включение журнала --------------------------------------------------------------------------------------------------------
	
	if (JF && + STATEINDEX >= + JF && PROJECT.Total != STATEINDEX) {
		
		let JD = new elem('div', {classname: 'j-container'});
		
		JD.append(new elem('span', {classname: 'j-name', innerhtml: 'Дневник ' + JOURNALINDEX}));
		
		QN.append(JD);
		
	}
	
	// --------------------------------------------------------------------------------------------------------------------------

	// Добавление названия и дополнительной подписи вопроса ---------------------------------------------------------------------
	
	if (QDATA.QTitle) document.querySelector('#MainContainer .name').innerHTML = (QDATA.QNumber && ! QND ? QDATA.QNumber + '. ' : '') + TextProcessing(QDATA.QTitle);
	
	if (QDATA.QCaption) {
		
		document.querySelector('#MainContainer .note').innerHTML = TextProcessing(QDATA.QCaption);
	
		document.querySelector('#MainContainer .note').classList.remove('hidden');
		
	}
	
	// --------------------------------------------------------------------------------------------------------------------------
	
	// Обработка структуры ------------------------------------------------------------------------------------------------------

	if (SEPARATE) {

		LASTSEPARATE = L2Data.length - 1;
		
		if (SEPARATEINDEX == 'last') SEPARATEINDEX = LASTSEPARATE;
		
		let SeparateBox = document.querySelector('#MainContainer .separate').appendChild(new elem('div', {innerhtml: TextProcessing(L1Data[SEPARATEINDEX].Name)}));
		
		if (L1Data[SEPARATEINDEX].Caption) SeparateBox.append(new elem('div', {classname: 'note', innerhtml: TextProcessing(L1Data[SEPARATEINDEX].Caption)}));

		document.querySelector('#MainContainer .separate').classList.remove('hidden');
		
		Rows = L2Data;
		
		SEPARATEMARK = L1Data[SEPARATEINDEX].Index;
		
	} else Rows = L1Data;

	// --------------------------------------------------------------------------------------------------------------------------
	
	// Обработка отображения дополнительных данных ------------------------------------------------------------------------------
	
	if (RULES.MSG && RULES.MSG.includes(STATEINDEX)) for (let R in RULESDATA) if (RULESDATA[R].Event == 'MSG') {
		
		let WorkResponse;
		
		if (RULESDATA[R].ResponseData.length > 1) {
			
			for (let rd = 0; rd < RULESDATA[R].ResponseData.length; rd ++) {
				
				let ShiftData = RULESDATA[R].ResponseData[rd].QName.match(/^[^_]+_(?<data>\d+)/);
				
				if (ShiftData.groups.data != null && ShiftData.groups.data == SEPARATEMARK) {
					
					WorkResponse = RULESDATA[R].ResponseData[rd];

					break;
					
				}
				
			}
			
		} else WorkResponse = RULESDATA[R].ResponseData[0];
		
		document.querySelector('#MainContainer .external').textContent = RULESDATA[R].Action.replace('$', /^Друг(ое$|ие$|ая$|ой$)|\[(t|n)\]/.test(WorkResponse.QResponse) ? WorkResponse.QRaw.replace(/^\d+-/, '') : WorkResponse.QResponse);
		
		document.querySelector('#MainContainer .external').classList.remove('hidden');
		
	}
	
	// --------------------------------------------------------------------------------------------------------------------------
	
	// Добавление строк ---------------------------------------------------------------------------------------------------------
		
	for (let RowIndex = 0, id = 0; RowIndex < Rows.length; RowIndex ++) {
		
		let WorkRow = Rows[RowIndex];

		// Добавление разделителя строк на секции -------------------------------------------------------------------------------
		
		RowSectionData = WorkRow.Name.match(/^(?<Replace>#(?<Section>.*)#).*/);
		
		if (RowSectionData != null) {
			
			WorkRow.Name = WorkRow.Name.replace(RowSectionData.groups.Replace, '');
			
			QB.appendChild(new elem('div', {classname: 'Section-string', innerhtml: RowSectionData.groups.Section}));

		}
		
		// ----------------------------------------------------------------------------------------------------------------------
		
		let RCC = new elem('div', {classname: 'input-container', attr: 'data-string-index=' + (WorkRow ? WorkRow.Index : RowIndex) + (WorkRow && WorkRow.Property ? '*' + WorkRow.Property : '') + (WorkRow && WorkRow.Attr ? '*' + WorkRow.Attr : '')});
		
		let Variable;

		id ++;
		
		let WorkInputNodeType = WorkRow.NodeType;
		
		if (WorkInputNodeType == null) {
		
			HasInput = false;
			
			DATACOMPLETED.hasOwnProperty(QDATA.QNumber) || (DATACOMPLETED[QDATA.QNumber] = ['NODATA', [], '']);
			
			break;
			
		}

		let WorkInputAttributes = '';
		
		if (WorkRow && WorkRow.Attributes) WorkInputAttributes += (WorkInputAttributes != '' ? '*' : '') + WorkRow.Attributes;

		if (WorkRow && WorkRow.Property) WorkInputAttributes += (WorkInputAttributes != '' ? '*' : '') + WorkRow.Property;

		if (WorkInputAttributes != '') WorkInputAttributes = TextProcessing(WorkInputAttributes);

		let L3Data = WorkRow.Data ? WorkRow.Data.split('*') : false;

		for (let ComplexIndex = 0; ComplexIndex < (L3Data && (WorkInputNodeType == 'checkbox' || WorkInputNodeType == 'radio') ? L3Data.length : 1); ComplexIndex ++) {
			
			let WorkId = id + (L3Data ? '.' + ComplexIndex : '');
			
			let WorkValue = L3Data ? ComplexIndex + 1 : (WorkRow ? WorkRow.Index : RowIndex);
			
			let WorkOutMark = WorkInputNodeType == 'file' ? ['file'] : [QDATA.QNumber];
			
			if (SEPARATE) WorkOutMark.push(SEPARATEMARK);

			switch (WorkInputNodeType) {
				
				case 'textarea':
				
					if (Rows.length > 1) WorkOutMark.push(WorkRow ? WorkRow.Index : RowIndex);
				
					if (L3Data) WorkOutMark.push(ComplexIndex + 1);

					StringBox = RCC.appendChild(new elem('div', {classname: 'string-box'}));
					
					StringBox.append(new elem('div', {
						
					classname: 'input-caption',
						
					innerhtml: (WorkRow && WorkRow.Name ? TextProcessing(WorkRow.Name) : '')}));
					
					if (WorkRow && WorkRow.Caption) StringBox.append(new elem('div', {classname: 'row-note', innerhtml: TextProcessing(WorkRow.Caption)}));
					
					StringBox.append(new elem('textarea', {
				
						id: WorkId,
						
						attr: 'data-out=' + WorkOutMark.join('_') + '*required' + (WorkInputAttributes ? '*' + WorkInputAttributes : '') + '*data-position=' + (RowIndex == Rows.length - 1 ? 'last' : RowIndex),
						
						addevent: 'keyup'
						
					}));

				break;
				
				case 'select':
				
					if (Rows.length > 1) WorkOutMark.push(WorkRow ? WorkRow.Index : RowIndex);

					StringBox = RCC.appendChild(new elem('div', {classname: 'string-box'}));
					
					if (WorkRow && WorkRow.Caption) StringBox.append(new elem('div', {classname: 'row-note', innerhtml: TextProcessing(WorkRow.Caption)}));
					
					StringBox.append(new elem('div', {
					
						classname: 'input-caption',
						
						textcontent: WorkRow.Name
						
					}));
					
					let Sel = StringBox.appendChild(new elem('select', {

						id: WorkId,
					
						attr: 'data-out=' + WorkOutMark.join('_'),
			
						addevent: 'change'
						
					}));
					
					Sel.appendChild(new elem('option', {textcontent: 'Выбрать'}));
					
					[].forEach.call(L3Data, function(Opt, OptIndex) {
						
						Variable = /^Друг(ое$|ие$|ая$|ой$)|\[(t|n)\]/.test(Opt);
						
						Sel.appendChild(new elem('option', {textcontent: Opt.replace(/\[t\]|\[n\]/, '')}));
						
						if (Variable) Sel.setAttribute('data-variable', OptIndex + 1);
						
					});

				break;
				
				case 'text': case 'number': case 'tel':
				
					if (Rows.length > 1) WorkOutMark.push(WorkRow ? WorkRow.Index : RowIndex);
				
					if (L3Data) WorkOutMark.push(ComplexIndex + 1);

					StringBox = RCC.appendChild(new elem('div', {classname: 'string-box'}));
						
					StringBox.append(new elem('div', {
						
						classname: 'input-caption',
						
						innerhtml: (WorkRow && WorkRow.Name ? TextProcessing(WorkRow.Name) : '')
						
					}));
					
					if (WorkRow && WorkRow.Caption) StringBox.append(new elem('div', {classname: 'row-note', innerhtml: TextProcessing(WorkRow.Caption)}));
					
					StringBox.append(new elem('input', {
						
						type: WorkInputNodeType,
			
						id: WorkId,

						pattern: WorkInputNodeType == 'tel' ? '.*' : '',
					
						attr: 'data-out=' + WorkOutMark.join('_') + '*required' + (WorkInputAttributes ? '*' + WorkInputAttributes : '') + '*data-position=' + (RowIndex == Rows.length - 1 ? 'last' : RowIndex),
			
						addevent: WorkInputNodeType == 'tel' ? 'input' : 'keyup'
						
					}));

				break;
				
				case 'checkbox': case 'radio':
				
					if (L3Data && Rows.length > 1) WorkOutMark.push(WorkRow ? WorkRow.Index : RowIndex);

					if (ComplexIndex == 0) {
					
						Variable = /^Друг(ое$|ие$|ая$|ой$)|\[(t|n)\]/.test(WorkRow.Name);
		
						WorkRow.Name = WorkRow.Name.replace(/\[t\]|\[n\]/, '');
						
						StringBox = RCC.appendChild(new elem('div', {classname: 'string-box'}));
						
						if (L3Data) StringBox.append(new elem('div', {
						
							classname: 'input-caption',
								
							textcontent: (WorkRow && WorkRow.Name ? TextProcessing(WorkRow.Name) : '')
							
						}));
						
						if (WorkRow && WorkRow.Caption) StringBox.append(new elem('div', {classname: 'row-note', innerhtml: TextProcessing(WorkRow.Caption)}));
						
					} else StringBox = RCC.querySelector('.string-box');
						
					StringBox.append(new elem('input', {
						
						type: WorkInputNodeType,
			
						id: WorkId,
					
						name: WorkOutMark.join('_'), 
					
						value: WorkValue, 
					
						attr: 'data-out=' + WorkOutMark.join('_') + (WorkInputAttributes ? '*' + WorkInputAttributes : '') + (Variable ? '*data-variable' : '') + (L3Data ? '*data-cancel-event' : ''),
					
						addevent: 'change'
						
					}), new elem('label', {
						
						classname: L3Data ? 'input-multi-caption' : 'input-caption',
					
						attr: 'for=' + WorkId,
						
						textcontent: L3Data ? L3Data[ComplexIndex] : WorkRow.Name
						
					}));

				break;
			
			}
			
			if (/text|tel/.test(WorkInputNodeType)) RCC.appendChild(new elem('span', {}));

			if (WorkInputNodeType == 'text' && /data-progress=line/.test(WorkInputAttributes)) RCC.appendChild(new elem('div', {classname: 'progress-container', attr: 'data-for=' + WorkId}));
			
			DATACOMPLETED.hasOwnProperty(WorkOutMark.join('_')) || (DATACOMPLETED[WorkOutMark.join('_')] = [WorkInputNodeType, [], '']);
			
			//if (Variable) PTDATA.hasOwnProperty(WorkOutMark.join('_')) || (PTDATA[WorkOutMark.join('_')] = {});
			
			if (SEPARATE) break;
			
		}

		if (HasInput) QB.append(RCC);
		
	}

	// --------------------------------------------------------------------------------------------------------------------------
	
	// Отображение кнопки Назад -------------------------------------------------------------------------------------------------
	
	if (HISTORY && STATEINDEX != '1' && ! QDATA.BackDisable) document.querySelector('#MainContainer .buttons .box').append(new elem('div', {id: 'Back', classname: 'button -back', textcontent: '<', addevent: 'click'}));
	
	// --------------------------------------------------------------------------------------------------------------------------
	
	// Отображение кнопки Далее
	
	if (STATEINDEX != PROJECT.Total) document.querySelector('#MainContainer .buttons .box').append(new elem('div', {id: 'Submit', classname: 'button -submit', textcontent: HasInput ? (STATEINDEX != PROJECT.Total ? 'Сохранить ответ и перейти к следующему вопросу' : 'Завершить') : 'Продолжить', addevent: 'click'}));

	// --------------------------------------------------------------------------------------------------------------------------
  
	if (RESP.HistoryData) for (let i in RESP.HistoryData) {

		let IEL = document.querySelector('[data-out="' + i + '"]');
		
		if (IEL != null) HistoryDataFill(IEL.type, i, RESP.HistoryData[i].split(','));
		
	}
	
	if (QB.querySelector('[data-position="0"], [data-position="last"]')) QB.querySelector('[data-position="' + (Rows.length > 1 ? 0 : 'last') + '"]').focus();
	
}

function HistoryDataFill(Type, DataOut, DataValue) {
	
	let DataArray;
	
	let Element;
	
	switch (Type) {
		
		case 'text': case 'number': case 'tel': case 'textarea': document.querySelector('[data-out="' + DataOut + '"]').value = DataValue;
		
		break;
		
		case 'select-one':
		
			Element = document.querySelector('[data-out="' + DataOut + '"]');
			
			if (DataValue[0] != '') {	
			
				DataArray = DataValue[0].match(/(?<val>\d+)-?(?<txt>.+)?/);
		
				Element.selectedIndex = DataArray.groups.val;
				
				if (DataArray.groups.txt != null) Element.parentNode.appendChild(new elem('input', {type: 'text', attr: 'required*data-input-variable*data-out=' + DataOut, value: DataArray.groups.txt.replace(/\//g, ',')}));
	
			}
		
		break;
		
		case 'checkbox':
	                
			if (DataValue[0] != '') {	
			
				[].forEach.call(DataValue, function(x) {
					
					DataArray = x.match(/(?<val>\d+)-?(?<txt>.+)?/);
					
					Element = document.querySelector('[data-out="' + DataOut + '"][value="' + DataArray.groups.val + '"]');
					
					Element.checked = true;
					
					if (DataArray.groups.txt != null) Element.parentNode.appendChild(new elem('input', {type: 'text', attr: 'required*data-input-variable*data-out=' + DataOut, value: DataArray.groups.txt.replace(/\//g, ',')}));
					
				});
				
			}
			
		break;
		
		case 'radio':
	                
			if (DataValue[0] != '') {
				
				DataArray = DataValue[0].match(/(?<val>\d+)-?(?<txt>.+)?/);

				Element = document.querySelector('[data-out="' + DataOut + '"][value="' + DataArray.groups.val + '"]');
				
				Element.checked = true;
				
				if (DataArray.groups.txt != null) Element.parentNode.appendChild(new elem('input', {type: 'text', attr: 'required*data-input-variable*data-out=' + DataOut, value: DataArray.groups.txt.replace(/\//g, ',')}));
			
			}
			
		break;
		
	}
	
}

function progressBar(el) {
	
	let delta = Math.round(100 / (+ el.maxLength / el.value.length));
	
	let bg;
	
	switch (el.dataset.progress) {
		
		case 'B':
		
			bg = typeof(el.dataset.progressBg) != 'undefined' ? el.dataset.progressBg : '00ff4d50';
		
			el.style.background = 'linear-gradient(90deg, ' + bg + ' ' + delta + '%, transparent ' + delta + '%, transparent 100%)';
		
		break;
		
		case 'L':
		
			bg = typeof(el.dataset.progressBg) != 'undefined' ? el.dataset.progressBg : '00ff4d80';
		
			document.querySelector('div[data-for="' + el.id + '"]').style.width = delta + '%';
			
			document.querySelector('div[data-for="' + el.id + '"]').style.backgroundColor = bg;
		
		break;
		
	}
	
}

function listener(e) {
	
	let el = e.target;
	
	let A = document.querySelector('#MainContainer .content');
	
	let FD = new FormData();
	
	let Pool;
	
	let LabelContent;
	
	if (A && A.querySelector('[data-error]')) {
		
		document.querySelector('#Submit').removeAttribute('warn');
		
		document.querySelector('#Submit').textContent = 'Сохранить ответ и перейти к следующему вопросу';
		
		[].forEach.call(A.querySelectorAll('[data-error]'), function(x) { x.removeAttribute('data-error') });
		
	}
								 
	switch (e.type) {
		
		case 'change' :
		
			switch (el.type) {
				
				case 'checkbox':
				
					if (el.id == 'NotInList') {

						if (el.checked) document.querySelector('#NotInListTable').classList.remove('hidden');
						
						else document.querySelector('#NotInListTable').classList.add('hidden');
						
						[].forEach.call(document.querySelectorAll('#AuthInputContainer input'), function(x) {
							
							if (el.checked) x.setAttribute('Disabled', '');
							
							else x.removeAttribute('disabled');
							
						});
						
					} else {
						
						if (el.checked) {

							if (el.dataset.only != null) {
								
								Pool = A.querySelectorAll('input, textarea, select, select-one');
							
								[].forEach.call(Pool, function(x) {
							
									if (x != el) switch (x.type) {
										
										case 'checkbox':

											x.checked = false;
										
											if (x.dataset.variable != null) x.parentNode.querySelector('input[data-input-variable]').remove();
										
										break;
										
									}
								
								});
								
							} else {
								
								Pool = A.querySelectorAll('input[data-only]');
								
								[].forEach.call(Pool, function(x) { 

									x.checked = false;
									
									if (x.dataset.variable != null) x.parentNode.querySelector('input[data-input-variable]').remove();

								});
								
							}
							
							if (el.dataset.variable != null) {
								
								let VariableElement = el.parentNode.appendChild(new elem('input', {type: 'text', attr: 'required*data-input-variable*data-out=' + el.dataset.out}));
								
								VariableElement.focus();
								
							}
		
						} else if (el.dataset.variable != null) el.parentNode.querySelector('input[data-input-variable]').remove();

					}

				break;
				
				case 'radio':

					if (el.dataset.variable != null) {
						
						let VariableElement = el.parentNode.appendChild(new elem('input', {type: 'text', attr: 'required*data-input-variable*data-out=' + el.dataset.out}));
							
						VariableElement.focus();
	
					} else A.querySelector('input[data-out="' + el.dataset.out + '"][data-input-variable]') && A.querySelector('input[data-out="' + el.dataset.out + '"][data-input-variable]').remove();
					
					if (el.dataset.only != null) {
						
						Pool = A.querySelectorAll('input, textarea, select, select-one');
						
						[].forEach.call(Pool, function(x) {
							
							if (x != el) switch (x.type) {
								
								case 'checkbox':

									x.checked = false;
								
									if (x.dataset.variable != null) x.parentNode.querySelector('input[data-input-variable]').remove();
								
								break;
								
								case 'text': case 'number': case 'tel': case 'textarea':
											
									x.value = '';
									
									x.setAttribute('data-not-required', '');
								
								break;
								
							}
						
						});
						
					}

					//if (el.dataset.cancelEvent == null && el.dataset.prompt == null) document.querySelector('#Submit').click();

				break;

				case 'select': case 'select-one':
				
					if (el.dataset.variable != null) {
				
						if (el.selectedIndex == el.dataset.variable) {
							
							let VariableElement = el.parentNode.appendChild(new elem('input', {type: 'text', attr: 'required*data-input-variable'}));
							
							VariableElement.focus();

						} else el.parentNode.querySelector('input[data-input-variable]') && el.parentNode.querySelector('input[data-input-variable]').remove();
	
					}
					
				break;
				
			}
		
		break;
		
		case 'input':
		
			switch (el.type) {
				
				case 'tel': mask(el);
				
				break
				
			}
		
		break;

		case 'keyup':
		
			let OnlyCheck = A.querySelector('input[data-only]:checked');
			
			if (OnlyCheck) {

				OnlyCheck.checked = false;
				
				el.removeAttribute('data-not-required');
				
			}
		
			if (el.type != 'textarea' && /Enter|NumpadEnter/.test(e.code)) {
				
				if (el.dataset.position != 'last') document.querySelector('input[data-position][id="' + (+ el.id + 1) + '"]').focus();
				
				else document.querySelector('#Submit').click();
				
			} else switch (el.type) {
				
				case 'number':
				
					if (el.value && ! /^0.+|\D/g.test(el.value)) {
				
						el.hasAttribute('min') && (el.value < + el.min && (el.value = el.value.substr(0, el.value.length - 1)));
						
						el.hasAttribute('max') && (el.value > + el.max && (el.value = el.value.substr(0, el.value.length - 1)));
						
					} else el.value = '';

				break;
				
				case 'text':
				
					el.value = el.value.replace(/[\/\\`~^]/g, '');
				
					if (el.dataset.maxLength != 'undefined' && el.value.length > + el.dataset.maxLength) el.value = el.value.substr(0, el.dataset.maxLength);
					
					if (el.dataset.except != 'undefined') el.value = el.value.replace(el.dataset.except, '');
					
					if (el.dataset.progress != 'undefined' && el.dataset.maxLength != 'undefined') progressBar(el);

				break;

			}
		
		break;
		
		case 'blur':
		
			switch (el.name) {
				
				case '1':
				
					let WorkValue1 = el.value.trim();
				
					if (BASELOGIN[1].Name != WorkValue1) {

						BASELOGIN[1].Name = WorkValue1;
						
						document.querySelector('#Login2 input').value = '';
						
						let DependList = document.querySelector('#Login2 datalist');
						
						Cleaner(DependList);
						
						BASELOGIN[2].Data = [];
						
						if (WorkValue1 != '' && BASELOGIN[1].Data.includes(WorkValue1)) {

							[].forEach.call(BASEDATA.FieldData[WorkValue1], function(y) {

								DependList.append(new elem('option', {value: y}));
								
								BASELOGIN[2].Data.push(y);
								
							});
							
						} else for (let d in BASEDATA.FieldData) [].forEach.call(BASEDATA.FieldData[d], function(y) {
	
							DependList.append(new elem('option', {value: y}));
							
							BASELOGIN[2].Data.push(y);
										
						});
						
					}
				
				break;
				
				case '2':
				
					let WorkValue2 = el.value.trim();
					
					if (BASELOGIN[2].Name != WorkValue2 && document.querySelector('#Login1 input').value == '') if (BASELOGIN[2].Data.includes(WorkValue2)) {
						
						BASELOGIN[2].Name = WorkValue2;
						
						for (let i in BASEDATA.FieldData) if (BASEDATA.FieldData[i].includes(WorkValue2)) {
						
							document.querySelector('#Login1 input').value = i;
							
							BASELOGIN[1].Name = i;
								
							break;
								
						}
						
					}
				
				break;
				
			}

		break;
		
		case 'click':
		
			if (! el.hasAttribute('id')) while ((el = el.parentNode) && ! el.hasAttribute('id'));
		
			switch (el.id) {
				
				case 'Submit':
				
					if (Object.keys(DATACOMPLETED).length) {
					
						let E = false;
						
						let WorkSet;

						for (let i in DATACOMPLETED) DATACOMPLETED[i][1] = [];
						
						for (let i in DATACOMPLETED) {
							
							switch (DATACOMPLETED[i][0]) {
								
								case 'checkbox':
								
									WorkSet = A.querySelectorAll('[data-out="' + i + '"]');

									E = VALID.Check(WorkSet);
									
									if (E && typeof(E[0]) != 'string') {
										
										[].forEach.call(E, function(x) {
											
											LabelContent = x.parentNode.querySelector('label').textContent;
											
											if (x.dataset.variable != null) {
												
												DATACOMPLETED[i][1].push(x.value + '-' + x.parentNode.querySelector('input[data-input-variable]').value.replace(/,/g, '/').trim());

											} else {
												
												DATACOMPLETED[i][1].push(x.value + (x.dataset.autoFill != null || x.dataset.throw != null ? '-' + LabelContent : ''));
												
												DATACOMPLETED[i][2] = LabelContent;
												
											}
											
										});
										
										E = false;
	
									}

								break;
								
								case 'radio':
								
									WorkSet = A.querySelectorAll('[data-out="' + i + '"]');
									
									let RadioValue = '';
									
									E = VALID.Check(WorkSet);
									
									if (E && typeof(E[0]) != 'string') {
										
										if (E[0].dataset.variable != null) {
	
											RadioValue = E[0].value + '-' + E[0].parentNode.querySelector('input[data-input-variable]').value.replace(/,/g, '/').trim();
	
										} else RadioValue = E[0].value;
										
										if (RadioValue != '') {
											
											LabelContent = E[0].parentNode.querySelector('label').textContent;

											DATACOMPLETED[i][1].push(RadioValue + (E[0].dataset.autoFill != null || E[0].dataset.throw != null ? '-' + LabelContent : ''));
											
											DATACOMPLETED[i][2] = LabelContent;
											
											E = false;
											
										}
										
									}

								break;

								case 'text': case 'number': case 'tel': case 'textarea':
								
									WorkSet = A.querySelector('[data-out="' + i + '"]');
									
									E = VALID.Check(WorkSet);
									
									if (! E) {
										
										if (WorkSet.hasAttribute('disabled') || WorkSet.hasAttribute('data-not-required') || WorkSet.hasAttribute('data-default')) {
											
											if (WorkSet.hasAttribute('data-default')) DATACOMPLETED[i][1].push(WorkSet.dataset.default);
											
											else DATACOMPLETED[i][1].push('');
										
										} else DATACOMPLETED[i][1].push(WorkSet.value);
										
									}
								
								break;
								
								case 'file':
									
									WorkSet = A.querySelector('input[type="file"]');
									
									if (WorkSet.files.length) {
										
										[].forEach.call(WorkSet.files, function(x) { DATACOMPLETED[i][1].push(x.name); });

									} 
									
								break;

								case 'select':
								
									WorkSet = A.querySelector('[data-out="' + i + '"]');
									
									if (WorkSet.hasAttribute('data-not-required') || WorkSet.selectedIndex > 0) {
										
										if (WorkSet.dataset.variable != null) {
											
											if (WorkSet.selectedIndex == WorkSet.dataset.variable) {
												
												let SelectText = WorkSet.parentNode.querySelector('input[data-input-variable]').value.replace(/,/g, '/').trim();
	
												if (SelectText != '') {
													
													DATACOMPLETED[i][1].push(WorkSet.selectedIndex + '-' + SelectText);
													
													DATACOMPLETED[i][2] = WorkSet.querySelector('option:nth-child(' + (WorkSet.selectedIndex + 1) + ')').value;
													
												} else E = ['Выделенное поле заполнено некорректно.<br>Необходимо заполнить это поле.', [WorkSet]];	
												
											} else {
												
												DATACOMPLETED[i][1].push(WorkSet.selectedIndex);
												
												DATACOMPLETED[i][2] = WorkSet.querySelector('option:nth-child(' + (WorkSet.selectedIndex + 1) + ')').value;
												
											}
											
										} else if (! WorkSet.hasAttribute('data-not-required')) {
											
											DATACOMPLETED[i][1].push(WorkSet.selectedIndex);
											
											DATACOMPLETED[i][2] = WorkSet.querySelector('option:nth-child(' + (WorkSet.selectedIndex + 1) + ')').value;
											
										}
										
									} else E = ['Выделенное поле заполнено некорректно.<br>Необходимо выбрать в этом поле.', [WorkSet]];
								
								break;
								
								case 'NODATA': DATACOMPLETED[i][1].push('');
								
								break;
								
								default: DATACOMPLETED[i][1].push(A.querySelector('[data-out="' + i + '"]').value);
								
								break;
								
							}
							
							if (E) break;
							
						}
						
						if (! E && TRACKER.length) {
							
							WorkSet = [];
							
							[].forEach.call(TRACKER, function(x) { WorkSet.push(document.querySelector('img[data-track-number="' + x + '"')) });
							
							E = ['Необходимо просмотреть все изображения.', WorkSet];
							
						}

						if (E) { 
						
							// Подсветка ошибки ---------------------------------------------------------------------------------

							let Offset;
							
							[].forEach.call(E[1], function(x, i) {
								
								x.parentElement.setAttribute('data-error', '');
								
								i == 0 && (Offset = x.offsetTop);
								
							});
							
							if (Offset < document.querySelector('#MainContainer').scrollTop) document.querySelector('#MainContainer').scrollTop = 0 + 'px';

							document.querySelector('#Submit').setAttribute('warn', '');
								
							document.querySelector('#Submit').innerHTML = E[0];

						} else { 
						
							// Отправка вопроса ---------------------------------------------------------------------------------
							
							if (CANSEND) {
								
								CANSEND = false;
								
								FD.append('ProjectId', PROJECT.id);
								
								FD.append('ProjectLimiting', PROJECT.Limiting);
								
								FD.append('UserId', UID);
								
								FD.append('StateIndex', STATEINDEX);
								
								FD.append('SeparateIndex', SEPARATEINDEX);
								
								if (SEPARATE && SEPARATEINDEX < LASTSEPARATE) FD.append('Separate', true);
								
								FD.append('AuthType', PROJECT.AuthType);	
								
								if (JF && + STATEINDEX >= + JF) FD.append('JournalIndex', JOURNALINDEX);
								
								FD.append('Total', PROJECT.Total);
								
								if (HISTORY) FD.append('HistoryState', JSON.stringify(HIO));
								
								if (JF && STATEINDEX == JL) FD.append('JournalState', (JOURNALINDEX == JC ? 'END' : JF));

								if (RULES.DIRECT && RULES.DIRECT.includes(STATEINDEX)) FD.append('DirectRule', true);
								
								if (LIMIT && LIMIT.includes(STATEINDEX)) FD.append('Limit', true);
								
								if (RULES.AUTOFILL && RULES.AUTOFILL.includes(STATEINDEX)) FD.append('AutoFill', true);

								let VIEWCONTENT = {};
								
								for (let i in DATACOMPLETED) {

									if (VIEW != null && VIEW.hasOwnProperty(i)) {
										
										let InputData = DATACOMPLETED[i][1][0].toString().match(/^(?<number>\d+)-?(?<text>.+)?/);
										
										VIEWCONTENT[VIEW[i]] = DATACOMPLETED[i][0] == 'select' || DATACOMPLETED[i][0] == 'radio' ? (InputData.groups.text == null ? '[' + DATACOMPLETED[i][1][0] + ']' + DATACOMPLETED[i][2] : InputData.groups.text) : DATACOMPLETED[i][1][0];
										
									}

									FD.append(i, DATACOMPLETED[i][1]);
									
								}

								if (Object.keys(VIEWCONTENT).length) FD.append('ViewContent', JSON.stringify(VIEWCONTENT));
										  
								DATACOMPLETED = {};
								
								PTDATA = {};
								
								TRACKER = [];
								
								el.textContent = '';
								
								Pre(el);
								
								SendRequest('Public/Php/Write.php', FD);
								
							}
							
						}
					
					}

				break;

				case 'LoginSubmit':
				
					if (CANSEND) {
		
						let AuthData = '';
						
						let AuthHash;
						
						let Input;
						
						let InputValue;
						
						let AuthError = false;

						switch (PROJECT.AuthType) {
							
							case '0':
							
								Input = document.querySelector('#Login input');
							
								InputValue = Input.value.trim();
								
								switch (Input.type) {
									
									case 'tel':
									
										if (/^\+\d\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(InputValue)) AuthData = InputValue;
								
										else AuthError = true;
									
									break;
									
									default:
									
										if (InputValue) AuthData = InputValue;
								
										else AuthError = true;
									
									break;
									
								}
							
							break;
							
							case '1':
							
								for (let i = 1; i <= + PROJECT.AuthData; i ++) {
									
									InputValue = document.querySelector('#Login' + i + ' input').value.trim();

									if (InputValue && BASELOGIN[i].Data.includes(InputValue)) AuthData += (AuthData != '' ? ', ' : '') + InputValue;
									
									else AuthError = true;
									
								}
							
							break;
							
						}
						
						if (PROJECT.AuthProtect == 'password' && ! AuthError) {
							
							InputValue = document.querySelector('#Password input').value.trim();
							
							if (InputValue) AuthHash = md5(InputValue);
								
							else AuthError = true;
							
						}

						if (AuthError === false) {

							FD.append('AuthData', AuthData);
							
							FD.append('AuthType', PROJECT.AuthType);
							
							if (PROJECT.AuthProtect == 'password') FD.append('AuthHash', AuthHash);

							FD.append('ProjectId', PROJECT.id);
							
							if (LIMIT && LIMIT.includes('0')) FD.append('Limit', true);
							
							if (Object.keys(VIEW).length) {
								
								let ViewData = []
								
								for (let v in VIEW) if (/BASE/.test(v)) ViewData.push(VIEW[v]);
								
								if (ViewData.length) FD.append('View', JSON.stringify(ViewData));
	
							}
							
							el.querySelector('div').classList.add('hidden');
							
							Pre(el);
							
							CANSEND = false;
							
							SendRequest('Public/Php/Start.php', FD);
							
						} else CreateDialog('AuthError');
					
					}

			    break;			   
			    
				case 'Back':

					if (CANSEND) {
						
						DATACOMPLETED = {};
						
						PTDATA = {};
						
						TRACKER = [];
						
						CANSEND = false;
						
						FD.append('ProjectId', PROJECT.id);
						
						FD.append('UserId', UID);
						
						if (JF && + STATEINDEX >= + JF) FD.append('JournalIndex', JOURNALINDEX);

						let IndexInHistory = HIO.indexOf(STATEINDEX);
						
						let StepBack = '';
						
						let HI = 0;
						
						let Last = true;
						
						if (IndexInHistory == -1) {
							
							for (HI in HIO) if (+ HIO[HI] > + STATEINDEX) {
								
								Last = false;
								
								break;
								
							}
							
							StepBack = HIO[HI - (Last ? 0 : 1)];
							
						} else StepBack = HIO[IndexInHistory - 1];
						
						FD.append('HistoryIndex', StepBack);
						
						FD.append('SeparateIndex', SEPARATEINDEX);

						if (SEPARATE && SEPARATEINDEX > 1) {
							
							FD.append('Separate', true);
							
							FD.append('StateIndex', STATEINDEX);
							
						}
						
						el.textContent = '';
								
						Pre(el);
						
						SendRequest('Public/Php/Back.php', FD);
						
					}

				break;
				
				case 'Img':
				
					if (el.parentNode.className != 'img-container') {

						PARENT = el.parentNode;
						
						let ImgContainer = new elem('div', {classname: 'img-container'});
						
						el.classList.add('big');
						
						ImgContainer.appendChild(el);

						document.querySelector('body').append(ImgContainer);
						
						if (el.dataset.track != null && TRACKER.includes(el.dataset.trackNumber)) {
							
							let TrackIndex = TRACKER.indexOf(el.dataset.trackNumber);
							
							TRACKER.splice(TrackIndex, 1);
							
						}
					
					} else {
						
						el.classList.remove('big');
						
						PARENT.appendChild(el);
						
						document.querySelector('.img-container').remove();

					}
				
				break;
				
				case 'BigImage':
				
					document.querySelector('.img-container').remove();
				
				break;

			}
		
		break;
		
	}
	
}

function GetProgress(x) {
    
    switch (PROJECT.Progress) {
        
        case 'N': return x + '/' + (PROJECT.Total - 1);
        
        break;
        
        case 'P': return Math.round(100 / ((PROJECT.Total - 1) / x)) + '%'; 

        break;
        
    }
    
}

function errorHandler(err){
    
    let msg = 'An error occured: ';
 
    switch (err.code) {
      
        case 1: case 8:
            
            msg += 'File or directory not found';
            
        break;
         
        case 4:
            
            msg += 'File or directory not readable';
            
        break;
         
        case 12:
        
            msg += 'File or directory already exists';
            
        break;
         
        case 11:
            
            msg += 'Invalid filetype';
            
        break;
         
        default:
        
            msg += 'Unknown Error ' + err.code;
            
        break;
 
    };
 
 console.log(msg);
 
};

function TextProcessing(text) {
	
	let TextHLT = [...text.matchAll(/(?<Replace>\{(?<Hlt>[^\}]+)\})/g)];
	
	if (TextHLT.length > 0) [].forEach.call(TextHLT, function(x) {
		
		text = text.replace(x.groups.Replace, '<r class="hlt">' + x.groups.Hlt + '</r>');
		
	});
	
	let SpecialChar = text.match(/^.*(?<Replace>\$(?<Var>.+)\$).*/m);
	
	if (SpecialChar != null) {
		
		let RDResponse = RULESDATA[SpecialChar.groups.Var].ResponseData[0].QResponse;
			
		let RDRaw = RULESDATA[SpecialChar.groups.Var].ResponseData[0].QRaw;
			
		let RDS = RDResponse.match(/^Друг(ое$|ие$|ая$|ой$)|\[(t|n)\]/);
			
		text = text.replaceAll(SpecialChar.groups.Replace, (RDS ? RDRaw : RDResponse));
		
	}
	
	let SpecialCharEqual = text.match(/^.*(?<Replace>#(?<Var>.+)#).*/m);

	if (SpecialCharEqual != null) text = text.replaceAll(SpecialCharEqual.groups.Replace, (100 - RULESDATA[SpecialCharEqual.groups.Var].ResponseData[0].QResponse));
	
	let ExternalText = text.match(/(?<Replace>~(?<Hlt>[^~]+)~)/m);
	
	if (ExternalText != null) {
		
		text = text.replace(ExternalText.groups.Replace, '');
		
		document.querySelector('#MainContainer .allocate').append(new elem('div', {textcontent: ExternalText.groups.Hlt}));
	
		document.querySelector('#MainContainer .allocate').classList.remove('hidden');
		
	}
	
	return text;
	
}

function $_GET(key) {
	
    let p = window.location.search;
	
    p = p.match(new RegExp(key + '=([^&=]+)'));
	
    return p ? p[1] : false;
	
}