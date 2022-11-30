import { createApp } from 'https://unpkg.com/petite-vue?module'

globalThis._vueTemplateCache = {};

class PVueApplication extends Application{
    constructor(...args){
        super(...args);
    }

    async _renderInner(data) {
        let html = await renderVue(this.template, data);
        if ( html === "" ) throw new Error(`No data was returned from template ${this.template}`);
        return $(html);
    }
}

async function renderVue(template, data){
    const vueTemplate = _vueTemplateCache[template] ?? await fetch(template).then(response => response.text());
    _vueTemplateCache[template] = vueTemplate;
    const el = document.createElement('div');
    el.innerHTML = vueTemplate;
    const app = createApp({
        data() {
            return data;
        }
    });
    app.mount(el);
    return el;
}

globalThis.PVueApplication = PVueApplication;