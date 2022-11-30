Hooks.on("ready", () => {
  class TestVueApp extends PVueApplication {
    constructor(...args) {
      super(...args);
    }

    static get defaultOptions() {
      return {
        ...super.defaultOptions,
        title: "Test Vue App",
        id: "test-vue-app",
        template: `modules/fvtt-petite-vue/templates/test.vue`,
        resizable: true,
        width: 300,
        height: 400,
      };
    }

    getData() {
      if(this._vueData) return this._vueData;
      const actor = game.actors.getName("Beiro (Half-Elf Bard)").toObject();
      debugger;
      return {
        count: 0,
        actor: actor,
        items: actor.items,
        increment() {
          this.count++;
        },
      }
    }
  }

  new TestVueApp().render(true);
});
