// расширение наследуется от Autodesk.Viewing.Extension
// создаем конструктор, определяем методы load, unload.

class HandleSelectionExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('HandleSelectionExtension has been loaded');
        return true;
    }

    unload() {
        // Очистите наши элементы пользовательского интерфейса, если мы добавили 
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('HandleSelectionExtension has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        // Создайте новую группу панелей инструментов, если она не существует
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        // Добавить новую кнопку в группу панелей инструментов
        this._button = new Autodesk.Viewing.UI.Button('handleSelectionExtensionButton');
        this._button.onClick = (ev) => {
            // Execute an action here.Выполните действие здесь
            // Get current selection.Получить текущий выбор
            const selection = this.viewer.getSelection();
            this.viewer.clearSelection();
            // Anything selected? Что-нибудь выбрано?
            if (selection.length > 0) {
                let isolated = [];
                // Iterate through the list of selected dbIds.Перебирать список выбранных dbId
                selection.forEach((dbId) => {
                    // Get properties of each dbId.Получить свойства каждого dbId
                    this.viewer.getProperties(dbId, (props) => {
                        // Output properties to console.Вывод свойств в консоль
                        console.log(props);
                        // Ask if want to isolate.Спросите, хотите ли вы изолировать
                        if (confirm(`Isolate ${props.name} (${props.externalId})?`)) {
                            isolated.push(dbId);
                            this.viewer.isolate(isolated);
                        }
                    });
                });
            } else {
                // If nothing selected, restore.Если ничего не выбрано, восстановить
                this.viewer.isolate(0);
            }

        };
        this._button.setToolTip('Handle Selection Extension');
        this._button.addClass('handleSelectionExtensionIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);