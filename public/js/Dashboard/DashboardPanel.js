// Dashboard panel base.Основание панели приборов
class DashboardPanel {
    load(parentDivId, divId, viewer) {
        this.divId = divId;
        this.viewer = viewer;
        $('#' + parentDivId).append('<div id="' + divId + '" class="dashboardPanel"></div>');
    }
}

// Dashboard panels for charts.Панели инструментов для графиков
class DashboardPanelChart extends DashboardPanel {
    load(parentDivId, divId, viewer, modelData) {
        if (!modelData.hasProperty(this.propertyToUse)){
            alert('This model does not contain a ' + this.propertyToUse +' property for the ' + this.constructor.name);
            console.log('These are the properties available on this model: ');
            console.log(Object.keys(modelData._modelData));
            return false;
        } 
        divId = this.propertyToUse.replace(/[^A-Za-z0-9]/gi, '') + divId; // div name = property + chart type
        super.load(parentDivId, divId, viewer);
        this.canvasId = divId + 'Canvas';
        $('#' + divId).append('<canvas id="' + this.canvasId + '" width="400" height="400"></canvas>');
        this.modelData = modelData;
        return true;
    }

    generateColors(count) {
        const background = [];
        const borders = [];
        for (let i = 0; i < count; i++) {
            const r = Math.round(Math.random() * 255);
            const g = Math.round(Math.random() * 255);
            const b = Math.round(Math.random() * 255);
            background.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');
            borders.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');
        }
        return { background: background, borders: borders };
    }
}

// Model data in format for charts.Данные модели в формате для диаграмм
class ModelData {
    constructor(viewer) {
        this._modelData = {};
        this._viewer = viewer;
    }

    init(callback) {
        const _this = this;

        _this.getAllLeafComponents(function (dbIds) {
            let count = dbIds.length;
            dbIds.forEach(function (dbId) {
                viewer.getProperties(dbId, function (props) {
                    props.properties.forEach(function (prop) {
                        if (!isNaN(prop.displayValue)) return; // let's not categorize properties that store numbers

                        // some adjustments for revit: некоторые корректировки для Revit
                        prop.displayValue = prop.displayValue.replace('Revit ', ''); // remove this Revit prefix
                        if (prop.displayValue.indexOf('<') === 0) return; // skip categories that start with <

                        // ok, now let's organize the data into this hash table.хорошо, теперь давайте организуем данные в эту хеш-таблицу
                        if (_this._modelData[prop.displayName] == null) _this._modelData[prop.displayName] = {};
                        if (_this._modelData[prop.displayName][prop.displayValue] == null) _this._modelData[prop.displayName][prop.displayValue] = [];
                        _this._modelData[prop.displayName][prop.displayValue].push(dbId);
                    })
                    if ((--count) === 0) callback();
                });
            })
        })
    }

    getAllLeafComponents(callback) {
        // from https://learnforge.autodesk.io/#/viewer/extensions/panel?id=enumerate-leaf-nodes
        viewer.getObjectTree(function (tree) {
            var leaves = [];
            tree.enumNodeChildren(tree.getRootId(), function (dbId) {
                if (tree.getChildCount(dbId) === 0) {
                    leaves.push(dbId);
                }
            }, true);
            callback(leaves);
        });
    }

    hasProperty(propertyName){
        return (this._modelData[propertyName] !== undefined);
    }

    getLabels(propertyName) {
        return Object.keys(this._modelData[propertyName]);
    }

    getCountInstances(propertyName) {
        return Object.keys(this._modelData[propertyName]).map(key => this._modelData[propertyName][key].length);
    }

    getIds(propertyName, propertyValue) {
        return this._modelData[propertyName][propertyValue];
    }
}
