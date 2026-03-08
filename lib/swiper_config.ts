import { SwiperOptions } from "swiper/types";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
export const swiperConfigBackdrop: SwiperOptions = {
  keyboard: { enabled: true },

  modules: [Navigation, Pagination, Keyboard, Scrollbar],
  slidesPerView: "auto",
  spaceBetween: 3,
};
