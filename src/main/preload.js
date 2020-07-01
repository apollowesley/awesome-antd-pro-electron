function loadChartjs() {
  var chartScript = document.createElement('script');
  chartScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js');
  document.head.appendChild(chartScript);
  // css
  var chartLink = document.createElement('link');
  chartLink.setAttribute('rel', 'stylesheet');
  chartLink.setAttribute('type', 'text/css');
  chartLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.css');
  document.head.appendChild(chartLink);
}

loadChartjs();
