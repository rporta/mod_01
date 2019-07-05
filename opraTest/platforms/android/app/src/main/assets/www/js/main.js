//aca trabajo con la instancia
//example:
vueApp.setColor(vueApp.color.bwt[0]);
var preloaderFull = vueApp.newComponent('c-preloader-circle-full').setSectionColor(vueApp.color.bwt[0]);

setTimeout(() => {
    preloaderFull.setShow(false);
}, 1000);

vueApp.create(preloaderFull);

var footer = vueApp.newComponent('c-footer').setColor(vueApp.color.bwt[0]).setColorText(vueApp.colorText.cyan[12]);
var main = vueApp.newComponent('c-main').setColor(vueApp.color.bwt[0]);
var header = vueApp.newComponent('c-header').setColor(vueApp.color.bwt[0]);
var nav = vueApp.newComponent('c-nav-bar').setColorM(vueApp.color.cyan[12]).setColor(vueApp.color.bwt[0]);
logo = vueApp.newComponent("c-icon").setIcon('import_export').setSize(vueApp.sizeIcon.m).setColorText(vueApp.colorText.bwt[1]);
var spanLogo = vueApp.newComponent("c-span").setText("Opratel").setColorText(vueApp.colorText.cyan[12]);

nav.addLogo(spanLogo);
spanLogo.create(logo);
vueApp.create(nav);
vueApp.create(header);
vueApp.create(main);
vueApp.create(footer);

var h = vueApp.newComponent("c-h").setSize(6);
var img = vueApp.newComponent("c-img");
// var iframe = vueApp.newComponent("c-iframe");
// iframe.setSrc("http://tulandia.net/landing/LC6s9r?skipcookie=2");
// iframe.setSrc("http://tulandia.net/");
var button = vueApp.newComponent("c-button").setText("OPEN:MODAL").setShow(0);
var input = vueApp.newComponent("c-input-fields").setText("textFAFA").setColorText(vueApp.colorText.cyan[12]).setShow(0);
main.create(button);
main.create(input);
footer.create(h);
// footer.create(iframe);
var modal = vueApp.newComponent("c-modal").setText("hola");
vueApp.create(modal);

nav.setShow(0);

//touch
var touch = vueApp.newComponent("c-icon").setIcon('adjust').setSize(vueApp.sizeIcon.t).setColorText(vueApp.colorText.red[5]).setShow(0);
vueApp.create(touch);

//set touch
$(touch.$el).css("position", "fixed");
$(touch.$el).css("-webkit-transition", "all 0.5s ease");
$(touch.$el).css("-moz-transition", "all 0.5s ease");
$(touch.$el).css("-o-transition", "all 0.5s ease");
$(touch.$el).css("-ms-transition", "all 0.5s ease");
$(touch.$el).css("transition", "all 0.5s ease");
$(touch.$el).css("z-index", "9999");
$(touch.$el).css("top", 0);
$(touch.$el).css("left", 0);

//events  
var buttonClicks = 0;
$(button.$el).click(function() {
    buttonClicks++;
    modal.setText("OPEN:MODAL : click (" + buttonClicks + ")");
    modal.open();
});
$(main.$el).css("display", "contents");