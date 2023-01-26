VALID = {

	Limit: function(el) {

		let Pool = document.querySelectorAll('.content input[data-limit]:valid:not([data-not-required])');

		return el.dataset.limit == Pool.length ? true : ['Выделенные поля заполнены некорректно.<br>Количество полей для заполнения: ' + el.dataset.limit + '.', Pool];

	},

	Trigger: function(el) {

		let Pool = document.querySelectorAll('.content input[data-target]:not([data-not-required])');

		switch (Pool[0].dataset.target) {

			case 'disable':

				[].forEach.call(Pool, function(TPV) {

					if (el.dataset.triggerMatch.split(',').includes(el.value)) {

						TPV.setAttribute('disabled', '');

						TPV.value = '';

					} else TPV.removeAttribute('disabled');

				});

			break;

		}

	},

	MinMax: function(el) {

		let MinMaxTest = true;
		
		if (el.type == 'number') {

			el.hasAttribute('max') && (MinMaxTest = el.value <= + el.max);

			(el.hasAttribute('min') && MinMaxTest) && (MinMaxTest = el.value >= + el.min);
			
		}

		return MinMaxTest || ['Выделенное поле заполнено некорректно.<br>Минимальное значение: ' + el.min + '.<br>Максимальное значение: ' + el.max + '.', [el]];

	},

	Total: function(el, Direct) {

		let Pool = document.querySelectorAll('.content input[data-total]:not([data-not-required])');

		let Total = + el.dataset.total;
		
		let Remains = 0;

		[].forEach.call(Pool, function(TPV) {
			
			let Value;
			
			switch (TPV.type) {
				
				case 'checkbox': case 'radio': Value = TPV.parentNode.lastChild.value;
				
				break;
				
				case 'number': Value = TPV.value;
				
				break;
				
				case 'text': 
				
					if (TPV.value) {
						
						Value = TPV.value.match(/\d+/);
						
						Value = Value == null ? 0 : Value[0];
						
					} else Value = 0;
	
				break;
				
			}

			Total -= + Value;
			
			Remains += + Value;
			
		});

		return Total == 0 ? true : ['Выделенные поля заполнены некорректно.<br>Введённая сумма значений равна: ' + Remains + '.<br>Сумма значений по этим полям должна быть равна: ' + el.dataset.total + '.', Pool];

	},

	Unique: function(el, Direct) {

		let Pool = document.querySelectorAll('.content input[data-unique]:not([data-not-required])');

		let UE = true;

		[].forEach.call(Pool, function(UPV) { if (el.id != UPV.id && el.value == UPV.value && el.value > 0) UE = false; });

		return UE ? true : ['Выделенные поля заполнены некорректно.<br>Эти поля не должны содержать совпадающих значений.', Pool];

	},

	Most: function(el, Direct) {

		let Pool = document.querySelectorAll('.content input:not([data-most][data-not-required])');

		let MostValue = + el.value;

		[].forEach.call(Pool, function(MPV) {

			MostValue -= + MPV.value;

		});

		return MostValue >= 0 ? true : ['Выделенные поля заполнены некорректно.<br>Значение первого поля не должно быть меньше суммы значений остальных полей.', Pool];

	},

	Amount: function(el, Direct) {

		let Pool = document.querySelectorAll('.content input[data-amount]:not([data-not-required])');

		let Amount = + el.dataset.amount;

		[].forEach.call(Pool, function(APV) { Amount -= + APV.value });

		return Amount >= 0 ? true : ['Выделенные поля заполнены некорректно.<br>Сумма значений по этим полям не должна превышать: ' + el.dataset.amount + '.', Pool];

	},

	Least: function(el, Direct) {

		let Pool = document.querySelectorAll('.content input[data-least]:not([data-not-required])');

		let Least = + el.dataset.least;

		[].forEach.call(Pool, function(LPV) { Least -= + LPV.value });

		return Least <= 0 ? true : ['Выделенные поля заполнены некорректно.<br>Сумма значений по этим полям должна быть равна или превышать: ' + el.dataset.least + '.', Pool];

	},

	Decrement: function(el, Direct) {

		let DE = true;

		let Pool = document.querySelectorAll('.content input[data-decrement]:not([data-not-required])');

		[].forEach.call(Pool, function(d, i) {

			if (i > 0 && + Pool[i - 1].value < + d.value) DE = ['Выделенное поле заполнено некорректно<br>Значение этого поля должно быть менее или равно значению предыдущего.', Pool];

		});

		return DE;

	},

	Available: function(el) {

		let AE = true;

		if (el.value.trim() != '') {
			
			switch (el.type) {
				
				case 'text':

					if (el.dataset.maxLength != null && el.value.length > + el.dataset.maxLength) AE = ['Выделенное поле заполнено некорректно<br>Максимальное количество символов - ' + el.dataset.maxLength + '.', [el]];
					
				break;
				
				case 'number':
				
					if (/^$|^0.+$|\D+/g.test(el.value)) AE = ['Выделенное поле заполнено некорректно<br>Необходимо заполнить это поле.', [el]];
				
				break;
				
				case 'tel':
				
					if (/_/.test(el.value)) AE = ['Выделенное поле заполнено некорректно<br>Необходимо заполнить это поле.', [el]];
				
				break;
			
			}

		} else if (el.dataset.notRequired == null && el.dataset.default == null && el.dataset.disabled == null) AE = ['Выделенное поле заполнено некорректно<br>Необходимо заполнить это поле.', [el]];

		return AE;

	},

	Checked: function(set) {

		let Result = [];

		let Unchecked = false;

		[].forEach.call(set, function(x) {

			if (x.checked) {

				Result.push(x);

			} else if (x.dataset.notRequired == null && x.dataset.only == null) Unchecked = true;

		});

		return Result.length ? Result : (Unchecked ? false : true);

	},

	Check: function(el, action = false) {

		let Result = true;

		let Elements;

		if (action) {

			switch (action) {

				case 'MinMax': Result = this.MinMax(el);

				break;

				case 'Total': Result = this.Total(el);

				break;

				case 'Decrement': Result = this.Decrement(el);

				break;

				case 'Limit': Result = this.Limit(el);

				break;

			}

		} else {

			switch (el.type || el[0].type) {

				case 'text': case 'number': case 'tel': case 'textarea':

					Result = this.Available(el);

					if (Result !== true) break;

					if (el.min || el.max) Result = this.MinMax(el);

					if (Result !== true) break;

					if (el.dataset.limit) Result = this.Limit(el);

					if (Result !== true) break;

					if (el.dataset.total) Result = this.Total(el);

					if (Result !== true) break;

					if (typeof(el.dataset.decrement) != 'undefined') Result = this.Decrement(el);

					if (Result !== true) break;

					if (el.dataset.amount) Result = this.Amount(el);

					if (Result !== true) break;

					if (el.dataset.least) Result = this.Least(el);

					if (Result !== true) break;

					if (typeof(el.dataset.unique) != 'undefined') Result = this.Unique(el);

					if (Result !== true) break;

					if (typeof(el.dataset.most) != 'undefined') Result = this.Most(el);

					if (Result !== true) break;

				break;

				case 'radio':

					Elements = this.Checked(el);

					Result = Elements === false ? ['Выделенные поля заполнены некорректно.<br>Необходимо отметить один вариант.', el] : Elements;

				break;

				case 'checkbox':

					Elements = this.Checked(el);

					if (Elements !== false) {

						if (Elements !== true) {

							if (Elements[0].dataset.equal != null) {
								
								if (+ Elements[0].dataset.equal != Elements.length) {
									
									if (Elements.length == 1 && Elements[0].dataset.only != null) {
										
										Result = Elements;
										
									} else Result = ['Выделенные поля заполнены некорректно.<br>Необходимо отметить указанное количество вариантов: ' + Elements[0].dataset.equal + '.', el];
									
								} else Result = Elements;

							} else if (Elements[0].dataset.min != null) {

								Result = + Elements[0].dataset.min <= Elements.length ? Elements : ['Выделенные поля заполнены некорректно.<br>Минимальное количество вариантов: ' + Elements[0].dataset.min + '.', el];

							} else if (Elements[0].dataset.max != null) {

								Result = + Elements[0].dataset.max >= Elements.length ? Elements : ['Выделенные поля заполнены некорректно.<br>Максимальное количество вариантов: ' + Elements[0].dataset.max + '.', el];
								
							} else Result = Elements;

						} else Result = true;

					} else Result = ['Выделенные поля заполнены некорректно.<br>Необходимо отметить один или несколько вариантов.', el];

				break;

			}

		}

		return Result === true ? false : Result;

	}

}