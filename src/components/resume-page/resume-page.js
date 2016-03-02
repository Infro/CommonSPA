define(['knockout', 'text!./resume-page.html'], function (ko, templateMarkup) {

  function Resume(route) {
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  Resume.prototype.dispose = function () { };

  return { viewModel: Resume, template: templateMarkup };

});
