import { useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { getRandomProducts } from "../../../utils/functions";
import Product from "./Product";

const ProductSlider = ({ title, tagline }) => {

  const { loading, products } = useSelector((state) => state.products);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,   // 🔥 ONLY 1 PRODUCT
    slidesToScroll: 1,
    arrows: false,
    swipe: true        // 🔥 mobile swipe ON
  };

  return (
    <section className="bg-white w-full shadow relative">

      {/* HEADER */}
      <div className="flex px-4 py-4 justify-between items-center">
        <div>
          <h1 className="text-lg font-medium">{title}</h1>
          <p className="text-xs text-gray-400">{tagline}</p>
        </div>

        <Link to="/products" className="bg-primary-blue text-xs text-white px-4 py-2 rounded">
          VIEW ALL
        </Link>
      </div>

      <hr />

      {/* LEFT BUTTON */}
      <button
        onClick={() => sliderRef.current.slickPrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md w-8 h-16 flex items-center justify-center"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => sliderRef.current.slickNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md w-8 h-16 flex items-center justify-center"
      >
        ›
      </button>

      {/* SLIDER */}
      {!loading && (
        <Slider ref={sliderRef} {...settings}>
          {products &&
            getRandomProducts(products, 12).map((product) => (
              <div key={product._id} className="flex justify-center">
                <Product {...product} />
              </div>
            ))
          }
        </Slider>
      )}

    </section>
  );
};

export default ProductSlider;
