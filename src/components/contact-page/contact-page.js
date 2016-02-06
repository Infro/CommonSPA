define(['knockout', 'text!./contact-page.html'], function (ko, templateMarkup) {

  function contact(route) {
  }

  contact.prototype.dispose = function () { };

  return { viewModel: contact, template: templateMarkup };

});
