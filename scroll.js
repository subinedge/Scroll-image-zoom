// More scaling = more zoom
let scaleAmount = 0.5;

function scrollZoom() {
  const images = document.querySelectorAll('[data-scroll-zoom]');
  // starting scroll posY = 0;
  let scrollPosY = 0;

  scaleAmount = scaleAmount / 100;

  const observerConfig = {
    rootMargin: "0% 0% 0% 0%",
    threshold: 0
  };

  // create separate intersection observers and scroll listeners for each image so that we can individually apply the scale only if the image is visible

  images.forEach(image => {
    let isVisible = false;
    const observer = new IntersectionObserver((elements, self) => {
      elements.forEach(element => {
        isVisible = element.isIntersecting;
      })
    }, observerConfig);

    observer.observe(image);

    // set initial image scale on page load

    image.style.transform = `scale(${1 + scaleAmount * percentageSeen(image)})`;

    // only fires if intersectionobserver is intersecting
    window.addEventListener("scroll", () => {
      if (isVisible) {
        scrollPosY = window.pageYOffset;
        image.style.transform = `scale(${1 + scaleAmount * percentageSeen(image)})`;
      }
    })
  });

  // calculates the 'percentage seen' based on when the image first enters the screen until the moment it leaves

  // here, we get the parent node position/height instead of the image since it's in a container that has a border, but

  // if your container has no extra height, you can simply get the image position/height


  function percentageSeen(element) {
    const parent = element.parentNode;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const elPosY = parent.getBoundingClientRect().top + scrollY;
    const borderHeight = parseFloat(getComputedStyle(parent).getPropertyValue('border-bottom-width')) + parseFloat(getComputedStyle(element).getPropertyValue('border-top-width'));

    const elHeight = parent.offsetHeight + borderHeight;

    if (elPosY > scrollY + viewportHeight) {
      // if we haven't reached the image yet
      return 0;
    } else if (elPosY + elHeight < scrollY) {
      // if we have completly scrolled page
      return 100;
    } else {
      // when the image is in the viewport
      const distance = scrollY + viewportHeight - elPosY;
      let percentage = distance / ((viewportHeight + elHeight) / 100);
      percentage = Math.round(percentage);

      return percentage;
    }
  }

}

scrollZoom();