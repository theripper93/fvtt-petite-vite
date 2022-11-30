import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

globalThis._vueTemplateCache = {};

class PVueApplication extends Application{
    constructor(...args){
        super(...args);
        this._object = args[0].object ?? null;
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

    async updateObject() {
        const data = this.store;
        if ( this._object ) {
            await this._object.update(data);
        }
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

const helpers = {
    localize(...args){
        return game.i18n.localize(...args);
    },
    l(...args){
        return this.localize(...args);
    }
};

globalThis.PVueApplication = PVueApplication;