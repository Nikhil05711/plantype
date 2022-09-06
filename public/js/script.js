getQueryString = () => {
  let queries = {};
  let url = document.location.search;
  if (url.trim() !== "") {
    $.each(document.location.search.substr(1).split("&"), function (c, q) {
      let i = q.split("=");
      queries[i[0]] = i[1];
    });
  }
  return queries;
};
