import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

globalThis._vueTemplateCache = {};

class PVueApplication extends Application{
    constructor(...args){
        super(...args);
    }

    async _renderInner(data) {
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
        return {};
    }
}

async function renderVue(template, data){
    const vueTemplate = _vueTemplateCache[template] ?? await fetch(template).then(response => response.text());
    _vueTemplateCache[template] = vueTemplate;
    const el = document.createElement('div');
    el.innerHTML = vueTemplate;
    const store = reactive(data);
    const app = createApp({store}).mount(el);
    return {app, el, store};
}

globalThis.PVueApplication = PVueApplication;