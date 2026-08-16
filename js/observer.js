// De 70 foto's tegelijk laden duurt te lang, dus ze komen pas binnen wanneer je er
// naartoe scrollt. Uitleg over IntersectionObserver:
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
const lazyObserver = new IntersectionObserver((items, observer) => {
  items.forEach((item) => {
    if (item.isIntersecting) {
      const afbeelding = item.target;
      afbeelding.src = afbeelding.dataset.src;
      afbeelding.classList.add("geladen");
      // eenmaal geladen mag hij niet meer in de gaten gehouden worden
      observer.unobserve(afbeelding);
    }
  });
},
// 100px marge, zo staat de foto er al net voor je hem ziet
{rootMargin: "100px"}
);

// Wordt na elke render opnieuw opgeroepen, want de img-elementen zijn dan nieuw.
const initLazyLoading = (container)=>{
    container.querySelectorAll("img[data-src]").forEach((afbeelding) =>{
        lazyObserver.observe(afbeelding);
    })
}