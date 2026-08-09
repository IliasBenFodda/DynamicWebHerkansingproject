const lazyObserver = new IntersectionObserver((items, observer) => {
  items.forEach((item) => {
    if (item.isIntersecting) {
      const afbeelding = item.target;
      afbeelding.src = afbeelding.dataset.src;
      afbeelding.classList.add("geladen");
      observer.unobserve(afbeelding);
    }
  });
},
{rootMargin: "100px"}
);

const initLazyLoading = (container)=>{
    container.querySelectorAll("img[data-src]").forEach((afbeelding) =>{
        lazyObserver.observe(afbeelding);
    })
}