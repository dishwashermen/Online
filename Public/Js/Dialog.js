let dialogData = {
	
	'AuthError': {
		
		DialogType: 'confirm',
		
		Position: 'bottom',
				
		TitleText: 'Не заполнены или некорректно заполнены данные для авторизации'
		
	},
	
	'LoginError': {
		
		DialogType: 'confirm',
		
		Position: 'bottom',
				
		TitleText: 'Запрос на вход отклонён'
		
	},
	
	'StartLimit': {
		
		DialogType: 'confirm',
		
		Position: 'bottom',
				
		TitleText: 'Лимит исчерпан'
		
	},
	
	'SinglePrompt': {
		
		DialogType: 'prompt',
		
		TrueButtonText: 'Записать',
				
		FalseButtonText: 'Отмена',
		
		TitleText: 'Впишите ответ'
		
	}
	
}

class Dialog {

	constructor({

		TitleText,

		TrueButtonText, 
		
		FalseButtonText, 
		
		ExtButtonText, 
		
		Parent,
		
		Position,
		
		DialogType,
		
		Custom
		
	}) {
		
		this.DialogType = DialogType || '';
		
		this.TitleText = TitleText || '';

		this.TrueButtonText = TrueButtonText || 'ОК';
		
		this.FalseButtonText = FalseButtonText || '';
		
		this.ExtButtonText = ExtButtonText || '';
		
		this.Custom = Custom || '';
		
		this.Parent = Parent || document.body;
		
		this.Position = Position || 'center';

		this.Dialog = undefined;
		
		this.TrueButton = undefined;
		
		this.FalseButton = undefined;

		if (this.DialogType == 'confirm') this._createConfirmDialog();
		
		if (this.DialogType == 'prompt') this._createPromptDialog();
		
		if (this.DialogType == 'custom') this._createCustomDialog();
		
		this._appendDialog();
	
	}

	confirm() {
	  
		return new Promise((resolve, reject) => {
			
			const somethingWentWrongUponCreation = ! this.Dialog || ! this.TrueButton || ! this.FalseButton;
		  
			if (somethingWentWrongUponCreation) {
			  
				reject('Someting went wrong when creating the modal');
			
				return;
			
			}

			this.Dialog.showModal();

			this.TrueButton.addEventListener('click', () => {
				
				if (this.Custom) resolve(this.Custom.querySelector('input') || true);
			  
				else resolve(this.PromptInput || true);
			
				this._destroy();
			
			});

			this.FalseButton.addEventListener('click', () => {
			  
				resolve(false);
			
				this._destroy();
			
			});
			
			this.extButton.addEventListener('click', () => {
			  
				resolve('ext');
			
				this._destroy();
			
			});
		  
		});
	
	}

	_createConfirmDialog() {
	  
		this.Dialog = elem('Dialog', {classname: this.Position + '-dialog'});

		this.Title = elem('div', {classname: 'dialog-title', innerhtml: this.TitleText});
		
		this.Dialog.appendChild(this.Title);

		const buttonGroup = elem('div', {classname: 'dialog-button-group'});
		
		this.Dialog.appendChild(buttonGroup);
		
		this.extButton = elem('button', {classname: 'dialog-button dialog-button--ext', type: 'button', textcontent: this.ExtButtonText});
		
		this.ExtButtonText && buttonGroup.appendChild(this.extButton);
		
		//this.divider1 = elem('span', {classname: 'dialog-divider'});
		
		//buttonGroup.appendChild(this.divider1);

		this.FalseButton = elem('button', {classname: 'dialog-button dialog-button--false', type: 'button', textcontent: this.FalseButtonText});
		
		this.FalseButtonText && buttonGroup.appendChild(this.FalseButton);
		
		//this.divider2 = elem('span', {classname: 'dialog-divider'});
		
		//buttonGroup.appendChild(this.divider2);
		
		this.TrueButton = elem('button', {classname: 'dialog-button dialog-button--true', type: 'button', textcontent: this.TrueButtonText});
		
		buttonGroup.appendChild(this.TrueButton);

	}
	
	_createPromptDialog() {
	  
		this.Dialog = elem('Dialog', {classname: this.Position + '-dialog'});

		this.Title = elem('div', {classname: 'dialog-title', innerhtml: this.TitleText});
		
		this.Dialog.appendChild(this.Title);
		
		this.PromptInput = elem('textarea', {classname: 'dialog-textarea'});
		
		this.Dialog.appendChild(this.PromptInput);

		const buttonGroup = elem('div', {classname: 'dialog-button-group'});
		
		this.Dialog.appendChild(buttonGroup);
		
		this.extButton = elem('button', {classname: 'dialog-button dialog-button--ext', type: 'button', textcontent: this.ExtButtonText});
		
		this.ExtButtonText && buttonGroup.appendChild(this.extButton);
		
		//this.divider1 = elem('span', {classname: 'dialog-divider'});
		
		//buttonGroup.appendChild(this.divider1);

		this.FalseButton = elem('button', {classname: 'dialog-button dialog-button--false', type: 'button', textcontent: this.FalseButtonText});
		
		this.FalseButtonText && buttonGroup.appendChild(this.FalseButton);
		
		//this.divider2 = elem('span', {classname: 'dialog-divider'});
		
		//buttonGroup.appendChild(this.divider2);
		
		this.TrueButton = elem('button', {classname: 'dialog-button dialog-button--true', type: 'button', textcontent: this.TrueButtonText});
		
		buttonGroup.appendChild(this.TrueButton);
		
		this.PromptInput.focus();

	}
	
	_createCustomDialog() {
	  
		this.Dialog = elem('Dialog', {classname: this.Position + '-dialog'});

		this.Title = elem('div', {classname: 'dialog-title', innerhtml: this.TitleText});
		
		this.TitleText && this.Dialog.appendChild(this.Title);
		
		this.Dialog.appendChild(this.Custom);

		this.Custom.classList.remove('hidden');

		this.Dialog.appendChild(this.Custom);

		const buttonGroup = elem('div', {classname: 'dialog-button-group'});
		
		this.Dialog.appendChild(buttonGroup);
		
		this.extButton = elem('button', {classname: 'dialog-button dialog-button--ext', type: 'button', textcontent: this.ExtButtonText});
		
		this.ExtButtonText && buttonGroup.appendChild(this.extButton);
		
		//this.divider1 = elem('span', {classname: 'dialog-divider'});
		
		//buttonGroup.appendChild(this.divider1);

		this.FalseButton = elem('button', {classname: 'dialog-button dialog-button--false', type: 'button', textcontent: this.FalseButtonText});
		
		this.FalseButtonText && buttonGroup.appendChild(this.FalseButton);
		
		//this.divider2 = elem('span', {classname: 'dialog-divider'});
		
		//buttonGroup.appendChild(this.divider2);
		
		this.TrueButton = elem('button', {classname: 'dialog-button dialog-button--true', type: 'button', textcontent: this.TrueButtonText});
		
		buttonGroup.appendChild(this.TrueButton);
		
		if (this.Custom.querySelector('input')) this.Custom.querySelector('input').addEventListener('keyup', (e) => {
			
			if (/Enter|NumpadEnter/.test(e.code)) this.TrueButton.click();
			
		});

	}

	_appendDialog() {
		  
		this.Parent.appendChild(this.Dialog);
		
	}

	_destroy() {
	  
		this.Parent.removeChild(this.Dialog);
		
		delete this;
	
	}
  
}


async function CreateDialog(type, position = false, custom = false, trb = false, flb = 'Отмена', title = false, ext = false) {

	switch (type) {

		case 'AuthError': case 'LoginError': case 'StartLimit':
		
			const SomeDialog = new Dialog(dialogData[type]);
			
			await SomeDialog.confirm();
		
		break;
		
		case 'SinglePrompt':
		
			const SinglePromptDialog = new Dialog(dialogData[type]);
			
			PROMPTRESULT = await SinglePromptDialog.confirm();
		
		break;
		
		case 'ModalDialog':
		
			const ModalDialog = new Dialog({DialogType: 'confirm', 'QuestionText': data});
			
			await ModalDialog.confirm();
		
		break;

	}
	
}

