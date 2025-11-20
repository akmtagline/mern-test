import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct } from "../../admin/products/FetchApi";
import "./style.css";

const apiURL = process.env.REACT_APP_API_URL;

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${data.categoryListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="py-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories && categories.length > 0 ? (
          categories.map((item, index) => {
            return (
              <Fragment key={index}>
                <div
                  onClick={(e) =>
                    history.push(`/products/category/${item._id}`)
                  }
                  className="col-span-1 m-2 flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <img
                    src={`${apiURL}/uploads/categories/${item.cImage}`}
                    alt="pic"
                  />
                  <div className="font-medium">{item.cName}</div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <div className="text-xl text-center my-4">No Category</div>
        )}
      </div>
    </div>
  );
};

const FilterAndSearch = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState(null);

  const applyFilters = (titleValue, descValue, minValue, maxValue) => {
    if (!products) {
      fetchProductData();
      return;
    }

    dispatch({
      type: "searchAndFilterProducts",
      titleSearch: titleValue,
      descSearch: descValue,
      minPrice: minValue,
      maxPrice: maxValue,
      productArray: products,
    });
  };

  const searchByTitle = (e) => {
    const value = e.target.value;
    setSearchTitle(value);
    applyFilters(value, searchDescription, minPrice, maxPrice);
  };

  const searchByDescription = (e) => {
    const value = e.target.value;
    setSearchDescription(value);
    applyFilters(searchTitle, value, minPrice, maxPrice);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    applyFilters(searchTitle, searchDescription, value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    applyFilters(searchTitle, searchDescription, minPrice, value);
  };

  const fetchProductData = async () => {
    dispatch({ type: "loading", payload: true });

    try {
      setTimeout(async () => {
        let response = await getAllProduct();
        if (response && response.Products) {
          setProducts(response.Products);
          dispatch({ type: "setProducts", payload: response.Products });
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  const closePanel = () => {
    // Reset products
    if (products) {
      dispatch({ type: "setProducts", payload: products });
    }

    dispatch({
      type: "filterSearchDropdown",
      payload: !data.filterSearchDropdown,
    });
    setSearchTitle("");
    setSearchDescription("");
    setMinPrice("");
    setMaxPrice("");
  };

  useEffect(() => {
    if (!products) {
      fetchProductData();
    }
  }, [products]);

  return (
    <div className={`${data.filterSearchDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col space-y-4 py-4">
        {/* Search Section */}
        <div className="flex items-center gap-2 md:gap-4">
          <input
            value={searchTitle}
            onChange={searchByTitle}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500 flex-1"
            type="text"
            placeholder="Search by title..."
          />
          <input
            value={searchDescription}
            onChange={searchByDescription}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500 flex-1"
            type="text"
            placeholder="Search by description..."
          />
        </div>

        {/* Filter by Price Section */}
        <div className="flex flex-col">
          <div className="font-medium py-2">Filter by price range</div>
          <div className="flex items-center gap-2 md:gap-4">
            <input
              value={minPrice}
              onChange={handleMinPriceChange}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500 flex-1"
              type="number"
              min="0"
              placeholder="Min Price ($)"
            />
            <input
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500 flex-1"
              type="number"
              min="0"
              placeholder="Max Price ($)"
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <div
            onClick={closePanel}
            className="cursor-pointer hover:bg-gray-200 rounded-full p-1"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <FilterAndSearch />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
