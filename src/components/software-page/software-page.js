define(['knockout', 'text!./software-page.html'], function (ko, templateMarkup) {

  function Software(route) {
  }

  Software.prototype.dispose = function () { };

  return { viewModel: Software, template: templateMarkup };

});
