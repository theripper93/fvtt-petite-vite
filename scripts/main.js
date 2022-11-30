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
      return {
        count: 0,
        increment() {
          this.count++;
        },
      }
    }
  }

  new TestVueApp().render(true);
});
