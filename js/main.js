"use strict";

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

if (isMobile.any()) {
  document.body.classList.add("_touch");
} else {
  document.body.classList.add("_pc");
}

// меню бургер -----------------------

const burgerMenu = document.querySelector('.menu-burger');
const headerMenu = document.querySelector('.header-menu');
const headerMenuList = document.querySelector('.header-menu__list')
const body = document.querySelector('body');
const toggleMenu = function () {
  headerMenu.classList.toggle("_active");
  burgerMenu.classList.toggle("_active");
  body.classList.toggle('lock');
};

if (burgerMenu) {
  burgerMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    burgerMenu.classList.toggle("_active");
    headerMenu.classList.toggle("_active");
    body.classList.toggle('lock');
  });
}

// -- прокрутка до потрібного блоку
const headerMenuLinks = document.querySelectorAll('.header-menu__link[data-goto]');
if (headerMenuLinks.length > 0) {
  headerMenuLinks.forEach(headerMenuLink => {
    headerMenuLink.addEventListener("click", onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const headerMenuLink = e.target;
    if(headerMenuLink.dataset.goto && document.querySelector(headerMenuLink.dataset.goto)){
      const gotoBlock = document.querySelector(headerMenuLink.dataset.goto);
      const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('.header__wrapper').offsetHeight;
  
      if (burgerMenu.classList.contains('_active')) {
        document.body.classList.remove('lock');
        burgerMenu.classList.remove('_active');
        headerMenu.classList.remove('_active');
      }
      
      window.scrollTo({
        top: gotoBlockValue,
        behavior: "smooth"
      });  
      e.preventDefault();                
    }
  }
}

// -- закрити адапт-меню при кліку поза ним
document.addEventListener("click", function (e) {
  const target = e.target;
  const its_headerMenu = target == headerMenu || headerMenu.contains(target);
  const its_burgerMenu = target == burgerMenu;
  const headerMenu_is_active = headerMenu.classList.contains("_active");

  if (!its_headerMenu && !its_burgerMenu && headerMenu_is_active) {
    toggleMenu();
  }
});

// ----------------------------- catalog

const catalogSliderBtnMores = document.querySelectorAll('.catalog-slider__btn-more');
const catalogSliderDescrHidden = document.querySelectorAll('.catalog-slider__descr--hidden');
if (catalogSliderBtnMores.length > 0) {
  for(let i = 0; i < catalogSliderBtnMores.length; i++){
    const catalogSliderBtnMore = catalogSliderBtnMores[i];
    catalogSliderBtnMore.addEventListener('click', function() {
      catalogSliderBtnMore.previousElementSibling.classList.toggle('hidden');
      if (catalogSliderBtnMore.dataset.option == "hidden") {
        catalogSliderBtnMore.innerText = "Скрыть...";
        catalogSliderBtnMore.dataset.option = "visible";
      } else {
        catalogSliderBtnMore.innerText = "Подробнее...";
        catalogSliderBtnMore.dataset.option = "hidden";
      }
    })
  }
}

// ----------------------------- catalogSlider

const catalogSlider = document.querySelector(".catalog__slider");

const catalogSwiper = new Swiper(catalogSlider, {
  slidesPerView: 3,
  speed: 300,
  slideBetween: 20,
  breakpoints: {
    320: {
      slidesPerView: 1,
      slideBetween: 0,
    },
    768: {
      slidesPerView: 2,
      slideBetween: 20,
    },
    992: {
      slidesPerView: 3,
      slideBetween: 20,
    },
  },
  
  // Navigation arrows
  navigation: {
    nextEl: ".catalog-slider__controls .swiper-button-next",
    prevEl: ".catalog-slider__controls .swiper-button-prev"
  },
  pagination: {
    el: '.catalog-slider__controls .swiper-pagination',
    clickable: true,
  },
});
// ------------------------------------------
const catalogSliderDescr = document.querySelectorAll('.catalog-slider__descr');
const catalogMore = document.querySelectorAll('.catalog-slider__btn-more');
const catalogLess = document.querySelectorAll('.catalog-slider__btn-less')

// ------------------------------- responceSlider

const responceSlider = document.querySelector(".responce-slider");

const responceSwiper = new Swiper(responceSlider, {
  slidesPerView: 3,
  slideBetween: 20,

  navigation: {
    nextEl: ".responce-slider__controls .swiper-button-next",
    prevEl: ".responce-slider__controls .swiper-button-prev"
  },
  pagination: {
    el: '.responce-slider__controls .swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      slideBetween: 0,
    },
    768: {
      slidesPerView: 2,
      slideBetween: 20,
    },
    992: {
      slidesPerView: 3,
      slideBetween: 20,
    },
  }
})

// -------------------------------- Modal

const modalLinks = document.querySelectorAll('.modal-link');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 800;

if (modalLinks.length > 0) {
  for (let index = 0; index < modalLinks.length; index++) {
    const modalLink = modalLinks[index];
    modalLink.addEventListener("click", function(e) {
      const modalName = modalLink.getAttribute('href').replace('#', '');
      const currentModal = document.getElementById(modalName);
      modalOpen(currentModal);
      e.preventDefault();
    })
  }
} 

const modalCloseIcon = document.querySelectorAll('.modal-close');
if (modalCloseIcon.length > 0) {
  for (let index = 0; index < modalCloseIcon.length; index++) {
    const el = modalCloseIcon[index];
    el.addEventListener('click', function(e) {
      modalClose(el.closest('.modal'));
      e.preventDefault();
    });
  }
}

function modalOpen(currentModal) {
  if (currentModal && unlock) {
    const modalActive = document.querySelector('.modal.open');
    if (modalActive) {
      modalClose(modalActive, false);
    } else {
      bodyLock();
    }
    currentModal.classList.add('open');
    currentModal.addEventListener('click', function(e) {
      if (!e.target.closest('.modal__content')) {
        modalClose(e.target.closest('.modal'));
      }
    });
  }
}
function modalClose(modalActive, doUnlock = true) {
  if (unlock) {
    modalActive.classList.remove('open');
    if (doUnlock) {
      bodyUnLock();
    }
  }
}

function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

  if (lockPadding.length > 0) {
    for (let index = 1; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;
  setTimeout(function() {
    unlock = true;
  }, timeout);
}
function bodyUnLock() {
  setTimeout(function() {
    if (lockPadding.length > 0) {
      for (let index = 1; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
    }
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);

  unlock = false;
  setTimeout(function() {
    unlock = true;
  }, timeout);
}

document.addEventListener('keydown', function(e) {
  if (e.which === 27) {
    const modalActive = document.querySelector('.modal.open');
    modalClose(modalActive);
  }
})


