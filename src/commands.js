exports.css = function (file) {
  return `<link href="${ file }" rel="stylesheet">`;
};

exports.js = function (file) {
  return `<script src="${ file }"></script>`;
};
