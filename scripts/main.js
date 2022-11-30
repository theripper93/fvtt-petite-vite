Hooks.on("ready", () => {


    class TestVueApp extends PVueApplication {
        constructor(...args) {
            super(...args);
        }

        static get defaultOptions() {
            return {
              ...super.defaultOptions,
              title: game.i18n.localize("AE.dialogs.companionManager.title"),
              id: "companionManager",
              template: `modules/fvtt-petite-vue/templates/test.vue`,
              resizable: true,
              width: 300,
              height: window.innerHeight > 400 ? 400 : window.innerHeight - 100,
              dragDrop: [{ dragSelector: null, dropSelector: null }],
            };
          }
    }

    new TestVueApp().render(true);


});

