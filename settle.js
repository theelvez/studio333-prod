(() => {
  if (new URLSearchParams(location.search).get("from") === "mosaic") {
    document.body.classList.add("from-mosaic");
  }
})();
