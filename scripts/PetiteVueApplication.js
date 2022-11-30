import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

globalThis._vueTemplateCache = {};

class PVueApplication extends Application{
    constructor(...args){
        super(...args);
        this._object = args[0].object ?? null;
        this._hookIds = [];
    }

    async activateListeners(html) {
        super.activateListeners(html);
        if(this.options.updateOnChange){
            html.on('change', 'input, select, textarea', (event) => this._onSubmit(event));
        }
        if(this.options.autoUpdate && this._object?.documentName){
            const hookName = `update${this._object.documentName}`;
            const hookId = Hooks.on(hookName, (document, data, options, userId) => {
                if(document.id === this._object.id){
                    this._updateVUEData();
                }
            });
            this._hookIds.push([hookName, hookId]);

            for(let s of Object.values(this._object.schema.fields)){
                if(s.element?.documentName){
                    const hookName2 = `update${s.element.documentName}`;
                    const hookId2 = Hooks.on(hookName2, (document, data, options, userId) => {
                        if(document.parent == this._object){
                            this._updateVUEData();
                        }
                    });
                    this._hookIds.push([hookName2, hookId2]);
                }
            }
        }
    }

    async _renderInner() {
        const vueData = await renderVue(this.template, await this.getData())
        this._vueStore = vueData.store;
        let html = vueData.el;
        if ( html === "" ) throw new Error(`No data was returned from template ${this.template}`);
        return $(html);
    }

    get store(){
        return this._vueStore;
    }

    async getData() {
        if(this._object.documentName){
            return this._object.toObject();
        }
    }

    async _updateVUEData(){
        const newData = await this.getData();
        updateObjectRecursive(this.store, newData);
    }

    async _onSubmit(event) {
        event.preventDefault();
        await this.updateObject();
    }

    async updateObject() {
        const data = this.store;
        if ( this._object ) {
            await this._object.update(data);
        }
    }

    async close() {
        if(this.options.updateOnClose){
            await this.updateObject();
        }
        this._hookIds.forEach(hookId => Hooks.off(...hookId));
        return super.close();
    }

    static get defaultOptions() {
        return {
          baseApplication: null,
          width: null,
          height: null,
          top: null,
          left: null,
          scale: null,
          popOut: true,
          minimizable: true,
          resizable: false,
          id: "",
          classes: [],
          dragDrop: [],
          tabs: [],
          filters: [],
          title: "",
          template: null,
          scrollY: [],
          submitOnClose: false,
          submitOnChange: false,
          autoUpdate: false,
        };
      }
}

async function renderVue(template, data){
    const vueTemplate = _vueTemplateCache[template] ?? await fetch(template).then(response => response.text());
    _vueTemplateCache[template] = vueTemplate;
    const el = document.createElement('div');
    el.innerHTML = vueTemplate;
    const store = reactive(data);
    const app = createApp({store, ...helpers}).mount(el);
    return {app, el, store};
}

function updateObjectRecursive(object1, object2){
    for (const key in object1) {
        if (object1.hasOwnProperty(key)) {
            if(typeof object1[key] === 'object'){
                updateObjectRecursive(object1[key], object2[key]);
            }else{
                if(object1[key] !== object2[key]) object1[key] = object2[key];
            }
        }
    }
}

const helpers = {
    localize(...args){
        return game.i18n.localize(...args);
    },
    l(...args){
        return this.localize(...args);
    }
};

globalThis.PVueApplication = PVueApplication;