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
  }

  new TestVueApp({object: game.actors.getName("Beiro (Half-Elf Bard)")}).render(true);
});
