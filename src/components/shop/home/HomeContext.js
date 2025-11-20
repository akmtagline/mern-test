export const homeState = {
  categoryListDropdown: false,
  filterSearchDropdown: false,
  products: null,
  loading: false,
  sliderImages: [],
};

export const homeReducer = (state, action) => {
  switch (action.type) {
    case "categoryListDropdown":
      return {
        ...state,
        categoryListDropdown: action.payload,
        filterSearchDropdown: false,
      };
    case "filterSearchDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterSearchDropdown: action.payload,
      };
    case "setProducts":
      return {
        ...state,
        products: action.payload,
      };
    case "searchHandleInReducer":
      return {
        ...state,
        products:
          action.productArray &&
          action.productArray.filter((item) => {
            const titleSearch = action.titleSearch || "";
            const descSearch = action.descSearch || "";

            const matchTitle =
              !titleSearch ||
              item.pName.toUpperCase().indexOf(titleSearch.toUpperCase()) !==
                -1;
            const matchDesc =
              !descSearch ||
              item.pDescription
                .toUpperCase()
                .indexOf(descSearch.toUpperCase()) !== -1;

            return matchTitle && matchDesc;
          }),
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "sliderImages":
      return {
        ...state,
        sliderImages: action.payload,
      };
    default:
      return state;
  }
};
