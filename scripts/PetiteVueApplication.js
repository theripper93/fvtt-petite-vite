import { createApp } from 'https://unpkg.com/petite-vue?module'

globalThis._vueTemplateCache = {};

class PVueApplication extends Application{
    constructor(...args){
        super(...args);
    }

    async _renderInner(data) {
        const vueData = await renderVue(this.template, await this.getData())
        this._vueApp = vueData.app;
        let html = vueData.el;
        if ( html === "" ) throw new Error(`No data was returned from template ${this.template}`);
        return $(html);
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
    const app = createApp(data).mount(el);
    return {app, el};
}

globalThis.PVueApplication = PVueApplication;